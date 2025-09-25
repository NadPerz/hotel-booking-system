
'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { createOrganizer, updateOrganizer } from '../lib/event-api';

interface Organizer {
  id: string;
  organizerName: string;
  contactEmail: string;
  contactPhone: string;
  organization: string;
}

const formSchema = z.object({
  organizerName: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  contactEmail: z.string().min(2, { message: 'Contact must be at least 2 characters.' }),
  contactPhone: z.string().min(2, { message: 'Contact must be at least 2 characters.' }),
  organization: z.string().min(2, { message: 'Organization must be at least 2 characters.' }),
});

interface OrganizerFormProps {
  organizer?: Organizer;
  onSuccess: () => void;
}

const OrganizerForm: React.FC<OrganizerFormProps> = ({ organizer, onSuccess }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      organizerName: organizer?.organizerName || '',
      contactEmail: organizer?.contactEmail || '',
      contactPhone: organizer?.contactPhone || '',
      organization: organizer?.organization || '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (organizer) {
        await updateOrganizer(organizer.id, values);
      } else {
        await createOrganizer(values);
      }
      onSuccess();
    } catch (error) {
      console.error('Failed to save organizer:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="organizerName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organizer Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., SLIIT" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contactEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Email</FormLabel>
              <FormControl>
                <Input placeholder="e.g., john.doe@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contactPhone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Phone</FormLabel>
              <FormControl>
                <Input placeholder="e.g., +1234567890" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="organization"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organization</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Tech Events Co." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit">{organizer ? 'Update' : 'Create'}</Button>
      </form>
    </Form>
  );
};

export default OrganizerForm;
