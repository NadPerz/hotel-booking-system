'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getHashtagById } from '@/features/event/lib/event-api';
import HashtagForm from '@/features/event/hashtags/HashtagForm';

interface Hashtag {
  id: string;
  hashtagName: string;
}

const EditHashtagPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const [hashtag, setHashtag] = useState<Hashtag  | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchHashtag = async () => {
        try {
          const hashtagData = await getHashtagById(id as string);
          setHashtag(hashtagData);
        } catch (error) {
          console.error('Failed to fetch hashtag for editing:', error);
          router.push('/event/hashtags');
        } finally {
          setLoading(false);
        }
      };
      fetchHashtag();
    }
  }, [id, router]);

  if (loading) {
    return <div>Loading hashtag details...</div>;
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Edit Hashtag </h1>
      {hashtag ? (
        <HashtagForm hashtag={hashtag} onSuccess={() => router.push('/event/hashtags')} />
      ) : (
        <div>Hashtag not found.</div>
      )}
    </div>
  );
};

export default EditHashtagPage;