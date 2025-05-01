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
import { Loader2, Github, ExternalLink, Tag } from 'lucide-react';
import { createTool, updateTool } from '@/lib/services/supabaseService';
import { Tool } from '@/lib/services/supabaseClient';

// Define the form schema
const formSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  image_url: z.string().url('Must be a valid URL'),
  tool_url: z.string().url('Must be a valid URL'),
  github_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  tags: z.string(), // We'll split this into technologies array
  status: z.enum(['Draft', 'Published']),
  featured: z.boolean().default(false)
});

export type ToolFormValues = z.infer<typeof formSchema>;

interface ToolFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editTool?: Tool | null;
}

const ToolForm: React.FC<ToolFormProps> = ({ open, onOpenChange, editTool }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<ToolFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      image_url: '',
      tool_url: '',
      github_url: '',
      tags: '',
      status: 'Draft',
      featured: false
    }
  });
  
  // Set form values when editing a tool
  React.useEffect(() => {
    if (editTool) {
      form.setValue('title', editTool.title);
      form.setValue('description', editTool.description);
      form.setValue('image_url', editTool.image_url);
      form.setValue('tool_url', editTool.tool_url);
      form.setValue('github_url', editTool.github_url || '');
      form.setValue('tags', editTool.technologies?.join ? editTool.technologies.join(', ') : '');
      form.setValue('status', editTool.status);
      form.setValue('featured', editTool.featured || false);
    } else {
      form.reset();
    }
  }, [editTool, form]);
  
  // Create tool mutation
  const createMutation = useMutation({
    mutationFn: (data: ToolFormValues) => {
      // Convert tags from comma-separated string to array
      const technologies = data.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
      
      const formattedData = {
        title: data.title,
        description: data.description,
        image_url: data.image_url,
        tool_url: data.tool_url,
        github_url: data.github_url,
        technologies,
        featured: data.featured,
        status: data.status
      };
      
      return createTool(formattedData);
    },
    onSuccess: () => {
      toast({
        title: 'Tool created',
        description: 'The tool has been successfully created.',
      });
      queryClient.invalidateQueries({ queryKey: ['tools'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      form.reset();
      onOpenChange(false);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to create tool: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    }
  });
  
  // Update tool mutation
  const updateMutation = useMutation({
    mutationFn: (data: ToolFormValues) => {
      if (!editTool) throw new Error("No tool to update");
      
      // Convert tags from comma-separated string to array
      const technologies = data.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
      
      const formattedData = {
        title: data.title,
        description: data.description,
        image_url: data.image_url,
        tool_url: data.tool_url,
        github_url: data.github_url,
        technologies,
        featured: data.featured,
        status: data.status
      };
      
      return updateTool(editTool.id, formattedData);
    },
    onSuccess: () => {
      toast({
        title: 'Tool updated',
        description: 'The tool has been successfully updated.',
      });
      queryClient.invalidateQueries({ queryKey: ['tools'] });
      if (editTool) {
        queryClient.invalidateQueries({ queryKey: ['tool', editTool.id] });
      }
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      form.reset();
      onOpenChange(false);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to update tool: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    }
  });
  
  // Form submission handler
  const onSubmit = (data: ToolFormValues) => {
    if (editTool) {
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
          <DialogTitle className="text-xl font-bold">{editTool ? 'Edit Tool' : 'Add New Tool'}</DialogTitle>
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
                    <FormLabel>Tool Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter tool title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Description field */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe your tool" 
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
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
                      Enter a direct URL to an image for this tool
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
                
                {/* Tags field */}
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Technologies & Tags</FormLabel>
                      <FormControl>
                        <div className="flex relative">
                          <Tag className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input className="pl-8" placeholder="React, TypeScript, Firebase" {...field} />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Separate tags with commas
                      </FormDescription>
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
                      <FormLabel>Featured Tool</FormLabel>
                      <FormDescription>
                        Mark this tool as featured to display it prominently on the homepage
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Tool URL field */}
                <FormField
                  control={form.control}
                  name="tool_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tool URL</FormLabel>
                      <FormControl>
                        <div className="flex relative">
                          <ExternalLink className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input className="pl-8" placeholder="https://example.com/tool" {...field} />
                        </div>
                      </FormControl>
                      <FormDescription>
                        URL where users can access the tool
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* GitHub URL field */}
                <FormField
                  control={form.control}
                  name="github_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GitHub Repository</FormLabel>
                      <FormControl>
                        <div className="flex relative">
                          <Github className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input className="pl-8" placeholder="GitHub URL (optional)" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            {/* Form buttons */}
            <DialogFooter className="mt-6 gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="gap-1">
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {editTool ? 'Update Tool' : 'Create Tool'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ToolForm;