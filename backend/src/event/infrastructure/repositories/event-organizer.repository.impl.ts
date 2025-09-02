import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventOrganizerRepository } from '../../domain/repositories/event-organizer.repository';
import { EventOrganizer } from '../../domain/entities/event-organizer.entity';
import { EventOrganizerDocument } from '../schemas/event-organizer.schema';

@Injectable()
export class EventOrganizerRepositoryImpl extends EventOrganizerRepository {
  constructor(
    @InjectModel(EventOrganizer.name) private readonly eventOrganizerModel: Model<EventOrganizerDocument>,
  ) {
    super();
  }

  async create(eventOrganizer: EventOrganizer): Promise<EventOrganizer> {
    const newEventOrganizer = new this.eventOrganizerModel(eventOrganizer);
    const savedEventOrganizer = await newEventOrganizer.save();
    return this.toDomainEntity(savedEventOrganizer);
  }

  async findById(id: string): Promise<EventOrganizer | null> {
    const doc = await this.eventOrganizerModel.findById(id).exec();
    return doc ? this.toDomainEntity(doc) : null;
  }

  private toDomainEntity(doc: EventOrganizerDocument): EventOrganizer {
    return new EventOrganizer(
      doc._id.toString(),
      doc.organizer_name,
      doc.contact_email,
      doc.contact_phone,
      doc.organization,
      (doc as any).createdAt,
      (doc as any).updatedAt,
    );
  }
}
