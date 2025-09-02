import { EventOrganizer } from '../entities/event-organizer.entity';

export abstract class EventOrganizerRepository {
  abstract create(eventOrganizer: EventOrganizer): Promise<EventOrganizer>;
  abstract findById(id: string): Promise<EventOrganizer | null>;
}
