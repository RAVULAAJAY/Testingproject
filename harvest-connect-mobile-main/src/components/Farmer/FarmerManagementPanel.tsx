import React, { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Edit, Trash2, Package, ShoppingCart, TrendingUp, CheckCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useGlobalState } from '@/context/GlobalStateContext';
import AddProductForm, { Product as FormProduct } from '@/components/Farmer/AddProductForm';
import ProductList from '@/components/Farmer/ProductList';
import { Product, Order } from '@/lib/data';

const getTodayIsoDate = () => new Date().toISOString().split('T')[0];

const FarmerManagementPanel: React.FC = () => {
  const { currentUser } = useAuth();
  const { products, orders, addProduct, updateProduct, deleteProduct } = useGlobalState();
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  const farmerProducts = useMemo(
    () => products.filter((product) => product.farmerId === currentUser?.id),
    [products, currentUser?.id]
  );

  const farmerOrders = useMemo(
    () => orders.filter((order) => order.farmerId === currentUser?.id),
    [orders, currentUser?.id]
  );

  const stats = useMemo(() => {
    const totalInventory = farmerProducts.reduce((sum, product) => sum + product.quantity, 0);
    const totalRevenue = farmerOrders
      .filter((order) => order.status === 'delivered')
      .reduce((sum, order) => sum + order.totalPrice, 0);

    return {
      totalProducts: farmerProducts.length,
      activeProducts: farmerProducts.filter((product) => product.quantity > 0).length,
      totalInventory,
      totalOrders: farmerOrders.length,
      pendingOrders: farmerOrders.filter((order) => order.status === 'pending').length,
      deliveredOrders: farmerOrders.filter((order) => order.status === 'delivered').length,
      totalRevenue,
    };
  }, [farmerProducts, farmerOrders]);

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    window.setTimeout(() => setSuccessMessage(''), 3000);
  };

  const openAddDialog = () => {
    setEditingProduct(null);
    setIsProductDialogOpen(true);
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setIsProductDialogOpen(true);
  };

  const closeProductDialog = () => {
    setIsProductDialogOpen(false);
    setEditingProduct(null);
  };

  const buildProductPayload = (formProduct: Omit<FormProduct, 'id' | 'createdAt'>, existingProduct?: Product): Product => ({
    id: existingProduct?.id ?? Date.now().toString(),
    name: formProduct.name,
    description: formProduct.description,
    price: formProduct.price,
    unit: formProduct.unit,
    quantity: formProduct.quantity,
    farmerId: currentUser.id,
    farmerName: currentUser.name,
    location: formProduct.location,
    category: formProduct.category,
    image: formProduct.image,
    rating: existingProduct?.rating ?? 0,
    reviews: existingProduct?.reviews ?? 0,
    available: formProduct.quantity > 0,
    harvestDate: existingProduct?.harvestDate ?? getTodayIsoDate(),
    createdAt: existingProduct?.createdAt ?? new Date().toISOString(),
  });

  const handleSaveProduct = (formProduct: Omit<FormProduct, 'id' | 'createdAt'>) => {
    const payload = buildProductPayload(formProduct, editingProduct ?? undefined);

    if (editingProduct) {
      updateProduct(editingProduct.id, payload);
      showSuccess(`"${payload.name}" updated successfully.`);
    } else {
      addProduct(payload);
      showSuccess(`"${payload.name}" added successfully.`);
    }

    closeProductDialog();
  };

  const handleDeleteProduct = (productId: string) => {
    const product = farmerProducts.find((item) => item.id === productId);
    deleteProduct(productId);
    if (product) {
      showSuccess(`"${product.name}" deleted successfully.`);
    }
  };

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Farmer Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage products, edit listings, and review orders from buyers.</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700 gap-2" onClick={openAddDialog}>
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      {successMessage && (
        <Alert className="bg-green-50 border-green-200 text-green-800">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-gray-600">My Products</p>
            <p className="text-3xl font-bold text-gray-900">{stats.totalProducts}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-gray-600">Active</p>
            <p className="text-3xl font-bold text-green-600">{stats.activeProducts}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-gray-600">Inventory</p>
            <p className="text-3xl font-bold text-blue-600">{stats.totalInventory}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-gray-600">Orders</p>
            <p className="text-3xl font-bold text-purple-600">{stats.totalOrders}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-gray-600">Pending</p>
            <p className="text-3xl font-bold text-orange-600">{stats.pendingOrders}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-gray-600">Revenue</p>
            <p className="text-3xl font-bold text-emerald-600">₹{stats.totalRevenue.toFixed(0)}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="products" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="products" className="gap-2">
            <Package className="h-4 w-4" />
            Products
          </TabsTrigger>
          <TabsTrigger value="orders" className="gap-2">
            <ShoppingCart className="h-4 w-4" />
            Orders
          </TabsTrigger>
          <TabsTrigger value="profile" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            Profile
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <ProductList
            products={farmerProducts}
            onEdit={openEditDialog}
            onDelete={handleDeleteProduct}
            onAddNew={openAddDialog}
            isFarmerView={true}
            allowActions={true}
          />
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Orders Received</CardTitle>
              <CardDescription>Orders placed by buyers for your products</CardDescription>
            </CardHeader>
            <CardContent>
              {farmerOrders.length > 0 ? (
                <div className="space-y-4">
                  {farmerOrders.map((order) => (
                    <div key={order.id} className="flex flex-col gap-3 rounded-lg border p-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold text-gray-900">{order.productName}</h3>
                          <Badge variant="secondary" className="capitalize">{order.status}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">Buyer: {order.buyerName}</p>
                        <p className="text-sm text-gray-600">Qty: {order.quantity} | Ordered: {order.orderDate}</p>
                      </div>
                      <div className="text-left md:text-right">
                        <p className="font-semibold text-gray-900">₹{order.totalPrice}</p>
                        <p className="text-sm text-gray-600">Order ID: {order.id}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-gray-600">
                  No orders received yet.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Farm Profile</CardTitle>
              <CardDescription>Your account summary</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Logged in as</p>
                <p className="font-semibold text-gray-900">{currentUser.name}</p>
                <p className="text-sm text-gray-600">{currentUser.email}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="capitalize">{currentUser.role}</Badge>
                <Badge variant="secondary">{currentUser.location}</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Edit Product' : 'Add Product'}</DialogTitle>
            <DialogDescription>
              {editingProduct ? 'Update the product details and save your changes.' : 'Create a new product listing for your farm.'}
            </DialogDescription>
          </DialogHeader>
          <AddProductForm
            initialProduct={editingProduct}
            submitLabel={editingProduct ? 'Save Changes' : 'Add Product'}
            title={editingProduct ? 'Edit Product' : 'Add New Product'}
            description={editingProduct ? 'Update the product information below.' : 'List a new product to sell on the marketplace.'}
            onSubmit={handleSaveProduct}
            onCancel={closeProductDialog}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FarmerManagementPanel;
