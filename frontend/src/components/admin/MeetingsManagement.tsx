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
import { Loader2, Eye, Calendar } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

// Define the Meeting type
interface Meeting {
  id: string;
  name: string;
  email: string;
  phone?: string;
  date: string;
  time: string;
  duration: number;
  topic: string;
  notes?: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  created_at: string;
}

const MeetingsManagement: React.FC = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  
  // Fetch meetings on component mount
  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('meetings')
          .select('*')
          .order('date', { ascending: true });
        
        if (error) {
          console.error('Error fetching meetings:', error);
          setError(error.message);
          return;
        }
        
        setMeetings(data || []);
      } catch (err) {
        console.error('Exception when fetching meetings:', err);
        setError('An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMeetings();
  }, []);
  
  const handleViewMeeting = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setIsViewDialogOpen(true);
  };
  
  const updateMeetingStatus = async (id: string, status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled') => {
    try {
      const { error } = await supabase
        .from('meetings')
        .update({ status })
        .eq('id', id);
      
      if (error) {
        console.error('Error updating meeting status:', error);
        return;
      }
      
      // Update the meeting in the local state
      setMeetings(meetings.map(mtg => 
        mtg.id === id ? { ...mtg, status } : mtg
      ));
    } catch (err) {
      console.error('Exception when updating meeting status:', err);
    }
  };
  
  const getStatusBadgeVariant = (status: string): "default" | "secondary" | "outline" | "destructive" => {
    switch (status) {
      case 'Pending':
        return 'default';
      case 'Confirmed':
        return 'secondary';
      case 'Completed':
        return 'outline';
      case 'Cancelled':
        return 'destructive';
      default:
        return 'default';
    }
  };
  
  // Format date string to a more readable format
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (err) {
      console.error('Error formatting date:', err);
      return dateString;
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Meetings Management</h2>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>All Meetings</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">
              Error loading meetings: {error}
            </div>
          ) : meetings.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Topic</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {meetings.map((meeting) => (
                  <TableRow key={meeting.id}>
                    <TableCell className="font-medium">{meeting.name}</TableCell>
                    <TableCell>{meeting.email}</TableCell>
                    <TableCell>{formatDate(meeting.date)}</TableCell>
                    <TableCell>{meeting.time}</TableCell>
                    <TableCell>{meeting.topic}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(meeting.status)}>
                        {meeting.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleViewMeeting(meeting)}
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
              No meetings found.
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* View Meeting Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedMeeting?.topic}</DialogTitle>
            <DialogDescription>
              Meeting with {selectedMeeting?.name} &lt;{selectedMeeting?.email}&gt;
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Date</p>
                <p>{selectedMeeting?.date ? formatDate(selectedMeeting.date) : 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Time</p>
                <p>{selectedMeeting?.time || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Duration</p>
                <p>{selectedMeeting?.duration ? `${selectedMeeting.duration} minutes` : 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <Badge variant={selectedMeeting ? getStatusBadgeVariant(selectedMeeting.status) : 'default'}>
                  {selectedMeeting?.status || 'N/A'}
                </Badge>
              </div>
            </div>
            
            {selectedMeeting?.phone && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Phone</p>
                <p>{selectedMeeting.phone}</p>
              </div>
            )}
            
            {selectedMeeting?.notes && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Notes</p>
                <p className="whitespace-pre-wrap">{selectedMeeting.notes}</p>
              </div>
            )}
          </div>
          <DialogFooter className="mt-4 space-x-2">
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
            {selectedMeeting && selectedMeeting.status === 'Pending' && (
              <Button 
                onClick={() => {
                  if (selectedMeeting) {
                    updateMeetingStatus(selectedMeeting.id, 'Confirmed');
                    setIsViewDialogOpen(false);
                  }
                }}
              >
                Confirm Meeting
              </Button>
            )}
            {selectedMeeting && selectedMeeting.status === 'Confirmed' && (
              <Button 
                onClick={() => {
                  if (selectedMeeting) {
                    updateMeetingStatus(selectedMeeting.id, 'Completed');
                    setIsViewDialogOpen(false);
                  }
                }}
              >
                Mark as Completed
              </Button>
            )}
            {selectedMeeting && (selectedMeeting.status === 'Pending' || selectedMeeting.status === 'Confirmed') && (
              <Button 
                variant="destructive"
                onClick={() => {
                  if (selectedMeeting) {
                    updateMeetingStatus(selectedMeeting.id, 'Cancelled');
                    setIsViewDialogOpen(false);
                  }
                }}
              >
                Cancel Meeting
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MeetingsManagement;
