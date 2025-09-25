"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Plus, Users } from 'lucide-react';
import { toast } from 'react-hot-toast';
import StatsCards from './StatsCards';
import RevenueChart from './RevenueChart';
import RecentBookings from './RecentBookings';
import QuickActions from './QuickActions';
import AlertsPanel from './AlertsPanel';
import { useBookings } from '../../hooks/useBookings';
import { useAnalytics } from '../../hooks/useAnalytics';
import LoadingSpinner from '../shared/LoadingSpinner';
import { exportToCSV, generateAnalyticsExport } from '../../lib/exportUtils';

export default function DashboardOverview() {
  const { bookings, conflicts, isLoading: bookingsLoading } = useBookings();
  const { analytics, revenue, isLoading: analyticsLoading } = useAnalytics();

  const handleExportReport = () => {
    try {
      const exportData = generateAnalyticsExport(analytics, revenue, 'month');
      const success = exportToCSV(exportData);
      
      if (success) {
        toast.success('Dashboard report exported successfully!');
      } else {
        toast.error('Failed to export report. Please try again.');
      }
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Export failed. Please try again.');
    }
  };

  if (bookingsLoading || analyticsLoading) {
    return <LoadingSpinner />;
  }

  const stats = {
    totalRevenue: revenue?.total || 25000,
    revenueGrowth: revenue?.growth || 15.2,
    totalBookings: bookings?.length || 0,
    bookingGrowth: analytics?.bookingGrowth || 12,
    occupancyRate: analytics?.occupancyRate || 78,
    occupancyGrowth: analytics?.occupancyGrowth || 8,
    conflicts: conflicts?.length || 0,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, NadPerz! 👋
          </h1>
          <p className="text-gray-600 mt-1">
            Here's what's happening with your hotels today.
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleExportReport}
          >
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button 
            size="sm"
            onClick={() => window.location.href = '/hotels/create'}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Hotel
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <StatsCards stats={stats} />

      {/* Alerts */}
      {(conflicts?.length || 0) > 0 && (
        <AlertsPanel conflicts={conflicts || []} />
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="recent">Recent Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Revenue Chart - Takes 2 columns */}
            <div className="xl:col-span-2">
              <RevenueChart data={revenue?.monthlyData || []} />
            </div>
            
            {/* Recent Bookings - Takes 1 column */}
            <div className="xl:col-span-1">
              <RecentBookings 
                bookings={(bookings || []).slice(0, 5)} 
                onViewAll={() => window.location.href = '/dashboard/bookings'}
              />
            </div>
          </div>
          
          {/* Quick Actions */}
          <QuickActions 
            conflictsCount={conflicts?.length || 0}
            onCreateHotel={() => window.location.href = '/hotels/create'}
            onCreateRoom={() => window.location.href = '/dashboard/hotels'}
            onViewReports={() => window.location.href = '/dashboard/analytics'}
            onViewConflicts={() => window.location.href = '/dashboard/conflicts'}
            onViewAnalytics={() => window.location.href = '/dashboard/analytics'}
          />
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Hotels</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from({ length: 3 }, (_, i) => (
                    <div key={i} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Paradise Resort #{i + 1}</p>
                        <p className="text-sm text-gray-600">{85 - i * 5}% occupancy</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">${(15000 - i * 2000).toLocaleString()}</p>
                        <p className="text-sm text-gray-600">this month</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Average Daily Rate</span>
                      <span className="font-medium">85%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Revenue Per Room</span>
                      <span className="font-medium">72%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '72%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Guest Satisfaction</span>
                      <span className="font-medium">95%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: '95%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recent" className="space-y-6">
          <RecentBookings 
            bookings={(bookings || []).slice(0, 10)} 
            onViewAll={() => window.location.href = '/dashboard/bookings'}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}