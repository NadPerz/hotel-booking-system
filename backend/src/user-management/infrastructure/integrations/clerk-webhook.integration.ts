import { Injectable, Logger } from '@nestjs/common';
import { Request } from 'express';
import { verifyWebhook } from '@clerk/express/webhooks';
import { CreateUserDto } from 'src/user-management/application/dtos/user/create-user.dto';
import {
  AuthWebhookEvent,
  AuthWebhookHandler,
} from 'src/user-management/domain/interfaces/auth-webhook.interface';
import { UserType } from 'src/user-management/domain/user/value-objects/user-role.vo';
import { ClerkEventUserCreated } from './types/clerk/event-user-created.type';

@Injectable()
export class ClerkWebhookIntegration implements AuthWebhookHandler {
  private readonly logger = new Logger(ClerkWebhookIntegration.name);

  constructor() {
    // Initialize any dependencies here if needed in the future
  }
  async verifyWebhook(req: Request): Promise<AuthWebhookEvent> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const event = await verifyWebhook(req);
      // Return the event in the AuthWebhookEvent format

      return {
        type: event.type,
        data: event.data,
      };
    } catch (error) {
      console.log(
        '🚀 ~ ClerkWebhookIntegration ~ verifyWebhook ~ error:',
        error,
      );
      throw error;
    }
    // Use Clerk's verifyWebhook to validate and parse the event
  }
  mapToCreateUserDto(eventData: any): CreateUserDto {
    console.log(
      '🚀 ~ ClerkWebhookIntegration ~ mapToCreateUserDto ~ eventData:',
      eventData,
    );

    const { data: event } = eventData as ClerkEventUserCreated;

    // Extract the primary email address
    const primaryEmail =
      event.email_addresses?.find(
        (email) => email.id === event.primary_email_address_id,
      )?.email_address || 'test@gmail.com';

    // Create the CreateUserDto from Clerk event data
    const createUserDto: CreateUserDto = {
      clerkUserId: event.id,
      email: primaryEmail,
      userType: UserType.TRAVELER, // Default to traveler, can be updated later
      travelProfile: {
        profilePicture: event.profile_image_url || event.image_url,
        bio: '', // Not available in Clerk data
        preferences: [], // Not available in Clerk data
        loyaltyPoints: 0, // Default value
      },
      socialSettings: {
        isPublic: false, // Default to private
        allowMessages: true, // Default to allow messages
      },
    };

    return createUserDto;
  }

  // Add methods to handle Clerk webhooks here
}
