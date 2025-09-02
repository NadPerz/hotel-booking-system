import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type EventOrganizerDocument = EventOrganizer & Document & { _id: Types.ObjectId };

@Schema({
  timestamps: true,
  strict: 'throw',
})
export class EventOrganizer {
  @Prop({ required: true })
  organizer_name: string;

  @Prop({ required: true })
  contact_email: string;

  @Prop({ required: true })
  contact_phone: string;

  @Prop({ required: true })
  organization: string;
}

export const EventOrganizerSchema = SchemaFactory.createForClass(EventOrganizer);
