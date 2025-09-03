import { Injectable } from '@nestjs/common';
import { EventRepository } from '../../domain/repositories/event.repository';
import { Event } from '../../domain/entities/event.entity';
import { CreateEventDto } from '../dtos/create-event.dto';
import { EventVenueRepository } from '../../domain/repositories/event-venue.repository';
import { EventOrganizerRepository } from '../../domain/repositories/event-organizer.repository';
import { EventCategoryRepository } from '../../domain/repositories/event-category.repository';
import { EventRsvpRepository } from '../../domain/repositories/event-rsvp.repository';
import { EventRsvp } from '../../domain/entities/event-rsvp.entity';
import { CreateEventRsvpDto } from '../dtos/create-event-rsvp.dto';
import { EventHashtagRepository } from '../../domain/repositories/event-hashtag.repository';
import { EventHashtag } from '../../domain/entities/event-hashtag.entity';
import { CreateEventHashtagDto } from '../dtos/create-event-hashtag.dto';
import { EventHashtagMappingRepository } from '../../domain/repositories/event-hashtag-mapping.repository';
import { EventHashtagMapping } from '../../domain/entities/event-hashtag-mapping.entity';
import { CreateEventHashtagMappingDto } from '../dtos/create-event-hashtag-mapping.dto';
import { CreateEventCategoryDto } from '../dtos/create-event-category.dto';
import { CreateEventOrganizerDto } from '../dtos/create-event-organizer.dto';
import { CreateEventVenueDto } from '../dtos/create-event-venue.dto';
import { EventCategory } from '../../domain/entities/event-category.entity';
import { EventOrganizer } from '../../domain/entities/event-organizer.entity';
import { EventVenue } from '../../domain/entities/event-venue.entity';

@Injectable()
export class EventService {
  constructor(
    private readonly eventRepository: EventRepository,
    private readonly eventVenueRepository: EventVenueRepository,
    private readonly eventOrganizerRepository: EventOrganizerRepository,
    private readonly eventCategoryRepository: EventCategoryRepository,
    private readonly eventRsvpRepository: EventRsvpRepository,
    private readonly eventHashtagRepository: EventHashtagRepository,
    private readonly eventHashtagMappingRepository: EventHashtagMappingRepository,
  ) {}

  async create(createDto: CreateEventDto): Promise<Event> {
    const venue = await this.eventVenueRepository.findById(createDto.venueId);
    const organizer = await this.eventOrganizerRepository.findById(
      createDto.organizerId,
    );
    const category = await this.eventCategoryRepository.findById(
      createDto.categoryId,
    );

    if (!venue || !organizer || !category) {
      throw new Error('Venue, Organizer or Category not found');
    }

    const event = new Event(
      null,
      createDto.name,
      createDto.description || '',
      createDto.date,
      createDto.endDate || createDto.date,
      createDto.startTime || '',
      createDto.endTime || '',
      createDto.maxAttendees || 0,
      createDto.ticketPrice || 0,
      createDto.eventStatus || 'active',
      createDto.imagesUrl || [],
      venue,
      organizer,
      category,
    );

    return await this.eventRepository.create(event);
  }

  async findById(id: string): Promise<Event | null> {
    return await this.eventRepository.findById(id);
  }

  async createRsvp(createRsvpDto: CreateEventRsvpDto): Promise<EventRsvp> {
    const event = await this.eventRepository.findById(createRsvpDto.event_id);

    if (!event) {
      throw new Error('Event not found');
    }

    const eventRsvp = new EventRsvp(
      null,
      event,
      createRsvpDto.user_id,
      createRsvpDto.rsvp_status,
      createRsvpDto.guest_count,
    );

    return await this.eventRsvpRepository.create(eventRsvp);
  }

  async createHashtag(
    createHashtagDto: CreateEventHashtagDto,
  ): Promise<EventHashtag> {
    const eventHashtag = new EventHashtag(
      null,
      createHashtagDto.hashtag_name,
    );

    return await this.eventHashtagRepository.create(eventHashtag);
  }

  async mapHashtagToEvent(
    createEventHashtagMappingDto: CreateEventHashtagMappingDto,
  ): Promise<EventHashtagMapping> {
    const event = await this.eventRepository.findById(
      createEventHashtagMappingDto.event_id,
    );
    const hashtag = await this.eventHashtagRepository.findById(
      createEventHashtagMappingDto.hashtag_id,
    );

    if (!event || !hashtag) {
      throw new Error('Event or Hashtag not found');
    }

    const eventHashtagMapping = new EventHashtagMapping(
      event,
      hashtag,
    );

    return await this.eventHashtagMappingRepository.create(eventHashtagMapping);
  }

  async createCategory(
    createDto: CreateEventCategoryDto,
  ): Promise<EventCategory> {
    const category = new EventCategory(
      null,
      createDto.category_name,
      createDto.description,
    );
    return await this.eventCategoryRepository.create(category);
  }

  async createOrganizer(
    createDto: CreateEventOrganizerDto,
  ): Promise<EventOrganizer> {
    const organizer = new EventOrganizer(
      null,
      createDto.organizer_name,
      createDto.contact_email,
      createDto.contact_phone,
      createDto.organization,
    );
    return await this.eventOrganizerRepository.create(organizer);
  }

  async createVenue(createDto: CreateEventVenueDto): Promise<EventVenue> {
    const venue = new EventVenue(
      null,
      createDto.venue_name,
      createDto.address,
      createDto.city,
      createDto.province,
      createDto.postal_code,
      createDto.country,
      createDto.capacity,
      createDto.facilities,
    );
    return await this.eventVenueRepository.create(venue);
  }
}
