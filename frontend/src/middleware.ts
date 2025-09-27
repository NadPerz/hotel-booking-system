import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { UserType } from "@shared/types/user-management/BusinessOnboardingSchema";

const isOnboardingRoute = createRouteMatcher(["/business/onboarding"]);
const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/", "/business/registration"]);

export default clerkMiddleware(async (auth, req) => {
  const { isAuthenticated, redirectToSignIn, sessionClaims } = await auth();
  console.log("🚀 ~ sessionClaims:", sessionClaims);

  if (isAuthenticated && isOnboardingRoute(req)) {
    return NextResponse.next();
  }

  if (!isAuthenticated && !isPublicRoute(req)) {
    // Add custom logic to run before redirecting

    return redirectToSignIn();
  }
  if (
    isAuthenticated &&
    !sessionClaims?.metadata?.onboardingComplete &&
    sessionClaims?.unsafe_metadata?.userType == UserType.BUSINESS_USER
  ) {
    const onboardingUrl = new URL("/business/onboarding", req.url);
    return NextResponse.redirect(onboardingUrl);
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
