import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOtherWorks, deleteOtherWork, updateOtherWork } from '@/lib/services/supabaseService';
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
import OtherWorkForm from './OtherWorkForm';
import { OtherWork } from '@/lib/services/supabaseClient';

const OtherWorksManagement = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [selectedWork, setSelectedWork] = useState<OtherWork | null>(null);
  const [workToDelete, setWorkToDelete] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch other works
  const { data: otherWorks, isLoading, error } = useQuery({
    queryKey: ['otherWorks'],
    queryFn: getOtherWorks
  });
 
  // Delete other work mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteOtherWork(id),
    onSuccess: () => {
      toast({
        title: 'Work deleted',
        description: 'The work has been successfully deleted.',
      });
      queryClient.invalidateQueries({ queryKey: ['otherWorks'] });
      queryClient.invalidateQueries({ queryKey: ['featuredOtherWorks'] });
      setIsDeleteDialogOpen(false);
      setWorkToDelete(null);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to delete work: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    }
  });

  // Toggle featured status mutation
  const toggleFeaturedMutation = useMutation({
    mutationFn: ({ id, featured }: { id: string; featured: boolean }) => {
      return updateOtherWork(id, { featured });
    },
    onSuccess: () => {
      toast({
        title: 'Work updated',
        description: 'Featured status has been updated successfully.',
      });
      queryClient.invalidateQueries({ queryKey: ['otherWorks'] });
      queryClient.invalidateQueries({ queryKey: ['featuredOtherWorks'] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to update featured status: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    }
  });

  const handleAddWork = () => {
    setSelectedWork(null);
    setIsFormOpen(true);
  };
  
  const handleEditWork = (work: OtherWork) => {
    setSelectedWork(work);
    setIsFormOpen(true);
  };
  
  const handleDeleteWork = (id: string) => {
    setWorkToDelete(id);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    if (workToDelete) {
      deleteMutation.mutate(workToDelete);
    }
  };

  const handleToggleFeatured = (work: OtherWork) => {
    toggleFeaturedMutation.mutate({
      id: work.id,
      featured: !work.featured
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Other Works Management</h2>
        <Button onClick={handleAddWork} className="gap-1">
          <Plus className="h-4 w-4" />
          Add New Work
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>All Works</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">
              Error loading works. Please try again.
            </div>
          ) : otherWorks && otherWorks.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {otherWorks.map((work) => (
                  <TableRow key={work.id}>
                    <TableCell className="font-medium">{work.title}</TableCell>
                    <TableCell>{work.work_type}</TableCell>
                    <TableCell>{work.client || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge variant={work.status === 'Published' ? 'default' : 'secondary'}>
                        {work.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleToggleFeatured(work)}
                        title={work.featured ? "Remove from featured" : "Add to featured"}
                      >
                        {work.featured ? (
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
                          <DropdownMenuItem onClick={() => handleEditWork(work)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteWork(work.id)}>
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
              No works found. Click "Add New Work" to create one.
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Other Work Form Dialog */}
      {isFormOpen && (
        <OtherWorkForm 
          open={isFormOpen} 
          onOpenChange={setIsFormOpen} 
          editWork={selectedWork} 
        />
      )}
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the work.
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

export default OtherWorksManagement;
