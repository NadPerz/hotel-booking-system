"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Clock, Users, X, ArrowRight } from 'lucide-react';
import { Booking } from '../../types/booking.types';

interface AlertsPanelProps {
  conflicts: Booking[];
}

export default function AlertsPanel({ conflicts }: AlertsPanelProps) {
  const alerts = [
    {
      id: 1,
      type: 'conflict',
      title: 'Booking Conflicts Detected',
      message: `${conflicts.length} booking conflicts require immediate attention`,
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      action: 'Resolve Now',
      href: '/bookings/conflicts',
      priority: 'high'
    },
    {
      id: 2,
      type: 'pending',
      title: 'Pending Payments',
      message: '5 bookings awaiting payment confirmation',
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      action: 'Review',
      href: '/bookings?status=pending',
      priority: 'medium'
    },
    {
      id: 3,
      type: 'capacity',
      title: 'High Occupancy Alert',
      message: 'Paradise Resort is 95% booked for next weekend',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      action: 'View Details',
      href: '/dashboard/hotels',
      priority: 'low'
    }
  ].filter(alert => {
    // Only show conflict alert if there are actual conflicts
    if (alert.type === 'conflict' && conflicts.length === 0) {
      return false;
    }
    return true;
  });

  if (alerts.length === 0) {
    return null;
  }

  return (
    <Card className="border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-orange-600 mr-2" />
            <CardTitle className="text-orange-800">
              Alerts & Notifications
            </CardTitle>
            <Badge variant="destructive" className="ml-3">
              {alerts.length}
            </Badge>
          </div>
          <Button variant="ghost" size="sm" className="text-orange-600 hover:text-orange-700">
            View All
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`flex items-center justify-between p-4 rounded-lg border transition-all hover:shadow-sm ${alert.bgColor} ${alert.borderColor}`}
          >
            <div className="flex items-center space-x-3 flex-1">
              <div className={`p-2 rounded-full bg-white shadow-sm`}>
                <alert.icon className={`h-4 w-4 ${alert.color}`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <p className="font-medium text-gray-800 text-sm">{alert.title}</p>
                  <Badge 
                    variant={alert.priority === 'high' ? 'destructive' : alert.priority === 'medium' ? 'secondary' : 'outline'}
                    className="text-xs"
                  >
                    {alert.priority}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 ml-4">
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.location.href = alert.href}
                className="bg-white hover:bg-gray-50 border-gray-200"
              >
                {alert.action}
              </Button>
              <Button size="sm" variant="ghost" className="text-gray-400 hover:text-gray-600">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}