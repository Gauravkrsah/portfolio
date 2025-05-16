import React, { useState, useEffect, useRef } from 'react';
import LeftSidebar from '@/components/layout/LeftSidebar';
import RightSidebar from '@/components/layout/RightSidebar';
import MobileNavbar from '@/components/layout/MobileNavbar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MapPin, 
  Mail, 
  Phone, 
  Send, 
  Loader2, 
  CheckCircle, 
  Github, 
  Linkedin, 
  Twitter, 
  Instagram 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '@/hooks/use-theme';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

const Contacts = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  
  const formRef = useRef<HTMLFormElement>(null);
  const contactInfoRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    document.title = "Contact Me | Gaurav Kr Sah";
    
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, 200);
    
    return () => clearTimeout(timeout);
  }, []);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      toast.success('Message sent!', {
        description: 'I will get back to you as soon as possible.',
      });
      setIsSubmitting(false);
      setSubmitted(true);
      
      setTimeout(() => {
        setFormData({ name: '', email: '', subject: '', message: '' });
        setSubmitted(false);
      }, 3000);
    }, 1500);
  };

  // Main content to render
  const renderContent = () => (
    <div className={cn(
      "relative transition-all duration-700",
      isVisible ? "opacity-100" : "opacity-0 translate-y-4"
    )}>
      <div className="max-w-6xl mx-auto p-6 md:p-8 lg:p-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3 text-white">Get in Touch</h1>
          <p className="text-gray-300 text-lg">
            I'm always open to new opportunities, collaborations, or just a friendly chat. 
            Feel free to reach out through any of the channels below.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
          <div ref={contactInfoRef} className="space-y-6">
            <motion.div 
              className="bg-gray-900 p-6 rounded-xl border border-gray-700 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FFB600] to-[#e2eeff] flex items-center justify-center shadow-lg">
                    <MapPin className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2 text-white">Location</h3>
                  <p className="text-gray-200">Kharibot-Balkumari, Lalitpur</p>
                  <p className="text-gray-200">Nepal</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-gray-900 p-6 rounded-xl border border-gray-700 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FFB600] to-[#e2eeff] flex items-center justify-center shadow-lg">
                    <Mail className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2 text-white">Email</h3>
                  <a 
                    href="mailto:hello@gauravsah.com.np" 
                    className="text-[#FFB600] hover:text-[#FFB600]/80 hover:underline text-lg font-medium"
                  >
                    hello@gauravsah.com.np
                  </a>
                  <p className="text-gray-200 text-sm mt-1">
                    I typically respond within 24 hours
                  </p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-gray-900 p-6 rounded-xl border border-gray-700 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FFB600] to-[#e2eeff] flex items-center justify-center shadow-lg">
                    <Phone className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2 text-white">Phone</h3>
                  <a 
                    href="tel:+1234567890" 
                    className="text-[#FFB600] hover:text-[#FFB600]/80 hover:underline text-lg font-medium"
                  >
                    +977-9844722697
                  </a>
                  <p className="text-gray-200 text-sm mt-1">
                    Monday-Friday, 9am-5pm PST
                  </p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-gray-900 p-6 rounded-xl border border-gray-700 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h3 className="text-xl font-medium mb-4 text-white">Connect with me</h3>
              <div className="flex flex-wrap gap-3">
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#FFB600]/20 hover:border-[#FFB600]/50 transition-colors border border-gray-600"
                  aria-label="GitHub"
                >
                  <Github className="w-5 h-5 text-white" />
                </a>
                <a 
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#FFB600]/20 hover:border-[#FFB600]/50 transition-colors border border-gray-600"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5 text-white" />
                </a>
                <a 
                  href="https://twitter.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#FFB600]/20 hover:border-[#FFB600]/50 transition-colors border border-gray-600"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5 text-white" />
                </a>
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#FFB600]/20 hover:border-[#FFB600]/50 transition-colors border border-gray-600"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5 text-white" />
                </a>
              </div>
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="bg-gray-900 p-6 md:p-8 rounded-xl border border-gray-700 shadow-lg">
              <h3 className="text-xl font-medium mb-6 text-white">Send me a message</h3>
              
              {submitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center text-center p-6"
                >
                  <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                  <h4 className="text-lg font-medium mb-2 text-white">Message Sent!</h4>
                  <p className="text-gray-200">
                    Thank you for reaching out. I'll get back to you as soon as possible.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} ref={formRef} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="name" className="block text-base font-medium mb-2 text-white">
                        Name
                      </label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-3 bg-gray-800 border-2 border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-[#FFB600] focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-base font-medium mb-2 text-white">
                        Email
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-3 bg-gray-800 border-2 border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-[#FFB600] focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-base font-medium mb-2 text-white">
                      Subject
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full p-3 bg-gray-800 border-2 border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-[#FFB600] focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-base font-medium mb-2 text-white">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      className="w-full p-3 bg-gray-800 border-2 border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-[#FFB600] focus:border-transparent resize-none"
                      required
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full p-4 bg-gradient-to-r from-[#FFB600] to-[#e2eeff] hover:from-[#FFB600]/90 hover:to-[#e2eeff]/90 text-black text-base font-medium rounded-lg flex items-center justify-center gap-2 shadow-lg transition-all duration-300"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
        
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h3 className="text-xl font-medium mb-6 text-white">Find me here</h3>
          <div className="aspect-[16/9] w-full rounded-xl overflow-hidden border border-gray-700 shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d7067.20750829847!2d85.3449909392367!3d27.66772869435176!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2snp!4v1746021323026!5m2!1sen!2snp"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Maps"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* Mobile navbar - only visible on mobile */}
      <MobileNavbar />
      
      <div className="flex flex-1 pt-[60px] lg:pt-0">
        {/* Left sidebar - hidden on mobile */}
        <div className="hidden lg:block sticky top-0 h-screen">
          <LeftSidebar />
        </div>
        
        {/* Main content - always visible */}
        <main className="flex-1 relative overflow-hidden">
          <ScrollArea className="h-screen w-full">
            {renderContent()}
          </ScrollArea>
        </main>
        
        {/* Right sidebar - hidden on mobile */}
        <div className="hidden lg:block sticky top-0 h-screen">
          <RightSidebar />
        </div>
      </div>
    </div>
  );
};

export default Contacts;
