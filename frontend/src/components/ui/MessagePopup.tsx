import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { MessageCircle, Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { directCreateMessage } from '@/lib/services/direct_fix';

interface MessagePopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MessagePopup: React.FC<MessagePopupProps> = ({ open, onOpenChange }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      console.log("Sending message with direct fix:", formData);
      
      // Save message to database using the direct fix
      await directCreateMessage({
        name: formData.name,
        email: formData.email,
        subject: 'Contact Form Message',
        message: formData.message
      });
      
      toast({
        title: "Message sent successfully!",
        description: "I'll get back to you as soon as possible.",
      });
      
      setIsSubmitting(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error sending message",
        description: "Please try again later.",
        variant: "destructive"
      });
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-w-[90vw] bg-gradient-to-br from-[#151515] to-neutral-900 border border-[#FFB600]/30 shadow-xl p-4">
        <DialogHeader>
          <DialogTitle className="text-base text-white flex items-center gap-2">
            <MessageCircle className="h-4 w-4 text-[#FFB600]" />
            Send a Message
          </DialogTitle>
          <DialogDescription className="text-neutral-400 text-sm">
            Have a question or want to work together?
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-2 mt-1">
          <div className="space-y-1.5">
            <label htmlFor="name" className="block text-xs font-medium text-neutral-300">
              Name
            </label>
            <Input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Your name"
              className="w-full rounded-md border border-neutral-800 bg-neutral-900/50 text-xs text-white focus:ring-1 focus:ring-[#FFB600] placeholder:text-neutral-500 h-8"
            />
          </div>
          
          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-xs font-medium text-neutral-300">
              Email
            </label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="your@email.com"
              className="w-full rounded-md border border-neutral-800 bg-neutral-900/50 text-xs text-white focus:ring-1 focus:ring-[#FFB600] placeholder:text-neutral-500 h-8"
            />
          </div>
          
          <div className="space-y-1.5">
            <label htmlFor="phone" className="block text-xs font-medium text-neutral-300">
              Phone (optional)
            </label>
            <Input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Your phone number"
              className="w-full rounded-md border border-neutral-800 bg-neutral-900/50 text-xs text-white focus:ring-1 focus:ring-[#FFB600] placeholder:text-neutral-500 h-8"
            />
          </div>
          
          <div className="space-y-1.5">
            <label htmlFor="message" className="block text-xs font-medium text-neutral-300">
              Message
            </label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={2}
              placeholder="Your message"
              className="w-full rounded-md border border-neutral-800 bg-neutral-900/50 text-xs text-white focus:ring-1 focus:ring-[#FFB600] placeholder:text-neutral-500 resize-none"
            />
          </div>
          
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-1.5 text-xs bg-gradient-to-r from-[#FFB600] to-[#e2eeff] hover:from-[#FFB600]/90 hover:to-[#e2eeff]/90 text-[#151515] font-medium rounded-md transition-all disabled:opacity-70 flex items-center justify-center gap-2 h-8"
          >
            {isSubmitting ? "Sending..." : (
              <>
                <Send className="h-3.5 w-3.5" />
                <span>Send Message</span>
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MessagePopup;
