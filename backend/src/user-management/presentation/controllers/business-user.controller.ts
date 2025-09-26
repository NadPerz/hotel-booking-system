import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { BusinessUserService } from '../../application/services/business-user.service';
import { BusinessOnboardingSchema } from '@shared/types/user-management/BusinessOnboardingSchema';

@Controller('business')
export class BusinessUserController {
  constructor(private readonly businessUserService: BusinessUserService) {}

  @Post('/onboarding/complete')
  completeOnboarding(@Body() body: BusinessOnboardingSchema) {
    const validatedData = BusinessOnboardingSchema.parse(body);
    // You may want to validate the body here if not handled globally
    return this.businessUserService.completeOnboarding(validatedData);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    // Placeholder for getting a single business user by id
    return {};
  }

  @Post()
  async create(@Body() createBusinessUserDto: any) {
    // Placeholder for creating a business user
    return {};
  }
}
