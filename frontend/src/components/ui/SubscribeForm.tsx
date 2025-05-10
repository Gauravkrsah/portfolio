import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Send } from 'lucide-react';
import { directCreateSubscriber } from '@/lib/services/direct_fix';

// Define the form schema
const formSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  name: z.string().optional()
});

type SubscribeFormValues = z.infer<typeof formSchema>;

interface SubscribeFormProps {
  onSuccess?: () => void;
  source?: string;
  showName?: boolean;
  buttonText?: string;
  className?: string;
}

const SubscribeForm: React.FC<SubscribeFormProps> = ({
  onSuccess,
  source = 'website',
  showName = false,
  buttonText = 'Subscribe',
  className = ''
}) => {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const form = useForm<SubscribeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      name: ''
    }
  });
  
  // Create subscriber mutation using the direct fix
  const subscribeMutation = useMutation({
    mutationFn: (data: SubscribeFormValues) => {
      console.log("Subscribing with direct fix:", data);
      return directCreateSubscriber({
        email: data.email,
        name: data.name,
        source
      });
    },
    onSuccess: () => {
      toast({
        title: 'Subscription successful',
        description: 'Thank you for subscribing to our newsletter!',
      });
      setIsSubmitted(true);
      form.reset();
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      // Check if it's a duplicate email error
      if (error instanceof Error && error.message.includes('duplicate')) {
        toast({
          title: 'Already subscribed',
          description: 'This email is already subscribed to our newsletter.',
          variant: 'default',
        });
        setIsSubmitted(true);
        form.reset();
        if (onSuccess) onSuccess();
      } else {
        toast({
          title: 'Error',
          description: `Failed to subscribe: ${error instanceof Error ? error.message : 'Unknown error'}`,
          variant: 'destructive',
        });
      }
    }
  });
  
  // Form submission handler
  const onSubmit = (data: SubscribeFormValues) => {
    subscribeMutation.mutate(data);
  };
  
  if (isSubmitted) {
    return (
      <div className={`text-center py-4 ${className}`}>
        <p className="text-green-500 dark:text-green-400">
          Thank you for subscribing!
        </p>
      </div>
    );
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={`space-y-3 ${className}`}>
        {showName && (
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input 
                    placeholder="Your name (optional)" 
                    {...field} 
                    className="bg-white/5 border-white/10 focus:border-white/20"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        <div className="flex space-x-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input 
                    placeholder="Your email address" 
                    type="email"
                    {...field} 
                    className="bg-white/5 border-white/10 focus:border-white/20"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            disabled={subscribeMutation.isPending} 
            className="gap-1 bg-[#FFB600] hover:bg-[#FFB600]/80 text-black"
          >
            {subscribeMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            {buttonText}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SubscribeForm;