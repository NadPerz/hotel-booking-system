import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Event } from './event.schema';

export type EventRsvpDocument = EventRsvp & Document & { _id: Types.ObjectId };

@Schema({
  timestamps: true,
  strict: 'throw',
})
export class EventRsvp {
  @Prop({ type: Types.ObjectId, ref: 'Event', required: true })
  event: Event;

  @Prop({ required: true })
  user_id: string;

  @Prop({ required: true })
  rsvp_status: string;

  @Prop({ required: true })
  rsvp_date: string;

  @Prop({ required: true })
  guest_count: number;
}

export const EventRsvpSchema = SchemaFactory.createForClass(EventRsvp);
