import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Sparkles, Mail } from 'lucide-react';
import SubscribeForm from './SubscribeForm';

interface SubscribePopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SubscribePopup: React.FC<SubscribePopupProps> = ({ open, onOpenChange }) => {
  const handleSuccess = () => onOpenChange(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-w-[90vw] bg-gradient-to-br from-[#151515] to-neutral-900 border border-[#FFB600]/30 shadow-xl p-4">
        <DialogHeader>
          <DialogTitle className="text-base text-white flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#FFB600]" />
            Subscribe to Our Newsletter
          </DialogTitle>
          <DialogDescription className="text-neutral-400 text-sm">
            Get exclusive updates on new projects and content
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex items-center justify-center py-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#FFB600]/20 to-[#e2eeff]/20 flex items-center justify-center">
            <Mail className="h-7 w-7 text-[#FFB600]" />
          </div>
        </div>
        
        <SubscribeForm 
          onSuccess={handleSuccess}
          source="newsletter_popup"
          buttonText="Subscribe"
        />
        
        <p className="text-center text-xs text-neutral-500 mt-4">
          We respect your privacy. You can unsubscribe at any time.
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default SubscribePopup;
