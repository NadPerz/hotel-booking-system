import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type EventVenueDocument = EventVenue & Document & { _id: Types.ObjectId };

@Schema({
  timestamps: true,
  strict: 'throw',
})
export class EventVenue {
  @Prop({ required: true })
  venue_name: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  province: string;

  @Prop({ required: true })
  postal_code: string;

  @Prop({ required: true })
  country: string;

  @Prop({ required: true })
  capacity: number;

  @Prop({ type: [String], required: true })
  facilities: string[];
}

export const EventVenueSchema = SchemaFactory.createForClass(EventVenue);
