import React from 'react';
import RatingsAndReviews from '@/components/Ratings/RatingsAndReviews';
import { Review } from '@/components/Ratings/ReviewCard';

const RatingsPage: React.FC = () => {
  // Sample reviews data
  const sampleReviews: Review[] = [
    {
      id: 'review-1',
      userId: 'user-001',
      userName: 'Rajesh Kumar',
      userAvatar: '🧑',
      rating: 5,
      title: 'Excellent quality vegetables!',
      content: 'Fresh and organic vegetables delivered on time. The quality is exceptional and taste is just like farm-fresh. Highly recommend this farmer. The packaging was also very good.',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      verified: true,
      purchaseVerified: true,
      helpful: 45,
      notHelpful: 2,
      images: [
        'https://via.placeholder.com/100?text=Veggies1',
        'https://via.placeholder.com/100?text=Veggies2'
      ]
    },
    {
      id: 'review-2',
      userId: 'user-002',
      userName: 'Priya Singh',
      userAvatar: '👩',
      rating: 4,
      title: 'Good quality, slightly late delivery',
      content: 'The vegetables were fresh and taste was good. However, the delivery was about 30 minutes late. Overall still satisfied with the purchase.',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      verified: true,
      purchaseVerified: true,
      helpful: 23,
      notHelpful: 3,
      images: []
    },
    {
      id: 'review-3',
      userId: 'user-003',
      userName: 'Amit Patel',
      userAvatar: '🧑',
      rating: 5,
      title: 'Best organic produce in the area',
      content: 'Been ordering from this farmer for 3 months now. Never been disappointed. The tomatoes and spinach are particularly amazing. Prices are fair for organic quality.',
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      verified: true,
      purchaseVerified: true,
      helpful: 67,
      notHelpful: 1,
      images: [
        'https://via.placeholder.com/100?text=Organic'
      ]
    },
    {
      id: 'review-4',
      userId: 'user-004',
      userName: 'Neha Sharma',
      userAvatar: '👩',
      rating: 3,
      title: 'Average experience',
      content: 'Got some good vegetables but a couple of tomatoes were damaged. The overall quality was okay but not exceptional for the price.',
      timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      verified: true,
      purchaseVerified: true,
      helpful: 12,
      notHelpful: 5,
      images: []
    },
    {
      id: 'review-5',
      userId: 'user-005',
      userName: 'Vikram Reddy',
      userAvatar: '🧑',
      rating: 5,
      title: 'Supporting local farmers!',
      content: 'Love supporting local organic farmers. This farmer provides excellent produce and is very professional. The packaging is eco-friendly too. Worth every rupee!',
      timestamp: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
      verified: true,
      purchaseVerified: true,
      helpful: 54,
      notHelpful: 0,
      images: [
        'https://via.placeholder.com/100?text=Eco1',
        'https://via.placeholder.com/100?text=Eco2',
        'https://via.placeholder.com/100?text=Eco3'
      ]
    },
    {
      id: 'review-6',
      userId: 'user-006',
      userName: 'Deepika Nair',
      userAvatar: '👩',
      rating: 4,
      title: 'Fresh and tasty',
      content: 'Had been buying from supermarkets for years. This is definitely fresher and tastier. The only issue is availability sometimes, but quality is consistent.',
      timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      verified: true,
      purchaseVerified: true,
      helpful: 34,
      notHelpful: 2,
      images: []
    },
    {
      id: 'review-7',
      userId: 'user-007',
      userName: 'Rohan Verma',
      userAvatar: '🧑',
      rating: 2,
      title: 'Had to throw away some items',
      content: 'Some items were already wilting by the time it arrived. Contacted seller but no response. Not ordering again.',
      timestamp: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      verified: true,
      purchaseVerified: true,
      helpful: 15,
      notHelpful: 8,
      images: []
    },
    {
      id: 'review-8',
      userId: 'user-008',
      userName: 'Sophia Das',
      userAvatar: '👩',
      rating: 5,
      title: 'Worth the premium price',
      content: 'Certified organic, no pesticides, and support local economy. Yes, it\'s pricier than supermarket but you know exactly what you\'re eating. Totally worth it!',
      timestamp: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
      verified: true,
      purchaseVerified: true,
      helpful: 78,
      notHelpful: 3,
      images: [
        'https://via.placeholder.com/100?text=Fresh1'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Green Valley Farms Ratings & Reviews</h1>
          <p className="text-gray-600">Fresh Organic Vegetables & Produce</p>
        </div>

        <RatingsAndReviews
          productId="farm-001"
          initialReviews={sampleReviews}
          onReviewSubmitted={(review) => {
            console.log('New review submitted:', review);
          }}
        />
      </div>
    </div>
  );
};

export default RatingsPage;
