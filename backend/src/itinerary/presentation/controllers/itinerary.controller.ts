import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { ItineraryService } from 'src/itinerary/application/services/itinerary.service';
import { CreateItineraryDto } from '../../application/dtos/create-itinerary.dto';
import { ItineraryChatService } from 'src/itinerary/application/services/itinerary-chat.service';

@Controller('itineraries')
export class ItineraryController {
  constructor(
    private readonly itineraryService: ItineraryService,
    private readonly itineraryChatService: ItineraryChatService,
  ) {}

  @Post()
  async create(@Body() createDto: CreateItineraryDto) {
    return await this.itineraryService.create(createDto);
  }
  @Post('chat')
  chatItinerary(
    @Body()
    { message, conversationId }: { message: string; conversationId: string },
  ) {
    return this.itineraryChatService.chatItinerary(message, conversationId);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.itineraryService.findById(id);
  }
}
