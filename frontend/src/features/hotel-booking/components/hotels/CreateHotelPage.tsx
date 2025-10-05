// frontend/src/features/hotel-booking/components/hotels/CreateHotelPage.tsx
"use client";

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Building2, Save, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import HotelForm from './HotelForm';
import { useHotels } from '../../hooks/useHotels';
import { useCurrentUser } from '../../hooks/useCurrentUser';

export default function CreateHotelPage() {
  const router = useRouter();
  const { createHotel, isCreating } = useHotels();
  const { currentUser } = useCurrentUser();

  console.log('🏨 Create Hotel Page loaded for user:', {
    userId: currentUser.id,
    userName: currentUser.name,
    timestamp: new Date().toISOString()
  });

  const handleSuccess = () => {
    console.log('✅ Hotel created successfully, redirecting...');
    router.push('/dashboard/hotels');
  };

  const handleCancel = () => {
    console.log('❌ Hotel creation cancelled');
    router.push('/dashboard/hotels');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Back Button */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => router.push('/dashboard/hotels')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
            
            <div className="h-6 w-px bg-gray-300" />
            
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Building2 className="h-6 w-6 text-blue-600" />
                Create New Hotel
              </h1>
              <p className="text-sm text-gray-600">
                Creating hotel for {currentUser.name}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* User Context Card */}
        <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 text-lg">
                  Creating hotel for: {currentUser.name}
                </h3>
                <p className="text-sm text-blue-700">
                  User ID: {currentUser.id} • 
                  Branch: {currentUser.businessProfile?.branchId?.slice(-4) || 'N/A'} • 
                  Type: {currentUser.userType}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Images will be stored as: hotels_{currentUser.businessProfile?.firstName || currentUser.name.split(' ')[0]}_timestamp_filename.jpg
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Hotel Form */}
        <HotelForm
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}