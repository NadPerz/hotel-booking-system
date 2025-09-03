export class CreateEventDto {
  name: string;
  description?: string;
  date: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  maxAttendees?: number;
  ticketPrice?: number;
  eventStatus?: string;
  imagesUrl?: string[];
  venueId: string;
  organizerId: string;
  categoryId: string;
  hashtags?: string[];
  location?: string;
}
