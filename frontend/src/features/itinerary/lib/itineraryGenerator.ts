import { v4 as uuidv4 } from 'uuid';
import { Itinerary, Place, ItineraryDay } from '../components/TravelChatbot'

// Mock data for demonstration - in a real app, this would use Google Places API
const mockPlacesData: Record<string, Place[]> = {
  paris: [
    {
      id: uuidv4(),
      name: "Eiffel Tower",
      type: "Attraction",
      coordinates: [2.2945, 48.8584],
      description: "Iconic iron lattice tower and symbol of Paris",
      rating: 4.6,
      address: "Champ de Mars, 5 Avenue Anatole France, 75007 Paris"
    },
    {
      id: uuidv4(),
      name: "Louvre Museum",
      type: "Museum",
      coordinates: [2.3376, 48.8606],
      description: "World's largest art museum and historic monument",
      rating: 4.5,
      address: "Rue de Rivoli, 75001 Paris"
    },
    {
      id: uuidv4(),
      name: "Notre-Dame Cathedral",
      type: "Attraction",
      coordinates: [2.3522, 48.8530],
      description: "Medieval Catholic cathedral with Gothic architecture",
      rating: 4.4,
      address: "6 Parvis Notre-Dame - Pl. Jean-Paul II, 75004 Paris"
    },
    {
      id: uuidv4(),
      name: "Sacré-Cœur Basilica",
      type: "Attraction",
      coordinates: [2.3431, 48.8867],
      description: "Beautiful basilica with panoramic views of Paris",
      rating: 4.3,
      address: "35 Rue du Chevalier de la Barre, 75018 Paris"
    },
    {
      id: uuidv4(),
      name: "Le Comptoir du Relais",
      type: "Restaurant",
      coordinates: [2.3387, 48.8530],
      description: "Traditional French bistro with authentic cuisine",
      rating: 4.2,
      address: "9 Carrefour de l'Odéon, 75006 Paris"
    },
    {
      id: uuidv4(),
      name: "Champs-Élysées",
      type: "Shopping",
      coordinates: [2.3073, 48.8698],
      description: "Famous avenue for shopping and entertainment",
      rating: 4.1,
      address: "Champs-Élysées, 75008 Paris"
    }
  ],
  tokyo: [
    {
      id: uuidv4(),
      name: "Senso-ji Temple",
      type: "Attraction",
      coordinates: [139.7967, 35.7148],
      description: "Ancient Buddhist temple in Asakusa district",
      rating: 4.3,
      address: "2 Chome-3-1 Asakusa, Taito City, Tokyo"
    },
    {
      id: uuidv4(),
      name: "Tokyo Skytree",
      type: "Attraction",
      coordinates: [139.8107, 35.7101],
      description: "World's tallest tower with observation decks",
      rating: 4.4,
      address: "1 Chome-1-2 Oshiage, Sumida City, Tokyo"
    },
    {
      id: uuidv4(),
      name: "Tsukiji Outer Market",
      type: "Restaurant",
      coordinates: [139.7709, 35.6654],
      description: "Famous fish market with fresh sushi and seafood",
      rating: 4.5,
      address: "Tsukiji, Chuo City, Tokyo"
    },
    {
      id: uuidv4(),
      name: "Meiji Shrine",
      type: "Attraction",
      coordinates: [139.6993, 35.6762],
      description: "Peaceful Shinto shrine surrounded by forest",
      rating: 4.3,
      address: "1-1 Yoyogikamizonocho, Shibuya City, Tokyo"
    }
  ],
  london: [
    {
      id: uuidv4(),
      name: "Tower of London",
      type: "Attraction",
      coordinates: [-0.0759, 51.5081],
      description: "Historic castle and former royal residence",
      rating: 4.4,
      address: "St Katharine's & Wapping, London EC3N 4AB"
    },
    {
      id: uuidv4(),
      name: "British Museum",
      type: "Museum",
      coordinates: [-0.1265, 51.5194],
      description: "World-famous museum with historic artifacts",
      rating: 4.5,
      address: "Great Russell St, Bloomsbury, London WC1B 3DG"
    },
    {
      id: uuidv4(),
      name: "Big Ben",
      type: "Attraction",
      coordinates: [-0.1246, 51.4994],
      description: "Iconic clock tower and symbol of London",
      rating: 4.3,
      address: "Westminster, London SW1A 0AA"
    },
    {
      id: uuidv4(),
      name: "Hyde Park",
      type: "Park",
      coordinates: [-0.1652, 51.5074],
      description: "Large royal park perfect for walks and picnics",
      rating: 4.4,
      address: "London W2 2UH"
    }
  ]
};

const parseUserInput = (input: string): { destination: string; days: number; preferences: string[] } => {
  const lowerInput = input.toLowerCase();
  
  // Extract destination
  let destination = 'paris'; // default
  if (lowerInput.includes('tokyo') || lowerInput.includes('japan')) {
    destination = 'tokyo';
  } else if (lowerInput.includes('london') || lowerInput.includes('uk') || lowerInput.includes('england')) {
    destination = 'london';
  } else if (lowerInput.includes('paris') || lowerInput.includes('france')) {
    destination = 'paris';
  }
  
  // Extract duration
  let days = 3; // default
  const dayMatches = lowerInput.match(/(\d+)\s*day/);
  if (dayMatches) {
    days = parseInt(dayMatches[1]);
  } else if (lowerInput.includes('weekend')) {
    days = 2;
  } else if (lowerInput.includes('week')) {
    days = 7;
  }
  
  // Extract preferences
  const preferences: string[] = [];
  if (lowerInput.includes('family')) preferences.push('family-friendly');
  if (lowerInput.includes('food') || lowerInput.includes('restaurant')) preferences.push('food');
  if (lowerInput.includes('museum') || lowerInput.includes('art')) preferences.push('culture');
  if (lowerInput.includes('shopping')) preferences.push('shopping');
  if (lowerInput.includes('nature') || lowerInput.includes('park')) preferences.push('nature');
  
  return { destination, days: Math.min(Math.max(days, 1), 7), preferences };
};

export const generateItinerary = async (userInput: string): Promise<Itinerary> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const { destination, days, preferences } = parseUserInput(userInput);
  const availablePlaces = mockPlacesData[destination] || mockPlacesData.paris;
  
  // Create itinerary days
  const itineraryDays: ItineraryDay[] = [];
  const placesPerDay = Math.ceil(availablePlaces.length / days);
  
  for (let day = 1; day <= days; day++) {
    const startIndex = (day - 1) * placesPerDay;
    const endIndex = Math.min(startIndex + placesPerDay, availablePlaces.length);
    const dayPlaces = availablePlaces.slice(startIndex, endIndex);
    
    itineraryDays.push({
      day,
      title: `Day ${day} - ${destination.charAt(0).toUpperCase() + destination.slice(1)} Exploration`,
      places: dayPlaces
    });
  }
  
  const itinerary: Itinerary = {
    id: uuidv4(),
    destination: destination.charAt(0).toUpperCase() + destination.slice(1),
    duration: days,
    days: itineraryDays,
    totalPlaces: availablePlaces.length
  };
  
  return itinerary;
};