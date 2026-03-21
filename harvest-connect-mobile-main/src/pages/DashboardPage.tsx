import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, ShoppingCart, MessageSquare, Star, Plus, Eye } from 'lucide-react';
import { User } from '@/context/AuthContext';

interface DashboardPageProps {
  user: User;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ user }) => {
  const isFarmer = user.role === 'farmer';
  const isBuyer = user.role === 'buyer';

  if (isFarmer) {
    return (
      <div className="space-y-6">
        {/* Header with animation */}
        <div className="animate-fade-in-scale">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Welcome back, {user.name}! 🧑‍🌾</h1>
          <p className="text-gray-600 mt-2">Here's what's happening with your farm today</p>
        </div>

        {/* Key Stats - with staggered animation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[
            { icon: ShoppingCart, label: 'Active Listings', value: '12', change: 'All active', color: 'from-green-500 to-emerald-600', textColor: 'text-green-600' },
            { icon: Eye, label: 'Total Views', value: '1,234', change: '↑ 12% this week', color: 'from-blue-500 to-cyan-600', textColor: 'text-blue-600' },
            { icon: TrendingUp, label: 'Revenue', value: '₹45,000', change: 'This month', color: 'from-purple-500 to-pink-600', textColor: 'text-purple-600' },
            { icon: Star, label: 'Rating', value: '4.8/5', change: '24 reviews', color: 'from-amber-500 to-orange-600', textColor: 'text-amber-600' },
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <Card key={idx} className={`animate-slide-in-bottom card-hover border-0 shadow-medium overflow-hidden`} style={{ animationDelay: `${idx * 50}ms` }}>
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-10`} />
                <CardHeader className="pb-3 relative">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <Icon className="h-5 w-5 md:h-6 md:w-6" />
                    {stat.label}
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative">
                  <p className="text-2xl md:text-3xl font-bold text-gray-900">{stat.value}</p>
                  <p className={`text-xs md:text-sm ${stat.textColor} mt-2 font-medium`}>{stat.change}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <Card className="animate-slide-in-bottom card-minimal border-0 shadow-medium">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 gap-2 h-auto py-3 text-white shadow-md hover:shadow-lg transition-all duration-200">
                <Plus className="h-5 w-5" />
                Add New Listing
              </Button>
              <Button variant="outline" className="gap-2 h-auto py-3 hover:bg-blue-50 transition-all duration-200">
                <MessageSquare className="h-5 w-5" />
                View Messages (3)
              </Button>
              <Button variant="outline" className="gap-2 h-auto py-3 hover:bg-amber-50 transition-all duration-200">
                <ShoppingCart className="h-5 w-5" />
                View Orders (2)
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="animate-slide-in-bottom card-minimal border-0 shadow-medium" style={{ animationDelay: '100ms' }}>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Recent Orders</CardTitle>
            <CardDescription>Latest orders from buyers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3].map((order) => (
                <div key={order} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border border-gray-100 rounded-xl hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all duration-200 group">
                  <div className="mb-3 sm:mb-0">
                    <p className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors">{`Organic Tomatoes (${50 + order * 10} kg)`}</p>
                    <p className="text-sm text-gray-600">From: {['Priya Singh', 'Rajesh Kumar', 'Deepika Nair'][order - 1]}</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="font-bold text-green-600 text-lg">₹{1500 + order * 200}</p>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${order === 1 ? 'bg-amber-100 text-amber-700' : order === 2 ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                      {order === 1 ? 'Pending' : order === 2 ? 'Processing' : 'Delivered'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isBuyer) {
    return (
      <div className="space-y-6">
        {/* Header with animation */}
        <div className="animate-fade-in-scale">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Welcome back, {user.name}! 🧑‍💼</h1>
          <p className="text-gray-600 mt-2">Discover fresh produce from local farmers</p>
        </div>

        {/* Key Stats - with staggered animation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[
            { icon: ShoppingCart, label: 'Orders Placed', value: '8', change: 'Total orders', color: 'from-blue-500 to-cyan-600', textColor: 'text-blue-600' },
            { icon: Eye, label: 'Favorites', value: '23', change: '↑ 5 new this week', color: 'from-pink-500 to-rose-600', textColor: 'text-pink-600' },
            { icon: TrendingUp, label: 'Total Spent', value: '₹12,500', change: 'Lifetime', color: 'from-emerald-500 to-green-600', textColor: 'text-emerald-600' },
            { icon: Star, label: 'Saved Items', value: '15', change: 'For later purchase', color: 'from-purple-500 to-violet-600', textColor: 'text-purple-600' },
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <Card key={idx} className={`animate-slide-in-bottom card-hover border-0 shadow-medium overflow-hidden`} style={{ animationDelay: `${idx * 50}ms` }}>
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-10`} />
                <CardHeader className="pb-3 relative">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <Icon className="h-5 w-5 md:h-6 md:w-6" />
                    {stat.label}
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative">
                  <p className="text-2xl md:text-3xl font-bold text-gray-900">{stat.value}</p>
                  <p className={`text-xs md:text-sm ${stat.textColor} mt-2 font-medium`}>{stat.change}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <Card className="animate-slide-in-bottom card-minimal border-0 shadow-medium">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 gap-2 h-auto py-3 text-white shadow-md hover:shadow-lg transition-all duration-200">
                <ShoppingCart className="h-5 w-5" />
                Browse Listings
              </Button>
              <Button variant="outline" className="gap-2 h-auto py-3 hover:bg-pink-50 transition-all duration-200">
                <MessageSquare className="h-5 w-5" />
                Messages (2)
              </Button>
              <Button variant="outline" className="gap-2 h-auto py-3 hover:bg-purple-50 transition-all duration-200">
                <ShoppingCart className="h-5 w-5" />
                My Orders (1)
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Featured Crops */}
        <Card className="animate-slide-in-bottom card-minimal border-0 shadow-medium" style={{ animationDelay: '100ms' }}>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Featured Crops</CardTitle>
            <CardDescription>Fresh picks for you today</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Total Spent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-900">₹12,500</p>
            <p className="text-xs text-green-600 mt-2">Lifetime</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Star className="h-4 w-4" />
              Saved Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-900">15</p>
            <p className="text-xs text-purple-600 mt-2">For later purchase</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Connections
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-900">6</p>
            <p className="text-xs text-blue-600 mt-2">Favorite farmers</p>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Button className="bg-blue-600 hover:bg-blue-700 gap-2 h-auto py-3">
                <ShoppingCart className="h-5 w-5" />
                Browse Listings
              </Button>
              <Button variant="outline" className="gap-2 h-auto py-3">
                <MessageSquare className="h-5 w-5" />
                Messages (2)
              </Button>
              <Button variant="outline" className="gap-2 h-auto py-3">
                <ShoppingCart className="h-5 w-5" />
                My Orders (1)
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Featured Crops */}
        <Card className="animate-slide-in-bottom card-minimal border-0 shadow-medium" style={{ animationDelay: '150ms' }}>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Featured Crops</CardTitle>
            <CardDescription>Fresh picks for you today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              { [
                { crop: 'Organic Tomatoes', price: '₹30/kg', location: 'Maharashtra', rating: 4.8, icon: '🍅' },
                { crop: 'Fresh Carrots', price: '₹20/kg', location: 'Punjab', rating: 4.9, icon: '🥕' },
                { crop: 'Spinach Bundle', price: '₹15/kg', location: 'Haryana', rating: 4.7, icon: '🥬' },
              ].map((item, idx) => (
                <div key={item.crop} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border border-gray-100 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 transition-all duration-200 group" style={{ animationDelay: `${idx * 30}ms` }}>
                  <div className="flex items-start gap-3 mb-3 sm:mb-0">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <p className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">{item.crop}</p>
                      <p className="text-sm text-gray-600">📍 {item.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <p className="font-bold text-blue-600 text-lg">{item.price}</p>
                    <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1.5 rounded-lg">
                      <span className="text-sm font-medium text-amber-700">⭐ {item.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-scale">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Dashboard</h1>
      <p className="text-gray-600">Welcome to your dashboard</p>
    </div>
  );
};

export default DashboardPage;
