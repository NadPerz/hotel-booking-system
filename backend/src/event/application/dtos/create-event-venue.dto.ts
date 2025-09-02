export class CreateEventVenueDto {
  venue_name: string;
  address: string;
  city: string;
  province: string;
  postal_code: string;
  country: string;
  capacity: number;
  facilities: string[];
}
