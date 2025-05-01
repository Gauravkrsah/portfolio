import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/services/supabaseClient';
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
import { Badge } from '@/components/ui/badge';
import { Loader2, Eye } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

// Define the Message type
interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'New' | 'Read' | 'Replied' | 'Archived';
  created_at: string;
}

const MessagesManagement: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  
  // Fetch messages on component mount
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching messages:', error);
          setError(error.message);
          return;
        }
        
        setMessages(data || []);
      } catch (err) {
        console.error('Exception when fetching messages:', err);
        setError('An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMessages();
  }, []);
  
  const handleViewMessage = (message: Message) => {
    setSelectedMessage(message);
    setIsViewDialogOpen(true);
    
    // If the message is new, mark it as read
    if (message.status === 'New') {
      updateMessageStatus(message.id, 'Read');
    }
  };
  
  const updateMessageStatus = async (id: string, status: 'New' | 'Read' | 'Replied' | 'Archived') => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ status })
        .eq('id', id);
      
      if (error) {
        console.error('Error updating message status:', error);
        return;
      }
      
      // Update the message in the local state
      setMessages(messages.map(msg => 
        msg.id === id ? { ...msg, status } : msg
      ));
    } catch (err) {
      console.error('Exception when updating message status:', err);
    }
  };
  
  const getStatusBadgeVariant = (status: string): "default" | "secondary" | "outline" | "destructive" => {
    switch (status) {
      case 'New':
        return 'default';
      case 'Read':
        return 'secondary';
      case 'Replied':
        return 'outline';
      case 'Archived':
        return 'destructive';
      default:
        return 'default';
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Messages Management</h2>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>All Messages</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">
              Error loading messages: {error}
            </div>
          ) : messages.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {messages.map((message) => (
                  <TableRow key={message.id}>
                    <TableCell className="font-medium">{message.name}</TableCell>
                    <TableCell>{message.email}</TableCell>
                    <TableCell>{message.subject}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(message.status)}>
                        {message.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(message.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleViewMessage(message)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No messages found.
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* View Message Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedMessage?.subject}</DialogTitle>
            <DialogDescription>
              From: {selectedMessage?.name} &lt;{selectedMessage?.email}&gt;
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 p-4 bg-muted rounded-md">
            <p className="whitespace-pre-wrap">{selectedMessage?.message}</p>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MessagesManagement;
