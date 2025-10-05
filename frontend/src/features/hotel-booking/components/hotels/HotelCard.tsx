// frontend/src/features/hotel-booking/components/hotels/HotelCard.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Star, Users, Wifi, Car, Utensils, Dumbbell, Edit, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { Hotel } from '../../types/hotel.types';

interface HotelCardProps {
  hotel: Hotel;
  onEdit?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
}

export default function HotelCard({ hotel, onEdit, onDelete, showActions = true }: HotelCardProps) {
  const amenityIcons = {
    freeWifi: Wifi,
    freeParking: Car,
    restaurant: Utensils,
    gym: Dumbbell,
  };

  const getAmenities = () => {
    const amenities = [];
    if (hotel.freeWifi) amenities.push({ key: 'freeWifi', label: 'Free WiFi', icon: Wifi });
    if (hotel.freeParking) amenities.push({ key: 'freeParking', label: 'Free Parking', icon: Car });
    if (hotel.restaurant) amenities.push({ key: 'restaurant', label: 'Restaurant', icon: Utensils });
    if (hotel.gym) amenities.push({ key: 'gym', label: 'Gym', icon: Dumbbell });
    return amenities.slice(0, 4); // Show first 4 amenities
  };

  return (
    <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow duration-200">
      {/* ✅ Hotel Image with MinIO signed URL */}
      <div className="relative h-48 bg-gray-200">
        {hotel.imageUrl ? (
          <Image
            src={hotel.imageUrl}
            alt={hotel.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => console.log('❌ Failed to load hotel image:', hotel.imageUrl)}
          />
        ) : (
          <div className="h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200">
            <div className="text-center text-gray-600">
              <div className="text-4xl mb-2">🏨</div>
              <p className="text-sm">No Image</p>
            </div>
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="bg-white/90">
            Draft
          </Badge>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="absolute top-3 right-3 flex gap-2">
            {onEdit && (
              <Button size="sm" variant="outline" onClick={onEdit} className="bg-white/90">
                <Edit className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button size="sm" variant="destructive" onClick={onDelete} className="bg-red-500/90">
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </div>

      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg line-clamp-1">{hotel.title}</CardTitle>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>4.5</span>
          </div>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="line-clamp-1">{hotel.city}, {hotel.country}</span>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-sm text-gray-600 line-clamp-2 mb-4">
          {hotel.description}
        </p>

        {/* Amenities */}
        <div className="flex flex-wrap gap-2 mb-4">
          {getAmenities().map((amenity) => {
            const Icon = amenity.icon;
            return (
              <div key={amenity.key} className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded">
                <Icon className="h-3 w-3" />
                <span>{amenity.label}</span>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <div className="text-sm text-gray-500">
            Created {new Date(hotel.createdAt).toLocaleDateString()}
          </div>
          <Button variant="outline" size="sm">
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}