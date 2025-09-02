import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { EventService } from '../../application/services/event.service';
import { CreateEventDto } from '../../application/dtos/create-event.dto';
import { CreateEventRsvpDto } from '../../application/dtos/create-event-rsvp.dto';
import { CreateEventHashtagDto } from '../../application/dtos/create-event-hashtag.dto';
import { CreateEventHashtagMappingDto } from '../../application/dtos/create-event-hashtag-mapping.dto';
import { CreateEventCategoryDto } from '../../application/dtos/create-event-category.dto';
import { CreateEventOrganizerDto } from '../../application/dtos/create-event-organizer.dto';
import { CreateEventVenueDto } from '../../application/dtos/create-event-venue.dto';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  async create(@Body() createDto: CreateEventDto) {
    return await this.eventService.create(createDto);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.eventService.findById(id);
  }

  @Post('rsvp')
  async createRsvp(@Body() createRsvpDto: CreateEventRsvpDto) {
    return await this.eventService.createRsvp(createRsvpDto);
  }

  @Post('hashtag')
  async createHashtag(@Body() createHashtagDto: CreateEventHashtagDto) {
    return await this.eventService.createHashtag(createHashtagDto);
  }

  @Post('hashtag/map')
  async mapHashtagToEvent(
    @Body() createEventHashtagMappingDto: CreateEventHashtagMappingDto,
  ) {
    return await this.eventService.mapHashtagToEvent(
      createEventHashtagMappingDto,
    );
  }

  @Post('category')
  async createCategory(@Body() createDto: CreateEventCategoryDto) {
    return await this.eventService.createCategory(createDto);
  }

  @Post('organizer')
  async createOrganizer(@Body() createDto: CreateEventOrganizerDto) {
    return await this.eventService.createOrganizer(createDto);
  }

  @Post('venue')
  async createVenue(@Body() createDto: CreateEventVenueDto) {
    return await this.eventService.createVenue(createDto);
  }
}
