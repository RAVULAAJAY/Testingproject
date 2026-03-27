import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MapPin, X, Check } from 'lucide-react';
import { cn } from "@/lib/utils";

export interface LocationOption {
  id: string;
  name: string;
  city: string;
  state: string;
  coordinates?: { lat: number; lng: number };
}

export const DEFAULT_LOCATION_OPTIONS: LocationOption[] = [
  { id: '1', name: 'Sector 45', city: 'Noida', state: 'Uttar Pradesh', coordinates: { lat: 28.209, lng: 77.1295 } },
  { id: '2', name: 'Greater Noida', city: 'Greater Noida', state: 'Uttar Pradesh', coordinates: { lat: 28.4595, lng: 77.4984 } },
  { id: '3', name: 'Delhi', city: 'Delhi', state: 'Delhi', coordinates: { lat: 28.7041, lng: 77.1025 } },
  { id: '4', name: 'Gurgaon', city: 'Gurgaon', state: 'Haryana', coordinates: { lat: 28.4595, lng: 77.0266 } },
  { id: '5', name: 'Faridabad', city: 'Faridabad', state: 'Haryana', coordinates: { lat: 28.4089, lng: 77.298 } },
  { id: '6', name: 'Bangalore', city: 'Bangalore', state: 'Karnataka', coordinates: { lat: 12.9716, lng: 77.5946 } },
  { id: '7', name: 'Pune', city: 'Pune', state: 'Maharashtra', coordinates: { lat: 18.5204, lng: 73.8567 } },
  { id: '8', name: 'Mumbai', city: 'Mumbai', state: 'Maharashtra', coordinates: { lat: 19.076, lng: 72.8855 } },
];

interface LocationSelectorProps {
  value?: LocationOption | null;
  onChange: (location: LocationOption | null) => void;
  placeholder?: string;
  disabled?: boolean;
  locations?: LocationOption[];
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
  value,
  onChange,
  placeholder = 'Select or search location...',
  disabled = false,
  locations: providedLocations,
}) => {
  const [open, setOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  const locations = providedLocations || DEFAULT_LOCATION_OPTIONS;
  const filteredLocations = searchInput
    ? locations.filter((location) =>
        `${location.name} ${location.city} ${location.state}`.toLowerCase().includes(searchInput.toLowerCase())
      )
    : locations;

  return (
    <Popover open={open && !disabled} onOpenChange={disabled ? undefined : setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('w-full justify-between bg-white', disabled ? 'cursor-not-allowed opacity-100' : '')}
          disabled={disabled}
          type="button"
        >
          <div className="flex items-center gap-2 flex-1 text-left">
            <MapPin className="h-4 w-4 text-gray-600 flex-shrink-0" />
            <span className={value ? 'text-gray-900 font-medium' : 'text-gray-500'}>
              {value ? `${value.name}, ${value.city}` : placeholder}
            </span>
          </div>
          <X
            className={cn('h-4 w-4 flex-shrink-0 transition-opacity', value ? 'opacity-100' : 'opacity-0')}
            aria-hidden="true"
          />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-full p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search locations..."
            value={searchInput}
            onValueChange={setSearchInput}
            className="border-none"
          />
          <CommandEmpty className="p-4 text-center text-gray-500">No location found.</CommandEmpty>
          <CommandGroup className="max-h-64 overflow-auto">
            {filteredLocations.map((location) => (
              <CommandItem
                key={location.id}
                value={location.id}
                onSelect={() => {
                  onChange(location);
                  setOpen(false);
                  setSearchInput('');
                }}
                className="cursor-pointer"
              >
                <Check className={cn('mr-2 h-4 w-4', value?.id === location.id ? 'opacity-100' : 'opacity-0')} />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{location.name}</p>
                  <p className="text-xs text-gray-600">{location.city}, {location.state}</p>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default LocationSelector;
