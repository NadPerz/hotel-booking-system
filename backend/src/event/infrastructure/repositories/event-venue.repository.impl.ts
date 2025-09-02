import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventVenueRepository } from '../../domain/repositories/event-venue.repository';
import { EventVenue } from '../../domain/entities/event-venue.entity';
import { EventVenueDocument } from '../schemas/event-venue.schema';

@Injectable()
export class EventVenueRepositoryImpl extends EventVenueRepository {
  constructor(
    @InjectModel(EventVenue.name) private readonly eventVenueModel: Model<EventVenueDocument>,
  ) {
    super();
  }

  async create(eventVenue: EventVenue): Promise<EventVenue> {
    const newEventVenue = new this.eventVenueModel(eventVenue);
    const savedEventVenue = await newEventVenue.save();
    return this.toDomainEntity(savedEventVenue);
  }

  async findById(id: string): Promise<EventVenue | null> {
    const doc = await this.eventVenueModel.findById(id).exec();
    return doc ? this.toDomainEntity(doc) : null;
  }

  private toDomainEntity(doc: EventVenueDocument): EventVenue {
    return new EventVenue(
      doc._id.toString(),
      doc.venue_name,
      doc.address,
      doc.city,
      doc.province,
      doc.postal_code,
      doc.country,
      doc.capacity,
      doc.facilities,
    );
  }
}
