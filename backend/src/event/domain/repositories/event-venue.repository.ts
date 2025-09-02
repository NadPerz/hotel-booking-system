import { EventVenue } from '../entities/event-venue.entity';

export abstract class EventVenueRepository {
  abstract create(eventVenue: EventVenue): Promise<EventVenue>;
  abstract findById(id: string): Promise<EventVenue | null>;
}
