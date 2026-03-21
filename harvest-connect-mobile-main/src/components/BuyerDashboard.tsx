import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { LogOut, Search, MessageCircle, ShoppingCart, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ChatDialog from './ChatDialog';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  role: string;
}

interface Crop {
  id: string;
  name: string;
  price: number;
  quantity: string;
  description: string;
  imageUrl: string;
  status: 'available' | 'sold';
  farmerId: string;
  farmerName: string;
  farmerLocation: string;
}

interface Order {
  id: string;
  cropId: string;
  buyerId: string;
  farmerId: string;
  quantity: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'delivered';
  orderDate: string;
  crop: Crop;
}

interface BuyerDashboardProps {
  user: User;
  onLogout: () => void;
}

const BuyerDashboard: React.FC<BuyerDashboardProps> = ({ user, onLogout }) => {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [filteredCrops, setFilteredCrops] = useState<Crop[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);
  const [orderQuantity, setOrderQuantity] = useState('');
  const [activeTab, setActiveTab] = useState<'browse' | 'orders'>('browse');
  const [chatCrop, setChatCrop] = useState<Crop | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    // Load crops from localStorage
    const savedCrops = localStorage.getItem('crops');
    if (savedCrops) {
      const allCrops = JSON.parse(savedCrops);
      const availableCrops = allCrops.filter((crop: Crop) => 
        crop.status === 'available' && crop.farmerId !== user.id
      );
      setCrops(availableCrops);
      setFilteredCrops(availableCrops);
    }

    // Load orders
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      const allOrders = JSON.parse(savedOrders);
      setOrders(allOrders.filter((order: Order) => order.buyerId === user.id));
    }
  }, [user.id]);

  useEffect(() => {
    // Filter and sort crops
    let filtered = crops.filter(crop =>
      crop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crop.farmerLocation.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort crops
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredCrops(filtered);
  }, [crops, searchTerm, sortBy]);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCrop || !orderQuantity) return;

    const quantityNum = parseFloat(orderQuantity);
    const totalPrice = quantityNum * selectedCrop.price;

    const order: Order = {
      id: Date.now().toString(),
      cropId: selectedCrop.id,
      buyerId: user.id,
      farmerId: selectedCrop.farmerId,
      quantity: orderQuantity + ' kg',
      totalPrice,
      status: 'pending',
      orderDate: new Date().toISOString(),
      crop: selectedCrop
    };

    // Save order
    const savedOrders = localStorage.getItem('orders');
    const allOrders = savedOrders ? JSON.parse(savedOrders) : [];
    const updatedOrders = [...allOrders, order];
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    setOrders([...orders, order]);

    // Reset form
    setSelectedCrop(null);
    setOrderQuantity('');
  };

  const handleChatWithFarmer = (crop: Crop) => {
    setSelectedCrop(crop);
    setIsChatOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-2xl">🧑‍💼</div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Buyer Dashboard</h1>
                <p className="text-sm text-gray-600">Welcome back, {user.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex space-x-2">
                <Button
                  variant={activeTab === 'browse' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('browse')}
                >
                  Browse Crops
                </Button>
                <Button
                  variant={activeTab === 'orders' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('orders')}
                >
                  My Orders ({orders.length})
                </Button>
              </div>
              <Button onClick={onLogout} variant="outline" className="flex items-center space-x-2">
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'browse' ? (
          <>
            {/* Search and Filter */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search crops or locations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name A-Z</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Available Crops</p>
                      <p className="text-2xl font-bold text-gray-900">{filteredCrops.length}</p>
                    </div>
                    <div className="text-3xl">🌾</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">My Orders</p>
                      <p className="text-2xl font-bold text-blue-600">{orders.length}</p>
                    </div>
                    <div className="text-3xl">📦</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Spent</p>
                      <p className="text-2xl font-bold text-green-600">
                        ₹{orders.reduce((sum, order) => sum + order.totalPrice, 0).toFixed(2)}
                      </p>
                    </div>
                    <div className="text-3xl">💰</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Crops Grid */}
            {filteredCrops.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No crops found</h3>
                  <p className="text-gray-600">Try adjusting your search or check back later for new listings</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCrops.map((crop) => (
                  <Card key={crop.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-video relative">
                      <img
                        src={crop.imageUrl}
                        alt={crop.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge variant="default" className="bg-green-600">
                          🟢 Available
                        </Badge>
                      </div>
                    </div>
                    
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg">{crop.name}</h3>
                        <p className="text-lg font-bold text-green-600">₹{crop.price}/kg</p>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-1">Available: {crop.quantity}</p>
                      <p className="text-sm text-gray-600 mb-2">📍 {crop.farmerLocation}</p>
                      <p className="text-sm text-gray-600 mb-3">👨‍🌾 {crop.farmerName}</p>
                      
                      {crop.description && (
                        <p className="text-sm text-gray-700 mb-4 line-clamp-2">{crop.description}</p>
                      )}
                      
                      <div className="flex items-center justify-between space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setChatCrop(crop)}
                          className="flex-1"
                        >
                          <MessageCircle className="h-3 w-3 mr-1" />
                          Chat
                        </Button>
                        
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              onClick={() => setSelectedCrop(crop)}
                              className="flex-1 bg-blue-600 hover:bg-blue-700"
                            >
                              <ShoppingCart className="h-3 w-3 mr-1" />
                              Order
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>Place Order</DialogTitle>
                              <DialogDescription>
                                Order {selectedCrop?.name} from {selectedCrop?.farmerName}
                              </DialogDescription>
                            </DialogHeader>
                            
                            {selectedCrop && (
                              <form onSubmit={handlePlaceOrder} className="space-y-4">
                                <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                                  <img
                                    src={selectedCrop.imageUrl}
                                    alt={selectedCrop.name}
                                    className="w-16 h-16 object-cover rounded"
                                  />
                                  <div>
                                    <h4 className="font-semibold">{selectedCrop.name}</h4>
                                    <p className="text-sm text-gray-600">₹{selectedCrop.price}/kg</p>
                                    <p className="text-sm text-gray-600">Available: {selectedCrop.quantity}</p>
                                  </div>
                                </div>
                                
                                <div className="space-y-2">
                                  <label htmlFor="quantity" className="text-sm font-medium">
                                    Quantity (kg)
                                  </label>
                                  <Input
                                    id="quantity"
                                    type="number"
                                    step="0.1"
                                    value={orderQuantity}
                                    onChange={(e) => setOrderQuantity(e.target.value)}
                                    placeholder="Enter quantity in kg"
                                    required
                                  />
                                </div>
                                
                                {orderQuantity && (
                                  <div className="p-3 bg-blue-50 rounded-lg">
                                    <p className="text-sm font-medium">Order Summary:</p>
                                    <p className="text-sm">Quantity: {orderQuantity} kg</p>
                                    <p className="text-sm">Price per kg: ₹{selectedCrop.price}</p>
                                    <p className="font-semibold">Total: ₹{(parseFloat(orderQuantity) * selectedCrop.price).toFixed(2)}</p>
                                  </div>
                                )}
                                
                                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                                  Place Order
                                </Button>
                              </form>
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        ) : (
          /* Orders Tab */
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h2>
            
            {orders.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <div className="text-6xl mb-4">📦</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h3>
                  <p className="text-gray-600 mb-4">Browse crops and place your first order</p>
                  <Button onClick={() => setActiveTab('browse')} className="bg-blue-600 hover:bg-blue-700">
                    Browse Crops
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <Card key={order.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <img
                            src={order.crop.imageUrl}
                            alt={order.crop.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div>
                            <h3 className="font-semibold text-lg">{order.crop.name}</h3>
                            <p className="text-sm text-gray-600">From: {order.crop.farmerName}</p>
                            <p className="text-sm text-gray-600">📍 {order.crop.farmerLocation}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={
                            order.status === 'pending' ? 'secondary' :
                            order.status === 'confirmed' ? 'default' : 'outline'
                          }>
                            {order.status.toUpperCase()}
                          </Badge>
                          <p className="text-lg font-bold text-green-600 mt-1">₹{order.totalPrice.toFixed(2)}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Quantity</p>
                          <p className="font-medium">{order.quantity}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Order Date</p>
                          <p className="font-medium">{new Date(order.orderDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Status</p>
                          <p className="font-medium capitalize">{order.status}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Total</p>
                          <p className="font-medium">₹{order.totalPrice.toFixed(2)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Chat Dialog */}
      <ChatDialog
        isOpen={isChatOpen}
        onClose={() => {
          setIsChatOpen(false);
          setSelectedCrop(null);
        }}
        recipientName={selectedCrop?.farmerName || 'Farmer'}
        currentUserId={user.id}
        recipientId={selectedCrop?.farmerId || ''}
      />
    </div>
  );
};

export default BuyerDashboard;
