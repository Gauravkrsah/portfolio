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
import { Loader2, Github, ExternalLink, Tag, Image, Video, Plus, X } from 'lucide-react';
import { createProject, updateProject } from '@/lib/services/supabaseService';
import { Project } from '@/lib/services/supabaseClient';

// Define the form schema
const formSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  image_url: z.string().url('Must be a valid URL'),
  additional_images: z.array(z.string().url('Must be a valid URL')).optional(),
  github_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  live_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  video_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  video_platform: z.string().optional(),
  tags: z.string(), // We'll split this into technologies array
  status: z.enum(['Draft', 'Published']),
  featured: z.boolean().default(false)
});

export type ProjectFormValues = z.infer<typeof formSchema>;

interface ProjectFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editProject?: Project | null;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ open, onOpenChange, editProject }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      content: '',
      image_url: '',
      additional_images: [],
 // Initialize as empty array
      github_url: '',
      live_url: '',
      video_url: '',
      video_platform: 'YouTube',
      tags: '',
      status: 'Draft',
      featured: false
    }
  });
  
  // Set form values when editing a project
  React.useEffect(() => {
    if (editProject) {
      form.setValue('title', editProject.title);
      form.setValue('description', editProject.description);
      form.setValue('content', editProject.content);
      form.setValue('image_url', editProject.image_url);
      form.setValue('github_url', editProject.github_url || '');
      form.setValue('additional_images', Array.isArray(editProject.additional_images) ? editProject.additional_images : []);
      form.setValue('live_url', editProject.live_url || '');
      form.setValue('tags', editProject.technologies?.join ? editProject.technologies.join(', ') : '');
      form.setValue('video_url', editProject.video_url || '');
      form.setValue('video_platform', editProject.video_platform || 'YouTube');
      form.setValue('status', editProject.status);
      form.setValue('featured', editProject.featured || false);
    } else {
      form.reset();
    }
  }, [editProject, form]);
  
  // Create project mutation
  const createMutation = useMutation({
    mutationFn: (data: ProjectFormValues) => {
      // Convert tags from comma-separated string to array
      const technologies = data.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
      
      const formattedData = {
        title: data.title,
        description: data.description,
        content: data.content,
        image_url: data.image_url,
        additional_images: Array.isArray(data.additional_images) ? data.additional_images.filter(url => url.trim() !== '') : [],
        github_url: data.github_url,
        live_url: data.live_url,
        video_url: data.video_url,
        video_platform: data.video_platform,
        technologies,
        featured: data.featured,
        status: data.status
      };
      
      console.log("Creating project with data:", formattedData);
      return createProject(formattedData);
    },
    onSuccess: () => {
      toast({
        title: 'Project created',
        description: 'The project has been successfully created.',
      });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['featuredProjects'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      form.reset();
      onOpenChange(false);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to create project: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    }
  });
  
  // Update project mutation
  const updateMutation = useMutation({
    mutationFn: (data: ProjectFormValues) => {
      if (!editProject) throw new Error("No project to update");
      
      // Convert tags from comma-separated string to array
      const technologies = data.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
      
      const formattedData = {
        title: data.title,
        description: data.description,
        content: data.content,
        image_url: data.image_url,
        additional_images: Array.isArray(data.additional_images) ? data.additional_images.filter(url => url.trim() !== '') : [],
        github_url: data.github_url,
        live_url: data.live_url,
        video_url: data.video_url,
        video_platform: data.video_platform,
        technologies,
        featured: data.featured,
        status: data.status
      };
      
      return updateProject(editProject.id, formattedData);
    },
    onSuccess: () => {
      toast({
        title: 'Project updated',
        description: 'The project has been successfully updated.',
      });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['featuredProjects'] });
      if (editProject) {
        queryClient.invalidateQueries({ queryKey: ['project', editProject.id] });
      }
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      form.reset();
      onOpenChange(false);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to update project: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    }
  });
  
  // Form submission handler
  const onSubmit = (data: ProjectFormValues) => {
    if (editProject) {
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
          <DialogTitle className="text-xl font-bold">{editProject ? 'Edit Project' : 'Add New Project'}</DialogTitle>
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
                    <FormLabel>Project Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter project title" {...field} />
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
                        placeholder="Describe your project" 
                        className="min-h-[100px]"
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
                        placeholder="# Project Title

## Overview
A brief overview of the project.

## Technologies Used
- Technology 1
- Technology 2

## Key Features
- Feature 1
- Feature 2" 
                        className="min-h-[200px] font-mono"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Enter markdown content for the project details page
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
                      Enter a direct URL to an image for this project
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Additional Images */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Additional Images</h3>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    className="h-7 px-2"
                    onClick={() => {
                      const currentImages = form.getValues('additional_images') || [];
                      form.setValue('additional_images', [...currentImages, '']);
                    }}
                  >
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    Add Image
                  </Button>
                </div>
                
                {form.watch('additional_images')?.map((_, index) => (
                  <FormField
                    key={index}
                    control={form.control}
                    name={`additional_images.${index}`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="flex">
                            <div className="flex relative flex-1">
                              <Image className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input className="pl-8" placeholder="https://example.com/image.jpg" {...field} />
                            </div>
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="sm" 
                              className="ml-2"
                              onClick={() => {
                                const currentImages = form.getValues('additional_images') || [];
                                form.setValue('additional_images', 
                                  currentImages.filter((_, i) => i !== index)
                                );
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
                
                {(!form.watch('additional_images') || form.watch('additional_images').length === 0) && (
                  <div className="text-sm text-muted-foreground italic">
                    No additional images added. Click "Add Image" to add more project images.
                  </div>
                )}
                
                <FormDescription>
                  Add multiple images to showcase different aspects of your project
                </FormDescription>
              </div>
              
              
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
                      <FormLabel>Featured Project</FormLabel>
                      <FormDescription>
                        Mark this project as featured to display it prominently on the homepage
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                
                {/* Live Demo URL field */}
                <FormField
                  control={form.control}
                  name="live_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Live Demo URL</FormLabel>
                      <FormControl>
                        <div className="flex relative">
                          <ExternalLink className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input className="pl-8" placeholder="Demo URL (optional)" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Video URL and Platform */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Video URL field */}
                <FormField
                  control={form.control}
                  name="video_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Video URL</FormLabel>
                      <FormControl>
                        <div className="flex relative">
                          <Video className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input className="pl-8" placeholder="https://youtube.com/watch?v=... or https://youtube.com/shorts/..." {...field} />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Add a video URL from YouTube, YouTube Shorts, Instagram, Instagram Reels, Vimeo, etc.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Video Platform field */}
                <FormField
                  control={form.control}
                  name="video_platform"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Video Platform</FormLabel>
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
                          <SelectItem value="YouTube">YouTube</SelectItem>
                          <SelectItem value="YouTube Shorts">YouTube Shorts</SelectItem>
                          <SelectItem value="Vimeo">Vimeo</SelectItem>
                          <SelectItem value="Instagram">Instagram</SelectItem>
                          <SelectItem value="Instagram Reels">Instagram Reels</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
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
                {editProject ? 'Update Project' : 'Create Project'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectForm;
