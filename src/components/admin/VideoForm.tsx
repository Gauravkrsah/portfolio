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
import { Loader2, Clock, Link2 } from 'lucide-react';
import { createContent, updateContent } from '@/lib/services/supabaseService';
import { Content } from '@/lib/services/supabaseClient';

// Define the content form schema
const formSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  content_url: z.string().url('Must be a valid URL'),
  thumbnail_url: z.string().url('Must be a valid URL'),
  platform: z.string().min(1, 'Platform is required'),
  content_type: z.string().min(1, 'Content type is required'),
  duration: z.string().optional(),
  likes: z.coerce.number().int().nonnegative().default(0),
  comments: z.coerce.number().int().nonnegative().default(0),
  shares: z.coerce.number().int().nonnegative().default(0),
  views: z.coerce.number().int().nonnegative().default(0),
  status: z.enum(['Draft', 'Published']),
  featured: z.boolean().default(false),
  is_video: z.boolean().default(true)
});

export type ContentFormValues = z.infer<typeof formSchema>;

interface ContentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editContent?: Content | null;
}

const ContentForm = ({ open, onOpenChange, editContent }: ContentFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<ContentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      content_url: '',
      thumbnail_url: '',
      platform: 'YouTube',
      content_type: 'video',
      duration: '',
      likes: 0,
      comments: 0,
      shares: 0,
      views: 0,
      status: 'Draft',
      featured: false,
      is_video: true
    }
  });
  
  // Set form values when editing a video
  React.useEffect(() => {
    if (editContent) {
      form.reset({
        title: editContent.title,
        description: editContent.description,
        content_url: editContent.content_url,
        thumbnail_url: editContent.thumbnail_url,
        platform: editContent.platform,
        content_type: editContent.content_type,
        duration: '', // Duration is not stored in the database
        likes: editContent.likes || 0,
        comments: editContent.comments || 0,
        shares: editContent.shares || 0,
        views: editContent.views || 0,
        status: editContent.status,
        featured: editContent.featured || false,
        is_video: editContent.is_video
      });
    } else {
      form.reset();
    }
  }, [editContent, form]);
  
  // Create content mutation
  const createMutation = useMutation({
    mutationFn: (data: ContentFormValues) => {
      return createContent({
        title: data.title,
        description: data.description,
        content_url: data.content_url,
        thumbnail_url: data.thumbnail_url,
        platform: data.platform,
        content_type: data.content_type,
        is_video: data.is_video,
        likes: data.likes,
        comments: data.comments,
        shares: data.shares,
        views: data.views,
        featured: data.featured,
        status: data.status
      });
    },
    onSuccess: () => {
      toast({
        title: 'Content created',
        description: 'The content has been successfully created.',
      });
      queryClient.invalidateQueries({ queryKey: ['videos'] });
      queryClient.invalidateQueries({ queryKey: ['contents'] });
      queryClient.invalidateQueries({ queryKey: ['featuredContents'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      form.reset();
      onOpenChange(false);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to create content: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    }
  });
  
  // Update content mutation
  const updateMutation = useMutation({
    mutationFn: (data: ContentFormValues) => {
      if (!editContent) throw new Error("No content to update");
      
      return updateContent(editContent.id, {
        title: data.title,
        description: data.description,
        content_url: data.content_url,
        thumbnail_url: data.thumbnail_url,
        platform: data.platform,
        content_type: data.content_type,
        is_video: data.is_video,
        likes: data.likes,
        comments: data.comments,
        shares: data.shares,
        views: data.views,
        featured: data.featured,
        status: data.status
      });
    },
    onSuccess: () => {
      toast({
        title: 'Content updated',
        description: 'The content has been successfully updated.',
      });
      queryClient.invalidateQueries({ queryKey: ['videos'] });
      queryClient.invalidateQueries({ queryKey: ['contents'] });
      queryClient.invalidateQueries({ queryKey: ['featuredContents'] });
      if (editContent) {
        queryClient.invalidateQueries({ queryKey: ['content', editContent.id] });
      }
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      form.reset();
      onOpenChange(false);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to update content: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    }
  });
  
  // Form submission handler
  const onSubmit = (data: ContentFormValues) => {
    if (editContent) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };
  
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  // Platform options
  const platformOptions = [
    "YouTube",
    "YouTube Shorts",
    "Instagram",
    "Instagram Reels",
    "Facebook",
    "TikTok",
    "Pinterest",
    "Twitter",
    "LinkedIn",
    "Vimeo",
    "Other"
  ];

  // Content type options
  const contentTypeOptions = [
    "video",
    "post",
    "reel",
    "story",
    "short"
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{editContent ? 'Edit Content' : 'Add New Content'}</DialogTitle>
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
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter video title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Platform field */}
                <FormField
                  control={form.control}
                  name="platform"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Platform</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select platform" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {platformOptions.map(platform => (
                            <SelectItem key={platform} value={platform}>{platform}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Content Type field */}
                <FormField
                  control={form.control}
                  name="content_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select content type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {contentTypeOptions.map(type => (
                            <SelectItem key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Description field */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="A brief description of the video" 
                        className="min-h-[80px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Content URL field */}
              <FormField
                control={form.control}
                name="content_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content URL</FormLabel>
                    <FormControl>
                      <div className="flex relative">
                        <Link2 className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input className="pl-8" placeholder="https://youtube.com/watch?v=... or https://youtube.com/shorts/..." {...field} />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Enter the URL to the video, short, reel, or post (YouTube, YouTube Shorts, Instagram, Instagram Reels, etc.)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Thumbnail URL field */}
              <FormField
                control={form.control}
                name="thumbnail_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thumbnail URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/thumbnail.jpg" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter a direct URL to a thumbnail image for this content
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Duration field */}
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (Optional)</FormLabel>
                      <FormControl>
                        <div className="flex relative">
                          <Clock className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input className="pl-8" placeholder="e.g., 3:45" {...field} />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Format: mm:ss (e.g., 3:45)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
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
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Likes field */}
                <FormField
                  control={form.control}
                  name="likes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Likes</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Comments field */}
                <FormField
                  control={form.control}
                  name="comments"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Comments</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Views field */}
                <FormField
                  control={form.control}
                  name="views"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Views</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
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
                      <FormLabel>Featured Content</FormLabel>
                      <FormDescription>
                        Mark this content as featured to display it prominently on the homepage
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
                {editContent ? 'Update Content' : 'Create Content'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ContentForm;