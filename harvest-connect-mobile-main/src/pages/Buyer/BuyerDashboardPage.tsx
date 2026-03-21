import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Search,
  ShoppingCart,
  Heart,
  Zap,
  TrendingUp,
  CheckCircle,
  AlertCircle as AlertIcon
} from 'lucide-react';
import { Product } from '@/components/Farmer/AddProductForm';
import FilterPanel, { FilterState } from '@/components/Buyer/FilterPanel';
import BuyerProductCard from '@/components/Buyer/BuyerProductCard';
import BuyerMarketplacePanel from '@/components/Buyer/BuyerMarketplacePanel';

// Sample farmer data for products
interface FarmerSummary {
  name: string;
  rating: number;
  reviews: number;
}

const sampleFarmers: Record<string, FarmerSummary> = {
  farmer1: {
    name: 'Green Valley Farms',
    rating: 4.8,
    reviews: 124
  },
  farmer2: {
    name: 'Honey Sweet Farm',
    rating: 4.9,
    reviews: 98
  },
  farmer3: {
    name: 'Organic Harvest',
    rating: 4.6,
    reviews: 76
  }
};

const BuyerDashboardPage: React.FC = () => {
  return <BuyerMarketplacePanel />;

  const navigate = useNavigate();
  // Sample products from different farmers
  const [allProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'Fresh Tomatoes',
      price: 40,
      quantity: 50,
      unit: 'kg',
      image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Ccircle cx="50" cy="50" r="45" fill="%23EF4444"/%3E%3Cpath d="M50 10 Q60 20 60 30 Q60 40 50 45" fill="%23059669"/%3E%3C/svg%3E',
      location: 'Sector 45, Noida',
      description: 'Fresh, organic tomatoes grown without pesticides. Perfect for cooking.',
      category: 'vegetables',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    },
    {
      id: '2',
      name: 'Honeycomb',
      price: 300,
      quantity: 20,
      unit: 'kg',
      image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect x="10" y="10" width="80" height="80" fill="%23FCD34D"/%3E%3Cpath d="M30 30 M40 25 M50 30 M60 25 M70 30" stroke="%23F59E0B" stroke-width="2"/%3E%3C/svg%3E',
      location: 'Greater Noida',
      description: 'Pure honeycomb, directly from the hive. Rich in nutrients.',
      category: 'honey',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    },
    {
      id: '3',
      name: 'Organic Spinach',
      price: 25,
      quantity: 5,
      unit: 'kg',
      image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Cpath d="M50 20 Q70 30 70 50 Q70 70 50 80 Q30 70 30 50 Q30 30 50 20" fill="%23059669"/%3E%3C/svg%3E',
      location: 'Delhi',
      description: 'Fresh organic spinach, nutrient-rich and delicious.',
      category: 'vegetables',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    },
    {
      id: '4',
      name: 'Fresh Apples',
      price: 80,
      quantity: 25,
      unit: 'kg',
      image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Ccircle cx="50" cy="55" r="40" fill="%23DC2626"/%3E%3Cpath d="M50 10 Q55 15 55 20 Q55 25 50 27 Q45 25 45 20 Q45 15 50 10" fill="%23059669"/%3E%3C/svg%3E',
      location: 'Himachal Pradesh',
      description: 'Crisp and sweet red apples from the hills.',
      category: 'fruits',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    },
    {
      id: '5',
      name: 'Organic Rice',
      price: 50,
      quantity: 100,
      unit: 'kg',
      image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect x="20" y="30" width="60" height="40" fill="%23F5DEB3" stroke="%23D2B48C" stroke-width="2"/%3E%3Cline x1="30" y1="35" x2="30" y2="65" stroke="%23D2B48C" stroke-width="1"/%3E%3Cline x1="40" y1="35" x2="40" y2="65" stroke="%23D2B48C" stroke-width="1"/%3E%3Cline x1="50" y1="35" x2="50" y2="65" stroke="%23D2B48C" stroke-width="1"/%3E%3C/svg%3E',
      location: 'Punjab',
      description: 'Premium basmati rice, aged for perfect taste.',
      category: 'grains',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    },
    {
      id: '6',
      name: 'Fresh Milk',
      price: 60,
      quantity: 50,
      unit: 'liter',
      image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect x="25" y="20" width="50" height="65" fill="%23FFFFFF" stroke="%23E5E7EB" stroke-width="2" rx="5"/%3E%3Cpath d="M45 15 Q45 10 50 10 Q55 10 55 15" fill="%23E5E7EB"/%3E%3Cline x1="30" y1="50" x2="70" y2="50" stroke="%23F5F5F5" stroke-width="1"/%3E%3C/svg%3E',
      location: 'Gurgaon',
      description: 'Fresh, pure milk from healthy cows.',
      category: 'dairy',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    },
    {
      id: '7',
      name: 'Organic Broccoli',
      price: 35,
      quantity: 15,
      unit: 'kg',
      image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Cpath d="M50 15 Q65 25 65 40 Q65 55 50 65 Q35 55 35 40 Q35 25 50 15" fill="%23059669"/%3E%3Ccircle cx="50" cy="40" r="8" fill="%232d5a2d"/%3E%3C/svg%3E',
      location: 'Himachal Pradesh',
      description: 'Fresh organic broccoli, crispy and nutritious.',
      category: 'organic',
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
    },
    {
      id: '8',
      name: 'Orange Juice',
      price: 120,
      quantity: 0,
      unit: 'liter',
      image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Ccircle cx="50" cy="50" r="40" fill="%23FB923C"/%3E%3C/svg%3E',
      location: 'Karnataka',
      description: 'Fresh squeezed orange juice - currently out of stock.',
      category: 'fruits',
      createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
    }
  ]);

  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    category: 'all',
    priceRange: [0, 500],
    location: '',
    sortBy: 'popular'
  });

  const [favorites, setFavorites] = useState<string[]>([]);
  const [cartItems, setCartItems] = useState<{ product: Product; quantity: number }[]>([]);
  const [successMessage, setSuccessMessage] = useState('');

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = allProducts;

    // Search filter
    if (filters.searchTerm) {
      const search = filters.searchTerm.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(search) ||
        p.description.toLowerCase().includes(search) ||
        p.location.toLowerCase().includes(search)
      );
    }

    // Category filter
    if (filters.category !== 'all') {
      result = result.filter(p => p.category === filters.category);
    }

    // Price filter
    result = result.filter(p => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]);

    // Location filter
    if (filters.location) {
      result = result.filter(p => p.location.includes(filters.location));
    }

    // Sort
    switch (filters.sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'popular':
      default:
        // Keep original order
        break;
    }

    return result;
  }, [allProducts, filters]);

  const handleAddToCart = (product: Product, quantity: number) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showSuccess(`Added ${product.name} to cart!`);
  };

  const handleToggleFavorite = (productId: string) => {
    setFavorites(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const stats = {
    totalProducts: allProducts.length,
    outOfStock: allProducts.filter(p => p.quantity === 0).length,
    lowStock: allProducts.filter(p => p.quantity > 0 && p.quantity <= 10).length,
    cartItems: cartItems.length,
    favorites: favorites.length
  };

  // Featured deals (out of stock or low stock)
  const featuredDeals = allProducts.filter(p => p.quantity > 0).slice(0, 4);

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">FarmDirect Marketplace</h1>
        <p className="text-gray-600 mt-2">Fresh farm produce delivered to your home</p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <Alert className="bg-green-50 border-green-200 text-green-800">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-gray-600">Products Available</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalProducts}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-gray-600">Saved Items</p>
            <p className="text-2xl font-bold text-red-600 mt-1">{stats.favorites}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-gray-600">Cart Items</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">{stats.cartItems}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-gray-600">Low Stock</p>
            <p className="text-2xl font-bold text-orange-600 mt-1">{stats.lowStock}</p>
          </CardContent>
        </Card>
      </div>

      {/* Featured Deals */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="h-5 w-5 text-green-600" />
            <h2 className="text-lg font-bold text-gray-900">Featured Deals</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredDeals.map(product => (
              <div key={product.id} className="bg-white p-3 rounded-lg border border-green-200">
                <p className="font-semibold text-gray-900 text-sm">{product.name}</p>
                <p className="text-sm text-gray-600">₹{product.price}/{product.unit}</p>
                <p className="text-xs text-green-600 font-medium mt-1">Limited Stock</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Content - Search and Products */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Browse Products</h2>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search products by name, description, or location..."
            value={filters.searchTerm}
            onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
            className="pl-10 h-12 text-base"
          />
        </div>

        {/* Filters + Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filter Panel - Sticky on desktop */}
          <div className="lg:col-span-1">
            <FilterPanel
              filters={filters}
              onFiltersChange={setFilters}
              maxPrice={500}
            />
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {filteredProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredProducts.map(product => (
                    <BuyerProductCard
                      key={product.id}
                      product={product}
                      farmer={sampleFarmers[`farmer${(parseInt(product.id) % 3) + 1}`]}
                      onAddToCart={handleAddToCart}
                      onViewDetails={(p) => navigate(`/product/${p.id}`)}
                      isFavorite={favorites.includes(product.id)}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  ))}
                </div>

                {/* Results Summary */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg text-center">
                  <p className="text-sm text-gray-600">
                    Showing {filteredProducts.length} of {allProducts.length} products
                  </p>
                </div>
              </>
            ) : (
              <div className="h-96 flex flex-col items-center justify-center text-center">
                <div className="text-6xl mb-4">🌾</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters or search terms</p>
                <Button
                  variant="outline"
                  onClick={() => setFilters({
                    searchTerm: '',
                    category: 'all',
                    priceRange: [0, 500],
                    location: '',
                    sortBy: 'popular'
                  })}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboardPage;
