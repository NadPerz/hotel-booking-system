import { UserRepository } from 'src/user-management/domain/repositories/user.repository';
import { UserDocument } from '../schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { User } from 'src/user-management/domain/user/user.entity';

Injectable();
export class UserRepositoryImpl extends UserRepository {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDocument>,
  ) {
    super();
  }

  async save(user: User): Promise<User> {
    const userDoc = new this.userModel(user);
    const saved = await userDoc.save();
    return this.toDomain(saved);
  }
  async delete(id: string): Promise<void> {
    // Check if id is a valid MongoDB ObjectId (24 hex chars)
    const isMongoId = /^[a-fA-F0-9]{24}$/.test(id);
    if (isMongoId) {
      await this.userModel.findByIdAndDelete(id).exec();
    } else {
      // Assume id is a clerkUserId
      await this.userModel.findOneAndDelete({ clerkUserId: id }).exec();
    }
  }
  private toDomain(userDoc: UserDocument): User {
    return new User(
      userDoc._id.toString(),
      userDoc.clerkUserId,
      userDoc.email,
      userDoc.firstName,
      userDoc.lastName,
      userDoc.userType,
      userDoc.businessAccountId,
      userDoc.branchId,
      userDoc.role,
      userDoc.travelProfile,
      userDoc.socialSettings,
      userDoc.createdAt,
      userDoc.updatedAt,
    );
  }
}
