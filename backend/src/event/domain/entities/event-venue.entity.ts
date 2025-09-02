export class EventVenue {
  constructor(
    public id: string,
    public venue_name: string,
    public address: string,
    public city: string,
    public province: string,
    public postal_code: string,
    public country: string,
    public capacity: number,
    public facilities: string[],
  ) {}
}
