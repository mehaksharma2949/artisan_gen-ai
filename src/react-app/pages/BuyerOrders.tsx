import { useState, useEffect } from 'react';
import { Package, Search, Filter, Star, MessageCircle, RefreshCw } from 'lucide-react';
import Header from '@/react-app/components/Header';

interface Order {
  id: number;
  product_name: string;
  product_image: string;
  artisan_name: string;
  quantity: number;
  total_amount: number;
  status: string;
  created_at: string;
  delivered_at?: string;
}

export default function BuyerOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/buyer/orders');
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mock data for demo
  const mockOrders = [
    {
      id: 1,
      product_name: 'Handwoven Traditional Scarf',
      product_image: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=200&h=200&fit=crop',
      artisan_name: 'Priya Sharma',
      quantity: 1,
      total_amount: 2500,
      status: 'delivered',
      created_at: '2024-01-10T10:30:00Z',
      delivered_at: '2024-01-15T14:20:00Z'
    },
    {
      id: 2,
      product_name: 'Ceramic Bowl Set',
      product_image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop',
      artisan_name: 'Rajesh Kumar',
      quantity: 1,
      total_amount: 1800,
      status: 'shipped',
      created_at: '2024-01-12T15:45:00Z'
    },
    {
      id: 3,
      product_name: 'Wooden Jewelry Box',
      product_image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=200&h=200&fit=crop',
      artisan_name: 'Meera Patel',
      quantity: 1,
      total_amount: 3200,
      status: 'confirmed',
      created_at: '2024-01-14T09:15:00Z'
    },
    {
      id: 4,
      product_name: 'Hand-painted Vase',
      product_image: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=200&h=200&fit=crop',
      artisan_name: 'Arjun Singh',
      quantity: 2,
      total_amount: 5600,
      status: 'pending',
      created_at: '2024-01-15T11:30:00Z'
    }
  ];

  const displayOrders = orders.length > 0 ? orders : mockOrders;

  const filteredOrders = displayOrders.filter(order => {
    const matchesSearch = order.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.artisan_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleReorder = (orderId: number) => {
    // Implement reorder functionality
    console.log('Reordering:', orderId);
  };

  const handleLeaveReview = (orderId: number) => {
    // Implement review functionality
    console.log('Leave review for:', orderId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">Track and manage your craft purchases</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search orders, products, artisans..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="all">All Orders</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
                <div className="flex space-x-4">
                  <div className="w-20 h-20 bg-gray-200 rounded-xl"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Product Info */}
                  <div className="flex space-x-4 flex-1">
                    <img
                      src={order.product_image}
                      alt={order.product_name}
                      className="w-20 h-20 rounded-xl object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{order.product_name}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-2">by {order.artisan_name}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>Qty: {order.quantity}</span>
                        <span>Order #{order.id}</span>
                      </div>
                      <div className="mt-2">
                        <p className="text-lg font-bold text-gray-900">₹{order.total_amount.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">
                          Ordered on {new Date(order.created_at).toLocaleDateString()}
                        </p>
                        {order.delivered_at && (
                          <p className="text-sm text-green-600">
                            Delivered on {new Date(order.delivered_at).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex lg:flex-col gap-2 lg:w-48">
                    {order.status === 'delivered' && (
                      <>
                        <button
                          onClick={() => handleLeaveReview(order.id)}
                          className="flex-1 lg:w-full flex items-center justify-center space-x-2 bg-orange-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-orange-700 transition-colors"
                        >
                          <Star className="w-4 h-4" />
                          <span>Review</span>
                        </button>
                        <button
                          onClick={() => handleReorder(order.id)}
                          className="flex-1 lg:w-full flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                        >
                          <RefreshCw className="w-4 h-4" />
                          <span>Reorder</span>
                        </button>
                      </>
                    )}
                    {order.status !== 'delivered' && order.status !== 'cancelled' && (
                      <button className="flex-1 lg:w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                        <Package className="w-4 h-4" />
                        <span>Track Order</span>
                      </button>
                    )}
                    <button className="flex-1 lg:w-full flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      <span>Message</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filteredOrders.length === 0 && (
              <div className="text-center py-16">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
                <p className="text-gray-600 mb-6">Start shopping to see your orders here</p>
                <button className="bg-orange-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-orange-700 transition-colors">
                  Browse Products
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
