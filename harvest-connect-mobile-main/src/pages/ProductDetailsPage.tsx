import React, { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Star,
  MapPin,
  Phone,
  Mail,
  Award,
  Truck,
  Shield,
  Heart,
  Share2,
  MessageCircle,
  ShoppingCart,
  Check,
  AlertCircle,
} from 'lucide-react';
import { Product } from '@/lib/data';
import { useGlobalState } from '@/context/GlobalStateContext';

interface Farmer {
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

interface ProductDetailsPageProps {
  product: Product;
  farmer?: Partial<Farmer>;
  onBack?: () => void;
}

const categoryLabels: Record<string, string> = {
  vegetables: 'Vegetables',
  fruits: 'Fruits',
  grains: 'Grains',
  dairy: 'Dairy',
  meat: 'Meat & Poultry',
  honey: 'Honey & Spices',
  organic: 'Organic',
  other: 'Other',
};

const categoryColors: Record<string, string> = {
  vegetables: 'bg-green-100 text-green-700',
  fruits: 'bg-red-100 text-red-700',
  grains: 'bg-yellow-100 text-yellow-700',
  dairy: 'bg-blue-100 text-blue-700',
  meat: 'bg-purple-100 text-purple-700',
  honey: 'bg-orange-100 text-orange-700',
  organic: 'bg-emerald-100 text-emerald-700',
  other: 'bg-gray-100 text-gray-700',
};

const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({
  product,
  farmer,
  onBack,
}) => {
  const {
    currentUser,
    placeOrder,
    isFavoriteProduct,
    toggleFavoriteProduct,
  } = useGlobalState();

  const [quantity, setQuantity] = useState(1);
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [showOrderDialog, setShowOrderDialog] = useState(false);
  const [contactMessage, setContactMessage] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);

  const resolvedFarmer: Farmer = useMemo(() => ({
    id: farmer?.id ?? product.farmerId,
    name: farmer?.name ?? product.farmerName ?? 'Farmer',
    email: farmer?.email ?? 'farmer@example.com',
    phone: farmer?.phone ?? 'N/A',
    location: farmer?.location ?? product.location,
    rating: farmer?.rating ?? 4.5,
    reviews: farmer?.reviews ?? 0,
    totalSales: farmer?.totalSales ?? 0,
    joinDate: farmer?.joinDate ?? 'Recently joined',
    certifications: farmer?.certifications ?? [],
    bio: farmer?.bio ?? 'Local farmer on the platform.',
  }), [farmer, product]);

  const isFavorite = isFavoriteProduct(product.id);
  const listedDate = product.createdAt ?? product.harvestDate;

  const reviews = [
    {
      id: 1,
      author: 'Rajesh Kumar',
      rating: 5,
      date: '2 days ago',
      text: 'Excellent quality and very fresh.',
    },
    {
      id: 2,
      author: 'Priya Singh',
      rating: 4,
      date: '1 week ago',
      text: 'Good quality and prompt delivery.',
    },
    {
      id: 3,
      author: 'Amit Patel',
      rating: 5,
      date: '2 weeks ago',
      text: 'Highly recommend this farmer.',
    },
  ];

  const handleToggleFavorite = () => {
    toggleFavoriteProduct(product.id);
  };

  const handlePlaceOrder = () => {
    if (currentUser) {
      placeOrder(product, quantity);
    }

    setOrderSuccess(true);
    window.setTimeout(() => {
      setShowOrderDialog(false);
      setOrderSuccess(false);
      setQuantity(1);
    }, 1400);
  };

  const handleContactFarmer = () => {
    setShowContactDialog(false);
    setContactMessage('');
  };

  return (
    <div className="space-y-8 pb-8">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <button onClick={onBack} className="font-medium hover:text-gray-900">Back</button>
        <span>/</span>
        <span>{categoryLabels[product.category] ?? 'Other'}</span>
        <span>/</span>
        <span className="font-medium text-gray-900">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <div className="sticky top-4 space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg bg-gray-100 flex items-center justify-center">
              {product.image ? (
                <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
              ) : (
                <div className="text-gray-400">No image</div>
              )}
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1 gap-2" onClick={handleToggleFavorite}>
                <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                {isFavorite ? 'Saved' : 'Save'}
              </Button>
              <Button variant="outline" size="sm" className="flex-1 gap-2">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div>
            <Badge className={categoryColors[product.category] ?? categoryColors.other}>
              {categoryLabels[product.category] ?? 'Other'}
            </Badge>
            <h1 className="mt-2 text-4xl font-bold text-gray-900">{product.name}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    className={`h-5 w-5 ${
                      index < Math.floor(resolvedFarmer.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">{resolvedFarmer.rating} ({resolvedFarmer.reviews} reviews)</span>
              <span className="text-sm text-gray-600">•</span>
              <span className="text-sm text-gray-600">{resolvedFarmer.totalSales} sales</span>
            </div>
          </div>

          <div className="border-b border-gray-200 pb-6">
            <div className="mb-4 flex items-end gap-2">
              <p className="text-5xl font-bold text-gray-900">₹{product.price.toFixed(2)}</p>
              <p className="mb-2 text-xl text-gray-600">/{product.unit}</p>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="h-5 w-5" />
              <span>{product.location}</span>
            </div>
          </div>

          {product.quantity === 0 ? (
            <Alert className="bg-red-50 border-red-200 text-red-800">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>This product is currently out of stock</AlertDescription>
            </Alert>
          ) : product.quantity <= 10 ? (
            <Alert className="bg-orange-50 border-orange-200 text-orange-800">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Only {product.quantity} units available. Order now!</AlertDescription>
            </Alert>
          ) : (
            <Alert className="bg-green-50 border-green-200 text-green-800">
              <Check className="h-4 w-4" />
              <AlertDescription>{product.quantity} units in stock - Free delivery on orders above ₹500</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4 rounded-lg bg-gray-50 p-6">
            <div>
              <Label className="mb-3 block">Quantity</Label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={product.quantity === 0}
                >
                  −
                </Button>
                <span className="w-16 text-center text-2xl font-bold">{quantity}</span>
                <Button
                  variant="outline"
                  onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                  disabled={quantity >= product.quantity || product.quantity === 0}
                >
                  +
                </Button>
                <span className="ml-auto text-sm text-gray-600">{product.unit}</span>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => setShowOrderDialog(true)}
                disabled={product.quantity === 0}
                className="w-full gap-2 bg-green-600 py-6 text-lg text-white hover:bg-green-700"
              >
                <ShoppingCart className="h-5 w-5" />
                Place Order (₹{(product.price * quantity).toFixed(2)})
              </Button>
              <Button
                onClick={() => setShowContactDialog(true)}
                variant="outline"
                className="w-full gap-2 py-6 text-lg"
              >
                <MessageCircle className="h-5 w-5" />
                Contact Farmer
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Why Choose This Product?</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Shield className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900">Certified Quality</p>
                    <p className="text-sm text-gray-600">Direct from verified farmer</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Truck className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">Fast Delivery</p>
                    <p className="text-sm text-gray-600">Estimated 1-2 days delivery</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Award className="mt-0.5 h-5 w-5 flex-shrink-0 text-purple-600" />
                  <div>
                    <p className="font-medium text-gray-900">Fresh Guarantee</p>
                    <p className="text-sm text-gray-600">Harvested within 24 hours</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="description" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="farmer">Farmer Profile</TabsTrigger>
          <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="description">
          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <div>
                  <p className="mb-1 text-sm text-gray-600">Category</p>
                  <p className="font-semibold text-gray-900">{categoryLabels[product.category] ?? 'Other'}</p>
                </div>
                <div>
                  <p className="mb-1 text-sm text-gray-600">Price per {product.unit}</p>
                  <p className="font-semibold text-gray-900">₹{product.price.toFixed(2)}</p>
                </div>
                <div>
                  <p className="mb-1 text-sm text-gray-600">Available Quantity</p>
                  <p className="font-semibold text-gray-900">{product.quantity} {product.unit}</p>
                </div>
                <div>
                  <p className="mb-1 text-sm text-gray-600">Listed On</p>
                  <p className="font-semibold text-gray-900">{new Date(listedDate).toLocaleDateString()}</p>
                </div>
              </div>

              <div>
                <h3 className="mb-2 font-semibold text-gray-900">Description</h3>
                <p className="leading-relaxed text-gray-700">{product.description}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="farmer">
          <Card>
            <CardHeader>
              <CardTitle>Farmer Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start justify-between border-b pb-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">🧑‍🌾</div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{resolvedFarmer.name}</h3>
                    <p className="mt-1 text-gray-600">Verified Organic Farmer</p>
                    <div className="mt-2 flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <Star
                            key={index}
                            className={`h-4 w-4 ${
                              index < Math.floor(resolvedFarmer.rating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium text-gray-700">{resolvedFarmer.rating}/5.0</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="mb-1 text-sm text-gray-600">Total Sales</p>
                  <p className="text-2xl font-bold text-gray-900">{resolvedFarmer.totalSales}+</p>
                </div>
                <div>
                  <p className="mb-1 text-sm text-gray-600">Reviews</p>
                  <p className="text-2xl font-bold text-gray-900">{resolvedFarmer.reviews}</p>
                </div>
                <div>
                  <p className="mb-1 text-sm text-gray-600">Member Since</p>
                  <p className="text-sm font-bold text-gray-900">{resolvedFarmer.joinDate}</p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Contact Information</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-700">{resolvedFarmer.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-700">{resolvedFarmer.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-700">{resolvedFarmer.location}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="mb-2 font-semibold text-gray-900">About</h4>
                <p className="text-gray-700">{resolvedFarmer.bio}</p>
              </div>

              <div>
                <h4 className="mb-3 font-semibold text-gray-900">Certifications</h4>
                <div className="flex flex-wrap gap-2">
                  {resolvedFarmer.certifications.map((cert, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      <Award className="h-3 w-3" />
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>

              <Button onClick={() => setShowContactDialog(true)} className="w-full gap-2">
                <MessageCircle className="h-4 w-4" />
                Contact This Farmer
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews">
          <Card>
            <CardHeader>
              <CardTitle>Customer Reviews</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-4xl font-bold text-gray-900">{resolvedFarmer.rating}</p>
                <p className="mt-2 text-sm text-gray-600">Based on {resolvedFarmer.reviews} reviews</p>
              </div>

              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <div className="mb-2 flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">{review.author}</p>
                        <p className="text-sm text-gray-600">{review.date}</p>
                      </div>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <Star
                            key={index}
                            className={`h-4 w-4 ${index < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700">{review.text}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contact {resolvedFarmer.name}</DialogTitle>
            <DialogDescription>Send a message to the farmer about this product</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Your Name</Label>
              <Input placeholder="Enter your name" className="mt-2" />
            </div>
            <div>
              <Label>Your Email</Label>
              <Input placeholder="Enter your email" type="email" className="mt-2" />
            </div>
            <div>
              <Label>Phone Number</Label>
              <Input placeholder="Enter your phone" className="mt-2" />
            </div>
            <div>
              <Label>Message</Label>
              <textarea
                placeholder="Ask about the product, bulk orders, or anything else..."
                rows={4}
                value={contactMessage}
                onChange={(event) => setContactMessage(event.target.value)}
                className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none"
              />
            </div>
            <div className="flex gap-3">
              <Button onClick={handleContactFarmer} className="flex-1 bg-green-600 hover:bg-green-700">
                Send Message
              </Button>
              <Button onClick={() => setShowContactDialog(false)} variant="outline" className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showOrderDialog} onOpenChange={setShowOrderDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Place Order</DialogTitle>
            <DialogDescription>Complete your order for {product.name}</DialogDescription>
          </DialogHeader>

          {orderSuccess ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="mb-2 text-2xl font-bold text-gray-900">Order Placed!</h3>
              <p className="mb-4 text-center text-gray-600">
                Your order has been saved to state. You'll receive a confirmation message shortly.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-3 rounded-lg bg-gray-50 p-4">
                <div className="flex justify-between">
                  <span className="text-gray-700">Product:</span>
                  <span className="font-medium">{product.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Seller:</span>
                  <span className="font-medium">{resolvedFarmer.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Quantity:</span>
                  <span className="font-medium">{quantity} {product.unit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Price per {product.unit}:</span>
                  <span className="font-medium">₹{product.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-3">
                  <span className="font-semibold text-gray-900">Total:</span>
                  <span className="text-2xl font-bold text-green-600">₹{(product.price * quantity).toFixed(2)}</span>
                </div>
              </div>

              <div>
                <Label>Delivery Address</Label>
                <textarea
                  placeholder="Enter your complete delivery address"
                  rows={3}
                  className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none"
                />
              </div>

              <Alert className="bg-blue-50 border-blue-200 text-blue-800">
                <Truck className="h-4 w-4" />
                <AlertDescription>
                  Estimated delivery: 1-2 days | Free delivery on orders above ₹500
                </AlertDescription>
              </Alert>

              <div className="flex gap-3">
                <Button onClick={handlePlaceOrder} className="flex-1 bg-green-600 py-6 text-lg hover:bg-green-700">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Confirm Order
                </Button>
                <Button onClick={() => setShowOrderDialog(false)} variant="outline" className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductDetailsPage;
