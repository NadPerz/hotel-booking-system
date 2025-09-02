export class Itinerary {
  constructor(
    public id: string,
    public title: string,
    public destination: string,
    public isActive?: boolean,
    public createdAt?: string,
    public updatedAt?: string,
  ) {}
}
export class Itinerary {
  constructor(
    public readonly title: string,
    public readonly summary: string,
    public readonly days: Day[],
    public readonly accommodation: string,
    public readonly tips: string[],
  ) {}
}
