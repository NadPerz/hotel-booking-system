'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getOrganizerById } from '@/features/event/lib/event-api';
import OrganizerForm from '@/features/event/organizers/OrganizerForm';

interface Organizer {
  id: string;
  organizerName: string;
  contactEmail: string;
  contactPhone: string;
  organization: string;
}

const EditOrganizerPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const [organizer, setOrganizer] = useState<Organizer | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchOrganizer = async () => {
        try {
          const organizerData = await getOrganizerById(id as string);
          setOrganizer(organizerData);
        } catch (error) {
          console.error('Failed to fetch organizer for editing:', error);
          router.push('/admin/event/organizers');
        } finally {
          setLoading(false);
        }
      };
      fetchOrganizer();
    }
  }, [id, router]);

  if (loading) {
    return <div>Loading organizer details...</div>;
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Edit Organizer</h1>
      {organizer ? (
        <OrganizerForm organizer={organizer} onSuccess={() => router.push('/admin/event/organizers')} />
      ) : (
        <div>Organizer not found.</div>
      )}
    </div>
  );
};

export default EditOrganizerPage;