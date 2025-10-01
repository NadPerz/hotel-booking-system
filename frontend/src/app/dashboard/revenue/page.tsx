import { Suspense } from 'react';
import RevenuePage from '@/features/hotel-booking/components/dashboard/RevenuePage';
import LoadingSpinner from '@/features/hotel-booking/components/shared/LoadingSpinner';

export default function DashboardRevenuePage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <RevenuePage />
    </Suspense>
  );
}