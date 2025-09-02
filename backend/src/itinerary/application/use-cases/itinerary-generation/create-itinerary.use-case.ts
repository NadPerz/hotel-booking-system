import { Injectable } from '@nestjs/common';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { PromptTemplate } from '@langchain/core/prompts';
import { Itinerary } from 'src/itinerary/domain/entities/itinerary.entity';
import { HotelsRepository } from 'src/itinerary/infrastructure/repositories/mocks/hotels.repository.mock';
import { AttractionsRepository } from 'src/itinerary/infrastructure/repositories/mocks/attraction.repository.mock';
import { GoogleMapsService } from 'src/itinerary/infrastructure/external-api/google-maps-service';
import { ConversationContext } from 'src/itinerary/domain/value-objects/conversation';
import { parseModelJson } from '../../support/parse-model-json';

@Injectable()
export class CreateItineraryUseCase {
  private llm = new ChatGoogleGenerativeAI({
    model: 'gemini-2.0-flash',
    temperature: 0.7,
  });

  constructor(
    private readonly hotelsRepository: HotelsRepository,
    private readonly attractionsRepository: AttractionsRepository,
    private readonly googleMapsService: GoogleMapsService,
  ) {}

  async execute(
    context: ConversationContext,
  ): Promise<{ itinerary: Itinerary; response: string }> {
    // - ! assertions due to validation in the itinerary-chat service | switch statement
    const hotels = this.hotelsRepository.findByDestination(
      context.destination!,
      context.budget,
    );
    const attractions =
      this.attractionsRepository.findByDestinationAndInterests(
        context.destination!,
        context.interests,
      );
    const placesData = await this.googleMapsService.getPlaces(
      context.destination!,
      context.interests,
    );

    const itineraryPrompt = PromptTemplate.fromTemplate(`
      Create a detailed itinerary for:
      - Destination: {destination}
      - Dates: {dates}
      - Travelers: {travelers}
      - Budget: {budget}
      - Interests: {interests}

      Available hotels: {hotels}
      Available attractions: {attractions}
      Google Places data: {places}

      Create a day-by-day itinerary with specific times, locations, and practical details.

      Return ONLY a valid JSON object with this exact structure:
      {{
        "title": "Trip title",
        "summary": "Brief overview",
        "days": [
          {{
            "day": 1 (Day numbers must be consecutive starting from 1),
            "date": "YYYY-MM-DD",
            "destination": "city name",
            "activities": [
              {{
                "time": "09:00",
                "name": "Activity name",
                "description": "Details",
                "address": "Address",
                "type": "restaurant",
                "coordinates": "[longitude, latitude]"
              }}
            ]
          }}
        ],
        "accommodation": "Hotel recommendation",
        "tips": ["Helpful tip 1", "Helpful tip 2"]
      }}
    `);

    try {
      const chain = itineraryPrompt.pipe(this.llm);
      const result = await chain.invoke({
        destination: context.destination,
        dates: context.dates,
        travelers: context.travelers,
        budget: context.budget || 'Not specified',
        interests: context.interests?.join(', ') || 'General sightseeing',
        hotels: JSON.stringify(hotels),
        attractions: JSON.stringify(attractions),
        places: JSON.stringify(placesData),
      });

      const itineraryData = parseModelJson(result.content) as Itinerary;

      const itinerary = new Itinerary(
        itineraryData.title,
        itineraryData.summary,
        itineraryData.days,
        itineraryData.accommodation,
        itineraryData.tips,
      );

      const response = `Here's your personalized itinerary for ${context.destination}!\n\nWould you like me to modify anything?`;

      return { itinerary, response };
    } catch (error) {
      throw new Error('Failed to create itinerary: ' + error);
    }
  }
}
