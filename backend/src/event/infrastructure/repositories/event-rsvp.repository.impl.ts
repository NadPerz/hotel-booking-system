import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventRsvpRepository } from '../../domain/repositories/event-rsvp.repository';
import { EventRsvp } from '../../domain/entities/event-rsvp.entity';
import { EventRsvpDocument } from '../schemas/event-rsvp.schema';

@Injectable()
export class EventRsvpRepositoryImpl extends EventRsvpRepository {
  constructor(
    @InjectModel(EventRsvp.name) private readonly eventRsvpModel: Model<EventRsvpDocument>,
  ) {
    super();
  }

  async create(eventRsvp: EventRsvp): Promise<EventRsvp> {
    const newEventRsvp = new this.eventRsvpModel(eventRsvp);
    const savedEventRsvp = await newEventRsvp.save();
    return this.toDomainEntity(savedEventRsvp);
  }

  async findById(id: string): Promise<EventRsvp | null> {
    const doc = await this.eventRsvpModel.findById(id).exec();
    return doc ? this.toDomainEntity(doc) : null;
  }

  private toDomainEntity(doc: EventRsvpDocument): EventRsvp {
    return new EventRsvp(
      doc._id.toString(),
      doc.event as any,
      doc.user_id,
      doc.rsvp_status,
      doc.createdAt,
      doc.guest_count,
    );
  }
}
