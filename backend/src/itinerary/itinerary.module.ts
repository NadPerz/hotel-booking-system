import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ItineraryController } from './presentation/controllers/itinerary.controller';
import { ItineraryService } from './application/services/itinerary.service';
import { ItineraryRepository } from './domain/repositories/itinerary.repository';
import { ItineraryRepositoryImpl } from './infrastructure/repositories/itinerary.repository.impl';
import { ItinerarySchema } from './infrastructure/schemas/itinerary.schema';
import { ItineraryChatService } from './application/services/itinerary-chat.service';
import {
  HandleClarificationUseCase,
  UpdateContextUseCase,
} from './application/use-cases/itinerary-generation';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Itinerary', schema: ItinerarySchema }]),
  ],
  controllers: [ItineraryController],
  providers: [
    ItineraryChatService,
    ItineraryService,
    HandleClarificationUseCase,
    UpdateContextUseCase,
    {
      provide: ItineraryRepository,
      useClass: ItineraryRepositoryImpl,
    },
  ],
  exports: [
    ItineraryService,
    ItineraryChatService,
    HandleClarificationUseCase,
    UpdateContextUseCase,
  ],
})
export class ItineraryModule {}
