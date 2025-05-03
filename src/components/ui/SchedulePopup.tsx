import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Calendar as CalendarIcon, Clock, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { createMeeting } from '@/lib/services/supabaseService';
import { sendMeetingConfirmation, sendAdminNotification } from '@/lib/services/emailService';

interface SchedulePopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const timeSlots = [
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", 
  "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
  "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM",
  "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM",
  "5:00 PM", "5:30 PM"
];

// Use explicit JSX.Element return type
const SchedulePopup = ({ open, onOpenChange }: SchedulePopupProps): JSX.Element => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (!date || !time) {
      toast.error("Please select a date and time");
      setIsSubmitting(false);
      return;
    }
    
    try {
      // First, save the meeting to the database
      const meetingData = {
        name,
        email,
        // Convert date to string format expected by the database
        date: date.toISOString().split('T')[0],
        time,
        duration: 60, // Default to 1 hour meeting
        topic: subject,
        notes: message || undefined
      };
      
      // Save to database
      const savedMeeting = await createMeeting(meetingData);
      
      if (!savedMeeting) {
        throw new Error("Failed to save meeting to database");
      }
      
      // Send confirmation email to the user
      const userEmailResult = await sendMeetingConfirmation({
        name,
        email,
        subject,
        date,
        time,
        message
      });
      
      // Send notification email to admin
      const adminEmailResult = await sendAdminNotification({
        name,
        email,
        subject,
        date,
        time,
        message
      });
      
      // Check if both emails were sent successfully
      if (userEmailResult.success && adminEmailResult.success) {
        toast.success("Meeting scheduled!", {
          description: `Your meeting is scheduled for ${date ? format(date, 'PPP') : ''} at ${time}. Check your email for confirmation.`,
        });
      } else {
        // If email sending failed but we still want to confirm the meeting
        toast.success("Meeting scheduled!", {
          description: `Your meeting is scheduled for ${date ? format(date, 'PPP') : ''} at ${time}.`,
        });
        console.error("Email sending issues:", { userEmailResult, adminEmailResult });
      }
      
      // Reset form
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setDate(undefined);
      setTime(undefined);
      onOpenChange(false);
    } catch (error) {
      console.error("Error scheduling meeting:", error);
      toast.error("Error scheduling meeting", {
        description: "There was an issue saving your meeting. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-w-[90vw] bg-gradient-to-br from-[#151515] to-neutral-900 border border-[#FFB600]/30 shadow-xl max-h-[80vh] overflow-y-auto p-4">
        <DialogHeader>
          <DialogTitle className="text-base text-white flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#FFB600]" />
            Schedule a Meeting
          </DialogTitle>
          <DialogDescription className="text-neutral-400 text-sm">
            Book a time to discuss your project or ideas
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex items-center justify-center py-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#FFB600]/20 to-[#e2eeff]/20 flex items-center justify-center">
            <CalendarIcon className="h-5 w-5 text-[#FFB600]" />
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="space-y-1.5">
              <label htmlFor="name" className="block text-xs font-medium text-neutral-300">
                Name
              </label>
              <Input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Your name"
                className="w-full px-3 py-1.5 h-8 rounded-md border border-neutral-800 bg-neutral-900/50 text-xs text-white focus:ring-1 focus:ring-[#FFB600] placeholder:text-neutral-500"
              />
            </div>
            
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-xs font-medium text-neutral-300">
                Email
              </label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Your email"
                className="w-full px-3 py-1.5 h-8 rounded-md border border-neutral-800 bg-neutral-900/50 text-xs text-white focus:ring-1 focus:ring-[#FFB600] placeholder:text-neutral-500"
              />
            </div>
          </div>
          
          <div className="space-y-1.5">
            <label htmlFor="subject" className="block text-xs font-medium text-neutral-300">
              Subject
            </label>
            <Input
              type="text"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              placeholder="Meeting subject"
              className="w-full px-3 py-1.5 h-8 rounded-md border border-neutral-800 bg-neutral-900/50 text-xs text-white focus:ring-1 focus:ring-[#FFB600] placeholder:text-neutral-500"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-neutral-300">
                Date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full h-8 justify-start text-left text-xs font-normal border border-neutral-800 bg-neutral-900/50 text-white hover:bg-neutral-800 hover:text-white",
                      !date && "text-neutral-500"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                    {date ? format(date, "PPP") : <span>Select date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-neutral-900 border border-neutral-800">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    disabled={(date) => date < new Date()}
                    className="bg-neutral-900 text-white"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-neutral-300">
                Time
              </label>
              <Select onValueChange={setTime}>
                <SelectTrigger className="w-full h-8 border border-neutral-800 bg-neutral-900/50 text-xs text-white">
                  <SelectValue placeholder="Select time">
                    <div className="flex items-center">
                      <Clock className="mr-2 h-3.5 w-3.5 text-neutral-400" />
                      {time || <span className="text-neutral-500">Select time</span>}
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-neutral-900 border border-neutral-800 text-white max-h-40">
                  {timeSlots.map((slot) => (
                    <SelectItem key={slot} value={slot} className="hover:bg-neutral-800 text-xs">
                      {slot}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-1.5">
            <label htmlFor="message" className="block text-xs font-medium text-neutral-300">
              Message (Optional)
            </label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={2}
              placeholder="What would you like to discuss?"
              className="w-full px-3 py-1.5 rounded-md border border-neutral-800 bg-neutral-900/50 text-xs text-white focus:ring-1 focus:ring-[#FFB600] placeholder:text-neutral-500 resize-none"
            />
          </div>
          
          <Button
            type="submit"
            disabled={isSubmitting || !date || !time}
            className="w-full py-1.5 h-8 text-xs bg-gradient-to-r from-[#FFB600] to-[#e2eeff] hover:from-[#FFB600]/90 hover:to-[#e2eeff]/90 text-[#151515] font-medium rounded-md transition-all disabled:opacity-70"
          >
            {isSubmitting ? "Scheduling..." : "Schedule Meeting"}
          </Button>
          
          <p className="text-center text-xs text-neutral-500 mt-2">
            You'll receive a confirmation email with meeting details.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SchedulePopup;
