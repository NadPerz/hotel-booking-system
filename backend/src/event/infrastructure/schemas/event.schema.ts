import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { EventVenue } from './event-venue.schema';
import { EventOrganizer } from './event-organizer.schema';
import { EventCategory } from './event-category.schema';

export type EventDocument = Event & Document & { _id: Types.ObjectId; createdAt: string; updatedAt: string };

@Schema({
  timestamps: true,
  strict: 'throw',
})
export class Event {
  @Prop({ required: true })
  event_name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  start_date: string;

  @Prop({ required: true })
  end_date: string;

  @Prop({ required: true })
  start_time: string;

  @Prop({ required: true })
  end_time: string;

  @Prop({ required: true })
  max_attendees: number;

  @Prop({ required: true })
  ticket_price: number;

  @Prop({ required: true })
  event_status: string;

  @Prop({ type: [String], required: true })
  images_url: string[];

  @Prop({ type: Types.ObjectId, ref: 'EventVenue', required: true })
  venue: EventVenue;

  @Prop({ type: Types.ObjectId, ref: 'EventOrganizer', required: true })
  organizer: EventOrganizer;

  @Prop({ type: Types.ObjectId, ref: 'EventCategory', required: true })
  category: EventCategory;
}

export const EventSchema = SchemaFactory.createForClass(Event);
