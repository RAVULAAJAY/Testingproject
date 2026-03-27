import React, { useMemo, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ExternalLink, MapPin, Navigation, Search } from 'lucide-react';
import LocationSelector, { DEFAULT_LOCATION_OPTIONS, LocationOption } from '@/components/Location/LocationSelector';
import NearbyFarmers, { Farmer } from '@/components/Location/NearbyFarmers';
import { useGlobalState } from '@/context/GlobalStateContext';

const buildMapsSearchUrl = (location: LocationOption) => {
  if (location.coordinates) {
    return `https://www.google.com/maps/search/?api=1&query=${location.coordinates.lat},${location.coordinates.lng}`;
  }

  const query = [location.name, location.city, location.state].filter(Boolean).join(', ');
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
};

const normalizeLocationKey = (value: string) => value.trim().toLowerCase();

const LocationPage: React.FC = () => {
  const { users } = useGlobalState();
  const [selectedLocation, setSelectedLocation] = useState<LocationOption | null>(null);
  const [manualLocation, setManualLocation] = useState('');
  const [locationError, setLocationError] = useState('');

  const allFarmers = useMemo(() => {
    return users
      .filter((user) => user.role === 'farmer')
      .map((farmer) => ({
        id: farmer.id,
        name: farmer.farmName || farmer.name,
        avatar: `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Ccircle cx="50" cy="50" r="45" fill="%2322c55e"/%3E%3Ctext x="50" y="60" font-size="40" fill="white" text-anchor="middle" font-family="Arial"%3E${(farmer.farmName || farmer.name).substring(0, 2).toUpperCase()}%3C/text%3E%3C/svg%3E`,
        location: farmer.location,
        distance: Math.random() * 50,
        rating: 4.5 + Math.random() * 0.5,
        totalReviews: Math.floor(100 + Math.random() * 400),
        products: 12 + Math.floor(Math.random() * 20),
        responseTime: '< 1 hour',
        isVerified: true,
        isFeatured: Math.random() > 0.7,
        speciality: (farmer.cropTypes || []).join(', ') || 'Fresh Produce',
        priceRange: '₹20-60/kg',
        description: farmer.farmDetails || 'Quality fresh produce from local farmer.',
      })) as Farmer[];
  }, [users]);

  const nearbyFarmers = useMemo(() => {
    if (!selectedLocation) {
      return [];
    }

    const query = normalizeLocationKey(selectedLocation.city || selectedLocation.name);
    return allFarmers.filter((farmer) => normalizeLocationKey(farmer.location || '').includes(query));
  }, [allFarmers, selectedLocation]);

  const mapUrl = selectedLocation ? buildMapsSearchUrl(selectedLocation) : '';

  const handleLocationChange = (location: LocationOption | null) => {
    setLocationError('');
    const nextLocation = location ? (location.coordinates ? location : DEFAULT_LOCATION_OPTIONS.find((entry) => entry.city === location.city || entry.name === location.name) ?? location) : null;
    setSelectedLocation(nextLocation);
    setManualLocation(nextLocation?.city || nextLocation?.name || '');

    if (nextLocation) {
      setManualLocation(nextLocation.city || nextLocation.name || '');
    }
  };

  const handleManualSearch = () => {
    const query = manualLocation.trim();
    if (!query) {
      setLocationError('Enter a location to search farmers.');
      return;
    }

    setLocationError('');

    const match = DEFAULT_LOCATION_OPTIONS.find(
      (entry) => normalizeLocationKey(entry.city) === normalizeLocationKey(query) || normalizeLocationKey(entry.name) === normalizeLocationKey(query)
    );

    const nextLocation = match ?? {
      id: `manual_${normalizeLocationKey(query).replace(/\s+/g, '_')}`,
      name: query,
      city: query,
      state: 'India',
    };

    handleLocationChange(nextLocation);
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
            <div className="flex gap-2">
              <Input
                value={manualLocation}
                onChange={(event) => setManualLocation(event.target.value)}
                placeholder="Or type a location manually"
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    handleManualSearch();
                  }
                }}
              />
              <Button onClick={handleManualSearch} className="gap-2">
                <Search className="h-4 w-4" />
                Search
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              {selectedLocation
                ? `Searching farmers in ${selectedLocation.city}`
                : 'Select or type a location to search farmers'}
            </p>
            {locationError && <p className="text-xs text-red-600">{locationError}</p>}
          </CardContent>
        </Card>

        <Card className="mt-4 overflow-hidden">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="h-5 w-5 text-green-600" />
              Map Preview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {selectedLocation ? (
              <>
                <div className="overflow-hidden rounded-xl border bg-white">
                  <iframe
                    title={`${selectedLocation.city} map preview`}
                    src={mapUrl}
                    className="h-72 w-full"
                    loading="lazy"
                  />
                </div>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs text-gray-500">
                    You stay on this page while the map preview loads. Use the link only if you want full Maps.
                  </p>
                  <Button asChild variant="outline" size="sm" className="gap-2">
                    <a href={mapUrl} target="_blank" rel="noreferrer">
                      <ExternalLink className="h-4 w-4" />
                      Open Maps
                    </a>
                  </Button>
                </div>
              </>
            ) : (
              <div className="rounded-xl border border-dashed p-6 text-center text-sm text-gray-500">
                Pick a location to show the map here.
              </div>
            )}
          </CardContent>
        </Card>

        {selectedLocation && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <MapPin className="h-5 w-5 text-green-600" />
                Farmers Found
              </CardTitle>
            </CardHeader>
            <CardContent>
              <NearbyFarmers
                farmers={nearbyFarmers}
                selectedLocation={selectedLocation.city}
                maxDistance={50}
                emptyMessage={`No farmers found for ${selectedLocation.city}`}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default LocationPage;
