// frontend/src/features/hotel-booking/lib/validations.ts
import * as z from 'zod';

export const hotelSchema = z.object({
  title: z.string().min(1, 'Hotel name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  country: z.string().min(1, 'Country is required'),
  state: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  address: z.string().optional(),
  locationDescription: z.string().optional(),
  // Amenities - all required booleans (not optional)
  amenities: z.object({
    gym: z.boolean(),
    spa: z.boolean(),
    bar: z.boolean(),
    laundry: z.boolean(),
    restaurant: z.boolean(),
    shopping: z.boolean(),
    freeParking: z.boolean(),
    bikeRental: z.boolean(),
    freeWifi: z.boolean(),
    movieNights: z.boolean(),
    swimmingPool: z.boolean(),
    coffeeShop: z.boolean(),
  }),
});

export type HotelFormData = z.infer<typeof hotelSchema>;