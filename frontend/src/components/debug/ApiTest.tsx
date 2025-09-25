"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';

export default function ApiTest() {
  const [testResult, setTestResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const testConnection = async () => {
    setIsLoading(true);
    setTestResult('Testing...');
    
    try {
      // Test basic connection
      const response = await api.get('/hotels');
      setTestResult(`✅ API Connection Success! Found ${response.data?.data?.length || 0} hotels`);
    } catch (error: any) {
      setTestResult(`❌ API Connection Failed: ${error.message}`);
      console.error('API Test Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const testHotelCreation = async () => {
    setIsLoading(true);
    setTestResult('Testing hotel creation...');
    
    try {
      const testHotel = {
        title: "API Test Hotel",
        description: "Testing hotel creation from frontend",
        country: "Sri Lanka",
        state: "Western",
        city: "Colombo",
        locationDescription: "Test location",
        gym: true,
        spa: false,
        bar: true,
        laundry: false,
        restaurant: true,
        shopping: false,
        freeParking: true,
        bikeRental: false,
        freeWifi: true,
        movieNights: false,
        swimmingPool: true,
        coffeeShop: true
      };

      const response = await api.post('/hotels', testHotel);
      setTestResult(`✅ Hotel Created! ID: ${response.data?.data?.id}`);
    } catch (error: any) {
      setTestResult(`❌ Hotel Creation Failed: ${error.response?.data?.message || error.message}`);
      console.error('Hotel Creation Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="font-bold mb-4">API Connection Test</h3>
      <div className="space-y-2 mb-4">
        <Button onClick={testConnection} disabled={isLoading}>
          Test API Connection
        </Button>
        <Button onClick={testHotelCreation} disabled={isLoading} variant="outline">
          Test Hotel Creation
        </Button>
      </div>
      {testResult && (
        <div className={`p-2 rounded ${testResult.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {testResult}
        </div>
      )}
    </div>
  );
}