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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiHeader,
} from '@nestjs/swagger';
import { HotelService } from '../../application/services/hotel.service';
import { CreateHotelDto } from '../../application/dtos/create-hotel.dto';
import { UpdateHotelDto } from '../../application/dtos/update-hotel.dto';

@ApiTags('Hotels')
@Controller('hotels')
export class HotelController {
  constructor(private readonly hotelService: HotelService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new hotel' })
  @ApiHeader({ name: 'x-user-id', description: 'User ID', required: false })
  @ApiResponse({ status: 201, description: 'Hotel created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createHotel(
    @Headers('x-user-id') userId: string = 'test-user-123',
    @Body() createHotelDto: CreateHotelDto,
  ) {
    const hotel = await this.hotelService.createHotel(userId, createHotelDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Hotel created successfully',
      data: hotel,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all hotels with optional filters' })
  @ApiQuery({ name: 'city', required: false, type: String })
  @ApiQuery({ name: 'state', required: false, type: String })
  @ApiQuery({ name: 'country', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Hotels retrieved successfully' })
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

  @Get('my-hotels')
  @ApiOperation({ summary: 'Get current user hotels' })
  @ApiHeader({ name: 'x-user-id', description: 'User ID', required: false })
  @ApiResponse({ status: 200, description: 'User hotels retrieved successfully' })
  async findMyHotels(@Headers('x-user-id') userId: string = 'test-user-123') {
    const hotels = await this.hotelService.findHotelsByUser(userId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Your hotels retrieved successfully',
      data: hotels,
      count: hotels.length,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get hotel by ID' })
  @ApiResponse({ status: 200, description: 'Hotel found' })
  @ApiResponse({ status: 404, description: 'Hotel not found' })
  async findHotelById(@Param('id') id: string) {
    const hotel = await this.hotelService.findHotelById(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Hotel found',
      data: hotel,
    };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update hotel' })
  @ApiHeader({ name: 'x-user-id', description: 'User ID', required: false })
  @ApiResponse({ status: 200, description: 'Hotel updated successfully' })
  @ApiResponse({ status: 404, description: 'Hotel not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - Not hotel owner' })
  async updateHotel(
    @Param('id') id: string,
    @Headers('x-user-id') userId: string = 'test-user-123',
    @Body() updateHotelDto: UpdateHotelDto,
  ) {
    const hotel = await this.hotelService.updateHotel(id, userId, updateHotelDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Hotel updated successfully',
      data: hotel,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete hotel' })
  @ApiHeader({ name: 'x-user-id', description: 'User ID', required: false })
  @ApiResponse({ status: 204, description: 'Hotel deleted successfully' })
  @ApiResponse({ status: 404, description: 'Hotel not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - Not hotel owner' })
  async deleteHotel(
    @Param('id') id: string,
    @Headers('x-user-id') userId: string = 'test-user-123',
  ) {
    await this.hotelService.deleteHotel(id, userId);
  }

  @Get('search/location')
  @ApiOperation({ summary: 'Find hotels by location' })
  @ApiQuery({ name: 'city', required: true, type: String })
  @ApiQuery({ name: 'state', required: false, type: String })
  @ApiQuery({ name: 'country', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Hotels found' })
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
}