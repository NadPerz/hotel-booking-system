export enum UserRole {
  BUSINESS_OWNER = "BUSINESS_OWNER",
  BRANCH_MANAGER = "BRANCH_MANAGER",
  CONTENT_MANAGER = "CONTENT_MANAGER",
  EVENT_MANAGER = "EVENT_MANAGER",
  RESERVATIONS_MANAGER = "RESERVATIONS_MANAGER",
}

export enum UserType {
  TRAVELER = "TRAVELER",
  BUSINESS_USER = "BUSINESS_USER",
}

export enum BusinessType {
  RESTAURANT = "restaurant",
  EVENT = "event",
  HOTEL = "hotel",
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Branch {
  bName: string;
  bLocation: {
    coords: Coordinates;
    address: string;
    city: string;
    country: string;
  };
}

export interface createBusinessUserDto {
  brandName: string;
  type: BusinessType;
  primaryContactNumber: string;
  branch:Branch,
  legalEntityName: string;
  legalEntityAddress: string;
  legalEntitySigner: string;
}
