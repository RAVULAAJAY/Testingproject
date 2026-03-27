import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navigation } from 'lucide-react';
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
    </div>
  );
};

export default LocationPage;
