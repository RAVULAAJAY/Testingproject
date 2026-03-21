import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, Search, Zap, Heart, ShoppingCart, TrendingUp } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useGlobalState } from '@/context/GlobalStateContext';
import { Product } from '@/lib/data';
import FilterPanel, { FilterState } from '@/components/Buyer/FilterPanel';
import BuyerProductCard from '@/components/Buyer/BuyerProductCard';

const getFarmerDetails = (farmerId: string, farmerName: string) => {
  const farmerProfiles: Record<string, { name: string; rating: number; reviews: number }> = {
    farmer1: { name: 'Green Valley Farms', rating: 4.8, reviews: 124 },
    farmer2: { name: 'Honey Sweet Farm', rating: 4.9, reviews: 98 },
    farmer3: { name: 'Organic Harvest', rating: 4.6, reviews: 76 },
  };

  return farmerProfiles[farmerId] ?? { name: farmerName, rating: 4.5, reviews: 24 };
};

const BuyerMarketplacePanel: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const {
    products,
    orders,
    favoriteProductIds,
    toggleFavoriteProduct,
    isFavoriteProduct,
    placeOrder,
  } = useGlobalState();

  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    category: 'all',
    priceRange: [0, 500],
    location: '',
    sortBy: 'popular',
  });
  const [successMessage, setSuccessMessage] = useState('');

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (filters.searchTerm) {
      const search = filters.searchTerm.toLowerCase();
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(search) ||
          product.description.toLowerCase().includes(search) ||
          product.location.toLowerCase().includes(search)
      );
    }

    if (filters.category !== 'all') {
      result = result.filter((product) => product.category === filters.category);
    }

    result = result.filter(
      (product) => product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
    );

    if (filters.location) {
      result = result.filter((product) => product.location.includes(filters.location));
    }

    switch (filters.sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.sort((a, b) => {
          const getTimestamp = (product: Product) => new Date(product.createdAt ?? product.harvestDate).getTime();
          return getTimestamp(b) - getTimestamp(a);
        });
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'popular':
      default:
        break;
    }

    return result;
  }, [filters, products]);

  const buyerOrders = useMemo(
    () => orders.filter((order) => order.buyerId === currentUser?.id),
    [orders, currentUser?.id]
  );

  const stats = {
    totalProducts: products.length,
    favorites: favoriteProductIds.length,
    orders: buyerOrders.length,
    availableProducts: products.filter((product) => product.quantity > 0).length,
  };

  const handlePlaceOrder = (product: Product, quantity: number) => {
    placeOrder(product, quantity);
    setSuccessMessage(`Order placed for ${quantity} ${product.unit} of ${product.name}.`);
    window.setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleToggleFavorite = (productId: string) => {
    toggleFavoriteProduct(productId);
  };

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900">FarmDirect Marketplace</h1>
        <p className="text-gray-600 mt-2">Browse all products from shared state, filter them, save favorites, and place orders.</p>
      </div>

      {successMessage && (
        <Alert className="bg-green-50 border-green-200 text-green-800">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-gray-600">Products</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalProducts}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-gray-600">Saved</p>
            <p className="text-2xl font-bold text-red-600 mt-1">{stats.favorites}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-gray-600">Orders</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">{stats.orders}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-gray-600">Available</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{stats.availableProducts}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="h-5 w-5 text-green-600" />
            <h2 className="text-lg font-bold text-gray-900">Featured</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {products
              .filter((product) => product.quantity > 0)
              .slice(0, 4)
              .map((product) => (
                <div key={product.id} className="bg-white p-3 rounded-lg border border-green-200">
                  <p className="font-semibold text-gray-900 text-sm">{product.name}</p>
                  <p className="text-sm text-gray-600">₹{product.price}/{product.unit}</p>
                  <p className="text-xs text-green-600 font-medium mt-1">{product.quantity} available</p>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Browse Products</h2>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search products by name, description, or location..."
            value={filters.searchTerm}
            onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
            className="pl-10 h-12 text-base"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <FilterPanel
              filters={filters}
              onFiltersChange={setFilters}
              maxPrice={500}
            />
          </div>

          <div className="lg:col-span-3">
            {filteredProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredProducts.map((product) => (
                    <BuyerProductCard
                      key={product.id}
                      product={product}
                      farmer={getFarmerDetails(product.farmerId, product.farmerName)}
                      onPlaceOrder={handlePlaceOrder}
                      onViewDetails={(selectedProduct) => navigate(`/product/${selectedProduct.id}`)}
                      isFavorite={isFavoriteProduct(product.id)}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  ))}
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg text-center">
                  <p className="text-sm text-gray-600">
                    Showing {filteredProducts.length} of {products.length} products
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
                    sortBy: 'popular',
                  })}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {buyerOrders.length > 0 && (
        <Card>
          <CardContent className="pt-6 space-y-3">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">My Orders</h3>
            </div>
            <div className="space-y-2">
              {buyerOrders.slice(0, 3).map((order) => (
                <div key={order.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-medium text-gray-900">{order.productName}</p>
                    <p className="text-sm text-gray-600">Qty {order.quantity} · {order.status}</p>
                  </div>
                  <p className="font-semibold text-gray-900">₹{order.totalPrice}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BuyerMarketplacePanel;
