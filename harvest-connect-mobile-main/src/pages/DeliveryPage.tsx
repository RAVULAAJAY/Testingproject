import React, { useState } from 'react';
import DeliveryOptions, { DeliveryMethod, DeliveryDetails } from '@/components/Delivery/DeliveryOptions';
import DeliveryStatus, { DeliveryStatusData, DeliveryStatus as DeliveryStatusType } from '@/components/Delivery/DeliveryStatus';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const DeliveryPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('options');
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryDetails | null>(null);

  // Sample delivery statuses for demo
  const sampleDeliveries: Record<string, DeliveryStatusData> = {
    'active': {
      orderId: 'ORD-2024-001234',
      status: 'on-the-way',
      method: 'farmer-delivery',
      farmerName: 'Rajesh Kumar',
      farmerPhone: '+91 98765 43210',
      farmerImage: undefined,
      estimatedTime: '3:45 PM',
      location: {
        current: 'Sector 51, Noida',
        destination: 'B-123, Sector 62, Noida'
      },
      timeline: {
        confirmed: { time: '10:30 AM - Today', completed: true },
        processing: { time: '11:00 AM - Today', completed: true },
        on_the_way: { time: '1:30 PM - Today', completed: true },
        arriving_soon: { time: '3:30 PM - Today (EST)', completed: false },
        delivered: { time: 'Pending', completed: false }
      }
    },
    'pickup': {
      orderId: 'ORD-2024-001235',
      status: 'confirmed',
      method: 'self-pickup',
      farmerName: 'Green Valley Farms',
      farmerPhone: '+91 98765 43210',
      location: {
        destination: 'Sector 45, Noida - Farm Gate'
      },
      timeline: {
        confirmed: { time: '2:15 PM - Today', completed: true },
        processing: { time: 'Ready for pickup', completed: true }
      }
    },
    'completed': {
      orderId: 'ORD-2024-001233',
      status: 'delivered',
      method: 'farmer-delivery',
      farmerName: 'Honey Sweet Farm',
      farmerPhone: '+91 97654 32109',
      estimatedTime: '4:30 PM',
      actualTime: '4:28 PM',
      location: {
        destination: 'B-123, Sector 62, Noida'
      },
      timeline: {
        confirmed: { time: '9:00 AM - Mar 18', completed: true },
        processing: { time: '10:00 AM - Mar 18', completed: true },
        on_the_way: { time: '2:15 PM - Mar 19', completed: true },
        arriving_soon: { time: '4:15 PM - Mar 19', completed: true },
        delivered: { time: '4:28 PM - Mar 19', completed: true }
      }
    }
  };

  const handleDeliveryMethodSelect = (method: DeliveryMethod, details: DeliveryDetails) => {
    setSelectedDelivery(details);
    setActiveTab('status');
  };

  const handleContactFarmer = () => {
    alert('Calling farmer...');
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Delivery Management</h1>
          <p className="text-gray-600">Choose delivery method and track your orders</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="options">Delivery Options</TabsTrigger>
            <TabsTrigger value="status">Track Order</TabsTrigger>
            <TabsTrigger value="history">Delivery History</TabsTrigger>
          </TabsList>

          {/* Delivery Options Tab */}
          <TabsContent value="options" className="space-y-4">
            <Card className="p-6">
              <DeliveryOptions
                onDeliveryMethodSelect={handleDeliveryMethodSelect}
                selectedMethod={selectedDelivery?.method}
              />
            </Card>
          </TabsContent>

          {/* Track Order Tab */}
          <TabsContent value="status" className="space-y-4">
            {selectedDelivery ? (
              <>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-blue-800">
                    <strong>Selected:</strong> {selectedDelivery.method === 'self-pickup' 
                      ? `Self Pickup - ${selectedDelivery.pickupLocation}` 
                      : `Farmer Delivery - ${selectedDelivery.deliveryAddress}`}
                  </p>
                </div>
                <Card className="p-6">
                  <DeliveryStatus
                    delivery={sampleDeliveries['active']}
                    onContactFarmer={handleContactFarmer}
                  />
                </Card>
              </>
            ) : (
              <Card className="p-12 text-center">
                <p className="text-gray-600 mb-4">Select a delivery method first</p>
                <Button onClick={() => setActiveTab('options')} className="bg-blue-600 hover:bg-blue-700">
                  Choose Delivery Method
                </Button>
              </Card>
            )}
          </TabsContent>

          {/* Delivery History Tab */}
          <TabsContent value="history" className="space-y-4">
            <div className="space-y-4">
              {/* Active Delivery */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Active Delivery</h3>
                <Card className="p-4">
                  <DeliveryStatus
                    delivery={sampleDeliveries['active']}
                    onContactFarmer={handleContactFarmer}
                  />
                </Card>
              </div>

              {/* Pickup Order */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready for Pickup</h3>
                <Card className="p-4">
                  <DeliveryStatus
                    delivery={sampleDeliveries['pickup']}
                    onContactFarmer={handleContactFarmer}
                  />
                </Card>
              </div>

              {/* Completed Delivery */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Past Deliveries</h3>
                <Card className="p-4">
                  <DeliveryStatus
                    delivery={sampleDeliveries['completed']}
                    onContactFarmer={handleContactFarmer}
                  />
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DeliveryPage;
