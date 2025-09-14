import { useState } from 'react';
import { useAuth } from '@getmocha/users-service/react';
import { useNavigate } from 'react-router';
import { Heart, ShoppingBag, MessageCircle, Star, Package, CreditCard } from 'lucide-react';
import Header from '@/react-app/components/Header';

export default function BuyerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');

  const recentOrders = [
    { id: 1, product: 'Handwoven Scarf', artisan: 'Priya Sharma', amount: '₹2,500', status: 'Delivered', image: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=100&h=100&fit=crop' },
    { id: 2, product: 'Ceramic Bowl Set', artisan: 'Rajesh Kumar', amount: '₹1,800', status: 'Shipped', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop' },
  ];

  const wishlistItems = [
    { id: 1, product: 'Wooden Jewelry Box', artisan: 'Meera Patel', price: '₹3,200', image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=200&h=200&fit=crop' },
    { id: 2, product: 'Hand-painted Vase', artisan: 'Arjun Singh', price: '₹2,800', image: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=200&h=200&fit=crop' },
  ];

  const recommendations = [
    { id: 1, product: 'Traditional Pottery Set', artisan: 'Maya Devi', price: '₹4,500', rating: 4.9, image: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=200&h=200&fit=crop' },
    { id: 2, product: 'Embroidered Wall Hanging', artisan: 'Sita Sharma', price: '₹1,800', rating: 4.8, image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=200&h=200&fit=crop' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
              <div className="flex items-center space-x-3 mb-6">
                <img
                  src={user?.google_user_data.picture || ''}
                  alt="Profile"
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {user?.google_user_data.name || 'Buyer'}
                  </h3>
                  <p className="text-sm text-gray-500">Buyer</p>
                </div>
              </div>

              <nav className="space-y-2">
                {[
                  { id: 'home', label: 'Home', icon: ShoppingBag, route: null },
                  { id: 'wishlist', label: 'Wishlist', icon: Heart, route: null },
                  { id: 'orders', label: 'Orders', icon: Package, route: '/buyer/orders' },
                  { id: 'recommendations', label: 'Recommendations', icon: Star, route: null },
                  { id: 'chat', label: 'Chat', icon: MessageCircle, route: null },
                  { id: 'profile', label: 'Payment & Profile', icon: CreditCard, route: '/buyer/profile' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => item.route ? navigate(item.route) : setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-colors ${
                      activeTab === item.id
                        ? 'bg-orange-50 text-orange-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'home' && (
              <div className="space-y-8">
                {/* Welcome Header */}
                <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-8 text-white">
                  <h1 className="text-3xl font-bold mb-2">
                    Welcome back, {user?.google_user_data.given_name || 'Buyer'}!
                  </h1>
                  <p className="text-orange-100">Discover unique handcrafted treasures from talented artisans</p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <Package className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">5</p>
                        <p className="text-sm text-gray-600">Total Orders</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
                        <Heart className="w-6 h-6 text-pink-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">12</p>
                        <p className="text-sm text-gray-600">Wishlist Items</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                        <Star className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">3</p>
                        <p className="text-sm text-gray-600">Artisans Followed</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Orders</h2>
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
                        <div className="flex items-center space-x-4">
                          <img
                            src={order.image}
                            alt={order.product}
                            className="w-16 h-16 rounded-xl object-cover"
                          />
                          <div>
                            <h3 className="font-semibold text-gray-900">{order.product}</h3>
                            <p className="text-sm text-gray-600">by {order.artisan}</p>
                            <p className="text-sm font-medium text-gray-900">{order.amount}</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-900">Your Wishlist</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wishlistItems.map((item) => (
                    <div key={item.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.product}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-1">{item.product}</h3>
                        <p className="text-sm text-gray-600 mb-2">by {item.artisan}</p>
                        <p className="text-lg font-bold text-gray-900 mb-4">{item.price}</p>
                        <div className="flex space-x-2">
                          <button className="flex-1 bg-orange-600 text-white py-2 px-4 rounded-xl font-medium hover:bg-orange-700 transition-colors">
                            Add to Cart
                          </button>
                          <button className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                            <Heart className="w-5 h-5 text-pink-500 fill-current" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'recommendations' && (
              <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-900">Recommended for You</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommendations.map((item) => (
                    <div key={item.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.product}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <div className="flex items-center space-x-1 mb-2">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium text-gray-900">{item.rating}</span>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">{item.product}</h3>
                        <p className="text-sm text-gray-600 mb-2">by {item.artisan}</p>
                        <p className="text-lg font-bold text-gray-900 mb-4">{item.price}</p>
                        <button className="w-full bg-orange-600 text-white py-2 px-4 rounded-xl font-medium hover:bg-orange-700 transition-colors">
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Other tabs */}
            {!['home', 'wishlist', 'recommendations'].includes(activeTab) && (
              <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                </h2>
                <p className="text-gray-600">This feature is coming soon...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
