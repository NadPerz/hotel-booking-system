import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventHashtagRepository } from '../../domain/repositories/event-hashtag.repository';
import { EventHashtag } from '../../domain/entities/event-hashtag.entity';
import { EventHashtagDocument } from '../schemas/event-hashtag.schema';

@Injectable()
export class EventHashtagRepositoryImpl extends EventHashtagRepository {
  constructor(
    @InjectModel(EventHashtag.name)
    private readonly eventHashtagModel: Model<EventHashtagDocument>,
  ) {
    super();
  }

  async create(eventHashtag: EventHashtag): Promise<EventHashtag> {
    const newEventHashtag = new this.eventHashtagModel(eventHashtag);
    const savedEventHashtag = await newEventHashtag.save();
    return this.toDomainEntity(savedEventHashtag);
  }

  async findById(id: string): Promise<EventHashtag | null> {
    const doc = await this.eventHashtagModel.findById(id).exec();
    return doc ? this.toDomainEntity(doc) : null;
  }

  async findByName(name: string): Promise<EventHashtag | null> {
    const doc = await this.eventHashtagModel.findOne({ hashtag_name: name }).exec();
    return doc ? this.toDomainEntity(doc) : null;
  }

  private toDomainEntity(doc: EventHashtagDocument): EventHashtag {
    return new EventHashtag(
      doc._id.toString(),
      doc.hashtag_name,
      // doc.createdAt,
    );
  }
}
