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
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiHeader,
} from '@nestjs/swagger';
import { RoomService } from '../../application/services/room.service';
import { CreateRoomDto } from '../../application/dtos/create-room.dto';
import { UpdateRoomDto } from '../../application/dtos/update-room.dto';

@ApiTags('Rooms')
@Controller('rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new room' })
  @ApiHeader({ name: 'x-user-id', description: 'User ID', required: true })
  @ApiResponse({ status: 201, description: 'Room created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden - Not hotel owner' })
  async createRoom(
    @Headers('x-user-id') userId: string,  // Remove default value
    @Body() createRoomDto: CreateRoomDto,
  ) {
    if (!userId) {
      throw new BadRequestException('User ID header (x-user-id) is required');
    }
    
    const room = await this.roomService.createRoom(userId, createRoomDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Room created successfully',
      data: room,
    };
  }

  @Get('hotel/:hotelId')
  @ApiOperation({ summary: 'Get all rooms in a hotel' })
  @ApiResponse({ status: 200, description: 'Rooms retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Hotel not found' })
  async findRoomsByHotel(@Param('hotelId') hotelId: string) {
    const rooms = await this.roomService.findRoomsByHotel(hotelId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Rooms retrieved successfully',
      data: rooms,
      count: rooms.length,
    };
  }

  @Get('available/:hotelId')
  @ApiOperation({ summary: 'Get available rooms in a hotel for specific dates' })
  @ApiQuery({ name: 'startDate', required: true, type: String, example: '2024-01-15' })
  @ApiQuery({ name: 'endDate', required: true, type: String, example: '2024-01-20' })
  @ApiResponse({ status: 200, description: 'Available rooms retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Invalid date format' })
  async findAvailableRooms(
    @Param('hotelId') hotelId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const rooms = await this.roomService.findAvailableRooms(hotelId, start, end);
    return {
      statusCode: HttpStatus.OK,
      message: 'Available rooms retrieved successfully',
      data: rooms,
      count: rooms.length,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get room by ID' })
  @ApiResponse({ status: 200, description: 'Room found' })
  @ApiResponse({ status: 404, description: 'Room not found' })
  async findRoomById(@Param('id') id: string) {
    const room = await this.roomService.findRoomById(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Room found',
      data: room,
    };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update room' })
  @ApiHeader({ name: 'x-user-id', description: 'User ID', required: true })
  @ApiResponse({ status: 200, description: 'Room updated successfully' })
  @ApiResponse({ status: 404, description: 'Room not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - Not hotel owner' })
  async updateRoom(
    @Param('id') id: string,
    @Headers('x-user-id') userId: string,  // Remove default value
    @Body() updateRoomDto: UpdateRoomDto,
  ) {
    if (!userId) {
      throw new BadRequestException('User ID header (x-user-id) is required');
    }
    
    const room = await this.roomService.updateRoom(id, userId, updateRoomDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Room updated successfully',
      data: room,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete room' })
  @ApiHeader({ name: 'x-user-id', description: 'User ID', required: true })
  @ApiResponse({ status: 204, description: 'Room deleted successfully' })
  @ApiResponse({ status: 404, description: 'Room not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - Not hotel owner' })
  async deleteRoom(
    @Param('id') id: string,
    @Headers('x-user-id') userId: string,  // Remove default value
  ) {
    if (!userId) {
      throw new BadRequestException('User ID header (x-user-id) is required');
    }
    
    await this.roomService.deleteRoom(id, userId);
  }
}