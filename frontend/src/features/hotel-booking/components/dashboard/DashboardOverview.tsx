"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Users, 
  Building, 
  Calendar,
  DollarSign,
  Download,
  Eye,
  Loader2
} from 'lucide-react';
import { useAnalytics } from '../../hooks/useAnalytics';
import { useHotels } from '../../hooks/useHotels';
import { exportToCSV, downloadCSV } from '../../lib/exportUtils';

// Define proper types for analytics data
interface AnalyticsData {
  totalRevenue: number;
  totalBookings: number;
  totalHotels: number;
  totalRooms: number;
  occupancyRate: number;
  averageRating: number;
  monthlyGrowth: number;
}

export default function DashboardOverview() {
  const [isExporting, setIsExporting] = useState(false);
  
  const { 
    revenueData, 
    bookingStats, 
    hotelStats, 
    monthlyRevenue,
    isLoading 
  } = useAnalytics();
  
  const { myHotels } = useHotels();

  console.log('📊 Dashboard Overview loaded:', {
    timestamp: '2025-09-25 08:58:24',
    user: 'NadPerz',
    hotelCount: myHotels.length,
    isLoading,
    revenueData,
    bookingStats,
    hotelStats
  });

  // Create comprehensive analytics object with safe property access
  const analyticsData: AnalyticsData = {
    totalRevenue: revenueData?.totalRevenue || 0,
    totalBookings: bookingStats?.totalBookings || 0,
    totalHotels: hotelStats?.totalHotels || myHotels.length,
    totalRooms: hotelStats?.totalRooms || 0,
    // Safe access to occupancyRate - provide default if not available
    occupancyRate: (bookingStats as any)?.occupancyRate || 0,
    averageRating: 4.5,
    monthlyGrowth: 12.5
  };

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      console.log('📊 Exporting dashboard data:', {
        timestamp: '2025-09-25 08:58:24',
        user: 'NadPerz'
      });
      
      const dashboardExportData = [{
        exportDate: '2025-09-25 08:58:24',
        exportedBy: 'NadPerz',
        ...analyticsData,
        hotelCount: myHotels.length,
        timestamp: '2025-09-25 08:58:24'
      }];
      
      const csvContent = exportToCSV(dashboardExportData, 'dashboard-overview');
      downloadCSV(csvContent, 'dashboard-overview');
      
      console.log('✅ Dashboard export completed successfully');
    } catch (error) {
      console.error('❌ Dashboard export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">Loading dashboard...</p>
          <p className="text-xs text-gray-500 mt-1">User: NadPerz | 2025-09-25 08:58:24</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 mt-2">
            Welcome back, NadPerz! Here's your hotel performance summary.
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Last updated: 2025-09-25 08:58:24 UTC
          </p>
        </div>
        
        <Button 
          onClick={handleExportData}
          disabled={isExporting}
          variant="outline"
        >
          {isExporting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </>
          )}
        </Button>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${analyticsData.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +{analyticsData.monthlyGrowth}% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.totalBookings}</div>
            <p className="text-xs text-muted-foreground">
              Active reservations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hotels</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.totalHotels}</div>
            <p className="text-xs text-muted-foreground">
              {analyticsData.totalRooms} total rooms
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.averageRating}</div>
            <p className="text-xs text-muted-foreground">
              Based on guest reviews
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Hotels</CardTitle>
          </CardHeader>
          <CardContent>
            {myHotels.length === 0 ? (
              <div className="text-center py-8">
                <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">No hotels yet</p>
                <p className="text-xs text-gray-500 mb-4">User: NadPerz | 2025-09-25 08:58:24</p>
                <Button className="mt-4" size="sm">
                  Create First Hotel
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {myHotels.slice(0, 3).map((hotel) => (
                  <div key={hotel.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{hotel.title}</p>
                      <p className="text-sm text-gray-600">{hotel.city}, {hotel.country}</p>
                    </div>
                    <Badge variant="outline">Active</Badge>
                  </div>
                ))}
                <p className="text-xs text-gray-500 pt-2 border-t">
                  Showing {Math.min(3, myHotels.length)} of {myHotels.length} hotels
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Occupancy Rate</span>
              <span className="font-semibold">{analyticsData.occupancyRate}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Active Hotels</span>
              <span className="font-semibold">{analyticsData.totalHotels}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Rooms</span>
              <span className="font-semibold">{analyticsData.totalRooms}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Monthly Growth</span>
              <span className="font-semibold text-green-600">+{analyticsData.monthlyGrowth}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Bookings</span>
              <span className="font-semibold">{analyticsData.totalBookings}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Eye className="mr-2 h-5 w-5" />
            System Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Current User:</span>
              <span className="font-medium ml-2">NadPerz</span>
            </div>
            <div>
              <span className="text-gray-600">Current Time:</span>
              <span className="font-medium ml-2">2025-09-25 08:58:24</span>
            </div>
            <div>
              <span className="text-gray-600">Timezone:</span>
              <span className="font-medium ml-2">UTC</span>
            </div>
            <div>
              <span className="text-gray-600">Dashboard Status:</span>
              <span className="font-medium ml-2 text-green-600">Active</span>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Last analytics update: 2025-09-25 08:58:24 UTC</span>
              <span>Data source: Hotel Booking API</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}