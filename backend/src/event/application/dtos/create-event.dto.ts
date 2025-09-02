export class CreateEventDto {
  event_name: string;
  description: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  max_attendees: number;
  ticket_price: number;
  event_status: string;
  images_url: string[];
  venue_id: string;
  organizer_id: string;
  category_id: string;
}
