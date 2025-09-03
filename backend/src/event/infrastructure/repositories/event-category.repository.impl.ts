import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventCategoryRepository } from '../../domain/repositories/event-category.repository';
import { EventCategory } from '../../domain/entities/event-category.entity';
import { EventCategoryDocument } from '../schemas/event-category.schema';

@Injectable()
export class EventCategoryRepositoryImpl extends EventCategoryRepository {
  constructor(
    @InjectModel(EventCategory.name) private readonly eventCategoryModel: Model<EventCategoryDocument>,
  ) {
    super();
  }

  async create(eventCategory: EventCategory): Promise<EventCategory> {
    const newEventCategory = new this.eventCategoryModel(eventCategory);
    const savedEventCategory = await newEventCategory.save();
    return this.toDomainEntity(savedEventCategory);
  }

  async findById(id: string): Promise<EventCategory | null> {
    const doc = await this.eventCategoryModel.findById(id).exec();
    return doc ? this.toDomainEntity(doc) : null;
  }

  private toDomainEntity(doc: EventCategoryDocument): EventCategory {
    return new EventCategory(
      doc._id.toString(),
      doc.category_name,
      doc.description,
      // (doc as any).createdAt,
    );
  }
}
