import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Navigation } from 'lucide-react';
import LocationSelector, { DEFAULT_LOCATION_OPTIONS, LocationOption } from '@/components/Location/LocationSelector';

const buildMapsSearchUrl = (location: LocationOption) => {
  if (location.coordinates) {
    return `https://www.google.com/maps/search/?api=1&query=${location.coordinates.lat},${location.coordinates.lng}`;
  }

  const query = [location.name, location.city, location.state].filter(Boolean).join(', ');
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
};

const LocationPage: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<LocationOption | null>(null);
  const [locationError, setLocationError] = useState('');

  const handleLocationChange = (location: LocationOption | null) => {
    setLocationError('');
    const nextLocation = location ? (location.coordinates ? location : DEFAULT_LOCATION_OPTIONS.find((entry) => entry.city === location.city || entry.name === location.name) ?? location) : null;
    setSelectedLocation(nextLocation);

    if (nextLocation) {
      const mapsWindow = window.open(buildMapsSearchUrl(nextLocation), '_blank', 'noopener,noreferrer');
      if (mapsWindow) {
        mapsWindow.opener = null;
      }
    }
  };

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Find Farmers Near You</h1>
        <p className="text-gray-600 mt-2">Connect directly with local farmers and get fresh produce delivered</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Navigation className="h-5 w-5 text-green-600" />
                Location
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <LocationSelector
                value={selectedLocation}
                onChange={handleLocationChange}
                placeholder="Search or select location..."
                locations={DEFAULT_LOCATION_OPTIONS}
              />
              <p className="text-xs text-gray-500">
                {selectedLocation ? `Opening ${selectedLocation.city} in Google Maps` : 'Select a location to open Google Maps'}
              </p>
              {locationError && <p className="text-xs text-red-600">{locationError}</p>}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Card className="border-2 border-dashed border-green-200 bg-gradient-to-br from-green-50 via-white to-blue-50 min-h-[320px] flex items-center justify-center">
            <CardContent className="text-center space-y-2">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-700">
                <MapPin className="h-6 w-6" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Location only</h2>
              <p className="text-sm text-gray-600 max-w-md">
                The page now keeps only the location selector. Choosing a location opens Google Maps directly.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LocationPage;
