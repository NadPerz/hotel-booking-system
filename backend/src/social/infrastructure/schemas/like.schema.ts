import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type LikeDocument = Like & Document & { _id: Types.ObjectId };

@Schema({
  timestamps: { createdAt: 'created_at' },
  collection: 'likes',
})
export class Like {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Post', required: true })
  post_id: Types.ObjectId;
}

export const LikeSchema = SchemaFactory.createForClass(Like);

// Index to prevent duplicate likes
LikeSchema.index({ user_id: 1, post_id: 1 }, { unique: true });
