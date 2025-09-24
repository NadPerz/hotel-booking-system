
'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { cn } from "@/lib/utils";
import { getVenues, getOrganizers, getCategories, getHashtags, createEvent } from '../lib/event-api';
import { getSignedUploadUrl, uploadFileToSignedUrl } from "src/lib/media.api";

const formSchema = z.object({
  eventName: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  startDate: z.string(),
  endDate: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  maxAttendees: z.coerce.number().int().nonnegative(),
  ticketPrice: z.coerce.number().nonnegative(),
  eventStatus: z.enum(['active', 'inactive']),
  venueId: z.string(),
  organizerId: z.string(),
  categoryId: z.string(),
  hashtagIds: z.array(z.string()),
});

type FormValues = z.infer<typeof formSchema>;

const EventForm = () => {
  const [venues, setVenues] = useState<any[]>([]);
  const [organizers, setOrganizers] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [hashtags, setHashtags] = useState<any[]>([]);
  const [isHashtagDialogOpen, setIsHashtagDialogOpen] = useState(false);
  const [hashtagSearch, setHashtagSearch] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [venuesData, organizersData, categoriesData, hashtagsData] = await Promise.all([
          getVenues(),
          getOrganizers(),
          getCategories(),
          getHashtags(),
        ]);
        setVenues(venuesData);
        setOrganizers(organizersData);
        setCategories(categoriesData);
        setHashtags(hashtagsData);
      } catch (error) {
        console.error('Failed to fetch event data:', error);
      }
    };
    fetchData();
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      eventName: '',
      description: '',
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '',
      maxAttendees: 0,
      ticketPrice: 0,
      eventStatus: 'active',
      venueId: '',
      organizerId: '',
      categoryId: '',
      hashtagIds: [],
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await createEvent({
        ...values,
        maxAttendees: Number(values.maxAttendees) || 0,
        ticketPrice: Number(values.ticketPrice) || 0,
        imagesUrl: imageKey ? [imageKey] : [],
      });
      alert('Event created successfully!');
      form.reset();
      setImageKey(""); // Reset image key state
      setSelectedImage(null);
    } catch (error) {
      console.error('Failed to create event:', error);
      alert('Failed to create event. Please try again.');
    }
  };

  //check whether the hashtag is already in the list
  const handleHashtagClick = (hashtagId: string) => {
    const currentHashtagIds = form.getValues('hashtagIds');
    const newHashtagIds = currentHashtagIds.includes(hashtagId)
      ? currentHashtagIds.filter(id => id !== hashtagId)
      : [...currentHashtagIds, hashtagId];

    form.setValue('hashtagIds', newHashtagIds, { shouldValidate: true });
    form.trigger('hashtagIds');
  };

  const filteredHashtags = hashtags.filter((h) =>
    h.hashtagName?.toLowerCase().includes(hashtagSearch.toLowerCase())
  );

  // Handle image upload
const [selectedImage, setSelectedImage] = useState<File | null>(null);
const [imageKey, setImageKey] = useState("");

const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = e.target.files;
  if (!files || files.length === 0) return;
  const file = files[0];
  setSelectedImage(file);
  // Generate a unique file name (e.g., userId + timestamp + original name)
  const fileName = `event-${Date.now()}-${file.name}`;
  const bucket = "events"; // Use a dedicated bucket or folder
  try {
    const signedUrl = await getSignedUploadUrl(fileName, bucket);
    await uploadFileToSignedUrl(file, signedUrl);
    setImageKey(`${bucket}/${fileName}`); // Store the key/path for DB
  } catch (err) {
    alert("Image upload failed");
  }
};


  return (
    <Form {...(form as any)}>
      <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-8">
        <FormField
          control={form.control as any}
          name="eventName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Summer Music Festival" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control as any}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe your event" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control as any}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Time</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Time</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="maxAttendees"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max Attendees</FormLabel>
                <FormControl>
                  <Input type="number" min={0} {...field} onChange={(e) => field.onChange(e.target.value)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ticketPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ticket Price</FormLabel>
                <FormControl>
                  <Input type="number" min={0} step="0.01" {...field} onChange={(e) => field.onChange(e.target.value)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="eventStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control as any}
          name="venueId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Venue</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a venue" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {venues.map((venue) => (
                    <SelectItem key={venue.id} value={venue.id}>
                      {venue.venueName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control as any}
          name="organizerId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organizer</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an organizer" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {organizers.map((organizer) => (
                    <SelectItem key={organizer.id} value={organizer.id}>
                      {organizer.organizerName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control as any}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.categoryName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control as any}
          name="hashtagIds"
          render={() => (
            <FormItem>
              <FormLabel>Hashtags</FormLabel>
              <FormControl>
                <div className="flex flex-col gap-3">
                  <div className="flex flex-wrap gap-2">
                    {form.getValues('hashtagIds').length === 0 && (
                      <span className="text-sm text-muted-foreground">No hashtags selected</span>
                    )}
                    {form.getValues('hashtagIds').map((id) => {
                      const tag = hashtags.find((h) => h.id === id);
                      if (!tag) return null;
                      return (
                        <Badge key={id} variant="secondary" className="flex items-center gap-2">
                          {tag.hashtagName}
                          <button
                            type="button"
                            aria-label={`Remove ${tag.hashtagName}`}
                            className="ml-1 rounded px-1 text-xs hover:bg-muted"
                            onClick={() => handleHashtagClick(id)}
                          >
                            ×
                          </button>
                        </Badge>
                      );
                    })}
                  </div>
                  <Dialog open={isHashtagDialogOpen} onOpenChange={setIsHashtagDialogOpen}>
                    <DialogTrigger asChild>
                      <Button type="button" variant="outline" className="w-fit">Add hashtags</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg">
                      <DialogHeader>
                        <DialogTitle>Select hashtags</DialogTitle>
                      </DialogHeader>
                      <div className="flex flex-col gap-3">
                        <Input
                          placeholder="Search hashtags..."
                          value={hashtagSearch}
                          onChange={(e) => setHashtagSearch(e.target.value)}
                        />
                        <ScrollArea className="h-64 rounded border p-2">
                          <div className="space-y-2">
                            {filteredHashtags.length === 0 && (
                              <div className="text-sm text-muted-foreground">No results</div>
                            )}
                            {filteredHashtags.map((hashtag) => {
                              const checked = form.getValues('hashtagIds').includes(hashtag.id);
                              return (
                                <label
                                  key={hashtag.id}
                                  className={cn(
                                    "flex cursor-pointer items-center justify-between rounded px-3 py-2 text-sm",
                                    checked ? "bg-muted" : "hover:bg-muted/60"
                                  )}
                                >
                                  <span>{hashtag.hashtagName}</span>
                                  <input
                                    type="checkbox"
                                    className="h-4 w-4"
                                    checked={checked}
                                    onChange={() => handleHashtagClick(hashtag.id)}
                                  />
                                </label>
                              );
                            })}
                          </div>
                        </ScrollArea>
                      </div>
                      <DialogFooter>
                        <Button type="button" onClick={() => setIsHashtagDialogOpen(false)}>Done</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* <FormField
          control={form.control as any}
          name="hashtagIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hashtags</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select hashtags" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {hashtags.map((hashtag) => (
                    <SelectItem key={hashtag.id} value={hashtag.id}>
                      {hashtag.hashtagName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        /> */}
        <input type="file" accept="image/*" onChange={handleImageChange} />

        <Button type="submit">Create Event</Button>
      </form>
    </Form>
  );
};

export default EventForm;
