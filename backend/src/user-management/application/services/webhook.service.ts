import { Inject, Injectable } from '@nestjs/common';
import { AuthWebhookHandler } from 'src/user-management/domain/interfaces/auth-webhook.interface';
import { UserService } from './user.service';
import { Request } from 'express';

@Injectable()
export class WebhookService {
  constructor(
    @Inject('AuthWebhookHandler')
    private authWebhookHanlder: AuthWebhookHandler,
    private userService: UserService,
  ) {}
  async processAuthWebhook(req: Request) {
    const evt = await this.authWebhookHanlder.verifyWebhook(req);
    console.log('🚀 ~ WebhookService ~ processAuthWebhook ~ evt:', evt);

    switch (evt.type) {
      case 'user.created': {
        const dto = this.authWebhookHanlder.mapToCreateUserDto(evt);
        await this.userService.createUser(dto);
        break;
      }
      case 'user.deleted': {
        const event = evt as { data: { id: string } };
        await this.userService.deleteUser(event.data.id);
        break;
      }
    }
  }
}
