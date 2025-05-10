import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBlogPosts, deleteBlogPost, updateBlogPost } from '@/lib/services/supabaseService';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Loader2, MoreVertical, Plus, Star, Edit, Trash } from 'lucide-react';
import BlogPostForm from './BlogPostForm';
import { BlogPost } from '@/lib/services/supabaseClient';

const BlogsManagement: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [selectedBlogPost, setSelectedBlogPost] = useState<BlogPost | null>(null);
  const [blogPostToDelete, setBlogPostToDelete] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch blog posts
  const { data: blogPosts, isLoading, error } = useQuery({
    queryKey: ['blogPosts'],
    queryFn: getBlogPosts
  });
 
  // Delete blog post mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteBlogPost(id),
    onSuccess: () => {
      toast({
        title: 'Blog post deleted',
        description: 'The blog post has been successfully deleted.',
      });
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      queryClient.invalidateQueries({ queryKey: ['featuredBlogPosts'] });
      setIsDeleteDialogOpen(false);
      setBlogPostToDelete(null);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to delete blog post: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    }
  });

  // Toggle featured status mutation
  const toggleFeaturedMutation = useMutation({
    mutationFn: ({ id, featured }: { id: string; featured: boolean }) => {
      return updateBlogPost(id, { featured });
    },
    onSuccess: () => {
      toast({
        title: 'Blog post updated',
        description: 'Featured status has been updated successfully.',
      });
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      queryClient.invalidateQueries({ queryKey: ['featuredBlogPosts'] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to update featured status: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    }
  });

  const handleAddBlogPost = () => {
    setSelectedBlogPost(null);
    setIsFormOpen(true);
  };
  
  const handleEditBlogPost = (blogPost: BlogPost) => {
    setSelectedBlogPost(blogPost);
    setIsFormOpen(true);
  };
  
  const handleDeleteBlogPost = (id: string) => {
    setBlogPostToDelete(id);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    if (blogPostToDelete) {
      deleteMutation.mutate(blogPostToDelete);
    }
  };

  const handleToggleFeatured = (blogPost: BlogPost) => {
    toggleFeaturedMutation.mutate({
      id: blogPost.id,
      featured: !blogPost.featured
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Blog Posts Management</h2>
        <Button onClick={handleAddBlogPost} className="gap-1">
          <Plus className="h-4 w-4" />
          Create New Post
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>All Blog Posts</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">
              Error loading blog posts. Please try again.
            </div>
          ) : blogPosts && blogPosts.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {blogPosts.map((blogPost) => (
                  <TableRow key={blogPost.id}>
                    <TableCell className="font-medium">{blogPost.title}</TableCell>
                    <TableCell>{blogPost.categories?.join(', ') || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge variant={blogPost.status === 'Published' ? 'default' : 'secondary'}>
                        {blogPost.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleToggleFeatured(blogPost)}
                        title={blogPost.featured ? "Remove from featured" : "Add to featured"}
                      >
                        {blogPost.featured ? (
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        ) : (
                          <Star className="h-4 w-4 text-gray-300" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditBlogPost(blogPost)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteBlogPost(blogPost.id)}>
                            <Trash className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No blog posts found. Click "Create New Post" to create one.
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Blog Post Form Dialog */}
      {isFormOpen && (
        <BlogPostForm 
          open={isFormOpen} 
          onOpenChange={setIsFormOpen} 
          editBlogPost={selectedBlogPost} 
        />
      )}
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the blog post.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BlogsManagement;
