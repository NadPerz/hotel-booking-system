'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getCategoryById } from '@/features/event/lib/event-api';
import CategoryForm from '@/features/event/categories/CategoryForm';

interface Category {
  id: string;
  categoryName: string;
  description: string;
}

const EditCategoryPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const [category, setCategory] = useState<Category | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchCategory = async () => {
        try {
          const categoryData = await getCategoryById(id as string);
          setCategory(categoryData);
        } catch (error) {
          console.error('Failed to fetch category for editing:', error);
          router.push('/event/categories');
        } finally {
          setLoading(false);
        }
      };
      fetchCategory();
    }
  }, [id, router]);

  if (loading) {
    return <div>Loading category details...</div>;
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Edit Category</h1>
      {category ? (
        <CategoryForm category={category} onSuccess={() => router.push('/event/categories')} />
      ) : (
        <div>Category not found.</div>
      )}
    </div>
  );
};

export default EditCategoryPage;