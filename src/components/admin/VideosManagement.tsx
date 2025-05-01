import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getVideos, deleteContent, updateContent } from '@/lib/services/supabaseService';
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
import { Loader2, MoreVertical, Plus, Star, Edit, Trash, Eye, ExternalLink } from 'lucide-react';
import { Content } from '@/lib/services/supabaseClient';
import VideoForm from './VideoForm';

const VideosManagement = () => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editVideo, setEditVideo] = useState<Content | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch videos
  const { data: videos, isLoading, error } = useQuery({
    queryKey: ['videos'],
    queryFn: getVideos
  });
 
  // Delete video mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteContent(id),
    onSuccess: () => {
      toast({
        title: 'Video deleted',
        description: 'The video has been successfully deleted.',
      });
      queryClient.invalidateQueries({ queryKey: ['videos'] });
      queryClient.invalidateQueries({ queryKey: ['contents'] });
      queryClient.invalidateQueries({ queryKey: ['featuredContents'] });
      setIsDeleteDialogOpen(false);
      setVideoToDelete(null);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to delete video: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    }
  });

  // Toggle featured status mutation
  const toggleFeaturedMutation = useMutation({
    mutationFn: ({ id, featured }: { id: string; featured: boolean }) => {
      return updateContent(id, { featured });
    },
    onSuccess: () => {
      toast({
        title: 'Video updated',
        description: 'Featured status has been updated successfully.',
      });
      queryClient.invalidateQueries({ queryKey: ['videos'] });
      queryClient.invalidateQueries({ queryKey: ['contents'] });
      queryClient.invalidateQueries({ queryKey: ['featuredContents'] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to update featured status: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    }
  });

  const handleAddVideo = () => {
    setEditVideo(null);
    setIsFormOpen(true);
  };
  
  const handleEditVideo = (video: Content) => {
    setEditVideo(video);
    setIsFormOpen(true);
  };
  
  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditVideo(null);
  };
  
  const handleDeleteVideo = (id: string) => {
    setVideoToDelete(id);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    if (videoToDelete) {
      deleteMutation.mutate(videoToDelete);
    }
  };

  const handleToggleFeatured = (video: Content) => {
    toggleFeaturedMutation.mutate({
      id: video.id,
      featured: !video.featured
    });
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Videos Management</h2>
        <Button onClick={handleAddVideo} className="gap-1">
          <Plus className="h-4 w-4" />
          Add New Video
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>All Videos</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">
              Error loading videos. Please try again.
            </div>
          ) : videos && videos.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Platform</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {videos.map((video) => (
                  <TableRow key={video.id}>
                    <TableCell className="font-medium">{video.title}</TableCell>
                    <TableCell>{video.platform || 'YouTube'}</TableCell>
                    <TableCell>{formatViews(video.views || 0)}</TableCell>
                    <TableCell>
                      <Badge variant={video.status === 'Published' ? 'default' : 'secondary'}>
                        {video.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleToggleFeatured(video)}
                        title={video.featured ? "Remove from featured" : "Add to featured"}
                      >
                        {video.featured ? (
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
                          <DropdownMenuItem onClick={() => window.open(video.content_url || '#', '_blank')}>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditVideo(video)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteVideo(video.id)}>
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
              No videos found. Click "Add New Video" to create one.
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the video.
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
      
      {/* Video Form Dialog */}
      <VideoForm 
        open={isFormOpen} 
        onOpenChange={handleFormClose} 
        editVideo={editVideo} 
      />
    </div>
  );
};

export default VideosManagement;
