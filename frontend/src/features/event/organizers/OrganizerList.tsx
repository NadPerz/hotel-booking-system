
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getOrganizers, deleteOrganizer } from '../lib/event-api';
import Link from 'next/link';

interface Organizer {
  id: string;
  organizerName: string;
  contactEmail: string;
  contactPhone: string;
  organization: string;
}

const OrganizerList = () => {
  const [organizers, setOrganizers] = useState<Organizer[]>([]);

  useEffect(() => {
    const fetchOrganizers = async () => {
      try {
        const data = await getOrganizers();
        setOrganizers(data);
      } catch (error) {
        console.error('Failed to fetch organizers:', error);
      }
    };
    fetchOrganizers();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteOrganizer(id);
      setOrganizers(organizers.filter((organizer) => organizer.id !== id));
    } catch (error) {
      console.error('Failed to delete organizer:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Organizers</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Organizer Name</TableHead>
              <TableHead>Contact Email</TableHead>
              <TableHead>Contact Phone</TableHead>
              <TableHead>Organization</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {organizers.map((organizer) => (
              <TableRow key={organizer.id}>
                <TableCell>{organizer.organizerName}</TableCell>
                <TableCell>{organizer.contactEmail}</TableCell>
                <TableCell>{organizer.contactPhone}</TableCell>
                <TableCell>{organizer.organization}</TableCell>
                <TableCell>
                  <Link href={`/event/organizers/edit/${organizer.id}`} passHref>
                    <Button variant="outline" size="sm" className="mr-2">
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(organizer.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default OrganizerList;
