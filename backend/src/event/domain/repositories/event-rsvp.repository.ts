import { EventRsvp } from '../entities/event-rsvp.entity';

export abstract class EventRsvpRepository {
  abstract create(eventRsvp: EventRsvp): Promise<EventRsvp>;
  abstract findById(id: string): Promise<EventRsvp | null>;
}
