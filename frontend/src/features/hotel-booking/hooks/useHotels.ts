import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { hotelApi } from '../services/api/hotels.api';
import { Hotel, CreateHotelRequest } from '../types/hotel.types';
import { toast } from 'react-hot-toast';

export const useHotels = () => {
  const queryClient = useQueryClient();

  // Get all hotels
  const {
    data: hotels = [],
    isLoading,
    error
  } = useQuery<Hotel[]>({
    queryKey: ['hotels'],
    queryFn: hotelApi.getHotels,
  });

  // Get my hotels
  const {
    data: myHotels = [],
    isLoading: isLoadingMyHotels
  } = useQuery<Hotel[]>({
    queryKey: ['my-hotels'],
    queryFn: hotelApi.getMyHotels,
  });

  // Create hotel mutation
  const createHotelMutation = useMutation({
    mutationFn: (data: CreateHotelRequest & { imageFile?: File }) => hotelApi.createHotel(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotels'] });
      queryClient.invalidateQueries({ queryKey: ['my-hotels'] });
      toast.success('Hotel created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create hotel');
    },
  });

  // Update hotel mutation
  const updateHotelMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateHotelRequest> }) => 
      hotelApi.updateHotel(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotels'] });
      queryClient.invalidateQueries({ queryKey: ['my-hotels'] });
      toast.success('Hotel updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update hotel');
    },
  });

  // Delete hotel mutation
  const deleteHotelMutation = useMutation({
    mutationFn: (id: string) => hotelApi.deleteHotel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotels'] });
      queryClient.invalidateQueries({ queryKey: ['my-hotels'] });
      toast.success('Hotel deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete hotel');
    },
  });

  return {
    hotels,
    myHotels,
    isLoading: isLoading || isLoadingMyHotels,
    error,
    createHotel: createHotelMutation.mutateAsync,
    updateHotel: updateHotelMutation.mutateAsync,
    deleteHotel: deleteHotelMutation.mutateAsync,
    isCreating: createHotelMutation.isPending,
    isUpdating: updateHotelMutation.isPending,
    isDeleting: deleteHotelMutation.isPending,
  };
};

// Get single hotel
export const useHotel = (id: string) => {
  return useQuery<Hotel>({
    queryKey: ['hotel', id],
    queryFn: () => hotelApi.getHotel(id),
    enabled: !!id,
  });
};