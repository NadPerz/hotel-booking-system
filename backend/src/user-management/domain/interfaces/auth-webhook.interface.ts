import { Request } from 'express';
import { CreateUserDto } from 'src/user-management/application/dtos/user/create-user.dto';

export interface AuthWebhookHandler {
  verifyWebhook(req: Request): Promise<AuthWebhookEvent>;
  mapToCreateUserDto(eventData: any): CreateUserDto;
}
export interface AuthWebhookEvent {
  type: string;
  data: any;
}
