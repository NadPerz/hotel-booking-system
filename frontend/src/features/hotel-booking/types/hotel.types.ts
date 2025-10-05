// frontend/src/features/hotel-booking/types/hotel.types.ts
export interface Hotel {
  id: string;
  title: string;
  description: string;
  city: string;
  state?: string;
  country: string;
  address?: string;
  locationDescription?: string;
  image?: string; // ✅ MinIO path
  imageUrl?: string; // ✅ Signed URL for display
  createdAt: string;
  updatedAt: string;
  userId: string;
  // ✅ Individual amenity properties (matching your MongoDB)
  gym: boolean;
  spa: boolean;
  bar: boolean;
  laundry: boolean;
  restaurant: boolean;
  shopping: boolean;
  freeParking: boolean;
  bikeRental: boolean;
  freeWifi: boolean;
  movieNights: boolean;
  swimmingPool: boolean;
  coffeeShop: boolean;
}

// ✅ Fixed CreateHotelRequest - match backend exactly
export interface CreateHotelRequest {
  title: string;
  description: string;
  city: string;
  state?: string;
  country: string;
  address?: string;
  locationDescription?: string;
  imageFile?: File;
  // ✅ Individual amenity properties (NOT nested)
  gym: boolean;
  spa: boolean;
  bar: boolean;
  laundry: boolean;
  restaurant: boolean;
  shopping: boolean;
  freeParking: boolean;
  bikeRental: boolean;
  freeWifi: boolean;
  movieNights: boolean;
  swimmingPool: boolean;
  coffeeShop: boolean;
}