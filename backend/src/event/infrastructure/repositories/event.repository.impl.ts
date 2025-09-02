import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventRepository } from '../../domain/repositories/event.repository';
import { Event } from '../../domain/entities/event.entity';
import { EventDocument } from '../schemas/event.schema';

@Injectable()
export class EventRepositoryImpl extends EventRepository {
  constructor(
    @InjectModel(Event.name) private readonly eventModel: Model<EventDocument>,
  ) {
    super();
  }

  async create(event: Event): Promise<Event> {
    const newEvent = new this.eventModel(event);
    const savedEvent = await newEvent.save();
    return this.toDomainEntity(savedEvent);
  }

  async findById(id: string): Promise<Event | null> {
    const doc = await this.eventModel.findById(id).exec();
    return doc ? this.toDomainEntity(doc) : null;
  }

  private toDomainEntity(doc: EventDocument): Event {
    return new Event(
      doc._id.toString(),
      doc.event_name,
      doc.description,
      doc.start_date,
      doc.end_date,
      doc.start_time,
      doc.end_time,
      doc.max_attendees,
      doc.ticket_price,
      doc.event_status,
      doc.images_url,
      doc.createdAt,
      doc.updatedAt,
      doc.venue as any,
      doc.organizer as any,
      doc.category as any,
    );
  }
}
