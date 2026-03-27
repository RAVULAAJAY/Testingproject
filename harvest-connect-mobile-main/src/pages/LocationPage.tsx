import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navigation } from 'lucide-react';
import LocationSelector, { DEFAULT_LOCATION_OPTIONS } from '@/components/Location/LocationSelector';

const LocationPage: React.FC = () => {
  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Find Farmers Near You</h1>
        <p className="text-gray-600 mt-2">Connect directly with local farmers and get fresh produce delivered</p>
      </div>

      <div className="max-w-xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Navigation className="h-5 w-5 text-green-600" />
              Location
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <LocationSelector
              value={null}
              onChange={() => undefined}
              placeholder="Search or select location..."
              locations={DEFAULT_LOCATION_OPTIONS}
              disabled
            />
            <p className="text-xs text-gray-500">Location display only</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LocationPage;
