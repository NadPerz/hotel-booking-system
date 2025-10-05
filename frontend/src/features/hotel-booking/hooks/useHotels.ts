// frontend/src/features/hotel-booking/hooks/useHotels.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { hotelsApi } from '../services/api/hotels.api';
import { useCurrentUser } from './useCurrentUser';
import { Hotel, CreateHotelRequest } from '../types/hotel.types';
import { toast } from 'sonner';

export const useHotels = () => {
  const queryClient = useQueryClient();
  const { currentUser } = useCurrentUser();

  // Get all hotels
  const {
    data: hotels = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['hotels'],
    queryFn: () => {
      console.log('🔄 React Query: Fetching all hotels...');
      return hotelsApi.getAll();
    },
  });

  // Get my hotels (user-specific)
  const {
    data: myHotels = [],
    isLoading: isLoadingMyHotels,
    error: myHotelsError
  } = useQuery({
    queryKey: ['my-hotels', currentUser.id],
    queryFn: () => {
      console.log('🔄 React Query: Fetching MY hotels for user:', currentUser.name);
      return hotelsApi.getMyHotels(currentUser);
    },
    enabled: !!currentUser.id,
  });

  // Create hotel mutation
  const createHotelMutation = useMutation({
    mutationFn: (data: CreateHotelRequest) => {
      console.log('🔄 Creating hotel via mutation for user:', currentUser.name);
      return hotelsApi.create(data, currentUser);
    },
    onSuccess: (createdHotel: any) => {
      console.log('✅ Hotel created successfully:', createdHotel);
      queryClient.invalidateQueries({ queryKey: ['hotels'] });
      queryClient.invalidateQueries({ queryKey: ['my-hotels', currentUser.id] });
      toast.success(`Hotel "${createdHotel.data?.title}" created successfully!`);
    },
    onError: (error: any) => {
      console.error('❌ Hotel creation failed:', error);
      toast.error(error?.response?.data?.message || 'Failed to create hotel');
    },
  });

  // Update hotel mutation
  const updateHotelMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateHotelRequest> }) => {
      console.log('🔄 Updating hotel via mutation:', id);
      return hotelsApi.update(id, data, currentUser);
    },
    onSuccess: (updatedHotel: any) => {
      console.log('✅ Hotel updated successfully:', updatedHotel);
      queryClient.invalidateQueries({ queryKey: ['hotels'] });
      queryClient.invalidateQueries({ queryKey: ['my-hotels', currentUser.id] });
      toast.success('Hotel updated successfully!');
    },
    onError: (error: any) => {
      console.error('❌ Hotel update failed:', error);
      toast.error(error?.response?.data?.message || 'Failed to update hotel');
    },
  });

  // Delete hotel mutation
  const deleteHotelMutation = useMutation({
    mutationFn: (id: string) => hotelsApi.delete(id, currentUser),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotels'] });
      queryClient.invalidateQueries({ queryKey: ['my-hotels', currentUser.id] });
      toast.success('Hotel deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to delete hotel');
    },
  });

  // Debug log
  console.log('🏨 useHotels Hook State:', {
    currentUser: {
      id: currentUser.id,
      name: currentUser.name,
      userType: currentUser.userType
    },
    totalHotels: hotels.length,
    myHotels: myHotels.length,
    isLoading,
    isLoadingMyHotels,
    hasError: !!error || !!myHotelsError
  });

  return {
    // Data
    hotels,
    myHotels,
    currentUser, // Include current user in return
    
    // Loading states
    isLoading,
    isLoadingMyHotels,
    error: error || myHotelsError,
    
    // Actions
    createHotel: createHotelMutation.mutateAsync,
    updateHotel: updateHotelMutation.mutateAsync,
    deleteHotel: deleteHotelMutation.mutateAsync,
    
    // Mutation states
    isCreating: createHotelMutation.isPending,
    isUpdating: updateHotelMutation.isPending,
    isDeleting: deleteHotelMutation.isPending,
  };
};

export const useHotel = (id: string) => {
  return useQuery({
    queryKey: ['hotel', id],
    queryFn: () => hotelsApi.getById(id),
    enabled: !!id,
  });
};