// frontend/src/app/hotels/create/page.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import HotelForm from '@/features/hotel-booking/components/hotels/HotelForm';

export default function CreateHotelPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push('/dashboard/hotels');
  };

  const handleCancel = () => {
    router.push('/dashboard/hotels');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Back Button */}
      <div className="max-w-6xl mx-auto px-6 mb-6">
        <Button 
          variant="ghost" 
          onClick={() => router.push('/dashboard/hotels')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>
      </div>

      {/* Hotel Form */}
      <HotelForm 
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </div>
  );
}