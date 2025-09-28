import { Controller, Post, Req } from '@nestjs/common';
import { BusinessAccountService } from '../../application/services/business-account.service';

import { ZodBody } from 'src/shared/decorators/zod-body.decorator';
import {
  BusinessOnboardingSchema,
  BusinessOnboardingData,
} from '@shared/types/user-management';
import { Request } from 'express';

@Controller('business')
export class BusinessUserController {
  constructor(private readonly businessUserService: BusinessAccountService) {}

  @Post('/onboarding/complete')
  completeOnboarding(
    @ZodBody(BusinessOnboardingSchema) body: BusinessOnboardingData,
    @Req() req: Request,
  ) {
    const userId = req.user?.user_id;
    return this.businessUserService.completeOnboarding(userId!, body);
  }
}
