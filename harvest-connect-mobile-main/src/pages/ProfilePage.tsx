import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Edit,
  Camera,
  Copy,
  ExternalLink
} from 'lucide-react';
import { User } from '@/context/AuthContext';

interface ProfilePageProps {
  user: User;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user }) => {
  const getRoleEmoji = (role: string) => {
    switch(role) {
      case 'farmer': return '🧑‍🌾';
      case 'buyer': return '🧑‍💼';
      case 'admin': return '🔐';
      default: return '👤';
    }
  };

  const getRoleColor = (role: string) => {
    switch(role) {
      case 'farmer': return 'green';
      case 'buyer': return 'blue';
      case 'admin': return 'purple';
      default: return 'gray';
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className={`text-6xl bg-${getRoleColor(user.role)}-100 w-24 h-24 rounded-full flex items-center justify-center`}>
                {getRoleEmoji(user.role)}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                <div className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium bg-${getRoleColor(user.role)}-100 text-${getRoleColor(user.role)}-800`}>
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </div>
              </div>
            </div>
            <Button variant="outline" className="gap-2">
              <Edit className="h-4 w-4" />
              Edit Profile
            </Button>
          </div>

          <div className="space-y-2 text-gray-600">
            <p>Email: {user.email}</p>
            <p>Phone: {user.phone}</p>
            <p>Location: {user.location}</p>
            {user.createdAt && (
              <p>Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Profile Stats */}
      {user.role === 'farmer' && (
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Active Listings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">12</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Sold</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-600">₹45,000</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-yellow-600">4.8/5</p>
            </CardContent>
          </Card>
        </div>
      )}

      {user.role === 'buyer' && (
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Orders Placed</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-600">8</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Spent</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">₹12,500</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Saved Items</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-purple-600">15</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* About Section */}
      <Card>
        <CardHeader>
          <CardTitle>About</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-gray-600">Bio</Label>
            <p className="mt-2 text-gray-700">
              {user.role === 'farmer' 
                ? 'Organic farmer with 10 years of experience growing fresh vegetables.'
                : 'Quality-focused buyer committed to supporting local farmers.'}
            </p>
          </div>
          <Button className="w-full bg-green-600 hover:bg-green-700">
            Edit Profile Details
          </Button>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Email</Label>
            <div className="flex gap-2 mt-2">
              <Input value={user.email} readOnly className="bg-gray-50" />
              <Button variant="outline" size="sm">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div>
            <Label>Phone</Label>
            <div className="flex gap-2 mt-2">
              <Input value={user.phone} readOnly className="bg-gray-50" />
              <Button variant="outline" size="sm">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card>
        <CardHeader>
          <CardTitle>Social Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {['Facebook', 'Instagram', 'WhatsApp'].map((social) => (
            <Button key={social} variant="outline" className="w-full justify-start">
              <ExternalLink className="h-4 w-4 mr-2" />
              {social}
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
