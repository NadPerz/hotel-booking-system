import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PostCommentDocument = PostComment &
  Document & { _id: Types.ObjectId };

@Schema({
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  collection: 'post_comments',
})
export class PostComment {
  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: Types.ObjectId, ref: 'Post', required: true })
  post_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Traveler', required: true })
  user_id: Types.ObjectId;
}

export const PostCommentSchema = SchemaFactory.createForClass(PostComment);

// Indexes
PostCommentSchema.index({ post_id: 1 });
PostCommentSchema.index({ user_id: 1 });
