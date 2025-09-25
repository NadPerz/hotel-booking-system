"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, TrendingUp, TrendingDown, Calendar, Users, DollarSign } from 'lucide-react';
import { toast } from 'react-hot-toast';
import RevenueChart from './RevenueChart';
import { useAnalytics } from '../../hooks/useAnalytics';
import { useBookings } from '../../hooks/useBookings';
import LoadingSpinner from '../shared/LoadingSpinner';
import { exportToCSV, generateAnalyticsExport, exportToJSON } from '../../lib/exportUtils';

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('month');
  const [isExporting, setIsExporting] = useState(false);
  
  const { analytics, revenue, isLoading: analyticsLoading } = useAnalytics();
  const { bookings, isLoading: bookingsLoading } = useBookings();

  const handleExportReport = async (format: 'csv' | 'json' = 'csv') => {
    setIsExporting(true);
    try {
      if (format === 'csv') {
        const exportData = generateAnalyticsExport(analytics, revenue, timeRange);
        const success = exportToCSV(exportData);
        
        if (success) {
          toast.success('Analytics report exported successfully!');
        } else {
          toast.error('Failed to export report. Please try again.');
        }
      } else {
        const data = {
          analytics: analytics || {},
          revenue: revenue || {},
          timeRange,
          exportDate: new Date().toISOString(),
          summary: {
            totalRevenue: revenue?.total || 125000,
            totalBookings: bookings?.length || 0,
            occupancyRate: analytics?.occupancyRate || 78,
          }
        };
        
        const currentDate = new Date().toISOString().split('T')[0];
        const success = exportToJSON(data, `analytics-data-${timeRange}-${currentDate}.json`);
        
        if (success) {
          toast.success('Analytics data exported as JSON!');
        } else {
          toast.error('Failed to export JSON data. Please try again.');
        }
      }
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  if (analyticsLoading || bookingsLoading) {
    return <LoadingSpinner />;
  }

  const kpis = [
    {
      title: 'Total Revenue',
      value: `$${(revenue?.total || 125000).toLocaleString()}`,
      change: `+${revenue?.growth || 15.2}%`,
      trend: 'up' as const,
      icon: DollarSign,
      color: 'text-green-600',
    },
    {
      title: 'Total Bookings',
      value: (bookings?.length || 0).toString(),
      change: `+${analytics?.bookingGrowth || 12}%`,
      trend: 'up' as const,
      icon: Calendar,
      color: 'text-blue-600',
    },
    {
      title: 'Avg. Occupancy',
      value: `${analytics?.occupancyRate || 78}%`,
      change: `+${analytics?.occupancyGrowth || 8}%`,
      trend: 'up' as const,
      icon: Users,
      color: 'text-purple-600',
    },
    {
      title: 'Avg. Daily Rate',
      value: '$245',
      change: '+12%',
      trend: 'up' as const,
      icon: TrendingUp,
      color: 'text-orange-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">
            Comprehensive insights into your hotel performance
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last Week</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="quarter">Last Quarter</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          
          {/* Export Buttons */}
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={() => handleExportReport('csv')}
              disabled={isExporting}
              className="relative"
            >
              <Download className="mr-2 h-4 w-4" />
              {isExporting ? 'Exporting...' : 'Export CSV'}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => handleExportReport('json')}
              disabled={isExporting}
            >
              <Download className="mr-2 h-4 w-4" />
              Export JSON
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi) => (
          <Card key={kpi.title} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{kpi.value}</p>
                </div>
                <div className={`p-3 rounded-full bg-gray-50`}>
                  <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                {kpi.trend === 'up' ? (
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={`text-sm font-medium ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {kpi.change}
                </span>
                <span className="text-sm text-gray-600 ml-1">vs last period</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Export Summary */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-blue-900">Quick Export</h3>
              <p className="text-sm text-blue-700">Export current analytics data for {timeRange} period</p>
            </div>
            <Button 
              onClick={() => handleExportReport('csv')}
              disabled={isExporting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Download className="mr-2 h-4 w-4" />
              {isExporting ? 'Processing...' : 'Download Report'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Analytics Tabs */}
      <Tabs defaultValue="revenue" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="revenue">Revenue Analysis</TabsTrigger>
          <TabsTrigger value="occupancy">Occupancy Trends</TabsTrigger>
          <TabsTrigger value="performance">Hotel Performance</TabsTrigger>
          <TabsTrigger value="guest">Guest Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RevenueChart data={revenue?.monthlyData || []} />
            
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Revenue Breakdown</CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleExportReport('csv')}
                    disabled={isExporting}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Room Revenue</span>
                    <span className="font-semibold">$89,450 (85%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Breakfast Revenue</span>
                    <span className="font-semibold">$12,340 (12%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '12%' }}></div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Other Services</span>
                    <span className="font-semibold">$3,210 (3%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '3%' }}></div>
                  </div>
                  
                  <div className="border-t pt-4 mt-6">
                    <div className="flex justify-between items-center font-bold">
                      <span>Total Revenue</span>
                      <span>$105,000</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="occupancy" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Occupancy Rate Trends</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    const data = {
                      occupancyRate: analytics?.occupancyRate || 78,
                      occupancyGrowth: analytics?.occupancyGrowth || 8,
                      timeRange
                    };
                    exportToJSON(data, `occupancy-data-${timeRange}.json`);
                    toast.success('Occupancy data exported!');
                  }}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <Users className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg font-medium">Occupancy Chart</p>
                  <p className="text-sm">Current occupancy: {analytics?.occupancyRate || 78}%</p>
                  <p className="text-xs text-green-600 mt-2">+{analytics?.occupancyGrowth || 8}% from last period</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Hotels</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from({ length: 5 }, (_, i) => (
                    <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Paradise Resort #{i + 1}</p>
                        <p className="text-sm text-gray-600">{90 - i * 5}% occupancy</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">${(20000 - i * 3000).toLocaleString()}</p>
                        <p className="text-sm text-gray-600">revenue</p>
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
                    <div className="flex justify-between text-sm mb-1">
                      <span>Average Daily Rate</span>
                      <span>85%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Revenue Per Room</span>
                      <span>72%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '72%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Guest Satisfaction</span>
                      <span>95%</span>
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

        <TabsContent value="guest" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Guest Analytics</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    const guestData = {
                      totalGuests: (bookings?.length || 0) * 2.3,
                      avgStayDuration: 2.4,
                      returnGuests: '23%',
                      timeRange
                    };
                    exportToJSON(guestData, `guest-analytics-${timeRange}.json`);
                    toast.success('Guest analytics exported!');
                  }}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <Users className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg font-medium">Guest Analytics Chart</p>
                  <p className="text-sm">Total guests served: {Math.round((bookings?.length || 0) * 2.3)}</p>
                  <p className="text-xs text-blue-600 mt-2">Average stay: 2.4 nights</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}