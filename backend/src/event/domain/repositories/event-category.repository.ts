import { EventCategory } from '../entities/event-category.entity';

export abstract class EventCategoryRepository {
  abstract create(eventCategory: EventCategory): Promise<EventCategory>;
  abstract findById(id: string): Promise<EventCategory | null>;
}
