import React, { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Clock,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  MapPin,
  Truck,
  Package,
  Download,
  Eye,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useGlobalState } from '@/context/GlobalStateContext';
import { Order } from '@/lib/data';

type OrderStatus = 'pending' | 'accepted' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

interface OrdersPageProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: 'farmer' | 'buyer' | 'admin';
    location?: string;
  };
}

const statusFlow: Array<OrderStatus> = ['pending', 'accepted', 'delivered'];

const statusConfig: Record<OrderStatus, { label: string; color: string; icon: React.ReactNode; description: string }> = {
  pending: {
    label: 'Pending',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    icon: <Clock className="h-5 w-5" />,
    description: 'Waiting for farmer confirmation',
  },
  accepted: {
    label: 'Accepted',
    color: 'bg-blue-100 text-blue-800 border-blue-300',
    icon: <Package className="h-5 w-5" />,
    description: 'Farmer is preparing the order',
  },
  confirmed: {
    label: 'Accepted',
    color: 'bg-blue-100 text-blue-800 border-blue-300',
    icon: <Package className="h-5 w-5" />,
    description: 'Farmer is preparing the order',
  },
  shipped: {
    label: 'Accepted',
    color: 'bg-blue-100 text-blue-800 border-blue-300',
    icon: <Package className="h-5 w-5" />,
    description: 'Farmer is preparing the order',
  },
  delivered: {
    label: 'Delivered',
    color: 'bg-green-100 text-green-800 border-green-300',
    icon: <CheckCircle className="h-5 w-5" />,
    description: 'Order completed',
  },
  cancelled: {
    label: 'Cancelled',
    color: 'bg-red-100 text-red-800 border-red-300',
    icon: <AlertCircle className="h-5 w-5" />,
    description: 'Order was cancelled',
  },
};

const OrdersPage: React.FC<OrdersPageProps> = ({ user }) => {
  const { currentUser } = useAuth();
  const { orders, updateOrder } = useGlobalState();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);

  const isFarmer = user.role === 'farmer';
  const isBuyer = user.role === 'buyer';

  const buyerOrders = useMemo(
    () => orders.filter((order) => order.buyerId === currentUser?.id),
    [orders, currentUser?.id]
  );

  const farmerOrders = useMemo(
    () => orders.filter((order) => order.farmerId === currentUser?.id),
    [orders, currentUser?.id]
  );

  const visibleOrders = isFarmer ? farmerOrders : buyerOrders;

  const statusCounts = useMemo(() => ({
    all: visibleOrders.length,
    pending: visibleOrders.filter((order) => order.status === 'pending').length,
    accepted: visibleOrders.filter((order) => order.status === 'accepted').length,
    delivered: visibleOrders.filter((order) => order.status === 'delivered').length,
    cancelled: visibleOrders.filter((order) => order.status === 'cancelled').length,
  }), [visibleOrders]);

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderDetail(true);
  };

  const handleAdvanceStatus = (order: Order) => {
    if (!isFarmer) {
      return;
    }

    const currentIndex = statusFlow.indexOf(order.status);
    if (currentIndex < 0 || currentIndex >= statusFlow.length - 1) {
      return;
    }

    const nextStatus = statusFlow[currentIndex + 1];
    updateOrder(order.id, {
      status: nextStatus,
      ...(nextStatus === 'delivered' ? { deliveryDate: new Date().toISOString().split('T')[0] } : {}),
    });
  };

  const filteredOrders = (status: OrderStatus | 'all') => {
    if (status === 'all') {
      return visibleOrders;
    }
    return visibleOrders.filter((order) => order.status === status);
  };

  const nextStatusLabel = (status: OrderStatus) => {
    if (status === 'pending') return 'Accept Order';
    if (status === 'accepted') return 'Mark Delivered';
    return null;
  };

  return (
    <div className="space-y-6 pb-8">
      <div className="animate-fade-in-scale">
        <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
          {isFarmer ? 'Orders Received' : 'My Orders'}
        </h1>
        <p className="mt-2 text-gray-600">
          {isFarmer
            ? 'Review orders from buyers and update their status in real time.'
            : 'Track your purchases and watch order progress update live.'}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        {[
          { label: 'Pending', value: statusCounts.pending, icon: '⏱️', color: 'from-amber-500 to-orange-600', textColor: 'text-amber-600' },
          { label: 'Accepted', value: statusCounts.accepted, icon: '✅', color: 'from-blue-500 to-cyan-600', textColor: 'text-blue-600' },
          { label: 'Delivered', value: statusCounts.delivered, icon: '📦', color: 'from-green-500 to-emerald-600', textColor: 'text-green-600' },
          { label: 'Total Orders', value: statusCounts.all, icon: '📊', color: 'from-purple-500 to-pink-600', textColor: 'text-purple-600' },
        ].map((stat, index) => (
          <Card key={stat.label} className="card-hover border-0 overflow-hidden shadow-medium" style={{ animationDelay: `${index * 50}ms` }}>
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-10`} />
            <CardContent className="relative pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-3xl font-bold text-gray-900 md:text-4xl">{stat.value}</p>
                  <p className={`mt-2 text-sm font-medium ${stat.textColor}`}>{stat.label}</p>
                </div>
                <span className="text-3xl">{stat.icon}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="all" className="w-full animate-slide-in-bottom" style={{ animationDelay: '200ms' }}>
        <TabsList className="grid w-full grid-cols-2 bg-gradient-to-r from-gray-100 to-gray-50 sm:grid-cols-4">
          <TabsTrigger value="all">All ({statusCounts.all})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({statusCounts.pending})</TabsTrigger>
          <TabsTrigger value="accepted" className="hidden sm:inline-flex">Accepted ({statusCounts.accepted})</TabsTrigger>
          <TabsTrigger value="delivered" className="hidden sm:inline-flex">Delivered ({statusCounts.delivered})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filteredOrders('all').map((order, index) => {
            const config = statusConfig[order.status];
            return (
              <Card key={order.id} className="card-hover border-0 shadow-medium transition-all" style={{ animationDelay: `${index * 30}ms` }}>
                <CardContent className="pt-6">
                  <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-lg font-semibold text-gray-900">{order.id}</p>
                      <p className="mt-1 text-sm text-gray-600">
                        {isFarmer ? `Buyer: ${order.buyerName}` : `Seller: ${order.farmerName}`}
                      </p>
                    </div>
                    <Badge className={`${config.color} flex w-fit items-center gap-1 border`}>
                      {config.icon}
                      <span>{config.label}</span>
                    </Badge>
                  </div>

                  <div className="mb-4 rounded-lg bg-gray-50 p-3">
                    <p className="text-sm font-medium text-gray-900">{order.productName}</p>
                    <p className="text-sm text-gray-600">Qty: {order.quantity}</p>
                  </div>

                  <div className="mb-4 grid grid-cols-2 gap-4 border-b pb-4">
                    <div>
                      <p className="text-xs text-gray-600">Order Date</p>
                      <p className="font-medium text-gray-900">{order.orderDate}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Est. Delivery</p>
                      <p className="font-medium text-gray-900">{order.deliveryDate ?? 'Pending'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Total Amount</p>
                      <p className="text-lg font-bold text-gray-900">₹{order.totalPrice}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Status</p>
                      <p className="font-medium text-gray-900 capitalize">{order.status}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Button onClick={() => handleViewDetails(order)} className="flex-1 gap-2">
                      <Eye className="h-4 w-4" />
                      View Details
                    </Button>
                    {isFarmer && nextStatusLabel(order.status) && (
                      <Button variant="outline" onClick={() => handleAdvanceStatus(order)} className="flex-1 gap-2">
                        <ChevronRight className="h-4 w-4" />
                        {nextStatusLabel(order.status)}
                      </Button>
                    )}
                    <Button variant="outline" size="sm" className="gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Message
                    </Button>
                    {order.status === 'delivered' && (
                      <Button variant="outline" size="sm" className="gap-2">
                        <Download className="h-4 w-4" />
                        Invoice
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {filteredOrders('pending').length > 0 ? (
            filteredOrders('pending').map((order) => (
              <Card key={order.id}>
                <CardContent className="pt-6">
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{order.id}</p>
                      <p className="text-sm text-gray-600">{isFarmer ? `Buyer: ${order.buyerName}` : `Seller: ${order.farmerName}`}</p>
                    </div>
                    <Badge className="gap-1 border border-yellow-300 bg-yellow-100 text-yellow-800">
                      <Clock className="h-4 w-4" />
                      Pending
                    </Badge>
                  </div>
                  <p className="mb-3 text-sm text-gray-600">{order.productName} · Qty {order.quantity}</p>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="font-bold text-gray-900">₹{order.totalPrice}</p>
                    <div className="flex gap-2">
                      <Button onClick={() => handleViewDetails(order)} className="gap-2">
                        View Details
                      </Button>
                      {isFarmer && (
                        <Button variant="outline" onClick={() => handleAdvanceStatus(order)} className="gap-2">
                          <ChevronRight className="h-4 w-4" />
                          Accept Order
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-gray-600">No pending orders</CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="accepted" className="space-y-4">
          {filteredOrders('accepted').length > 0 ? (
            filteredOrders('accepted').map((order) => (
              <Card key={order.id}>
                <CardContent className="pt-6">
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{order.id}</p>
                      <p className="text-sm text-gray-600">{isFarmer ? `Buyer: ${order.buyerName}` : `Seller: ${order.farmerName}`}</p>
                    </div>
                    <Badge className="gap-1 border border-blue-300 bg-blue-100 text-blue-800">
                      <Package className="h-4 w-4" />
                      Accepted
                    </Badge>
                  </div>
                  <p className="mb-3 text-sm text-gray-600">{order.productName} · Est. Delivery: {order.deliveryDate ?? 'Pending'}</p>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="font-bold text-gray-900">₹{order.totalPrice}</p>
                    <div className="flex gap-2">
                      <Button onClick={() => handleViewDetails(order)} className="gap-2">
                        View Details
                      </Button>
                      {isFarmer && (
                        <Button variant="outline" onClick={() => handleAdvanceStatus(order)} className="gap-2">
                          <ChevronRight className="h-4 w-4" />
                          Mark Delivered
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-gray-600">No accepted orders</CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="delivered" className="space-y-4">
          {filteredOrders('delivered').length > 0 ? (
            filteredOrders('delivered').map((order) => (
              <Card key={order.id}>
                <CardContent className="pt-6">
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{order.id}</p>
                      <p className="text-sm text-gray-600">{isFarmer ? `Buyer: ${order.buyerName}` : `Seller: ${order.farmerName}`}</p>
                    </div>
                    <Badge className="gap-1 border border-green-300 bg-green-100 text-green-800">
                      <CheckCircle className="h-4 w-4" />
                      Delivered
                    </Badge>
                  </div>
                  <p className="mb-3 text-sm text-gray-600">{order.productName} · Delivered on {order.deliveryDate ?? order.orderDate}</p>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="font-bold text-gray-900">₹{order.totalPrice}</p>
                    <Button onClick={() => handleViewDetails(order)} className="gap-2">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-gray-600">No delivered orders</CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={showOrderDetail} onOpenChange={setShowOrderDetail}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>Live details from shared state</DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="rounded-lg bg-gray-50 p-4 space-y-2">
                <p><span className="font-medium">Order:</span> {selectedOrder.id}</p>
                <p><span className="font-medium">Product:</span> {selectedOrder.productName}</p>
                <p><span className="font-medium">Buyer:</span> {selectedOrder.buyerName}</p>
                <p><span className="font-medium">Farmer:</span> {selectedOrder.farmerName}</p>
                <p><span className="font-medium">Status:</span> {selectedOrder.status}</p>
                <p><span className="font-medium">Total:</span> ₹{selectedOrder.totalPrice}</p>
              </div>
              {isFarmer && selectedOrder.status !== 'delivered' && (
                <Button className="w-full" onClick={() => {
                  handleAdvanceStatus(selectedOrder);
                  setShowOrderDetail(false);
                }}>
                  {selectedOrder.status === 'pending' ? 'Accept Order' : 'Mark Delivered'}
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrdersPage;
