import { EventVenue } from './event-venue.entity';
import { EventOrganizer } from './event-organizer.entity';
import { EventCategory } from './event-category.entity';

export class Event {
  constructor(
    public id: string,
    public event_name: string,
    public description: string,
    public start_date: string,
    public end_date: string,
    public start_time: string,
    public end_time: string,
    public max_attendees: number,
    public ticket_price: number,
    public event_status: string,
    public images_url: string[],
    public venue: EventVenue,
    public organizer: EventOrganizer,
    public category: EventCategory,
    public created_at?: string,
    public updated_at?: string,
  ) {}
}
