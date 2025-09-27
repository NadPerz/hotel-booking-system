import { z } from "zod";

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
// Business types enum - duplicated here to avoid import issues
export enum BusinessType {
  RESTAURANT = "restaurant",
  EVENT = "event",
  HOTEL = "hotel",
}

// Branch location schema
const CoordinatesSchema = z.object({
  lat: z.number(),
  lng: z.number(),
});

const BranchLocationSchema = z.object({
  coords: CoordinatesSchema,
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
});

const BranchSchema = z.object({
  bName: z.string().min(1, "Branch name is required"),
  bLocation: BranchLocationSchema,
});

// Complete Zod schema for the entire form
export const BusinessOnboardingSchema = z.object({
  brandName: z.string().min(1, "Brand name is required"),
  type: z.nativeEnum(BusinessType),
  branch: BranchSchema,
  primaryContactNumber: z.string().min(10, "Please enter a valid phone number"),
  //business legal step
  legalEntityName: z.string().min(1, "Legal entity name is required"),
  legalEntityAddress: z.string().min(1, "Legal entity address is required"),
  legalEntitySigner: z.string().min(1, "Legal entity signer is required"),
});

export type BusinessOnboardingSchema = z.infer<typeof BusinessOnboardingSchema>;

// Individual step schemas
export const BusinessDetailsSchema = BusinessOnboardingSchema.pick({
  brandName: true,
  type: true,
  primaryContactNumber: true,
  branch: true,
});
export const BusinessLegalEntitySchema = BusinessOnboardingSchema.pick({
  legalEntityName: true,
  legalEntityAddress: true,
  legalEntitySigner: true,
});
