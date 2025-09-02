// import { Injectable } from '@nestjs/common';
// import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
// import { PromptTemplate } from '@langchain/core/prompts';
// import { Itinerary } from '../../domain/entities/itinerary.entity';
// import { HotelsRepository } from '../../infrastructure/database/hotels.repository';
// import { AttractionsRepository } from '../../infrastructure/database/attractions.repository';
// import { GoogleMapsService } from '../../infrastructure/external/google-maps.service';

// @Injectable()
// export class ModifyItineraryUseCase {
//   private llm = new ChatGoogleGenerativeAI({
//     model: 'gemini-2.0-flash',
//     temperature: 0.7,
//   });

//   constructor(
//     private readonly hotelsRepository: HotelsRepository,
//     private readonly attractionsRepository: AttractionsRepository,
//     private readonly googleMapsService: GoogleMapsService,
//   ) {}

//   async execute(
//     modification: string,
//     currentItinerary: Itinerary,
//     context: any,
//   ): Promise<{ itinerary: Itinerary; response: string }> {
//     const hotels = await this.hotelsRepository.findByDestination(
//       context.destination,
//       context.budget,
//     );
//     const attractions =
//       await this.attractionsRepository.findByDestinationAndInterests(
//         context.destination,
//         context.interests,
//       );
//     const placesData = await this.googleMapsService.getPlaces(
//       context,
//       modification,
//     );

//     const modifyPrompt = PromptTemplate.fromTemplate(`
//       User wants to modify their itinerary: "{modification}"
//       Current itinerary: {currentItinerary}

//       Apply the requested changes and return ONLY the updated itinerary as a valid JSON object.
//       Use this additional data:
//       Database data: {dbData}
//       Google Places data: {placesData}

//       Return the same JSON structure as the original itinerary.
//     `);

//     try {
//       const chain = modifyPrompt.pipe(this.llm);
//       const result = await chain.invoke({
//         modification,
//         currentItinerary: JSON.stringify(currentItinerary),
//         dbData: JSON.stringify({ hotels, attractions }),
//         placesData: JSON.stringify(placesData),
//       });

//       let cleanJson = result.content.toString().trim();
//       if (cleanJson.startsWith('```json')) {
//         cleanJson = cleanJson.replace(/```json\n?/, '').replace(/\n?```$/, '');
//       } else if (cleanJson.startsWith('```')) {
//         cleanJson = cleanJson.replace(/```\n?/, '').replace(/\n?```$/, '');
//       }

//       const itineraryData = JSON.parse(cleanJson);
//       const itinerary = new Itinerary(
//         itineraryData.title,
//         itineraryData.summary,
//         itineraryData.days,
//         itineraryData.accommodation,
//         itineraryData.tips,
//       );

//       const response = `I've updated your itinerary based on your request!\n\nAny other changes you'd like to make?`;

//       return { itinerary, response };
//     } catch (error) {
//       throw new Error('Failed to modify itinerary: ' + error.message);
//     }
//   }
// }
