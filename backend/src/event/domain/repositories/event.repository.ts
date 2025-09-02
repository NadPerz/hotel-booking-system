import { Event } from '../entities/event.entity';

export abstract class EventRepository {
  abstract create(event: Event): Promise<Event>;
  abstract findById(id: string): Promise<Event | null>;
}
