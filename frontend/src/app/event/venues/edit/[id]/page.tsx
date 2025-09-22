'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getVenueById } from '@/features/event/lib/event-api';
import VenueForm from '@/features/event/venues/VenueForm';


interface Venue {
  id: string;
  venueName: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  capacity: number;
  facilities: string[];
}

const EditVenuePage = () => {
  const router = useRouter();
  const { id } = useParams();
  const [venue, setVenue] = useState<Venue | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchVenue = async () => {
        try {
          const venueData = await getVenueById(id as string);
          setVenue(venueData);
        } catch (error) {
          console.error('Failed to fetch venue for editing:', error);
          // Redirect or show an error message
          router.push('/event/venues'); 
        } finally {
          setLoading(false);
        }
      };
      fetchVenue();
    }
  }, [id, router]);

  if (loading) {
    return <div>Loading venue details...</div>;
  }

  // Pass the fetched venue data to the form component
  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Edit Venue</h1>

     {venue ? (
        <VenueForm venue={venue} onSuccess={() => router.push('/event/venues')} />
      ) : (
        <div>Venue not found.</div>
      )}
    </div>
  );
};

export default EditVenuePage;