import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Sparkles, Eye, Save } from 'lucide-react';
import Header from '@/react-app/components/Header';
import ImageUpload from '@/react-app/components/ImageUpload';
import SocialShare from '@/react-app/components/SocialShare';

export default function AddProduct() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock_quantity: '',
    images: ['']
  });

  const categories = [
    'Pottery', 'Textiles', 'Woodwork', 'Metalwork', 'Jewelry', 
    'Paintings', 'Sculptures', 'Home Decor', 'Traditional Crafts', 'Other'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImagesChange = (images: string[]) => {
    setFormData({
      ...formData,
      images
    });
  };

  const generateDescription = async () => {
    if (!formData.name || !formData.category) {
      alert('Please enter product name and category first');
      return;
    }

    setGenerating(true);
    try {
      const response = await fetch('/api/generate-description', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          category: formData.category,
          images: formData.images.filter(img => img.trim())
        }),
      });

      const data = await response.json();
      if (data.description) {
        setFormData({
          ...formData,
          description: data.description
        });
      }
    } catch (error) {
      console.error('Error generating description:', error);
      alert('Failed to generate description. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          stock_quantity: parseInt(formData.stock_quantity),
          images: JSON.stringify(formData.images.filter(img => img.trim()))
        }),
      });

      if (response.ok) {
        navigate('/artisan-dashboard');
      } else {
        throw new Error('Failed to create product');
      }
    } catch (error) {
      console.error('Product creation error:', error);
      alert('Failed to create product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const productPreview = {
    name: formData.name,
    price: parseFloat(formData.price) || 0,
    description: formData.description,
    images: formData.images.filter(img => img.trim())
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <button 
            onClick={() => navigate('/artisan-dashboard')}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Product</h1>
                <p className="text-gray-600">Share your craft with the world</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Product Images */}
                <ImageUpload
                  images={formData.images}
                  onChange={handleImagesChange}
                  maxImages={5}
                />

                {/* Product Details */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Enter product name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="">Select Category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (₹) *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stock Quantity *
                    </label>
                    <input
                      type="number"
                      name="stock_quantity"
                      value={formData.stock_quantity}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* AI Description Generation */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Product Description
                    </label>
                    <button
                      type="button"
                      onClick={generateDescription}
                      disabled={generating || !formData.name || !formData.category}
                      className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>{generating ? 'Generating...' : 'AI Generate'}</span>
                    </button>
                  </div>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                    placeholder="Describe your product... or use AI to generate a compelling description based on images"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Click "AI Generate" to create a compelling description based on your product name, category, and images.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4 pt-6">
                  <button
                    type="button"
                    onClick={() => setShowPreview(!showPreview)}
                    className="flex-1 flex items-center justify-center space-x-2 border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                  >
                    <Eye className="w-5 h-5" />
                    <span>{showPreview ? 'Hide Preview' : 'Preview'}</span>
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 flex items-center justify-center space-x-2 bg-orange-600 text-white py-3 rounded-xl font-medium hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="w-5 h-5" />
                    <span>{loading ? 'Saving...' : 'Save Product'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Preview & Share Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Product Preview */}
              {(showPreview || formData.name || formData.images.some(img => img.trim())) && (
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Preview</h3>
                  
                  {formData.images.filter(img => img.trim())[0] && (
                    <img
                      src={formData.images.filter(img => img.trim())[0]}
                      alt="Product preview"
                      className="w-full h-48 object-cover rounded-xl mb-4"
                    />
                  )}
                  
                  <h4 className="font-bold text-gray-900 mb-2">
                    {formData.name || 'Product Name'}
                  </h4>
                  
                  {formData.price && (
                    <p className="text-2xl font-bold text-orange-600 mb-2">
                      ₹{parseFloat(formData.price).toLocaleString()}
                    </p>
                  )}
                  
                  {formData.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-4">
                      {formData.description}
                    </p>
                  )}
                  
                  {formData.category && (
                    <span className="inline-block bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-medium">
                      {formData.category}
                    </span>
                  )}

                  <button className="w-full mt-4 bg-orange-600 text-white py-3 rounded-xl font-medium hover:bg-orange-700 transition-colors">
                    Add to Cart
                  </button>
                </div>
              )}

              {/* Social Share */}
              {formData.name && formData.price && formData.description && (
                <SocialShare product={productPreview} />
              )}

              {/* Tips */}
              <div className="bg-blue-50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">💡 Tips for Success</h3>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li>• Use high-quality, well-lit photos</li>
                  <li>• Try the AI enhancement for better images</li>
                  <li>• Let AI generate compelling descriptions</li>
                  <li>• Include multiple angles of your product</li>
                  <li>• Share on social media for more reach</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
