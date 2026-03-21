import React, { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, BarChart3, LogOut, Package, Shield, ShoppingCart, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useGlobalState } from '@/context/GlobalStateContext';
import { User } from '@/context/AuthContext';
import { useLocation } from 'react-router-dom';

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
}

const statusClasses: Record<string, string> = {
  pending: 'bg-orange-100 text-orange-800',
  accepted: 'bg-blue-100 text-blue-800',
  confirmed: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const roleBadgeClasses: Record<string, string> = {
  farmer: 'bg-green-100 text-green-800',
  buyer: 'bg-blue-100 text-blue-800',
  admin: 'bg-purple-100 text-purple-800',
};

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onLogout }) => {
  const { currentUser, users, products, orders, deleteUser, blockUser } = useGlobalState();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();

  useEffect(() => {
    const tab = new URLSearchParams(location.search).get('tab');

    if (tab === 'users' || tab === 'products' || tab === 'orders' || tab === 'overview') {
      setActiveTab(tab);
    }
  }, [location.search]);

  const allUsers = useMemo(() => {
    const adminUser = currentUser?.role === 'admin' ? [currentUser] : [];
    const mergedUsers = [...adminUser, ...users].filter(
      (entry, index, array) => array.findIndex((candidate) => candidate.id === entry.id) === index
    );

    if (!searchQuery.trim()) {
      return mergedUsers;
    }

    const query = searchQuery.toLowerCase();
    return mergedUsers.filter(
      (entry) =>
        entry.name.toLowerCase().includes(query) ||
        entry.email.toLowerCase().includes(query) ||
        entry.location.toLowerCase().includes(query) ||
        entry.role.toLowerCase().includes(query)
    );
  }, [currentUser, searchQuery, users]);

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) {
      return products;
    }

    const query = searchQuery.toLowerCase();
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.farmerName.toLowerCase().includes(query) ||
        product.location.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
    );
  }, [products, searchQuery]);

  const filteredOrders = useMemo(() => {
    if (!searchQuery.trim()) {
      return orders;
    }

    const query = searchQuery.toLowerCase();
    return orders.filter(
      (order) =>
        order.productName.toLowerCase().includes(query) ||
        order.buyerName.toLowerCase().includes(query) ||
        order.farmerName.toLowerCase().includes(query) ||
        order.status.toLowerCase().includes(query)
    );
  }, [orders, searchQuery]);

  const stats = {
    totalUsers: allUsers.length,
    totalFarmers: allUsers.filter((entry) => entry.role === 'farmer').length,
    totalBuyers: allUsers.filter((entry) => entry.role === 'buyer').length,
    totalProducts: products.length,
    totalOrders: orders.length,
    pendingOrders: orders.filter((order) => order.status === 'pending').length,
  };

  const handleRemoveUser = (userId: string) => {
    deleteUser(userId);
  };

  const handleBlockUser = (userId: string) => {
    blockUser(userId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      <div className="border-b border-gray-200 bg-white/90 backdrop-blur-sm shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-200">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
              <p className="text-sm text-gray-600">FarmDirect administration and moderation</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
            <Button onClick={onLogout} variant="outline" className="gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Live platform overview</h2>
            <p className="text-gray-600">Browse all users, products, and orders. Remove users from state when needed.</p>
          </div>

          <div className="w-full max-w-xl">
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search users, products, or orders..."
              className="bg-white"
            />
          </div>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <Users className="h-4 w-4" />
                Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <Package className="h-4 w-4" />
                Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <ShoppingCart className="h-4 w-4" />
                Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <BarChart3 className="h-4 w-4" />
                Farmers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-gray-900">{stats.totalFarmers}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <Users className="h-4 w-4" />
                Buyers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-gray-900">{stats.totalBuyers}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <AlertTriangle className="h-4 w-4" />
                Pending Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-orange-600">{stats.pendingOrders}</p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 gap-2 bg-white p-1 shadow-sm">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Platform Snapshot</CardTitle>
                <CardDescription>Key counts pulled directly from the shared app state</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <div className="rounded-xl border bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">Users</p>
                    <p className="mt-2 text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
                  </div>
                  <div className="rounded-xl border bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">Products</p>
                    <p className="mt-2 text-3xl font-bold text-gray-900">{stats.totalProducts}</p>
                  </div>
                  <div className="rounded-xl border bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">Orders</p>
                    <p className="mt-2 text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
                  </div>
                  <div className="rounded-xl border bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">Pending Orders</p>
                    <p className="mt-2 text-3xl font-bold text-orange-600">{stats.pendingOrders}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="mt-6 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Delete or block users by removing them from shared state</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[560px] pr-4">
                  <div className="space-y-3">
                    {allUsers.map((entry) => (
                      <div key={entry.id} className="flex flex-col gap-4 rounded-xl border bg-white p-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-700">
                            {entry.name
                              .split(' ')
                              .slice(0, 2)
                              .map((part) => part.charAt(0))
                              .join('')
                              .toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="truncate font-semibold text-gray-900">{entry.name}</h3>
                              <Badge className={roleBadgeClasses[entry.role] ?? 'bg-gray-100 text-gray-800'}>
                                {entry.role}
                              </Badge>
                              {currentUser?.id === entry.id && <Badge variant="secondary">Current user</Badge>}
                            </div>
                            <p className="truncate text-sm text-gray-600">{entry.email}</p>
                            <p className="text-sm text-gray-500">{entry.location}</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                          <Button
                            variant="outline"
                            onClick={() => handleBlockUser(entry.id)}
                            disabled={currentUser?.id === entry.id}
                          >
                            Block
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => handleRemoveUser(entry.id)}
                            disabled={currentUser?.id === entry.id}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}

                    {allUsers.length === 0 && (
                      <div className="rounded-xl border border-dashed p-8 text-center text-gray-500">
                        No users match your search.
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="mt-6 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Products</CardTitle>
                <CardDescription>View every product currently stored in the shared state</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[560px] pr-4">
                  <div className="space-y-3">
                    {filteredProducts.map((product) => (
                      <div key={product.id} className="rounded-xl border bg-white p-4">
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                          <div className="min-w-0 space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-semibold text-gray-900">{product.name}</h3>
                              <Badge variant={product.available ? 'default' : 'secondary'}>
                                {product.available ? 'Available' : 'Unavailable'}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">{product.description}</p>
                            <p className="text-sm text-gray-500">
                              {product.category} • {product.location} • Farmer: {product.farmerName}
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="text-lg font-semibold text-gray-900">₹{product.price}</p>
                            <p className="text-sm text-gray-500">Qty: {product.quantity} {product.unit}</p>
                          </div>
                        </div>
                      </div>
                    ))}

                    {filteredProducts.length === 0 && (
                      <div className="rounded-xl border border-dashed p-8 text-center text-gray-500">
                        No products match your search.
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="mt-6 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Orders</CardTitle>
                <CardDescription>Track every order flowing through the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[560px] pr-4">
                  <div className="space-y-3">
                    {filteredOrders.map((order) => (
                      <div key={order.id} className="rounded-xl border bg-white p-4">
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-semibold text-gray-900">{order.productName}</h3>
                              <Badge className={statusClasses[order.status] ?? 'bg-gray-100 text-gray-800'}>
                                {order.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">
                              Buyer: {order.buyerName} • Farmer: {order.farmerName}
                            </p>
                            <p className="text-sm text-gray-500">
                              Ordered on {order.orderDate} • Quantity {order.quantity}
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="text-lg font-semibold text-gray-900">₹{order.totalPrice}</p>
                            <p className="text-sm text-gray-500">Order ID: {order.id}</p>
                          </div>
                        </div>
                      </div>
                    ))}

                    {filteredOrders.length === 0 && (
                      <div className="rounded-xl border border-dashed p-8 text-center text-gray-500">
                        No orders match your search.
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;