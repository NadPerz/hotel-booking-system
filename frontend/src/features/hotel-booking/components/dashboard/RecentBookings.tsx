"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, ArrowRight, Clock } from 'lucide-react';
import { Booking } from '../../types/booking.types';
import { formatDate } from '../../lib/formatters';

interface RecentBookingsProps {
  bookings: Booking[];
  onViewAll?: () => void;
}

export default function RecentBookings({ bookings, onViewAll }: RecentBookingsProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Recent Bookings</CardTitle>
          {onViewAll && (
            <Button variant="ghost" size="sm" onClick={onViewAll}>
              View All
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {bookings.length > 0 ? (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <Calendar className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      Booking #{booking.id.slice(-8).toUpperCase()}
                    </p>
                    <div className="flex items-center space-x-2 text-xs text-gray-600">
                      <Clock className="h-3 w-3" />
                      <span>{formatDate(booking.startDate)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="text-right">
                    <p className="font-medium text-sm">${booking.totalPrice}</p>
                    <p className="text-xs text-gray-600">{booking.currency}</p>
                  </div>
                  <Badge 
                    variant={booking.paymentStatus ? "default" : "secondary"}
                    className={`text-xs ${
                      booking.paymentStatus 
                        ? "bg-green-100 text-green-800" 
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {booking.paymentStatus ? 'Paid' : 'Pending'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500 font-medium">No recent bookings found</p>
            <p className="text-sm text-gray-400 mt-1">
              Bookings will appear here once customers start booking
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}