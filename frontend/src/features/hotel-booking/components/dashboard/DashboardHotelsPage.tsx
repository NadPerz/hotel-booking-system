// frontend/src/features/hotel-booking/components/dashboard/DashboardHotelsPage.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Building2, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import { useHotels } from '../../hooks/useHotels';

export default function DashboardHotelsPage() {
  const router = useRouter();
  const { 
    myHotels, 
    isLoadingMyHotels, 
    currentUser 
  } = useHotels();

  const handleCreateHotel = () => {
    console.log('🏨 Navigating to create hotel page');
    router.push('/hotels/create');
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hotel Management</h1>
          <p className="text-gray-600 mt-1">
            Welcome back, {currentUser.name}! Manage your {myHotels?.length || 0} hotel{(myHotels?.length || 0) !== 1 ? 's' : ''}
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button 
            onClick={handleCreateHotel}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Hotel
          </Button>
          <Button variant="outline">
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </Button>
        </div>
      </div>

      {/* Business Profile Banner */}
      {currentUser.businessProfile && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Building2 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900">
                  Business Account: {currentUser.businessProfile.firstName} {currentUser.businessProfile.lastName} Hotels
                </h3>
                <p className="text-sm text-blue-700">
                  Branch ID: {currentUser.businessProfile.branchId.slice(0, 8)}... • 
                  Business ID: {currentUser.businessProfile.businessAccountId.slice(0, 8)}... • 
                  Type: {currentUser.userType}
                </p>
              </div>
              <Badge className="ml-auto bg-green-100 text-green-800">Active</Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Hotels List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Hotels</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingMyHotels ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : myHotels && myHotels.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myHotels.map((hotel) => (
                <Card key={hotel.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{hotel.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{hotel.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">📍 {hotel.city}</span>
                      <Badge variant={hotel.isActive ? 'default' : 'secondary'}>
                        {hotel.isActive ? 'Active' : 'Draft'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Hotels Yet</h3>
              <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                Start building your hotel business by adding your first property.
              </p>
              <Button 
                onClick={handleCreateHotel}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Hotel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}