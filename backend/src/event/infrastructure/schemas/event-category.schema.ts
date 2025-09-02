import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type EventCategoryDocument = EventCategory & Document & { _id: Types.ObjectId };

@Schema({
  timestamps: true,
  strict: 'throw',
})
export class EventCategory {
  @Prop({ required: true })
  category_name: string;

  @Prop({ required: true })
  description: string;
}

export const EventCategorySchema = SchemaFactory.createForClass(EventCategory);
