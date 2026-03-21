import React, { createContext, useCallback, useContext, useState, ReactNode } from 'react';
import {
  dummyUsers,
  dummyProducts,
  dummyOrders,
  Product,
  Order,
  User as SeedUser,
} from '@/lib/data';

export type UserRole = 'farmer' | 'buyer' | 'admin';
export type AuthMode = 'login' | 'signup' | null;

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  role: UserRole;
  createdAt?: string;
}

const toAppUser = (user: SeedUser): User => ({
  id: user.id,
  name: user.name,
  email: user.email,
  phone: user.phone ?? '',
  location: user.location,
  role: user.role,
});

const isUserRole = (value: unknown): value is UserRole => {
  return value === 'farmer' || value === 'buyer' || value === 'admin';
};

const isValidUser = (value: unknown): value is User => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.name === 'string' &&
    typeof candidate.email === 'string' &&
    typeof candidate.location === 'string' &&
    typeof candidate.phone === 'string' &&
    isUserRole(candidate.role)
  );
};

const readStoredValue = <T,>(key: string): T | null => {
  try {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : null;
  } catch {
    return null;
  }
};

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  recipientName: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export type NotificationType = 'order' | 'message' | 'update';

export interface AppNotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

const defaultNotifications: AppNotification[] = [];

const defaultMessages: Message[] = [
  {
    id: 'message_1',
    senderId: '1',
    senderName: 'Rajesh Kumar',
    recipientId: '2',
    recipientName: 'Priya Sharma',
    content: 'Fresh tomatoes are ready for pickup this afternoon.',
    timestamp: '2024-03-18T09:30:00.000Z',
    read: true,
  },
  {
    id: 'message_2',
    senderId: '2',
    senderName: 'Priya Sharma',
    recipientId: '1',
    recipientName: 'Rajesh Kumar',
    content: 'Great. Please keep 5 kg aside for me.',
    timestamp: '2024-03-18T09:34:00.000Z',
    read: true,
  },
  {
    id: 'message_3',
    senderId: '3',
    senderName: 'Amit Singh',
    recipientId: '4',
    recipientName: 'Sneha Patel',
    content: 'Carrots are packed and ready for tomorrow morning delivery.',
    timestamp: '2024-03-19T11:00:00.000Z',
    read: false,
  },
];

export interface GlobalStateContextType {
  // Auth
  currentUser: User | null;
  selectedRole: UserRole | null;
  users: User[];
  login: (user: User) => void;
  signup: (user: User) => void;
  logout: () => void;
  setCurrentUser: (user: User | null) => void;
  setSelectedRole: (role: UserRole | null) => void;
  updateUser: (userId: string, updates: Partial<User>) => void;
  deleteUser: (userId: string) => void;
  blockUser: (userId: string) => void;

  // Products
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProductById: (id: string) => Product | undefined;
  getProductsByFarmer: (farmerId: string) => Product[];

  // Buyer favorites and orders
  favoriteProductIds: string[];
  toggleFavoriteProduct: (productId: string) => void;
  isFavoriteProduct: (productId: string) => boolean;
  placeOrder: (product: Product, quantity: number) => void;

  // Orders
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrder: (id: string, order: Partial<Order>) => void;
  deleteOrder: (id: string) => void;
  getOrderById: (id: string) => Order | undefined;
  getOrdersByBuyer: (buyerId: string) => Order[];
  getOrdersByFarmer: (farmerId: string) => Order[];

  // Messages
  messages: Message[];
  addMessage: (message: Message) => void;
  getMessagesByUser: (userId: string) => Message[];
  getConversationMessages: (userIdA: string, userIdB: string) => Message[];
  markMessagesAsRead: (messageIds: string[]) => void;
  getUnreadMessageCount: (userId: string) => number;

  // Notifications
  notifications: AppNotification[];
  addNotification: (notification: AppNotification) => void;
  getNotificationsByUser: (userId: string) => AppNotification[];
  markNotificationAsRead: (notificationId: string) => void;
  deleteNotification: (notificationId: string) => void;
  clearNotificationsForUser: (userId: string) => void;
  getUnreadNotificationCount: (userId: string) => number;

  // Statistics
  getTotalSpentByBuyer: (buyerId: string) => number;
  getOrderCountByBuyer: (buyerId: string) => number;
  getFarmerRevenue: (farmerId: string) => number;
  getFarmerOrderCount: (farmerId: string) => number;
}

const GlobalStateContext = createContext<GlobalStateContextType | undefined>(
  undefined
);

export const GlobalStateProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUserState] = useState<User | null>(() => {
    const storedUser = readStoredValue<unknown>('currentUser');
    if (isValidUser(storedUser)) {
      return storedUser;
    }

    if (storedUser !== null) {
      localStorage.removeItem('currentUser');
    }

    return null;
  });
  const [selectedRole, setSelectedRoleState] = useState<UserRole | null>(() => {
    const storedRole = readStoredValue<unknown>('selectedRole');
    if (isUserRole(storedRole)) {
      return storedRole;
    }

    if (storedRole !== null) {
      localStorage.removeItem('selectedRole');
    }

    const storedUser = readStoredValue<unknown>('currentUser');
    return isValidUser(storedUser) ? storedUser.role : null;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const savedProducts = readStoredValue<Product[]>('products');
    return savedProducts ?? dummyProducts;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const savedUsers = readStoredValue<User[]>('users');
    return savedUsers ?? dummyUsers.map(toAppUser);
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const savedOrders = readStoredValue<Order[]>('orders');
    return savedOrders ?? dummyOrders;
  });

  const [messages, setMessages] = useState<Message[]>(() => {
    const savedMessages = readStoredValue<Message[]>('messages');
    return savedMessages ?? defaultMessages;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const savedNotifications = readStoredValue<AppNotification[]>('notifications');
    return savedNotifications ?? defaultNotifications;
  });

  const [favoriteProductIds, setFavoriteProductIds] = useState<string[]>(() => {
    const savedFavorites = readStoredValue<string[]>('favoriteProductIds');
    return savedFavorites ?? [];
  });

  const setCurrentUser = useCallback((user: User | null) => {
    setCurrentUserState(user);

    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem(`user_${user.id}`, JSON.stringify(user));
      setSelectedRoleState(user.role);
      localStorage.setItem('selectedRole', JSON.stringify(user.role));
      return;
    }

    localStorage.removeItem('currentUser');
    setSelectedRoleState(null);
    localStorage.removeItem('selectedRole');
  }, []);

  const setSelectedRole = useCallback((role: UserRole | null) => {
    setSelectedRoleState(role);

    if (role) {
      localStorage.setItem('selectedRole', JSON.stringify(role));
      return;
    }

    localStorage.removeItem('selectedRole');
  }, []);

  const login = useCallback((user: User) => {
    setCurrentUser(user);
  }, [setCurrentUser]);

  const signup = useCallback((user: User) => {
    const userWithTimestamp = {
      ...user,
      createdAt: new Date().toISOString(),
    };

    setCurrentUser(userWithTimestamp);
  }, [setCurrentUser]);

  const logout = useCallback(() => {
    setCurrentUserState(null);
    setSelectedRoleState(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('selectedRole');
  }, []);

  const updateUser = useCallback((userId: string, updates: Partial<User>) => {
    setUsers((prev) => {
      const updated = prev.map((user) =>
        user.id === userId ? { ...user, ...updates } : user
      );
      localStorage.setItem('users', JSON.stringify(updated));
      return updated;
    });

    setCurrentUserState((prev) => {
      if (!prev || prev.id !== userId) {
        return prev;
      }

      const nextUser = { ...prev, ...updates };
      localStorage.setItem('currentUser', JSON.stringify(nextUser));
      localStorage.setItem(`user_${userId}`, JSON.stringify(nextUser));
      return nextUser;
    });
  }, []);

  const addNotification = useCallback((notification: AppNotification) => {
    setNotifications((prev) => {
      const updated = [notification, ...prev];
      localStorage.setItem('notifications', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const removeUserFromState = useCallback((userId: string) => {
    setUsers((prev) => {
      const updated = prev.filter((user) => user.id !== userId);
      localStorage.setItem('users', JSON.stringify(updated));
      return updated;
    });

    setProducts((prev) => {
      const updated = prev.filter((product) => product.farmerId !== userId);
      localStorage.setItem('products', JSON.stringify(updated));
      return updated;
    });

    setOrders((prev) => {
      const updated = prev.filter(
        (order) => order.buyerId !== userId && order.farmerId !== userId
      );
      localStorage.setItem('orders', JSON.stringify(updated));
      return updated;
    });

    setMessages((prev) => {
      const updated = prev.filter(
        (message) => message.senderId !== userId && message.recipientId !== userId
      );
      localStorage.setItem('messages', JSON.stringify(updated));
      return updated;
    });

    setFavoriteProductIds((prev) => {
      localStorage.setItem('favoriteProductIds', JSON.stringify(prev));
      return prev;
    });

    if (currentUser?.id === userId) {
      setCurrentUserState(null);
      setSelectedRoleState(null);
      localStorage.removeItem('currentUser');
      localStorage.removeItem('selectedRole');
    }
  }, [currentUser]);

  const deleteUser = useCallback((userId: string) => {
    removeUserFromState(userId);
  }, [removeUserFromState]);

  const blockUser = useCallback((userId: string) => {
    removeUserFromState(userId);
  }, [removeUserFromState]);

  // Product operations
  const addProduct = useCallback((product: Product) => {
    setProducts((prev) => {
      const updated = [...prev, product];
      localStorage.setItem('products', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const updateProduct = useCallback((id: string, updates: Partial<Product>) => {
    setProducts((prev) => {
      const updated = prev.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      );
      localStorage.setItem('products', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      localStorage.setItem('products', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const getProductById = useCallback(
    (id: string) => products.find((p) => p.id === id),
    [products]
  );

  const getProductsByFarmer = useCallback(
    (farmerId: string) => products.filter((p) => p.farmerId === farmerId),
    [products]
  );

  const toggleFavoriteProduct = useCallback((productId: string) => {
    setFavoriteProductIds((prev) => {
      const updated = prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];
      localStorage.setItem('favoriteProductIds', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const isFavoriteProduct = useCallback(
    (productId: string) => favoriteProductIds.includes(productId),
    [favoriteProductIds]
  );

  const placeOrder = useCallback(
    (product: Product, quantity: number) => {
      if (!currentUser) {
        return;
      }

      const safeQuantity = Math.max(1, Math.min(quantity, product.quantity || 1));
      const order: Order = {
        id: `order_${Date.now()}`,
        buyerId: currentUser.id,
        farmerId: product.farmerId,
        productId: product.id,
        productName: product.name,
        quantity: safeQuantity,
        totalPrice: product.price * safeQuantity,
        status: 'pending',
        orderDate: new Date().toISOString().split('T')[0],
        buyerName: currentUser.name,
        farmerName: product.farmerName,
      };

      setOrders((prev) => {
        const updated = [...prev, order];
        localStorage.setItem('orders', JSON.stringify(updated));
        return updated;
      });

      const notificationTimestamp = new Date().toISOString();
      const buyerNotification: AppNotification = {
        id: `notification_${Date.now()}`,
        userId: currentUser.id,
        type: 'order',
        title: 'Order placed successfully',
        message: `Your order for ${product.name} was placed successfully and is now pending approval.`,
        timestamp: notificationTimestamp,
        read: false,
        actionUrl: '/orders',
      };

      const farmerNotification: AppNotification = {
        id: `notification_${Date.now()}_farmer`,
        userId: product.farmerId,
        type: 'order',
        title: 'New order received',
        message: `${currentUser.name} ordered ${safeQuantity} ${product.unit} of ${product.name}.`,
        timestamp: notificationTimestamp,
        read: false,
        actionUrl: '/orders',
      };

      addNotification(farmerNotification);
      if (currentUser.id !== product.farmerId) {
        addNotification(buyerNotification);
      }
    },
    [addNotification, currentUser]
  );

  // Order operations
  const addOrder = useCallback((order: Order) => {
    setOrders((prev) => {
      const updated = [...prev, order];
      localStorage.setItem('orders', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const updateOrder = useCallback((id: string, updates: Partial<Order>) => {
    setOrders((prev) => {
      const updated = prev.map((o) =>
        o.id === id ? { ...o, ...updates } : o
      );
      localStorage.setItem('orders', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const deleteOrder = useCallback((id: string) => {
    setOrders((prev) => {
      const updated = prev.filter((o) => o.id !== id);
      localStorage.setItem('orders', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const getOrderById = useCallback(
    (id: string) => orders.find((o) => o.id === id),
    [orders]
  );

  const getOrdersByBuyer = useCallback(
    (buyerId: string) => orders.filter((o) => o.buyerId === buyerId),
    [orders]
  );

  const getOrdersByFarmer = useCallback(
    (farmerId: string) => orders.filter((o) => o.farmerId === farmerId),
    [orders]
  );

  // Message operations
  const addMessage = useCallback((message: Message) => {
    setMessages((prev) => {
      const updated = [...prev, message];
      localStorage.setItem('messages', JSON.stringify(updated));
      return updated;
    });

    addNotification({
      id: `notification_${Date.now()}_message`,
      userId: message.recipientId,
      type: 'message',
      title: `New message from ${message.senderName}`,
      message: message.content,
      timestamp: message.timestamp,
      read: false,
      actionUrl: '/messages',
    });
  }, [addNotification]);

  const getMessagesByUser = useCallback(
    (userId: string) =>
      messages.filter(
        (m) => m.senderId === userId || m.recipientId === userId
      ),
    [messages]
  );

  const getConversationMessages = useCallback(
    (userIdA: string, userIdB: string) =>
      messages.filter(
        (message) =>
          (message.senderId === userIdA && message.recipientId === userIdB) ||
          (message.senderId === userIdB && message.recipientId === userIdA)
      ),
    [messages]
  );

  const markMessagesAsRead = useCallback((messageIds: string[]) => {
    setMessages((prev) => {
      const updated = prev.map((m) =>
        messageIds.includes(m.id) ? { ...m, read: true } : m
      );
      localStorage.setItem('messages', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const getUnreadMessageCount = useCallback(
    (userId: string) =>
      messages.filter((m) => m.recipientId === userId && !m.read).length,
    [messages]
  );

  const getNotificationsByUser = useCallback(
    (userId: string) => notifications.filter((notification) => notification.userId === userId),
    [notifications]
  );

  const markNotificationAsRead = useCallback((notificationId: string) => {
    setNotifications((prev) => {
      const updated = prev.map((notification) =>
        notification.id === notificationId ? { ...notification, read: true } : notification
      );
      localStorage.setItem('notifications', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const deleteNotification = useCallback((notificationId: string) => {
    setNotifications((prev) => {
      const updated = prev.filter((notification) => notification.id !== notificationId);
      localStorage.setItem('notifications', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearNotificationsForUser = useCallback((userId: string) => {
    setNotifications((prev) => {
      const updated = prev.filter((notification) => notification.userId !== userId);
      localStorage.setItem('notifications', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const getUnreadNotificationCount = useCallback(
    (userId: string) => notifications.filter((notification) => notification.userId === userId && !notification.read).length,
    [notifications]
  );

  // Statistics
  const getTotalSpentByBuyer = useCallback(
    (buyerId: string) =>
      getOrdersByBuyer(buyerId)
        .filter((o) => o.status === 'delivered')
        .reduce((total, o) => total + o.totalPrice, 0),
    [getOrdersByBuyer]
  );

  const getOrderCountByBuyer = useCallback(
    (buyerId: string) => getOrdersByBuyer(buyerId).length,
    [getOrdersByBuyer]
  );

  const getFarmerRevenue = useCallback(
    (farmerId: string) =>
      getOrdersByFarmer(farmerId)
        .filter((o) => o.status === 'delivered')
        .reduce((total, o) => total + o.totalPrice, 0),
    [getOrdersByFarmer]
  );

  const getFarmerOrderCount = useCallback(
    (farmerId: string) => getOrdersByFarmer(farmerId).length,
    [getOrdersByFarmer]
  );

  const value: GlobalStateContextType = {
    // Auth
    currentUser,
    selectedRole,
    users,
    login,
    signup,
    logout,
    setCurrentUser,
    setSelectedRole,
    updateUser,
    deleteUser,
    blockUser,

    // Products
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    getProductsByFarmer,

    // Buyer favorites and orders
    favoriteProductIds,
    toggleFavoriteProduct,
    isFavoriteProduct,
    placeOrder,

    // Orders
    orders,
    addOrder,
    updateOrder,
    deleteOrder,
    getOrderById,
    getOrdersByBuyer,
    getOrdersByFarmer,

    // Messages
    messages,
    addMessage,
    getMessagesByUser,
    getConversationMessages,
    markMessagesAsRead,
    getUnreadMessageCount,

    // Notifications
    notifications,
    addNotification,
    getNotificationsByUser,
    markNotificationAsRead,
    deleteNotification,
    clearNotificationsForUser,
    getUnreadNotificationCount,

    // Statistics
    getTotalSpentByBuyer,
    getOrderCountByBuyer,
    getFarmerRevenue,
    getFarmerOrderCount,
  };

  return (
    <GlobalStateContext.Provider value={value}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = (): GlobalStateContextType => {
  const context = useContext(GlobalStateContext);
  if (context === undefined) {
    throw new Error(
      'useGlobalState must be used within a GlobalStateProvider'
    );
  }
  return context;
};