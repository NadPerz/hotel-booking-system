import { Event } from './event.entity';

export class EventRsvp {
  constructor(
    public id: string,
    public event: Event,
    public user_id: string,
    public rsvp_status: string,
    public guest_count: number,
    public rsvp_date?: string,
  ) {}
}
