import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { BusinessUserService } from '../../application/services/business-user.service';

@Controller('business')
export class BusinessUserController {
  constructor(private readonly businessUserService: BusinessUserService) {}

  @Post('/registration/complete')
  completeRegistration() {
    return this.businessUserService.completeRegistration();
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
