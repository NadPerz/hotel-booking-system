import { Suspense } from 'react';
import ConflictsPage from '@/features/hotel-booking/components/bookings/ConflictsPage';
import LoadingSpinner from '@/features/hotel-booking/components/shared/LoadingSpinner';

export default function DashboardConflictsPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ConflictsPage />
    </Suspense>
  );
}