"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, DollarSign, TrendingUp, Calendar, Users } from 'lucide-react';
import RevenueChart from './RevenueChart';
import { useAnalytics } from '../../hooks/useAnalytics';
import LoadingSpinner from '../shared/LoadingSpinner';

export default function RevenuePage() {
  const [timeRange, setTimeRange] = useState('month');
  const { revenue, analytics, isLoading } = useAnalytics();

  const handleExportReport = () => {
    // Create CSV data for revenue report
    const csvData = [
      ['Month', 'Revenue', 'Bookings', 'Avg Rate'],
      ...(revenue?.monthlyData || []).map(item => [
        item.month,
        item.revenue,
        item.bookings,
        Math.round(item.revenue / item.bookings || 0)
      ])
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `revenue-report-${timeRange}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const revenueStats = [
    {
      title: 'Total Revenue',
      value: `$${(revenue?.total || 125000).toLocaleString()}`,
      change: `+${revenue?.growth || 15.2}%`,
      icon: DollarSign,
      color: 'text-green-600',
    },
    {
      title: 'Monthly Average',
      value: `$${Math.round((revenue?.total || 125000) / 6).toLocaleString()}`,
      change: '+8.5%',
      icon: TrendingUp,
      color: 'text-blue-600',
    },
    {
      title: 'Revenue/Booking',
      value: '$365',
      change: '+12%',
      icon: Calendar,
      color: 'text-purple-600',
    },
    {
      title: 'Revenue/Guest',
      value: '$182',
      change: '+6%',
      icon: Users,
      color: 'text-orange-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Revenue Analysis</h1>
          <p className="text-gray-600 mt-1">
            Track and analyze your hotel revenue performance
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
          
          <Button variant="outline" onClick={handleExportReport}>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {revenueStats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className="p-3 rounded-full bg-gray-50">
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm font-medium text-green-600">{stat.change}</span>
                <span className="text-sm text-gray-600 ml-1">vs last period</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <RevenueChart data={revenue?.monthlyData || []} />
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Revenue Breakdown</CardTitle>
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
                  <span>${(revenue?.total || 125000).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Performance Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Month</th>
                  <th className="text-right p-2">Revenue</th>
                  <th className="text-right p-2">Bookings</th>
                  <th className="text-right p-2">Avg Rate</th>
                  <th className="text-right p-2">Growth</th>
                </tr>
              </thead>
              <tbody>
                {(revenue?.monthlyData || []).map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2 font-medium">{item.month}</td>
                    <td className="p-2 text-right">${item.revenue.toLocaleString()}</td>
                    <td className="p-2 text-right">{item.bookings}</td>
                    <td className="p-2 text-right">${Math.round(item.revenue / item.bookings || 0)}</td>
                    <td className="p-2 text-right text-green-600">+{Math.round(Math.random() * 20)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}