import { useState } from 'react';
import { Search, Package } from 'lucide-react';
import { Link } from 'react-router';
import Header from '@/react-app/components/Header';
import Footer from '@/react-app/components/Footer';

export default function Categories() {
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    {
      id: 'pottery',
      name: 'Pottery & Ceramics',
      description: 'Handcrafted bowls, vases, and decorative pieces',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
      productCount: 156,
      artisanCount: 23
    },
    {
      id: 'textiles',
      name: 'Textiles & Fabrics',
      description: 'Traditional weaving, embroidery, and handloom products',
      image: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=400&h=300&fit=crop',
      productCount: 203,
      artisanCount: 31
    },
    {
      id: 'woodwork',
      name: 'Woodwork & Carving',
      description: 'Furniture, sculptures, and decorative wooden items',
      image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400&h=300&fit=crop',
      productCount: 89,
      artisanCount: 18
    },
    {
      id: 'metalwork',
      name: 'Metalwork & Brass',
      description: 'Traditional metal crafts, jewelry, and utensils',
      image: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=300&fit=crop',
      productCount: 67,
      artisanCount: 12
    },
    {
      id: 'jewelry',
      name: 'Handmade Jewelry',
      description: 'Unique accessories and traditional ornaments',
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop',
      productCount: 124,
      artisanCount: 19
    },
    {
      id: 'paintings',
      name: 'Paintings & Art',
      description: 'Traditional and contemporary handmade artwork',
      image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop',
      productCount: 95,
      artisanCount: 25
    },
    {
      id: 'sculptures',
      name: 'Sculptures',
      description: 'Stone, wood, and metal sculptural works',
      image: 'https://images.unsplash.com/photo-1594736797933-d0f02555a3a8?w=400&h=300&fit=crop',
      productCount: 42,
      artisanCount: 8
    },
    {
      id: 'home-decor',
      name: 'Home Decor',
      description: 'Decorative items for beautiful living spaces',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
      productCount: 178,
      artisanCount: 29
    },
    {
      id: 'traditional',
      name: 'Traditional Crafts',
      description: 'Heritage crafts passed down through generations',
      image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&h=300&fit=crop',
      productCount: 134,
      artisanCount: 21
    }
  ];

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Craft Categories
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Explore our diverse collection of traditional and contemporary crafts
          </p>
          
          {/* Search */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {categories.reduce((total, cat) => total + cat.productCount, 0)}
            </div>
            <div className="text-gray-600">Total Products</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {categories.reduce((total, cat) => total + cat.artisanCount, 0)}
            </div>
            <div className="text-gray-600">Active Artisans</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {categories.length}
            </div>
            <div className="text-gray-600">Categories</div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCategories.map((category) => (
            <Link
              key={category.id}
              to={`/products?category=${category.id}`}
              className="group cursor-pointer"
            >
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="flex items-center space-x-2 text-sm">
                      <Package className="w-4 h-4" />
                      <span>{category.productCount} products</span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {category.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{category.artisanCount} artisans</span>
                    <span className="text-orange-600 font-medium group-hover:text-orange-700">
                      Explore →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredCategories.length === 0 && (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No categories found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Can't find what you're looking for?</h2>
          <p className="text-xl mb-6 text-orange-100">
            Connect directly with our artisans for custom creations
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="bg-white text-orange-600 px-8 py-3 rounded-xl font-medium hover:bg-orange-50 transition-colors"
            >
              Contact an Artisan
            </Link>
            <Link
              to="/custom-orders"
              className="border-2 border-white text-white px-8 py-3 rounded-xl font-medium hover:bg-white hover:text-orange-600 transition-colors"
            >
              Request Custom Item
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
