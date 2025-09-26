import { UserType } from "./user-management";

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
