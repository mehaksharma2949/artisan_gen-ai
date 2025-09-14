import { useState } from 'react';
import { useAuth } from '@getmocha/users-service/react';
import { useNavigate } from 'react-router';
import { Package, Plus, TrendingUp, MessageCircle, Settings, Star, DollarSign, Eye } from 'lucide-react';
import Header from '@/react-app/components/Header';

export default function ArtisanDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { label: 'Total Products', value: '24', icon: Package, change: '+2 this week' },
    { label: 'Total Sales', value: '₹45,600', icon: DollarSign, change: '+12% this month' },
    { label: 'Profile Views', value: '1,234', icon: Eye, change: '+5% this week' },
    { label: 'Average Rating', value: '4.8', icon: Star, change: '8 new reviews' },
  ];

  const recentOrders = [
    { id: 1, product: 'Handwoven Scarf', customer: 'Priya Sharma', amount: '₹2,500', status: 'Pending' },
    { id: 2, product: 'Ceramic Bowl Set', customer: 'Rajesh Kumar', amount: '₹1,800', status: 'Shipped' },
    { id: 3, product: 'Wooden Jewelry Box', customer: 'Meera Patel', amount: '₹3,200', status: 'Delivered' },
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
                    {user?.google_user_data.name || 'Artisan'}
                  </h3>
                  <p className="text-sm text-gray-500">Artisan</p>
                </div>
              </div>

              <nav className="space-y-2">
                {[
                  { id: 'overview', label: 'Overview', icon: TrendingUp, route: null },
                  { id: 'products', label: 'Products', icon: Package, route: null },
                  { id: 'orders', label: 'Orders', icon: Package, route: '/artisan/orders' },
                  { id: 'messages', label: 'Messages', icon: MessageCircle, route: '/artisan/messages' },
                  { id: 'profile', label: 'Profile', icon: Settings, route: '/artisan/profile' },
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
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                      Welcome back, {user?.google_user_data.given_name || 'Artisan'}!
                    </h1>
                    <p className="text-gray-600">Here's what's happening with your crafts</p>
                  </div>
                  <button 
                    onClick={() => navigate('/add-product')}
                    className="bg-orange-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-orange-700 transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Add New Product
                  </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {stats.map((stat, index) => (
                    <div key={index} className="bg-white rounded-2xl p-6 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                          <stat.icon className="w-6 h-6 text-orange-600" />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                        <p className="text-xs text-green-600">{stat.change}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
                    <button className="text-orange-600 hover:text-orange-700 font-medium">
                      View All
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="text-left py-3 text-sm font-medium text-gray-600">Product</th>
                          <th className="text-left py-3 text-sm font-medium text-gray-600">Customer</th>
                          <th className="text-left py-3 text-sm font-medium text-gray-600">Amount</th>
                          <th className="text-left py-3 text-sm font-medium text-gray-600">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentOrders.map((order) => (
                          <tr key={order.id} className="border-b border-gray-50">
                            <td className="py-4 font-medium text-gray-900">{order.product}</td>
                            <td className="py-4 text-gray-600">{order.customer}</td>
                            <td className="py-4 font-medium text-gray-900">{order.amount}</td>
                            <td className="py-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {order.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'products' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h1 className="text-3xl font-bold text-gray-900">Products</h1>
                  <button 
                    onClick={() => navigate('/add-product')}
                    className="bg-orange-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-orange-700 transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Add New Product
                  </button>
                </div>
                
                <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
                  <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No products yet</h3>
                  <p className="text-gray-600 mb-6">Start by adding your first handcrafted product</p>
                  <button 
                    onClick={() => navigate('/add-product')}
                    className="bg-orange-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-orange-700 transition-colors"
                  >
                    Create Your First Product
                  </button>
                </div>
              </div>
            )}

            {/* Other tabs content would go here */}
            {activeTab !== 'overview' && activeTab !== 'products' && (
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
