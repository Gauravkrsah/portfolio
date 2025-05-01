import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from '@/components/ui/form';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Tag } from 'lucide-react';
import { createBlogPost, updateBlogPost } from '@/lib/services/supabaseService';
import { BlogPost } from '@/lib/services/supabaseClient';

// Define the form schema
const formSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  summary: z.string().min(10, 'Summary must be at least 10 characters'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  image_url: z.string().url('Must be a valid URL'),
  categories: z.string(), // We'll split this into categories array
  status: z.enum(['Draft', 'Published']),
  featured: z.boolean().default(false),
  author: z.string().optional()
});

export type BlogPostFormValues = z.infer<typeof formSchema>;

interface BlogPostFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editBlogPost?: BlogPost | null;
}

const BlogPostForm: React.FC<BlogPostFormProps> = ({ open, onOpenChange, editBlogPost }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<BlogPostFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      summary: '',
      content: '',
      image_url: '',
      categories: '',
      status: 'Draft',
      featured: false,
      author: ''
    }
  });
  
  // Set form values when editing a blog post
  React.useEffect(() => {
    if (editBlogPost) {
      form.setValue('title', editBlogPost.title);
      form.setValue('summary', editBlogPost.summary || '');
      form.setValue('content', editBlogPost.content);
      form.setValue('image_url', editBlogPost.image_url);
      form.setValue('categories', editBlogPost.categories?.join ? editBlogPost.categories.join(', ') : '');
      form.setValue('status', editBlogPost.status);
      form.setValue('featured', editBlogPost.featured || false);
      form.setValue('author', editBlogPost.author || '');
    } else {
      form.reset();
    }
  }, [editBlogPost, form]);
  
  // Create blog post mutation
  const createMutation = useMutation({
    mutationFn: (data: BlogPostFormValues) => {
      // Convert categories from comma-separated string to array
      const categories = data.categories.split(',').map(cat => cat.trim()).filter(cat => cat !== '');
      
      const formattedData = {
        title: data.title,
        summary: data.summary,
        content: data.content,
        image_url: data.image_url,
        categories,
        featured: data.featured,
        status: data.status,
        author: data.author
      };
      
      return createBlogPost(formattedData);
    },
    onSuccess: () => {
      toast({
        title: 'Blog post created',
        description: 'The blog post has been successfully created.',
      });
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      queryClient.invalidateQueries({ queryKey: ['featuredBlogPosts'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      form.reset();
      onOpenChange(false);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to create blog post: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    }
  });
  
  // Update blog post mutation
  const updateMutation = useMutation({
    mutationFn: (data: BlogPostFormValues) => {
      if (!editBlogPost) throw new Error("No blog post to update");
      
      // Convert categories from comma-separated string to array
      const categories = data.categories.split(',').map(cat => cat.trim()).filter(cat => cat !== '');
      
      const formattedData = {
        title: data.title,
        summary: data.summary,
        content: data.content,
        image_url: data.image_url,
        categories,
        featured: data.featured,
        status: data.status,
        author: data.author
      };
      
      return updateBlogPost(editBlogPost.id, formattedData);
    },
    onSuccess: () => {
      toast({
        title: 'Blog post updated',
        description: 'The blog post has been successfully updated.',
      });
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      queryClient.invalidateQueries({ queryKey: ['featuredBlogPosts'] });
      if (editBlogPost) {
        queryClient.invalidateQueries({ queryKey: ['blogPost', editBlogPost.id] });
      }
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      form.reset();
      onOpenChange(false);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to update blog post: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    }
  });
  
  // Form submission handler
  const onSubmit = (data: BlogPostFormValues) => {
    if (editBlogPost) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };
  
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{editBlogPost ? 'Edit Blog Post' : 'Create New Blog Post'}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <div className="grid grid-cols-1 gap-4">
              {/* Title field */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Post Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter blog post title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Summary field */}
              <FormField
                control={form.control}
                name="summary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Summary</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="A brief summary of your blog post" 
                        className="min-h-[80px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Content field */}
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content (Markdown)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="# Blog Post Title

## Introduction
Write your introduction here.

## Main Content
Your main content goes here.

## Conclusion
Wrap up your post here." 
                        className="min-h-[200px] font-mono"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Enter markdown content for the blog post
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Image URL field */}
              <FormField
                control={form.control}
                name="image_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <div className="flex">
                        <Input placeholder="https://example.com/image.jpg" {...field} />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Enter a direct URL to an image for this blog post
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Status field */}
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Draft">Draft</SelectItem>
                          <SelectItem value="Published">Published</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Categories field */}
                <FormField
                  control={form.control}
                  name="categories"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categories</FormLabel>
                      <FormControl>
                        <div className="flex relative">
                          <Tag className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input className="pl-8" placeholder="Web Development, Design, AI" {...field} />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Separate categories with commas
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Author field */}
              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Author</FormLabel>
                    <FormControl>
                      <Input placeholder="Author name (optional)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Featured checkbox */}
              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Featured Blog Post</FormLabel>
                      <FormDescription>
                        Mark this blog post as featured to display it prominently on the homepage
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
            
            {/* Form buttons */}
            <DialogFooter className="mt-6 gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="gap-1">
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {editBlogPost ? 'Update Blog Post' : 'Create Blog Post'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default BlogPostForm;
