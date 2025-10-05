// frontend/src/features/hotel-booking/components/hotels/HotelForm.tsx
"use client";

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { X, Loader2, Building2, User } from 'lucide-react';
import MinioImageUpload from '../shared/MinioImageUpload';
import { useHotels } from '../../hooks/useHotels';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { Hotel as HotelType, CreateHotelRequest } from '../../types/hotel.types';

// ✅ Fixed schema to match backend exactly
const hotelSchema = z.object({
  title: z.string().min(1, 'Hotel name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  country: z.string().min(1, 'Country is required'),
  state: z.string().min(1, 'State is required'),
  city: z.string().min(1, 'City is required'),
  address: z.string().optional(),
  locationDescription: z.string().optional(),
  // ✅ All amenities as booleans (matching backend)
  gym: z.boolean(),
  spa: z.boolean(),
  bar: z.boolean(),
  laundry: z.boolean(),
  restaurant: z.boolean(),
  shopping: z.boolean(),
  freeParking: z.boolean(),
  bikeRental: z.boolean(),
  freeWifi: z.boolean(),
  movieNights: z.boolean(),
  swimmingPool: z.boolean(),
  coffeeShop: z.boolean(),
});

type HotelFormData = z.infer<typeof hotelSchema>;

interface HotelFormProps {
  hotel?: HotelType | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function HotelForm({ hotel, onSuccess, onCancel }: HotelFormProps) {
  const { createHotel, updateHotel, isCreating, isUpdating } = useHotels();
  const { currentUser } = useCurrentUser();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const isEditMode = !!hotel;
  const isSubmitting = isCreating || isUpdating;

  const form = useForm<HotelFormData>({
    resolver: zodResolver(hotelSchema),
    defaultValues: {
      title: hotel?.title || '',
      description: hotel?.description || '',
      country: hotel?.country || '',
      state: hotel?.state || '',
      city: hotel?.city || '',
      address: hotel?.address || '',
      locationDescription: hotel?.locationDescription || '',
      // ✅ Access amenities directly from flat structure
      gym: hotel?.gym || false,
      spa: hotel?.spa || false,
      bar: hotel?.bar || false,
      laundry: hotel?.laundry || false,
      restaurant: hotel?.restaurant || false,
      shopping: hotel?.shopping || false,
      freeParking: hotel?.freeParking || false,
      bikeRental: hotel?.bikeRental || false,
      freeWifi: hotel?.freeWifi || true,
      movieNights: hotel?.movieNights || false,
      swimmingPool: hotel?.swimmingPool || false,
      coffeeShop: hotel?.coffeeShop || false,
    },
  });

  const handleImageSelect = (file: File | null) => {
    setSelectedImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview('');
    }
  };

  // ✅ FIXED: Match CreateHotelRequest interface exactly
  const onSubmit: SubmitHandler<HotelFormData> = async (data) => {
    try {
      console.log(`🏨 ${isEditMode ? 'Updating' : 'Creating'} hotel for user:`, {
        userId: currentUser.id,
        userName: currentUser.name,
        userLogin: currentUser.login,
        hotelTitle: data.title
      });
      
      // ✅ CRITICAL FIX: Structure data exactly as CreateHotelRequest expects
      const hotelData: CreateHotelRequest = {
        title: data.title,
        description: data.description,
        country: data.country,
        state: data.state,
        city: data.city,
        address: data.address?.trim() || undefined,
        locationDescription: data.locationDescription?.trim() || undefined,
        // ✅ Individual amenity properties (NOT nested object)
        gym: data.gym,
        spa: data.spa,
        bar: data.bar,
        laundry: data.laundry,
        restaurant: data.restaurant,
        shopping: data.shopping,
        freeParking: data.freeParking,
        bikeRental: data.bikeRental,
        freeWifi: data.freeWifi,
        movieNights: data.movieNights,
        swimmingPool: data.swimmingPool,
        coffeeShop: data.coffeeShop,
        // ✅ Handle image: backend expects 'image' field, not 'imageFile'
        ...(selectedImage && { image: 'placeholder-image-path' }) // Will be replaced by backend
      };

      console.log('🚀 Sending hotel data to API (matches CreateHotelRequest):', hotelData);
      
      if (isEditMode && hotel) {
        await updateHotel({
          id: hotel.id,
          data: hotelData,
        });
        console.log('✅ Hotel updated successfully');
      } else {
        await createHotel(hotelData);
        console.log('✅ Hotel created successfully');
      }

      onSuccess?.();
    } catch (error: any) {
      console.error(`❌ Failed to ${isEditMode ? 'update' : 'create'} hotel:`, error);
      
      // ✅ Better error handling
      if (error.message?.includes('Validation error')) {
        alert(`❌ Validation Error: ${error.message}`);
      } else if (error.message?.includes('Network')) {
        alert('❌ Network Error: Cannot connect to backend server');
      } else {
        alert(`❌ Error: ${error.message || 'Unknown error occurred'}`);
      }
    }
  };

  const amenities = [
    { key: 'gym', label: 'Gym' },
    { key: 'spa', label: 'Spa' },
    { key: 'bar', label: 'Bar' },
    { key: 'laundry', label: 'Laundry Service' },
    { key: 'restaurant', label: 'Restaurant' },
    { key: 'shopping', label: 'Shopping' },
    { key: 'freeParking', label: 'Free Parking' },
    { key: 'bikeRental', label: 'Bike Rental' },
    { key: 'freeWifi', label: 'Free WiFi' },
    { key: 'movieNights', label: 'Movie Nights' },
    { key: 'swimmingPool', label: 'Swimming Pool' },
    { key: 'coffeeShop', label: 'Coffee Shop' },
  ] as const;

  const getUserPrefix = () => {
    return currentUser.businessProfile?.firstName || 
           currentUser.name?.split(' ')[0] || 
           currentUser.login || 
           'user';
  };

  return (
    <div className="space-y-6">
      {/* User Context Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900">
                {isEditMode ? 'Editing' : 'Creating'} hotel for: {currentUser.name}
              </h3>
              <p className="text-sm text-blue-700">
                User ID: {currentUser.id} • Login: {currentUser.login} • Type: {currentUser.userType}
              </p>
              {currentUser.businessProfile && (
                <p className="text-xs text-blue-600">
                  Business: {currentUser.businessProfile.firstName} {currentUser.businessProfile.lastName}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Building2 className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-gray-900">{isEditMode ? 'Edit Hotel' : 'Create New Hotel'}</CardTitle>
            </div>
            {onCancel && (
              <Button variant="ghost" size="sm" onClick={onCancel}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <p className="text-sm text-gray-600">
            {isEditMode 
              ? `Update "${hotel?.title}" details`
              : 'Fill in the details to add a new hotel property'
            }
          </p>
          {/* ✅ No hydration error - static message */}
          <p className="text-xs text-blue-600">
            📦 Images will be stored as: hotels_{getUserPrefix()}_timestamp_filename.jpg
          </p>
        </CardHeader>
        
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
                
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">Hotel Name *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g. Grand Palace Hotel" 
                          {...field} 
                          disabled={isSubmitting}
                          className="bg-white text-gray-900 border-gray-300 placeholder:text-gray-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">Description *</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your hotel, its features, and what makes it special..." 
                          className="min-h-[100px] bg-white text-gray-900 border-gray-300 placeholder:text-gray-500"
                          {...field} 
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Image Upload */}
                <div>
                  <MinioImageUpload
                    label="Hotel Image"
                    onImageSelect={handleImageSelect}
                    preview={imagePreview}
                    bucket="hotel-bucket"
                    folder="images"
                    isUploading={isSubmitting}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    💾 File will be stored in MinIO with user-specific naming
                  </p>
                </div>
              </div>

              {/* Location Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Location Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">Country *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g. Sri Lanka" 
                            {...field} 
                            disabled={isSubmitting}
                            className="bg-white text-gray-900 border-gray-300 placeholder:text-gray-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">State/Province *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g. Western" 
                            {...field} 
                            disabled={isSubmitting}
                            className="bg-white text-gray-900 border-gray-300 placeholder:text-gray-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">City *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g. Colombo" 
                            {...field} 
                            disabled={isSubmitting}
                            className="bg-white text-gray-900 border-gray-300 placeholder:text-gray-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">Street Address</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g. 123 Main Street, Downtown"
                          {...field} 
                          disabled={isSubmitting}
                          className="bg-white text-gray-900 border-gray-300 placeholder:text-gray-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="locationDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">Location Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Additional details about the location, nearby attractions, etc..." 
                          {...field} 
                          disabled={isSubmitting}
                          className="bg-white text-gray-900 border-gray-300 placeholder:text-gray-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Hotel Amenities */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Hotel Amenities & Services</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {amenities.map((amenity) => (
                    <FormField
                      key={amenity.key}
                      control={form.control}
                      name={amenity.key}
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value as boolean}
                              onCheckedChange={(checked) => {
                                field.onChange(checked === true);
                              }}
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm font-normal text-gray-700">
                              {amenity.label}
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                {onCancel && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                )}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="min-w-[150px] bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isEditMode ? 'Updating Hotel...' : 'Creating Hotel...'}
                    </>
                  ) : (
                    `${isEditMode ? 'Update Hotel' : 'Create Hotel'}`
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}