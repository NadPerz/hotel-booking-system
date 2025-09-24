import { Suspense } from 'react';
import AllBookingsPage from '@/features/hotel-booking/components/bookings/AllBookingsPage';
import LoadingSpinner from '@/features/hotel-booking/components/shared/LoadingSpinner';

export default function DashboardBookingsPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <AllBookingsPage />
    </Suspense>
  );
}