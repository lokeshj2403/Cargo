'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, MapPin, PackageCheck } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Placeholder data structure for tracking info
interface TrackingInfo {
    shipmentId: string;
    status: 'Pending Pickup' | 'In Transit' | 'Out for Delivery' | 'Delivered' | 'Delayed';
    currentLocation: string;
    estimatedDelivery: string;
    updates: { timestamp: string; message: string }[];
}

export default function TrackLoadPage() {
  const [shipmentId, setShipmentId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [trackingInfo, setTrackingInfo] = useState<TrackingInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTrackShipment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTrackingInfo(null);
    setError(null);

    console.log('Tracking Shipment:', shipmentId);

    // Simulate API call to fetch tracking data
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Replace with actual API call
    if (shipmentId === 'TEST12345') {
      setTrackingInfo({
        shipmentId: 'TEST12345',
        status: 'In Transit',
        currentLocation: 'Chicago, IL',
        estimatedDelivery: '2024-07-18',
        updates: [
          { timestamp: '2024-07-16 10:00 AM', message: 'Picked up from Los Angeles, CA' },
          { timestamp: '2024-07-17 08:30 PM', message: 'Arrived at sorting facility in Denver, CO' },
           { timestamp: '2024-07-18 09:15 AM', message: 'Departed sorting facility in Chicago, IL' },
        ],
      });
    } else if (shipmentId === 'DELIVERED67') {
        setTrackingInfo({
        shipmentId: 'DELIVERED67',
        status: 'Delivered',
        currentLocation: 'New York, NY',
        estimatedDelivery: '2024-07-15',
        updates: [
            { timestamp: '2024-07-13 09:00 AM', message: 'Picked up from Miami, FL' },
            { timestamp: '2024-07-15 11:45 AM', message: 'Delivered to destination in New York, NY' },
        ],
        });
    }
    else {
      setError('Shipment ID not found. Please check the ID and try again.');
    }

    setIsLoading(false);
  };

  const getStatusColor = (status: TrackingInfo['status']) => {
    switch (status) {
      case 'Delivered': return 'text-green-600';
      case 'In Transit':
      case 'Out for Delivery': return 'text-blue-600';
      case 'Delayed': return 'text-red-600';
      case 'Pending Pickup':
      default: return 'text-yellow-600';
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container max-w-screen-md mx-auto py-12 px-4">
        <Card className="w-full shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-primary">Track Your Load</CardTitle>
            <CardDescription>Enter your Shipment ID to see the current status.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleTrackShipment} className="flex items-end gap-4 mb-8">
              <div className="flex-grow space-y-2">
                <Label htmlFor="shipmentId">Shipment ID</Label>
                <Input
                  id="shipmentId"
                  placeholder="Enter your tracking ID"
                  value={shipmentId}
                  onChange={(e) => setShipmentId(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <Button type="submit" disabled={isLoading || !shipmentId}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Track
              </Button>
            </form>

            {isLoading && (
              <div className="text-center py-8">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                <p className="mt-2 text-muted-foreground">Loading tracking information...</p>
              </div>
            )}

            {error && !isLoading && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {trackingInfo && !isLoading && !error && (
              <div>
                <h3 className="text-xl font-semibold mb-4 text-primary">Tracking Details for #{trackingInfo.shipmentId}</h3>
                 <div className={`mb-6 p-4 rounded-md border ${getStatusColor(trackingInfo.status).replace('text-', 'bg-').replace('-600', '/10')} ${getStatusColor(trackingInfo.status).replace('text-', 'border-').replace('-600', '/50')}`}>
                    <p className="text-lg font-bold flex items-center gap-2">
                        {trackingInfo.status === 'Delivered' ? <PackageCheck className={`inline-block h-6 w-6 ${getStatusColor(trackingInfo.status)}`} /> : <MapPin className={`inline-block h-6 w-6 ${getStatusColor(trackingInfo.status)}`} />}
                        Status: <span className={getStatusColor(trackingInfo.status)}>{trackingInfo.status}</span>
                    </p>
                     <p className="text-sm text-muted-foreground mt-1">Current Location: {trackingInfo.currentLocation}</p>
                    {trackingInfo.status !== 'Delivered' && <p className="text-sm text-muted-foreground">Estimated Delivery: {trackingInfo.estimatedDelivery}</p>}
                </div>

                 <h4 className="text-lg font-semibold mb-3 text-primary">Updates</h4>
                <Separator className="mb-4"/>
                <ul className="space-y-4">
                  {trackingInfo.updates.slice().reverse().map((update, index) => ( // Show latest first
                    <li key={index} className="flex gap-4 text-sm relative pl-6">
                       <span className={`absolute left-0 top-1 h-3 w-3 rounded-full ${index === 0 ? 'bg-primary' : 'bg-muted'}`}></span>
                       <span className="absolute left-[5px] top-[18px] h-[calc(100%-12px)] w-[2px] ${index === trackingInfo.updates.length - 1 ? 'bg-transparent' : 'bg-muted'}"></span>
                       <span className="font-medium w-32 shrink-0 text-muted-foreground">{update.timestamp}</span>
                      <span className="text-foreground">{update.message}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
