import { UserType } from "@shared/types/user-management/BusinessOnboardingSchema";
export {};

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      onboardingComplete?: boolean;
    };
    unsafe_metadata?: {
      userType?: UserType;
    };
  }
}
