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
import { createOtherWork, updateOtherWork } from '@/lib/services/supabaseService';
import { OtherWork } from '@/lib/services/supabaseClient';

// Define the form schema
const formSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  image_url: z.string().url('Must be a valid URL'),
  work_type: z.string().min(1, 'Work type is required'),
  client: z.string().optional(),
  technologies: z.string(), // We'll split this into technologies array
  status: z.enum(['Draft', 'Published']),
  featured: z.boolean().default(false)
});

export type OtherWorkFormValues = z.infer<typeof formSchema>;

interface OtherWorkFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editWork?: OtherWork | null;
}

const OtherWorkForm = ({ open, onOpenChange, editWork }: OtherWorkFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<OtherWorkFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      content: '',
      image_url: '',
      work_type: '',
      client: '',
      technologies: '',
      status: 'Draft',
      featured: false
    }
  });
  
  // Set form values when editing a work
  React.useEffect(() => {
    if (editWork) {
      form.reset({
        title: editWork.title,
        description: editWork.description,
        content: editWork.content,
        image_url: editWork.image_url,
        work_type: editWork.work_type,
        client: editWork.client || '',
        technologies: editWork.technologies?.join ? editWork.technologies.join(', ') : '',
        status: editWork.status,
        featured: editWork.featured || false
      });
    } else {
      form.reset();
    }
  }, [editWork, form]);
  
  // Create other work mutation
  const createMutation = useMutation({
    mutationFn: (data: OtherWorkFormValues) => {
      // Convert technologies from comma-separated string to array
      const technologies = data.technologies.split(',').map(tech => tech.trim()).filter(tech => tech !== '');
      
      return createOtherWork({
        title: data.title,
        description: data.description,
        content: data.content,
        image_url: data.image_url,
        work_type: data.work_type,
        client: data.client,
        technologies,
        featured: data.featured,
        status: data.status
      });
    },
    onSuccess: () => {
      toast({
        title: 'Work created',
        description: 'The work has been successfully created.',
      });
      queryClient.invalidateQueries({ queryKey: ['otherWorks'] });
      queryClient.invalidateQueries({ queryKey: ['featuredOtherWorks'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      form.reset();
      onOpenChange(false);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to create work: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    }
  });
  
  // Update other work mutation
  const updateMutation = useMutation({
    mutationFn: (data: OtherWorkFormValues) => {
      if (!editWork) throw new Error("No work to update");
      
      // Convert technologies from comma-separated string to array
      const technologies = data.technologies.split(',').map(tech => tech.trim()).filter(tech => tech !== '');
      
      return updateOtherWork(editWork.id, {
        title: data.title,
        description: data.description,
        content: data.content,
        image_url: data.image_url,
        work_type: data.work_type,
        client: data.client,
        technologies,
        featured: data.featured,
        status: data.status
      });
    },
    onSuccess: () => {
      toast({
        title: 'Work updated',
        description: 'The work has been successfully updated.',
      });
      queryClient.invalidateQueries({ queryKey: ['otherWorks'] });
      queryClient.invalidateQueries({ queryKey: ['featuredOtherWorks'] });
      if (editWork) {
        queryClient.invalidateQueries({ queryKey: ['otherWork', editWork.id] });
      }
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      form.reset();
      onOpenChange(false);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to update work: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    }
  });
  
  // Form submission handler
  const onSubmit = (data: OtherWorkFormValues) => {
    if (editWork) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };
  
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  // Work type options
  const workTypeOptions = [
    "Design",
    "Consultation",
    "Workshop",
    "Research",
    "Case Study",
    "Mentorship",
    "Speaking",
    "Other"
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{editWork ? 'Edit Work' : 'Add New Work'}</DialogTitle>
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
                      <Input placeholder="Enter work title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Work Type field */}
                <FormField
                  control={form.control}
                  name="work_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Work Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select work type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {workTypeOptions.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Client field */}
                <FormField
                  control={form.control}
                  name="client"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Client name" {...field} />
                      </FormControl>
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
                        placeholder="A brief description of the work" 
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
                        placeholder="# Work Title

## Overview
Brief overview of the work.

## Process
Description of the process.

## Results
Outcomes and results." 
                        className="min-h-[200px] font-mono"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Enter markdown content for the work details
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
                      Enter a direct URL to an image for this work
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
                
                {/* Technologies field */}
                <FormField
                  control={form.control}
                  name="technologies"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Technologies</FormLabel>
                      <FormControl>
                        <div className="flex relative">
                          <Tag className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input className="pl-8" placeholder="Figma, Photoshop, Illustrator" {...field} />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Separate technologies with commas
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
                      <FormLabel>Featured Work</FormLabel>
                      <FormDescription>
                        Mark this work as featured to display it prominently on the homepage
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
                {editWork ? 'Update Work' : 'Create Work'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default OtherWorkForm;
