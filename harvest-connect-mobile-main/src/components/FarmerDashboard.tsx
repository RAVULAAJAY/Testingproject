import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, MessageCircle, LogOut, Camera } from 'lucide-react';
import ChatDialog from './ChatDialog';

interface Crop {
  id: string;
  name: string;
  price: number;
  quantity: string;
  description: string;
  imageUrl: string;
  farmerId: string;
  farmerName: string;
  farmerLocation: string;
  status: 'available' | 'sold';
}

interface Order {
  id: string;
  cropId: string;
  cropName: string;
  buyerId: string;
  buyerName: string;
  quantity: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'delivered';
  orderDate: string;
  deliveryAddress: string;
}

interface FarmerDashboardProps {
  user: any;
  onLogout: () => void;
}

const FarmerDashboard: React.FC<FarmerDashboardProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('crops');
  const [crops, setCrops] = useState<Crop[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [showAddCrop, setShowAddCrop] = useState(false);
  const [editingCrop, setEditingCrop] = useState<Crop | null>(null);
  const [chatWith, setChatWith] = useState<{id: string, name: string} | null>(null);

  const [newCrop, setNewCrop] = useState({
    name: '',
    price: '',
    quantity: '',
    description: '',
    imageUrl: '/placeholder.svg'
  });

  // Sample data
  useEffect(() => {
    const sampleCrops: Crop[] = [
      {
        id: '1',
        name: 'Fresh Tomatoes',
        price: 50,
        quantity: '100 kg',
        description: 'Organic red tomatoes, freshly harvested',
        imageUrl: '/placeholder.svg',
        farmerId: user.id,
        farmerName: user.name,
        farmerLocation: user.location,
        status: 'available' as const
      },
      {
        id: '2',
        name: 'Green Chilies',
        price: 80,
        quantity: '50 kg',
        description: 'Spicy green chilies, perfect for cooking',
        imageUrl: '/placeholder.svg',
        farmerId: user.id,
        farmerName: user.name,
        farmerLocation: user.location,
        status: 'available' as const
      }
    ];

    const sampleOrders: Order[] = [
      {
        id: '1',
        cropId: '1',
        cropName: 'Fresh Tomatoes',
        buyerId: 'buyer1',
        buyerName: 'Local Restaurant',
        quantity: '25 kg',
        totalPrice: 1250,
        status: 'pending',
        orderDate: '2024-01-20',
        deliveryAddress: '123 Market Street, City'
      }
    ];

    setCrops(sampleCrops);
    setOrders(sampleOrders);
  }, [user.id, user.name, user.location]);

  const handleAddCrop = () => {
    if (newCrop.name && newCrop.price && newCrop.quantity) {
      const crop: Crop = {
        id: Date.now().toString(),
        name: newCrop.name,
        price: parseFloat(newCrop.price),
        quantity: newCrop.quantity,
        description: newCrop.description,
        imageUrl: newCrop.imageUrl,
        farmerId: user.id,
        farmerName: user.name,
        farmerLocation: user.location,
        status: 'available' as const
      };
      setCrops([...crops, crop]);
      setNewCrop({ name: '', price: '', quantity: '', description: '', imageUrl: '/placeholder.svg' });
      setShowAddCrop(false);
    }
  };

  const handleEditCrop = (crop: Crop) => {
    setEditingCrop(crop);
    setNewCrop({
      name: crop.name,
      price: crop.price.toString(),
      quantity: crop.quantity,
      description: crop.description,
      imageUrl: crop.imageUrl
    });
    setShowAddCrop(true);
  };

  const handleUpdateCrop = () => {
    if (editingCrop && newCrop.name && newCrop.price && newCrop.quantity) {
      const updatedCrop: Crop = {
        ...editingCrop,
        name: newCrop.name,
        price: parseFloat(newCrop.price),
        quantity: newCrop.quantity,
        description: newCrop.description,
        imageUrl: newCrop.imageUrl
      };
      setCrops(crops.map(c => c.id === editingCrop.id ? updatedCrop : c));
      setNewCrop({ name: '', price: '', quantity: '', description: '', imageUrl: '/placeholder.svg' });
      setShowAddCrop(false);
      setEditingCrop(null);
    }
  };

  const handleDeleteCrop = (cropId: string) => {
    setCrops(crops.filter(c => c.id !== cropId));
  };

  const handleUpdateOrderStatus = (orderId: string, status: 'pending' | 'confirmed' | 'delivered') => {
    setOrders(orders.map(o => o.id === orderId ? {...o, status} : o));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-green-700">🧑‍🌾 Farmer Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user.name}</p>
            </div>
            <Button onClick={onLogout} variant="outline" className="text-red-600 border-red-300">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b">
        <div className="px-4">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('crops')}
              className={`py-3 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'crops'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              My Crops ({crops.length})
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`py-3 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'orders'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Orders ({orders.length})
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {activeTab === 'crops' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">My Crop Listings</h2>
              <Button onClick={() => setShowAddCrop(true)} className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                Add New Crop
              </Button>
            </div>

            {/* Add/Edit Crop Form */}
            {showAddCrop && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>{editingCrop ? 'Edit Crop' : 'Add New Crop'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Crop Name</Label>
                      <Input
                        value={newCrop.name}
                        onChange={(e) => setNewCrop({...newCrop, name: e.target.value})}
                        placeholder="e.g., Fresh Tomatoes"
                      />
                    </div>
                    <div>
                      <Label>Price per kg (₹)</Label>
                      <Input
                        type="number"
                        value={newCrop.price}
                        onChange={(e) => setNewCrop({...newCrop, price: e.target.value})}
                        placeholder="50"
                      />
                    </div>
                    <div>
                      <Label>Available Quantity</Label>
                      <Input
                        value={newCrop.quantity}
                        onChange={(e) => setNewCrop({...newCrop, quantity: e.target.value})}
                        placeholder="100 kg"
                      />
                    </div>
                    <div>
                      <Label>Image</Label>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Camera className="w-4 h-4 mr-2" />
                          Upload Photo
                        </Button>
                        <span className="text-sm text-gray-500">No file chosen</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Input
                      value={newCrop.description}
                      onChange={(e) => setNewCrop({...newCrop, description: e.target.value})}
                      placeholder="Brief description of your crop"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      onClick={editingCrop ? handleUpdateCrop : handleAddCrop}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {editingCrop ? 'Update Crop' : 'Add Crop'}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setShowAddCrop(false);
                        setEditingCrop(null);
                        setNewCrop({ name: '', price: '', quantity: '', description: '', imageUrl: '/placeholder.svg' });
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Crops Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {crops.map((crop) => (
                <Card key={crop.id} className="overflow-hidden">
                  <div className="aspect-video bg-gray-200 flex items-center justify-center">
                    <span className="text-4xl">🌾</span>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{crop.name}</h3>
                      <Badge variant={crop.status === 'available' ? 'default' : 'secondary'}>
                        {crop.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{crop.description}</p>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-lg font-bold text-green-600">₹{crop.price}/kg</span>
                      <span className="text-sm text-gray-500">{crop.quantity} available</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleEditCrop(crop)}>
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDeleteCrop(crop.id)}>
                        <Trash2 className="w-3 h-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div>
            <h2 className="text-xl font-semibold mb-6">Order Management</h2>
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold">{order.cropName}</h3>
                          <Badge variant={
                            order.status === 'pending' ? 'destructive' :
                            order.status === 'confirmed' ? 'default' : 'secondary'
                          }>
                            {order.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          Buyer: {order.buyerName}
                        </p>
                        <p className="text-sm text-gray-600 mb-1">
                          Quantity: {order.quantity} | Total: ₹{order.totalPrice}
                        </p>
                        <p className="text-sm text-gray-600 mb-1">
                          Order Date: {order.orderDate}
                        </p>
                        <p className="text-sm text-gray-600">
                          Delivery: {order.deliveryAddress}
                        </p>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <Button 
                          size="sm" 
                          onClick={() => setChatWith({id: order.buyerId, name: order.buyerName})}
                        >
                          <MessageCircle className="w-3 h-3 mr-1" />
                          Chat
                        </Button>
                        {order.status === 'pending' && (
                          <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleUpdateOrderStatus(order.id, 'confirmed')}
                          >
                            Confirm
                          </Button>
                        )}
                        {order.status === 'confirmed' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleUpdateOrderStatus(order.id, 'delivered')}
                          >
                            Mark Delivered
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Chat Dialog */}
      {chatWith && (
        <ChatDialog
          isOpen={!!chatWith}
          onClose={() => setChatWith(null)}
          recipientName={chatWith.name}
          currentUserId={user.id}
          recipientId={chatWith.id}
        />
      )}
    </div>
  );
};

export default FarmerDashboard;
