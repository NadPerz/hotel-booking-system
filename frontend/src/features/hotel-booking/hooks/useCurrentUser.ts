// frontend/src/features/hotel-booking/hooks/useCurrentUser.ts
import { useUser } from '@clerk/nextjs';
import { useMemo } from 'react';

export interface CurrentUser {
  id: string;
  login: string;
  email: string;
  name: string;
  isAuthenticated: boolean;
  userType: 'BUSINESS_USER' | 'INDIVIDUAL_USER';
  businessProfile?: {
    branchId: string;
    businessAccountId: string;
    firstName: string;
    lastName: string;
  };
  timestamp: string;
}

export const useCurrentUser = (): { currentUser: CurrentUser } => {
  const { user, isLoaded } = useUser();
  
  const currentUser = useMemo(() => {
    const timestamp = new Date().toISOString();
    
    if (isLoaded && user) {
      // Production: Use actual Clerk user data
      const unsafeMetadata = user.unsafeMetadata || {};
      const publicMetadata = user.publicMetadata || {};
      
      const result: CurrentUser = {
        id: user.id, // Real Clerk user ID like "user_33MGKuuLEkvx1toEKAxxKF3Y"
        login: user.username || user.emailAddresses[0]?.emailAddress.split('@')[0] || 'User',
        email: user.emailAddresses[0]?.emailAddress || '',
        name: user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User',
        isAuthenticated: true,
        userType: (unsafeMetadata.userType as any) || 'BUSINESS_USER',
        businessProfile: {
          branchId: String(unsafeMetadata.branchId ?? publicMetadata.branchId ?? '68deb6aac82d1e5d5f8e6234'),
          businessAccountId: String(unsafeMetadata.businessAccountId ?? publicMetadata.businessAccountId ?? '68deb6aac82d1e5d5f8e6232'),
          firstName: user.firstName || 'Nadija',
          lastName: user.lastName || 'Perera'
        },
        timestamp
      };
      
      console.log('✅ Using Real Clerk User Data:', result);
      return result;
    }
    
    // Fallback (only when no user authenticated)
    const result: CurrentUser = {
      id: 'NadPerz-fallback',
      login: 'NadPerz',
      email: 'nadperz@hotelmanager.com',
      name: 'NadPerz (Development)',
      isAuthenticated: false,
      userType: 'BUSINESS_USER',
      businessProfile: {
        branchId: '68deb6aac82d1e5d5f8e6234',
        businessAccountId: '68deb6aac82d1e5d5f8e6232',
        firstName: 'NadPerz',
        lastName: 'Dev'
      },
      timestamp
    };
    
    console.log('🔧 Using Development Fallback:', result);
    return result;
  }, [user, isLoaded]);
  
  return { currentUser };
};