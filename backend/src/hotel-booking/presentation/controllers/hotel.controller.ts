// backend/src/hotel-booking/presentation/controllers/hotel.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpStatus,
  HttpCode,
  Headers,
} from '@nestjs/common';
import { HotelService } from '../../application/services/hotel.service';
import { CreateHotelDto } from '../../application/dtos/create-hotel.dto';
import { UpdateHotelDto } from '../../application/dtos/update-hotel.dto';

@Controller('hotels')
export class HotelController {
  constructor(private readonly hotelService: HotelService) {}

@Post()
@HttpCode(HttpStatus.CREATED)
async createHotel(
  @Body() createHotelDto: CreateHotelDto,
  @Headers('x-user-id') userId?: string,
  @Headers('x-user-first-name') firstName?: string,
  @Headers('x-user-last-name') lastName?: string,
  @Headers('x-branch-id') branchId?: string,
  @Headers('x-business-account-id') businessAccountId?: string,
) {
  // Use actual user data from headers (no more hardcoded NadPerz)
  const actualUserId = userId || 'nadijaaa'; // Use actual username
  const actualFirstName = firstName || 'Nadijaaa';
  const actualLastName = lastName || 'Pereraaa';
  const actualBranchId = branchId || '68deb6aac82d1e5d5f8e6234';
  const actualBusinessAccountId = businessAccountId || '68deb6aac82d1e5d5f8e6232';

  console.log('🏨 Creating hotel with dynamic user:', {
    userId: actualUserId,
    firstName: actualFirstName,
    lastName: actualLastName,
    branchId: actualBranchId,
    businessAccountId: actualBusinessAccountId
  });

  const hotelWithBusinessInfo = {
    ...createHotelDto,
    userId: actualUserId, // This will now be "nadijaaa" not "NadPerz"
    branchId: actualBranchId,
    businessAccountId: actualBusinessAccountId,
    userType: 'BUSINESS_USER',
    ownerName: `${actualFirstName} ${actualLastName}`,
    createdBy: actualUserId
  };

  const hotel = await this.hotelService.createHotel(actualUserId, hotelWithBusinessInfo);
  
  return {
    statusCode: HttpStatus.CREATED,
    message: `Hotel created successfully for ${actualFirstName} ${actualLastName}`,
    data: {
      ...hotel,
      businessProfile: {
        branchId: actualBranchId,
        businessAccountId: actualBusinessAccountId,
        owner: actualUserId,
        ownerName: `${actualFirstName} ${actualLastName}`,
        userType: 'BUSINESS_USER'
      }
    },
  };
}

  @Get('my-hotels')
  async findMyHotels(
    @Headers('x-user-id') userId?: string,
    @Headers('x-branch-id') branchId?: string,
    @Headers('x-business-account-id') businessAccountId?: string,
  ) {
    const actualUserId = userId || 'NadPerz';
    const actualBranchId = branchId || '68deb6aac82d1e5d5f8e6234';
    const actualBusinessAccountId = businessAccountId || '68deb6aac82d1e5d5f8e6232';

    // Get hotels for this specific business branch
    const hotels = await this.hotelService.findHotelsByUser(actualUserId);
    
    return {
      statusCode: HttpStatus.OK,
      message: 'Your business hotels retrieved successfully',
      data: hotels,
      count: hotels.length,
      businessContext: {
        branchId: actualBranchId,
        businessAccountId: actualBusinessAccountId,
        userType: 'BUSINESS_USER',
        owner: actualUserId
      }
    };
  }

  @Get()
  async findAllHotels(
    @Query('city') city?: string,
    @Query('state') state?: string,
    @Query('country') country?: string,
  ) {
    const filters = {
      ...(city && { city }),
      ...(state && { state }),
      ...(country && { country }),
    };

    const hotels = await this.hotelService.findAllHotels(filters);
    return {
      statusCode: HttpStatus.OK,
      message: 'Hotels retrieved successfully',
      data: hotels,
      count: hotels.length,
    };
  }

  @Get('search/location')
  async findHotelsByLocation(
    @Query('city') city: string,
    @Query('state') state?: string,
    @Query('country') country?: string,
  ) {
    const hotels = await this.hotelService.findHotelsByLocation(city, state, country);
    return {
      statusCode: HttpStatus.OK,
      message: `Hotels in ${city} retrieved successfully`,
      data: hotels,
      count: hotels.length,
    };
  }

  @Get(':id')
  async findHotelById(@Param('id') id: string) {
    const hotel = await this.hotelService.findHotelById(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Hotel found',
      data: hotel,
    };
  }

  @Put(':id')
  async updateHotel(
    @Param('id') id: string,
    @Body() updateHotelDto: UpdateHotelDto,
    @Headers('x-user-id') userId?: string,
  ) {
    const actualUserId = userId || 'NadPerz';
    const hotel = await this.hotelService.updateHotel(id, actualUserId, updateHotelDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Hotel updated successfully',
      data: hotel,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteHotel(
    @Param('id') id: string,
    @Headers('x-user-id') userId?: string,
  ) {
    const actualUserId = userId || 'NadPerz';
    await this.hotelService.deleteHotel(id, actualUserId);
  }
}