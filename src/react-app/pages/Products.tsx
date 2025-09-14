import { useState, useEffect } from 'react';
import { Search, Filter, Star, Heart, MapPin } from 'lucide-react';
import Header from '@/react-app/components/Header';
import Footer from '@/react-app/components/Footer';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  artisan_name: string;
  category: string;
  images: string;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mock data for demo
  const mockProducts = [
    {
      id: 1,
      name: 'Handwoven Traditional Scarf',
      description: 'Beautiful handwoven scarf made with traditional techniques',
      price: 2500,
      artisan_name: 'Priya Sharma',
      category: 'Textiles',
      images: '["https://images.unsplash.com/photo-1544441893-675973e31985?w=400&h=400&fit=crop"]'
    },
    {
      id: 2,
      name: 'Ceramic Bowl Set',
      description: 'Handcrafted ceramic bowls perfect for serving',
      price: 1800,
      artisan_name: 'Rajesh Kumar',
      category: 'Pottery',
      images: '["https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop"]'
    },
    {
      id: 3,
      name: 'Wooden Jewelry Box',
      description: 'Intricately carved wooden box for jewelry storage',
      price: 3200,
      artisan_name: 'Meera Patel',
      category: 'Woodwork',
      images: '["https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400&h=400&fit=crop"]'
    },
    {
      id: 4,
      name: 'Hand-painted Vase',
      description: 'Beautiful ceramic vase with traditional patterns',
      price: 2800,
      artisan_name: 'Arjun Singh',
      category: 'Pottery',
      images: '["https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=400&h=400&fit=crop"]'
    },
    {
      id: 5,
      name: 'Traditional Brass Lamp',
      description: 'Elegant brass lamp with intricate detailing',
      price: 4500,
      artisan_name: 'Maya Devi',
      category: 'Metalwork',
      images: '["https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=400&fit=crop"]'
    },
    {
      id: 6,
      name: 'Embroidered Wall Hanging',
      description: 'Beautiful wall hanging with traditional embroidery',
      price: 1800,
      artisan_name: 'Sita Sharma',
      category: 'Textiles',
      images: '["https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&h=400&fit=crop"]'
    }
  ];

  const displayProducts = products.length > 0 ? products : mockProducts;
  const categories = ['all', 'Textiles', 'Pottery', 'Woodwork', 'Metalwork', 'Jewelry'];

  const filteredProducts = displayProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.artisan_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getImageUrl = (images: string) => {
    try {
      const imageArray = JSON.parse(images);
      return imageArray[0];
    } catch {
      return images;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Discover Authentic Crafts</h1>
          <p className="text-xl text-gray-600">Find unique handmade treasures from talented artisans</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for products, artisans..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-2xl h-64 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
                <div className="relative">
                  <img
                    src={getImageUrl(product.images)}
                    alt={product.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <button className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
                    <Heart className="w-5 h-5 text-gray-600 hover:text-pink-500 transition-colors" />
                  </button>
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                      {product.category}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                    {product.name}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">by {product.artisan_name}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium text-gray-900">4.8</span>
                      <span className="text-sm text-gray-500">(12)</span>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">₹{product.price.toLocaleString()}</p>
                    </div>
                  </div>

                  <button className="w-full mt-4 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 active:scale-95">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredProducts.length === 0 && !loading && (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
