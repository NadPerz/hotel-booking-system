import { Injectable } from '@nestjs/common';

export interface Attraction {
  id: string;
  name: string;
  type: string;
  rating: number;
  address: string;
  destination: string;
  coordinates: [number, number]; // [longitude, latitude]
  description: string;
  priceLevel?: 'free' | 'cheap' | 'moderate' | 'expensive';
  openingHours?: string;
  imageUrl?: string;
  popularity: number;
}
@Injectable()
export class AttractionsRepository {
  private readonly attractions: Attraction[] = [
    {
      id: '1',
      name: 'National Museum of Colombo',
      type: 'museum',
      rating: 4.3,
      address: 'Sir Marcus Fernando Mawatha, Colombo 07',
      destination: 'Colombo',
      coordinates: [79.8612, 6.9147],
      description: 'Largest museum in Sri Lanka showcasing cultural heritage',
      priceLevel: 'moderate',
      popularity: 85,
    },
    {
      id: '2',
      name: 'Temple of the Sacred Tooth Relic',
      type: 'temple',
      rating: 4.7,
      address: 'Sri Dalada Veediya, Kandy',
      destination: 'Kandy',
      coordinates: [80.6337, 7.2906],
      description: 'Most sacred Buddhist temple in Sri Lanka',
      priceLevel: 'cheap',
      popularity: 95,
    },
    {
      id: '3',
      name: 'Galle Fort',
      type: 'historic site',
      rating: 4.6,
      address: 'Church Street, Galle Fort',
      destination: 'Galle',
      coordinates: [80.217, 6.0329],
      description: 'Historic fort with colonial architecture and shops',
      priceLevel: 'free',
      popularity: 90,
    },
    {
      id: '4',
      name: 'Gregory Lake',
      type: 'nature',
      rating: 4.2,
      address: 'Gregory Lake Road, Nuwara Eliya',
      destination: 'Nuwara Eliya',
      coordinates: [80.757, 6.9497],
      description: 'Scenic lake with boating and walking paths',
      priceLevel: 'cheap',
      popularity: 75,
    },
    {
      id: '5',
      name: 'Gangaramaya Temple',
      type: 'temple',
      rating: 4.4,
      address: '61 Sri Jinaratana Road, Colombo 02',
      destination: 'Colombo',
      coordinates: [79.86, 6.916],
      description: 'Beautiful Buddhist temple with museum and library',
      priceLevel: 'free',
      popularity: 80,
    },
    {
      id: '6',
      name: 'Royal Botanical Gardens',
      type: 'nature',
      rating: 4.5,
      address: 'Peradeniya, Kandy',
      destination: 'Kandy',
      coordinates: [80.5981, 7.2733],
      description: 'Largest botanical gardens in Sri Lanka',
      priceLevel: 'moderate',
      popularity: 88,
    },
    {
      id: '7',
      name: 'Sigiriya Rock Fortress',
      type: 'historic site',
      rating: 4.8,
      address: 'Sigiriya',
      destination: 'Sigiriya',
      coordinates: [80.7573, 7.957],
      description: 'Ancient rock fortress and palace ruins',
      priceLevel: 'expensive',
      popularity: 98,
    },
    {
      id: '8',
      name: 'Yala National Park',
      type: 'wildlife',
      rating: 4.6,
      address: 'Yala',
      destination: 'Yala',
      coordinates: [81.3047, 6.2605],
      description: 'Famous for leopard sightings and diverse wildlife',
      priceLevel: 'expensive',
      popularity: 92,
    },
  ];

  findByDestinationAndInterests(
    destination: string,
    interests?: string[],
  ): Attraction[] {
    let filteredAttractions = this.attractions.filter((attraction) =>
      attraction.destination.toLowerCase().includes(destination.toLowerCase()),
    );

    if (interests && interests.length > 0) {
      filteredAttractions = filteredAttractions.filter((attraction) =>
        interests.some(
          (interest) =>
            attraction.type.toLowerCase().includes(interest.toLowerCase()) ||
            attraction.name.toLowerCase().includes(interest.toLowerCase()) ||
            attraction.description
              .toLowerCase()
              .includes(interest.toLowerCase()),
        ),
      );
    }

    return filteredAttractions.sort((a, b) => b.popularity - a.popularity);
  }

  findById(id: string): Attraction | null {
    return this.attractions.find((attraction) => attraction.id === id) || null;
  }

  findByType(type: string): Attraction[] {
    return this.attractions
      .filter(
        (attraction) => attraction.type.toLowerCase() === type.toLowerCase(),
      )
      .sort((a, b) => b.rating - a.rating);
  }

  findByRating(minRating: number): Attraction[] {
    return this.attractions
      .filter((attraction) => attraction.rating >= minRating)
      .sort((a, b) => b.rating - a.rating);
  }
}
