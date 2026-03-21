import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useParams } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { GlobalStateProvider, useGlobalState } from "./context/GlobalStateContext";
import Layout from "./components/Layout";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import OrdersPage from "./pages/OrdersPage";
import MessagesPage from "./pages/MessagesPage";
import ChatListPage from "./pages/ChatPage";
import PaymentDemoPage from "./pages/PaymentDemoPage";
import LocationPage from "./pages/LocationPage";
import RatingsPage from "./pages/RatingsPage";
import DeliveryPage from "./pages/DeliveryPage";
import NotificationsPage from "./pages/NotificationsPage";
import MyListingsPage from "./pages/Farmer/MyListingsPage";
import FarmerDashboardPage from "./pages/Farmer/FarmerDashboardPage";
import BrowseListingsPage from "./pages/Buyer/BrowseListingsPage";
import BuyerDashboardPage from "./pages/Buyer/BuyerDashboardPage";
import AdminDashboard from "./components/AdminDashboard";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import { dummyUsers } from "./lib/data";

const queryClient = new QueryClient();

interface FarmerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  rating: number;
  reviews: number;
  totalSales: number;
  joinDate: string;
  certifications: string[];
  bio: string;
}

interface ProductRecord {
  id: string;
  name: string;
  farmerId: string;
  farmerName: string;
  price: number;
  quantity: number;
  unit: string;
  image: string;
  location: string;
  description: string;
  category: string;
  createdAt: Date;
}

// Sample farmer data
const farmerDatabase: Record<string, FarmerProfile> = {
  farmer1: {
    id: 'farmer1',
    name: 'Green Valley Farms',
    email: 'greenvalley@example.com',
    phone: '+91 98765 43210',
    location: 'Sector 45, Noida',
    rating: 4.8,
    reviews: 124,
    totalSales: 450,
    joinDate: 'Mar 2023',
    certifications: ['Organic Certified', 'ISO 22000', 'State Verified'],
    bio: 'Family-owned farm with 15 years of experience in sustainable organic farming. We believe in direct farmer-to-consumer relationships and quality produce.'
  },
  farmer2: {
    id: 'farmer2',
    name: 'Honey Sweet Farm',
    email: 'honeysweet@example.com',
    phone: '+91 97654 32109',
    location: 'Greater Noida',
    rating: 4.9,
    reviews: 98,
    totalSales: 320,
    joinDate: 'May 2023',
    certifications: ['Honey Certified', 'Bee Friendly', 'Organic'],
    bio: 'Specialized in pure, natural honey and bee products. Committed to sustainable beekeeping practices.'
  },
  farmer3: {
    id: 'farmer3',
    name: 'Organic Harvest',
    email: 'organicharvest@example.com',
    phone: '+91 96543 21098',
    location: 'Delhi',
    rating: 4.6,
    reviews: 76,
    totalSales: 210,
    joinDate: 'Jul 2023',
    certifications: ['100% Organic', 'Pesticide-Free', 'Govt Verified'],
    bio: 'Dedicated to providing chemical-free organic vegetables fresh from our farm to your table.'
  }
};

// Sample products database
const productDatabase: Record<string, { product: ProductRecord; farmer: FarmerProfile }> = {
  '1': {
    product: {
      id: '1',
      name: 'Fresh Tomatoes',
      farmerId: 'farmer1',
      farmerName: 'Green Valley Farms',
      price: 40,
      quantity: 50,
      unit: 'kg',
      image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Ccircle cx="50" cy="50" r="45" fill="%23EF4444"/%3E%3Cpath d="M50 10 Q60 20 60 30 Q60 40 50 45" fill="%23059669"/%3E%3C/svg%3E',
      location: 'Sector 45, Noida',
      description: 'Fresh, organic tomatoes grown without pesticides. Perfect for cooking, salads, and sauces. Harvested daily for maximum freshness.',
      category: 'vegetables',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    },
    farmer: farmerDatabase.farmer1
  },
  '2': {
    product: {
      id: '2',
      name: 'Honeycomb',
      farmerId: 'farmer2',
      farmerName: 'Honey Sweet Farm',
      price: 300,
      quantity: 20,
      unit: 'kg',
      image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect x="10" y="10" width="80" height="80" fill="%23FCD34D"/%3E%3Cpath d="M30 30 M40 25 M50 30 M60 25 M70 30" stroke="%23F59E0B" stroke-width="2"/%3E%3C/svg%3E',
      location: 'Greater Noida',
      description: 'Pure honeycomb, directly from the hive. Rich in nutrients and natural vitamins. Sustainably harvested using bee-friendly methods.',
      category: 'honey',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    },
    farmer: farmerDatabase.farmer2
  }
};

// Wrapper component for product details
const ProductDetailsPageWrapper = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products } = useGlobalState();
  
  const product = products.find((item) => item.id === id) ?? productDatabase[id as string]?.product;
  const farmerId = product?.farmerId ?? productDatabase[id as string]?.product?.farmerId;
  const fallbackFromDummy = dummyUsers.find((user) => user.id === farmerId);
  const fallbackFarmer: Partial<FarmerProfile> | undefined =
    farmerDatabase[farmerId ?? ''] ??
    (fallbackFromDummy
      ? {
          id: fallbackFromDummy.id,
          name: fallbackFromDummy.name,
          email: fallbackFromDummy.email,
          phone: fallbackFromDummy.phone ?? 'N/A',
          location: fallbackFromDummy.location,
        }
      : undefined);
  const farmer = product
    ? {
        id: farmerId ?? product.farmerId,
        name: product.farmerName || fallbackFarmer?.name || 'Farmer',
        email: fallbackFarmer?.email || 'farmer@example.com',
        phone: fallbackFarmer?.phone || 'N/A',
        location: product.location || fallbackFarmer?.location || 'Unknown',
        rating: fallbackFarmer?.rating ?? 4.5,
        reviews: fallbackFarmer?.reviews ?? 24,
        totalSales: fallbackFarmer?.totalSales ?? 0,
        joinDate: fallbackFarmer?.joinDate ?? 'Recently joined',
        certifications: fallbackFarmer?.certifications ?? [],
        bio: fallbackFarmer?.bio ?? 'Local farmer on the platform.',
      }
    : undefined;
  
  if (!product || !farmer) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Product not found</h1>
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 hover:text-blue-700"
        >
          Go back
        </button>
      </div>
    );
  }
  
  return (
    <ProductDetailsPage
      product={product}
      farmer={farmer}
      onBack={() => navigate(-1)}
    />
  );
};

const AppRoutes = () => {
  const { currentUser, logout } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Index />} />
      
      {/* Protected Routes - Require login */}
      {currentUser ? (
        <>
          {/* Dashboard */}
          <Route
            path="/dashboard"
            element={
              <Layout
                user={currentUser}
                onLogout={logout}
                currentPath="/dashboard"
              >
                <DashboardPage user={currentUser} />
              </Layout>
            }
          />
          
          {/* Common Pages */}
          <Route
            path="/profile"
            element={
              <Layout
                user={currentUser}
                onLogout={logout}
                currentPath="/profile"
              >
                <ProfilePage user={currentUser} />
              </Layout>
            }
          />
          <Route
            path="/settings"
            element={
              <Layout
                user={currentUser}
                onLogout={logout}
                currentPath="/settings"
              >
                <SettingsPage user={currentUser} />
              </Layout>
            }
          />
          <Route
            path="/messages"
            element={
              <Layout
                user={currentUser}
                onLogout={logout}
                currentPath="/messages"
              >
                <MessagesPage user={currentUser} />
              </Layout>
            }
          />
          <Route
            path="/chat"
            element={
              <Layout
                user={currentUser}
                onLogout={logout}
                currentPath="/chat"
              >
                <ChatListPage />
              </Layout>
            }
          />
          
          <Route
            path="/payment"
            element={
              <Layout
                user={currentUser}
                onLogout={logout}
                currentPath="/payment"
              >
                <PaymentDemoPage />
              </Layout>
            }
          />
          
          <Route
            path="/locations"
            element={
              <Layout
                user={currentUser}
                onLogout={logout}
                currentPath="/locations"
              >
                <LocationPage />
              </Layout>
            }
          />
          
          <Route
            path="/ratings"
            element={
              <Layout
                user={currentUser}
                onLogout={logout}
                currentPath="/ratings"
              >
                <RatingsPage />
              </Layout>
            }
          />
          
          <Route
            path="/delivery"
            element={
              <Layout
                user={currentUser}
                onLogout={logout}
                currentPath="/delivery"
              >
                <DeliveryPage />
              </Layout>
            }
          />
          
          <Route
            path="/notifications"
            element={
              <Layout
                user={currentUser}
                onLogout={logout}
                currentPath="/notifications"
              >
                <NotificationsPage />
              </Layout>
            }
          />
          
          {/* Orders (for both farmer and buyer) */}
          <Route
            path="/orders"
            element={
              <Layout
                user={currentUser}
                onLogout={logout}
                currentPath="/orders"
              >
                <OrdersPage user={currentUser} />
              </Layout>
            }
          />
          
          {/* Farmer Routes */}
          {currentUser.role === 'farmer' && (
            <>
              <Route
                path="/farmer/dashboard"
                element={
                  <Layout
                    user={currentUser}
                    onLogout={logout}
                    currentPath="/farmer/dashboard"
                  >
                    <FarmerDashboardPage />
                  </Layout>
                }
              />
              <Route
                path="/my-listings"
                element={
                  <Layout
                    user={currentUser}
                    onLogout={logout}
                    currentPath="/my-listings"
                  >
                    <MyListingsPage user={currentUser} />
                  </Layout>
                }
              />
            </>
          )}
          
          {/* Buyer Routes */}
          {currentUser.role === 'buyer' && (
            <>
              <Route
                path="/buyer/dashboard"
                element={
                  <Layout
                    user={currentUser}
                    onLogout={logout}
                    currentPath="/buyer/dashboard"
                  >
                    <BuyerDashboardPage />
                  </Layout>
                }
              />
              <Route
                path="/browse"
                element={
                  <Layout
                    user={currentUser}
                    onLogout={logout}
                    currentPath="/browse"
                  >
                    <BrowseListingsPage user={currentUser} />
                  </Layout>
                }
              />
            </>
          )}

          {/* Admin Routes */}
          {currentUser.role === 'admin' && (
            <Route
              path="/admin/dashboard"
              element={
                <Layout
                  user={currentUser}
                  onLogout={logout}
                  currentPath="/admin/dashboard"
                >
                  <AdminDashboard user={currentUser} onLogout={logout} />
                </Layout>
              }
            />
          )}
        </>
      ) : null}
      
      {/* Product Details Route - Public but needs product ID */}
      <Route path="/product/:id" element={
        currentUser ? (
          <Layout
            user={currentUser}
            onLogout={logout}
            currentPath=""
          >
            <ProductDetailsPageWrapper />
          </Layout>
        ) : (
          <Navigate to="/" replace />
        )
      } />
      
      {/* Catch All */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <GlobalStateProvider>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </GlobalStateProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
