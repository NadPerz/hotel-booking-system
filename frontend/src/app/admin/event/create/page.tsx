
'use client';

import React from 'react';
import EventForm from '@/features/event/create/EventForm';

const CreateEventPage = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Create a New Event</h1>
      <EventForm />
    </div>
  );
};

export default CreateEventPage;
