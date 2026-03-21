// Dummy data for Harvest Connect Mobile App

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'farmer' | 'buyer' | 'admin';
  location: string;
  avatar?: string;
  phone?: string;
  joinedDate: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  quantity: number;
  farmerId: string;
  farmerName: string;
  location: string;
  category: string;
  image: string;
  rating: number;
  reviews: number;
  available: boolean;
  harvestDate: string;
  createdAt?: string;
}

export interface Order {
  id: string;
  buyerId: string;
  farmerId: string;
  productId: string;
  productName: string;
  quantity: number;
  totalPrice: number;
  status: 'pending' | 'accepted' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: string;
  deliveryDate?: string;
  buyerName: string;
  farmerName: string;
}

// Dummy Users
export const dummyUsers: User[] = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    email: 'rajesh.farmer@email.com',
    role: 'farmer',
    location: 'Nashik, Maharashtra',
    phone: '+91 98765 43210',
    joinedDate: '2023-01-15',
  },
  {
    id: '2',
    name: 'Priya Sharma',
    email: 'priya.buyer@email.com',
    role: 'buyer',
    location: 'South Delhi, Delhi',
    phone: '+91 98765 43211',
    joinedDate: '2023-02-20',
  },
  {
    id: '3',
    name: 'Amit Singh',
    email: 'amit.farmer@email.com',
    role: 'farmer',
    location: 'Ludhiana, Punjab',
    phone: '+91 98765 43212',
    joinedDate: '2023-03-10',
  },
  {
    id: '4',
    name: 'Sneha Patel',
    email: 'sneha.buyer@email.com',
    role: 'buyer',
    location: 'Ahmedabad, Gujarat',
    phone: '+91 98765 43213',
    joinedDate: '2023-04-05',
  },
  {
    id: '5',
    name: 'Ananya Iyer',
    email: 'admin@farmdirect.example.com',
    role: 'admin',
    location: 'Bengaluru, Karnataka',
    phone: '+91 98765 43214',
    joinedDate: '2023-05-01',
  },
];

// Dummy Products
export const dummyProducts: Product[] = [
  {
    id: '1',
    name: 'Organic Tomatoes',
    description: 'Vine-ripened organic tomatoes picked in the early morning and packed the same day.',
    price: 36,
    unit: 'kg',
    quantity: 48,
    farmerId: '1',
    farmerName: 'Rajesh Kumar',
    location: 'Nashik, Maharashtra',
    category: 'Vegetables',
    image: '🍅',
    rating: 4.8,
    reviews: 32,
    available: true,
    harvestDate: '2026-03-18',
    createdAt: '2026-03-18T06:20:00.000Z',
  },
  {
    id: '2',
    name: 'Fresh Carrots',
    description: 'Sweet, crisp carrots washed and graded for retail and restaurant supply.',
    price: 24,
    unit: 'kg',
    quantity: 72,
    farmerId: '3',
    farmerName: 'Amit Singh',
    location: 'Ludhiana, Punjab',
    category: 'Vegetables',
    image: '🥕',
    rating: 4.9,
    reviews: 28,
    available: true,
    harvestDate: '2026-03-17',
    createdAt: '2026-03-17T07:15:00.000Z',
  },
  {
    id: '3',
    name: 'Spinach Bundle',
    description: 'Tender spinach bundles harvested before sunrise and packed in chilled crates.',
    price: 18,
    unit: 'kg',
    quantity: 34,
    farmerId: '1',
    farmerName: 'Rajesh Kumar',
    location: 'Nashik, Maharashtra',
    category: 'Leafy Greens',
    image: '🥬',
    rating: 4.7,
    reviews: 21,
    available: true,
    harvestDate: '2026-03-19',
    createdAt: '2026-03-19T05:55:00.000Z',
  },
  {
    id: '4',
    name: 'Premium Basmati Rice',
    description: 'Aged basmati rice with long grains and a fragrant aroma, packed in 5 kg sacks.',
    price: 92,
    unit: 'kg',
    quantity: 120,
    farmerId: '3',
    farmerName: 'Amit Singh',
    location: 'Ludhiana, Punjab',
    category: 'Grains',
    image: '🌾',
    rating: 4.6,
    reviews: 40,
    available: true,
    harvestDate: '2026-02-28',
    createdAt: '2026-02-28T09:00:00.000Z',
  },
  {
    id: '5',
    name: 'Alphonso Mangoes',
    description: 'Premium Alphonso mangoes from Ratnagiri, hand-selected for sweetness and size.',
    price: 180,
    unit: 'kg',
    quantity: 26,
    farmerId: '1',
    farmerName: 'Rajesh Kumar',
    location: 'Nashik, Maharashtra',
    category: 'Fruits',
    image: '🥭',
    rating: 4.9,
    reviews: 58,
    available: false,
    harvestDate: '2026-03-11',
    createdAt: '2026-03-10T10:30:00.000Z',
  },
  {
    id: '6',
    name: 'Wildflower Honey',
    description: 'Raw wildflower honey bottled in small batches with no added sugar or heating.',
    price: 250,
    unit: 'jar',
    quantity: 38,
    farmerId: '3',
    farmerName: 'Amit Singh',
    location: 'Ludhiana, Punjab',
    category: 'Honey',
    image: '🍯',
    rating: 4.8,
    reviews: 19,
    available: true,
    harvestDate: '2026-03-12',
    createdAt: '2026-03-12T08:45:00.000Z',
  },
];

// Dummy Orders
export const dummyOrders: Order[] = [
  {
    id: '1',
    buyerId: '2',
    farmerId: '1',
    productId: '1',
    productName: 'Organic Tomatoes',
    quantity: 8,
    totalPrice: 288,
    status: 'delivered',
    orderDate: '2026-03-12',
    deliveryDate: '2026-03-13',
    buyerName: 'Priya Sharma',
    farmerName: 'Rajesh Kumar',
  },
  {
    id: '2',
    buyerId: '4',
    farmerId: '3',
    productId: '4',
    productName: 'Premium Basmati Rice',
    quantity: 12,
    totalPrice: 1104,
    status: 'shipped',
    orderDate: '2026-03-15',
    deliveryDate: '2026-03-19',
    buyerName: 'Sneha Patel',
    farmerName: 'Amit Singh',
  },
  {
    id: '3',
    buyerId: '2',
    farmerId: '1',
    productId: '3',
    productName: 'Spinach Bundle',
    quantity: 6,
    totalPrice: 108,
    status: 'accepted',
    orderDate: '2026-03-18',
    buyerName: 'Priya Sharma',
    farmerName: 'Rajesh Kumar',
  },
  {
    id: '4',
    buyerId: '4',
    farmerId: '3',
    productId: '2',
    productName: 'Fresh Carrots',
    quantity: 5,
    totalPrice: 120,
    status: 'pending',
    orderDate: '2026-03-19',
    buyerName: 'Sneha Patel',
    farmerName: 'Amit Singh',
  },
  {
    id: '5',
    buyerId: '2',
    farmerId: '1',
    productId: '5',
    productName: 'Alphonso Mangoes',
    quantity: 4,
    totalPrice: 720,
    status: 'confirmed',
    orderDate: '2026-03-11',
    deliveryDate: '2026-03-14',
    buyerName: 'Priya Sharma',
    farmerName: 'Rajesh Kumar',
  },
  {
    id: '6',
    buyerId: '4',
    farmerId: '3',
    productId: '6',
    productName: 'Wildflower Honey',
    quantity: 2,
    totalPrice: 500,
    status: 'delivered',
    orderDate: '2026-03-08',
    deliveryDate: '2026-03-10',
    buyerName: 'Sneha Patel',
    farmerName: 'Amit Singh',
  },
];

// Helper functions for data simulation
export const getUserById = (id: string): User | undefined => {
  return dummyUsers.find(user => user.id === id);
};

export const getProductsByFarmer = (farmerId: string): Product[] => {
  return dummyProducts.filter(product => product.farmerId === farmerId);
};

export const getOrdersByBuyer = (buyerId: string): Order[] => {
  return dummyOrders.filter(order => order.buyerId === buyerId);
};

export const getOrdersByFarmer = (farmerId: string): Order[] => {
  return dummyOrders.filter(order => order.farmerId === farmerId);
};

export const getAvailableProducts = (): Product[] => {
  return dummyProducts.filter(product => product.available);
};

export const getTotalSpentByBuyer = (buyerId: string): number => {
  return getOrdersByBuyer(buyerId)
    .filter(order => order.status === 'delivered')
    .reduce((total, order) => total + order.totalPrice, 0);
};

export const getOrderCountByBuyer = (buyerId: string): number => {
  return getOrdersByBuyer(buyerId).length;
};