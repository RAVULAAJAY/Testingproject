import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import { useGlobalState } from '@/context/GlobalStateContext';

const RatingsPage: React.FC = () => {
  const { currentUser, products } = useGlobalState();

  const farmerProducts = useMemo(() => {
    if (!currentUser || currentUser.role !== 'farmer') {
      return [];
    }

    return products.filter((product) => product.farmerId === currentUser.id);
  }, [currentUser, products]);

  const feedbackStats = useMemo(() => {
    const totalReviews = farmerProducts.reduce((sum, product) => sum + (product.reviews ?? 0), 0);
    const weightedRating = farmerProducts.reduce(
      (sum, product) => sum + (product.rating ?? 0) * (product.reviews ?? 0),
      0
    );
    const averageRating = totalReviews > 0 ? weightedRating / totalReviews : 0;

    return {
      totalReviews,
      averageRating,
    };
  }, [farmerProducts]);

  if (!currentUser) {
    return (
      <Card className="p-6">
        <p className="text-center text-gray-600">Please log in to view ratings.</p>
      </Card>
    );
  }

  if (currentUser.role !== 'farmer') {
    return (
      <Card className="p-6">
        <p className="text-center text-gray-600">Buyer feedback is available for farmer accounts.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Ratings & Buyer Feedback</h1>
        <p className="text-gray-600 mt-2">Track how buyers rate your listings and identify products that need improvement.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardDescription>Average Rating</CardDescription>
            <CardTitle className="text-3xl text-amber-600">
              {feedbackStats.averageRating > 0 ? feedbackStats.averageRating.toFixed(1) : 'N/A'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-amber-500">
              {Array.from({ length: 5 }).map((_, index) => {
                const filled = feedbackStats.averageRating >= index + 1;
                return <Star key={index} className={`h-4 w-4 ${filled ? 'fill-current' : ''}`} />;
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Total Buyer Reviews</CardDescription>
            <CardTitle className="text-3xl text-blue-600">{feedbackStats.totalReviews}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">Aggregated across all your product listings.</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product-wise Feedback</CardTitle>
          <CardDescription>Ratings and review counts for each listing.</CardDescription>
        </CardHeader>
        <CardContent>
          {farmerProducts.length === 0 ? (
            <p className="text-sm text-gray-600">No listings found yet. Add products to start receiving buyer feedback.</p>
          ) : (
            <div className="space-y-3">
              {farmerProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex flex-col gap-2 rounded-lg border p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="font-semibold text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-600">Category: {product.category}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary">{product.reviews ?? 0} reviews</Badge>
                    <div className="flex items-center gap-1 text-amber-600 font-semibold">
                      <Star className="h-4 w-4 fill-current" />
                      {(product.rating ?? 0).toFixed(1)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RatingsPage;
