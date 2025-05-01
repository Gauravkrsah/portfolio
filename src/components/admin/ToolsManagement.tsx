import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTools, deleteTool } from '@/lib/services/supabaseService';
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
import { Loader2, MoreVertical, Plus, Star, Edit, Trash, Eye } from 'lucide-react';
import ToolForm from './ToolForm';
import { Tool } from '@/lib/services/supabaseClient';
import { adminSupabase } from '@/lib/services/supabaseClient';

const ToolsManagement: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [toolToDelete, setToolToDelete] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch tools
  const { data: tools, isLoading, error } = useQuery({
    queryKey: ['tools'],
    queryFn: getTools
  });
  
  // Delete tool mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      try {
        // Use adminSupabase client to bypass RLS
        const { error } = await adminSupabase
          .from('tools')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        return true;
      } catch (error) {
        console.error("Error deleting tool:", error);
        throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: 'Tool deleted',
        description: 'The tool has been successfully deleted.',
      });
      queryClient.invalidateQueries({ queryKey: ['tools'] });
      setIsDeleteDialogOpen(false);
      setToolToDelete(null);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to delete tool: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    }
  });

  // Toggle featured status mutation
  const toggleFeaturedMutation = useMutation({
    mutationFn: async ({ id, featured }: { id: string; featured: boolean }) => {
      try {
        // Use adminSupabase client to bypass RLS
        const { data, error } = await adminSupabase
          .from('tools')
          .update({
            featured,
            updated_at: new Date().toISOString()
          })
          .eq('id', id)
          .select()
          .single();
        
        if (error) throw error;
        return data as Tool;
      } catch (error) {
        console.error("Error updating tool featured status:", error);
        throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: 'Tool updated',
        description: 'Featured status has been updated successfully.',
      });
      queryClient.invalidateQueries({ queryKey: ['tools'] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to update featured status: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    }
  });

  const handleAddTool = () => {
    setSelectedTool(null);
    setIsFormOpen(true);
  };
  
  const handleEditTool = (tool: Tool) => {
    setSelectedTool(tool);
    setIsFormOpen(true);
  };
  
  const handleDeleteTool = (id: string) => {
    setToolToDelete(id);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    if (toolToDelete) {
      deleteMutation.mutate(toolToDelete);
    }
  };

  const handleToggleFeatured = (tool: Tool) => {
    toggleFeaturedMutation.mutate({
      id: tool.id,
      featured: !tool.featured
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Tools Management</h2>
        <Button onClick={handleAddTool} className="gap-1">
          <Plus className="h-4 w-4" />
          Add New Tool
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>All Tools</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">
              Error loading tools. Please try again.
            </div>
          ) : tools && tools.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Technologies</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tools.map((tool) => (
                  <TableRow key={tool.id}>
                    <TableCell className="font-medium">{tool.title}</TableCell>
                    <TableCell>{tool.technologies?.join(', ') || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge variant={tool.status === 'Published' ? 'default' : 'secondary'}>
                        {tool.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleToggleFeatured(tool)}
                        title={tool.featured ? "Remove from featured" : "Add to featured"}
                      >
                        {tool.featured ? (
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
                          <DropdownMenuItem onClick={() => handleEditTool(tool)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteTool(tool.id)}>
                            <Trash className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => window.open(tool.tool_url, '_blank')}
                            disabled={!tool.tool_url}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Live
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
              No tools found. Click "Add New Tool" to create one.
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Tool Form Dialog */}
      <ToolForm 
        open={isFormOpen} 
        onOpenChange={setIsFormOpen} 
        editTool={selectedTool} 
      />
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the tool.
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

export default ToolsManagement;