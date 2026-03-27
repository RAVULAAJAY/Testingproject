import React, { useMemo, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Navigation, LayoutGrid, List } from 'lucide-react';
import LocationSelector, { DEFAULT_LOCATION_OPTIONS, LocationOption } from '@/components/Location/LocationSelector';
import DistanceFilter from '@/components/Location/DistanceFilter';
import NearbyFarmers, { Farmer } from '@/components/Location/NearbyFarmers';
import { useGlobalState } from '@/context/GlobalStateContext';

const normalizeLocationKey = (value: string) => value.trim().toLowerCase();

const locationKey = (location: Pick<LocationOption, 'name' | 'city'>) =>
  normalizeLocationKey(location.city || location.name);

const resolveLocationOption = (location: LocationOption): LocationOption => {
  if (location.coordinates) {
    return location;
  }

  const match = DEFAULT_LOCATION_OPTIONS.find((entry) => locationKey(entry) === locationKey(location));

  return match ? { ...match, id: location.id } : location;
};

const buildMapsSearchUrl = (location: Pick<LocationOption, 'name' | 'city' | 'state' | 'coordinates'>) => {
  if (location.coordinates) {
    return `https://www.google.com/maps/search/?api=1&query=${location.coordinates.lat},${location.coordinates.lng}`;
  }

  const query = [location.name, location.city, location.state].filter(Boolean).join(', ');
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
};

const LocationPage: React.FC = () => {
  const { users } = useGlobalState();
  const [selectedLocation, setSelectedLocation] = useState<LocationOption | null>(null);
  const [manualLocation, setManualLocation] = useState('');
  const [locationError, setLocationError] = useState('');
  const [maxDistance, setMaxDistance] = useState(50);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [isLoading, setIsLoading] = useState(false);

  // Get real farmers from context
  const allFarmers = useMemo(() => {
    return users
      .filter(user => user.role === 'farmer')
      .map(farmer => ({
        id: farmer.id,
        name: farmer.farmName || farmer.name,
        avatar: `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Ccircle cx="50" cy="50" r="45" fill="%2322c55e"/%3E%3Ctext x="50" y="60" font-size="40" fill="white" text-anchor="middle" font-family="Arial"%3E${(farmer.farmName || farmer.name).substring(0, 2).toUpperCase()}%3C/text%3E%3C/svg%3E`,
        location: farmer.location,
        distance: Math.random() * 50, // Simulated distance
        rating: 4.5 + Math.random() * 0.5,
        totalReviews: Math.floor(100 + Math.random() * 400),
        products: 12 + Math.floor(Math.random() * 20),
        responseTime: '< 1 hour',
        isVerified: true,
        isFeatured: Math.random() > 0.7,
        speciality: (farmer.cropTypes || []).join(', ') || 'Fresh Produce',
        priceRange: '₹20-60/kg',
        description: farmer.farmDetails || 'Quality fresh produce from local farmer.'
      }))
  }, [users]);

  // Map location names to groups
  const farmersByLocation: Record<string, Farmer[]> = useMemo(() => {
    const grouped: Record<string, Farmer[]> = {};
    allFarmers.forEach(farmer => {
      const City = farmer.location || 'Other';
      if (!grouped[City]) {
        grouped[City] = [];
      }
      grouped[City].push(farmer);
    });
    return grouped;
  }, [allFarmers]);

  const locationCatalog = useMemo(() => {
    const collected = new Map<string, LocationOption>();

    DEFAULT_LOCATION_OPTIONS.forEach((location) => {
      collected.set(locationKey(location), location);
    });

    allFarmers
      .map((farmer) => farmer.location?.trim())
      .filter((location): location is string => Boolean(location))
      .forEach((location, index) => {
        const normalized = normalizeLocationKey(location);
        const knownLocation = DEFAULT_LOCATION_OPTIONS.find((entry) => {
          return locationKey(entry) === normalized;
        });

        collected.set(
          normalized,
          knownLocation ?? {
            id: `custom_${index}_${normalized.replace(/\s+/g, '_')}`,
            name: location,
            city: location,
            state: 'India',
          }
        );
      });

    return Array.from(collected.values());
  }, [allFarmers]);

  // Check if any farmers exist in system at all
  const hasFarmersInSystem = users.some(u => u.role === 'farmer');

  // Get farmers for selected location
  const nearbyFarmers = useMemo(() => {
    if (!selectedLocation) return [];

    const farmersInLocation = farmersByLocation[selectedLocation.city] || [];
    
    // Filter by distance
    return farmersInLocation.filter(farmer => farmer.distance <= maxDistance);
  }, [selectedLocation, maxDistance, farmersByLocation]);

  const mapUrl = selectedLocation ? buildMapsSearchUrl(selectedLocation) : '';
  const selectedLocationLabel = selectedLocation ? `${selectedLocation.city}${selectedLocation.state ? `, ${selectedLocation.state}` : ''}` : '';

  const quickLocations = useMemo(() => {
    const seen = new Set<string>();

    return locationCatalog.filter((location) => {
      const key = locationKey(location);
      if (seen.has(key)) {
        return false;
      }

      seen.add(key);
      return true;
    }).slice(0, 6);
  }, [locationCatalog]);

  const openMaps = (location: LocationOption) => {
    const mapsWindow = window.open(buildMapsSearchUrl(location), '_blank', 'noopener,noreferrer');
    if (mapsWindow) {
      mapsWindow.opener = null;
    }
  };

  const handleDistanceChange = (distance: number) => {
    setMaxDistance(distance);
  };

  const handleReset = () => {
    setMaxDistance(50);
  };

  const handleLocationChange = (location: LocationOption | null) => {
    setLocationError('');
    const nextLocation = location ? resolveLocationOption(location) : null;
    setSelectedLocation(nextLocation);
    setIsLoading(true);
    if (nextLocation) {
      openMaps(nextLocation);
    }
    // Simulate loading
    setTimeout(() => setIsLoading(false), 600);
  };

  const handleManualLocationSubmit = async () => {
    const trimmedLocation = manualLocation.trim();
    if (!trimmedLocation) {
      return;
    }

    setLocationError('');

    const matchedLocation = locationCatalog.find((location) => locationKey(location) === normalizeLocationKey(trimmedLocation));
    if (matchedLocation) {
      handleLocationChange(matchedLocation);
      return;
    }

    const customLocation: LocationOption = {
      id: `manual_${normalizeLocationKey(trimmedLocation).replace(/\s+/g, '_')}`,
      name: trimmedLocation,
      city: trimmedLocation,
      state: 'India',
    };

    setSelectedLocation(customLocation);
    openMaps(customLocation);
    setIsLoading(true);
    window.setTimeout(() => setIsLoading(false), 600);
  };

  const handleFarmerMessage = (farmerId: string) => {
    console.log('Message farmer:', farmerId);
  };

  const handleFarmerClick = (farmer: Farmer) => {
    console.log('View farmer profile:', farmer);
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Find Farmers Near You</h1>
        <p className="text-gray-600 mt-2">
          Connect directly with local farmers and get fresh produce delivered
        </p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar - Filters */}
        <div className="lg:col-span-1 space-y-4">
          {/* Location Selector */}
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
                locations={locationCatalog}
              />
              <p className="text-xs text-gray-500">
                {selectedLocation
                  ? `Showing farmers in ${selectedLocation.city}`
                  : 'Search a location to preview it on the map'}
              </p>
              {locationError && (
                <p className="text-xs text-red-600">{locationError}</p>
              )}
            </CardContent>
          </Card>

          {/* Distance Filter */}
          {selectedLocation && (
            <DistanceFilter
              maxDistance={maxDistance}
              onDistanceChange={handleDistanceChange}
              onReset={handleReset}
            />
          )}

          {/* Quick Stats */}
          {selectedLocation && (
            <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
              <CardContent className="pt-6 space-y-3">
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div>
                    <p className="text-2xl font-bold text-green-600">
                      {nearbyFarmers.length}
                    </p>
                    <p className="text-xs text-gray-600">Farms Found</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-600">
                      {nearbyFarmers.reduce((sum, f) => sum + f.products, 0)}
                    </p>
                    <p className="text-xs text-gray-600">Products</p>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-xs text-gray-600 mb-1">Avg Rating</p>
                  <p className="text-xl font-bold">
                    {nearbyFarmers.length > 0
                      ? (nearbyFarmers.reduce((sum, f) => sum + f.rating, 0) / nearbyFarmers.length).toFixed(1)
                      : '—'}
                    ⭐
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-4">
          {/* Empty / Search State */}
          {!selectedLocation && (
            <Card className="border-2 border-dashed border-green-200 bg-gradient-to-br from-green-50 via-white to-blue-50">
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-green-100 p-2 text-green-700">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-lg font-semibold text-gray-900">Explore a location</h2>
                    <p className="text-sm text-gray-600">
                      {hasFarmersInSystem
                        ? 'Select a city to find nearby farmers and preview it on the map.'
                        : 'No farmers are registered yet. You can still search a location, enter one manually, and preview it on the map.'}
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="space-y-3">
                    <LocationSelector
                      value={selectedLocation}
                      onChange={handleLocationChange}
                      placeholder="Search location..."
                      locations={locationCatalog}
                    />

                    <div className="flex gap-2">
                      <Input
                        value={manualLocation}
                        onChange={(event) => setManualLocation(event.target.value)}
                        placeholder="Or type a city manually"
                        aria-label="Manual location entry"
                        onKeyDown={(event) => {
                          if (event.key === 'Enter') {
                            event.preventDefault();
                            void handleManualLocationSubmit();
                          }
                        }}
                      />
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {quickLocations.map((location) => (
                        <Button
                          key={location.id}
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleLocationChange(location)}
                        >
                          {location.city}
                        </Button>
                      ))}
                    </div>

                    {locationError && (
                      <p className="text-sm text-red-600">{locationError}</p>
                    )}
                  </div>

                  <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
                    <div className="flex h-72 flex-col items-center justify-center gap-4 px-6 text-center">
                      <div className="space-y-1">
                        <p className="text-base font-semibold text-gray-900">Maps will open automatically</p>
                        <p className="text-sm text-gray-500">
                          Selecting a location or using a manual search will open Google Maps for that place.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Results Header */}
          {selectedLocation && (
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {nearbyFarmers.length} Farms Found
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Within {maxDistance} km of {selectedLocationLabel || selectedLocation.city}
                </p>
              </div>

              {/* View Mode Toggle */}
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('list')}
                  title="List view"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('grid')}
                  title="Grid view"
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Farmers Display */}
          {selectedLocation && (
            <>
              {viewMode === 'list' ? (
                <NearbyFarmers
                  farmers={nearbyFarmers}
                  selectedLocation={selectedLocation.city}
                  maxDistance={maxDistance}
                  onFarmerClick={handleFarmerClick}
                  onMessage={handleFarmerMessage}
                  isLoading={isLoading}
                  emptyMessage={`No farmers found within ${maxDistance} km`}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {nearbyFarmers.map((farmer) => (
                    <Card
                      key={farmer.id}
                      className="hover:shadow-lg transition-all cursor-pointer"
                      onClick={() => handleFarmerClick(farmer)}
                    >
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          {/* Avatar and Name */}
                          <div className="flex items-start gap-3">
                            <img
                              src={farmer.avatar}
                              alt={farmer.name}
                              className="h-12 w-12 rounded-full"
                            />
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900">
                                {farmer.name}
                              </h3>
                              <p className="text-xs text-green-600 font-medium">
                                {farmer.distance} km away
                              </p>
                            </div>
                          </div>

                          {/* Location */}
                          <div className="text-xs text-gray-600">
                            <p className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {farmer.location}
                            </p>
                          </div>

                          {/* Rating */}
                          <div className="flex items-center gap-2 text-xs">
                            <span className="flex items-center gap-1">
                              <span className="text-yellow-500">★</span>
                              {farmer.rating}
                            </span>
                            <span className="text-gray-600">
                              ({farmer.totalReviews} reviews)
                            </span>
                          </div>

                          {/* Specialty */}
                          <p className="text-sm font-medium text-gray-700">
                            {farmer.speciality}
                          </p>

                          {/* Action Buttons */}
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleFarmerMessage(farmer.id);
                              }}
                            >
                              Chat
                            </Button>
                            <Button
                              size="sm"
                              className="flex-1 bg-green-600 hover:bg-green-700"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleFarmerClick(farmer);
                              }}
                            >
                              Profile
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LocationPage;
