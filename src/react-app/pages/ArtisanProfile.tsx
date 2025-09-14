import { useState, useEffect } from 'react';
import { useAuth } from '@getmocha/users-service/react';
import { Camera, MapPin, Clock, Award, Save, Sparkles, Instagram, Share2, Users, Star, MessageCircle, Copy } from 'lucide-react';
import Header from '@/react-app/components/Header';

export default function ArtisanProfile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [generatingStory, setGeneratingStory] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    craft_type: '',
    specialty: '',
    years_experience: '',
    story: '',
    workshop_location: '',
    social_media_links: ''
  });

  const [stats] = useState({
    products: 24,
    orders: 156,
    rating: 4.8,
    followers: 1247
  });

  const [products, setProducts] = useState([]);

  const shareProfile = () => {
    const profileUrl = `${window.location.origin}/artisan/${user?.id}`;
    const shareText = `Check out ${formData.full_name || 'this amazing artisan'}'s handcrafted ${formData.craft_type || 'products'}! 🎨✨\n\n${formData.bio || 'Discover unique handmade treasures'}\n\n`;
    
    if (navigator.share) {
      navigator.share({
        title: `${formData.full_name} - Artisan Profile`,
        text: shareText,
        url: profileUrl,
      });
    } else {
      // Fallback sharing options
      const options = [
        {
          name: 'WhatsApp',
          icon: MessageCircle,
          color: 'bg-green-600',
          action: () => {
            const whatsappText = encodeURIComponent(`${shareText}View profile: ${profileUrl}`);
            window.open(`https://wa.me/?text=${whatsappText}`, '_blank');
          }
        },
        {
          name: 'Instagram',
          icon: Instagram,
          color: 'bg-gradient-to-r from-purple-600 to-pink-600',
          action: () => {
            navigator.clipboard.writeText(`${shareText}${profileUrl}`).then(() => {
              alert('Profile link copied! You can now paste it in your Instagram story or bio.');
            });
          }
        },
        {
          name: 'Copy Link',
          icon: Copy,
          color: 'bg-gray-600',
          action: () => {
            navigator.clipboard.writeText(profileUrl).then(() => {
              alert('Profile link copied to clipboard!');
            });
          }
        }
      ];

      // Show sharing modal
      const modal = document.createElement('div');
      modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
      modal.innerHTML = `
        <div class="bg-white rounded-2xl p-6 max-w-sm mx-4">
          <h3 class="text-lg font-semibold mb-4">Share Your Profile</h3>
          <div class="space-y-3">
            ${options.map(option => `
              <button onclick="window.shareOption('${option.name}')" class="${option.color} text-white px-4 py-3 rounded-lg w-full text-left flex items-center space-x-3">
                <span class="text-sm font-medium">${option.name}</span>
              </button>
            `).join('')}
          </div>
          <button onclick="this.closest('.fixed').remove()" class="mt-4 w-full border border-gray-300 text-gray-700 py-2 rounded-lg">Cancel</button>
        </div>
      `;
      
      (window as any).shareOption = (optionName: string) => {
        const option = options.find(o => o.name === optionName);
        option?.action();
        modal.remove();
      };
      
      document.body.appendChild(modal);
    }
  };

  const inviteFriends = () => {
    const inviteUrl = `${window.location.origin}/invite/${user?.id}`;
    const inviteText = `🎨 Join me on CraftConnect! Discover amazing handcrafted treasures and support local artisans.\n\n✨ Use my invite link to get started: ${inviteUrl}\n\n#HandmadeIndia #SupportArtisans #CraftConnect`;
    
    const options = [
      {
        name: 'WhatsApp',
        action: () => {
          const whatsappText = encodeURIComponent(inviteText);
          window.open(`https://wa.me/?text=${whatsappText}`, '_blank');
        }
      },
      {
        name: 'Instagram',
        action: () => {
          navigator.clipboard.writeText(inviteText).then(() => {
            alert('Invite message copied! Share it in your Instagram story or DM friends.');
          });
        }
      },
      {
        name: 'Copy Link',
        action: () => {
          navigator.clipboard.writeText(inviteUrl).then(() => {
            alert('Invite link copied to clipboard!');
          });
        }
      }
    ];

    // Show invite modal
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
      <div class="bg-white rounded-2xl p-6 max-w-sm mx-4">
        <h3 class="text-lg font-semibold mb-4">Invite Friends</h3>
        <p class="text-gray-600 text-sm mb-4">Share CraftConnect with your friends and help them discover amazing artisans!</p>
        <div class="space-y-3">
          ${options.map(option => `
            <button onclick="window.inviteOption('${option.name}')" class="bg-orange-600 text-white px-4 py-3 rounded-lg w-full text-left">
              ${option.name}
            </button>
          `).join('')}
        </div>
        <button onclick="this.closest('.fixed').remove()" class="mt-4 w-full border border-gray-300 text-gray-700 py-2 rounded-lg">Cancel</button>
      </div>
    `;
    
    (window as any).inviteOption = (optionName: string) => {
      const option = options.find(o => o.name === optionName);
      option?.action();
      modal.remove();
    };
    
    document.body.appendChild(modal);
  };

  useEffect(() => {
    if (user && activeTab === 'gallery') {
      fetchProducts();
    }
  }, [user, activeTab]);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`/api/artisan/${user?.id}/products`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        full_name: user.google_user_data.name || '',
        email: user.email || ''
      }));
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/artisan/profile');
      const data = await response.json();
      if (data) {
        setFormData(prev => ({ ...prev, ...data }));
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const generateStory = async () => {
    if (!formData.craft_type || !formData.full_name) {
      alert('Please fill in your name and craft type first');
      return;
    }

    setGeneratingStory(true);
    try {
      const response = await fetch('/api/generate-story', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.full_name,
          craft_type: formData.craft_type,
          location: formData.location,
          years_experience: formData.years_experience,
          specialty: formData.specialty,
          workshop_location: formData.workshop_location
        }),
      });

      const data = await response.json();
      if (data.story) {
        setFormData({
          ...formData,
          story: data.story
        });
      }
    } catch (error) {
      console.error('Error generating story:', error);
      alert('Failed to generate story. Please try again.');
    } finally {
      setGeneratingStory(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/artisan/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Profile updated successfully!');
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const craftTypes = [
    'Pottery & Ceramics', 'Textiles & Weaving', 'Woodwork & Carving', 
    'Metalwork & Jewelry', 'Paintings & Art', 'Sculptures', 
    'Traditional Crafts', 'Home Decor', 'Other'
  ];

  const tabs = [
    { id: 'profile', label: 'Profile', icon: Camera },
    { id: 'gallery', label: 'Gallery', icon: Instagram },
    { id: 'analytics', label: 'Analytics', icon: Star }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Instagram-style Header */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
            {/* Profile Picture */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-pink-400 via-purple-500 to-orange-400 p-1">
                <img
                  src={user?.google_user_data.picture || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face'}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover bg-white p-1"
                />
              </div>
              <button className="absolute bottom-2 right-2 bg-orange-500 text-white p-3 rounded-full hover:bg-orange-600 transition-colors shadow-lg">
                <Camera className="w-4 h-4" />
              </button>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:space-x-8 space-y-4 md:space-y-0">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{formData.full_name || 'Your Name'}</h1>
                  <p className="text-gray-600 flex items-center mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    {formData.location || 'Your Location'}
                  </p>
                  <p className="text-orange-600 font-medium mt-1">{formData.craft_type || 'Your Craft'}</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-8">
                  <div className="text-center">
                    <div className="text-xl font-bold text-gray-900">{stats.products}</div>
                    <div className="text-sm text-gray-600">Products</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-gray-900">{stats.orders}</div>
                    <div className="text-sm text-gray-600">Orders</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-gray-900">{stats.followers}</div>
                    <div className="text-sm text-gray-600">Followers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-gray-900 flex items-center justify-center">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      {stats.rating}
                    </div>
                    <div className="text-sm text-gray-600">Rating</div>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="mt-4">
                <p className="text-gray-700 text-sm leading-relaxed">
                  {formData.bio || 'Tell your visitors about your craft and passion...'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 mt-6">
                <button 
                  onClick={() => setActiveTab('profile')}
                  className="bg-orange-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors"
                >
                  Edit Profile
                </button>
                <button 
                  onClick={shareProfile}
                  className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  <Share2 className="w-4 h-4 inline mr-2" />
                  Share Profile
                </button>
                <button 
                  onClick={inviteFriends}
                  className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  <Users className="w-4 h-4 inline mr-2" />
                  Invite Friends
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-t-2xl shadow-sm">
          <div className="flex border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-8 py-4 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-orange-600 border-b-2 border-orange-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-b-2xl shadow-sm p-8">
          {activeTab === 'profile' && (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      disabled
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="City, State"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                    placeholder="Tell visitors about yourself..."
                  />
                </div>
              </div>

              {/* Craft Information */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Craft Information</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Craft Type *
                    </label>
                    <select
                      name="craft_type"
                      value={formData.craft_type}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="">Select Craft Type</option>
                      {craftTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Years of Experience
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="number"
                        name="years_experience"
                        value={formData.years_experience}
                        onChange={handleInputChange}
                        min="0"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specialty
                  </label>
                  <div className="relative">
                    <Award className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                    <textarea
                      name="specialty"
                      value={formData.specialty}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                      placeholder="What makes your craft unique? What are you known for?"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Workshop Location
                  </label>
                  <input
                    type="text"
                    name="workshop_location"
                    value={formData.workshop_location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Where do you create your crafts?"
                  />
                </div>
              </div>

              {/* AI Artisan Story */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Your Artisan Story</h2>
                  <button
                    type="button"
                    onClick={generateStory}
                    disabled={generatingStory || !formData.craft_type || !formData.full_name}
                    className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{generatingStory ? 'Generating...' : 'AI Generate Story'}</span>
                  </button>
                </div>
                <textarea
                  name="story"
                  value={formData.story}
                  onChange={handleInputChange}
                  rows={8}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                  placeholder="Share your journey as an artisan. How did you start? What inspires you? What traditions do you follow? Or let AI create a beautiful story for you based on your craft details."
                />
                <p className="text-sm text-gray-500 mt-2">
                  Click "AI Generate Story" to create an inspiring artisan story based on your craft information.
                </p>
              </div>

              {/* Social Media */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Social Media Links</h2>
                <textarea
                  name="social_media_links"
                  value={formData.social_media_links}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                  placeholder="Instagram, Facebook, Website URLs (one per line)"
                />
              </div>

              {/* Save Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full md:w-auto flex items-center justify-center space-x-2 bg-orange-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-5 h-5" />
                  <span>{loading ? 'Saving...' : 'Save Profile'}</span>
                </button>
              </div>
            </form>
          )}

          {activeTab === 'gallery' && (
            <div>
              {products.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product: any) => (
                    <div key={product.id} className="group cursor-pointer">
                      <div className="relative overflow-hidden rounded-xl aspect-square">
                        <img
                          src={product.images ? JSON.parse(product.images)[0] : 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop'}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 text-center text-white">
                            <h4 className="font-semibold text-lg">{product.name}</h4>
                            <p className="text-orange-200">₹{product.price?.toLocaleString()}</p>
                            <div className="flex items-center justify-center mt-2 space-x-2">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <Instagram className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Product Gallery</h3>
                  <p className="text-gray-600 mb-6">Your beautiful crafts will be displayed here</p>
                  <button 
                    onClick={() => window.location.href = '/add-product'}
                    className="bg-orange-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-orange-700 transition-colors"
                  >
                    Add New Product
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Profile Views</h3>
                <p className="text-3xl font-bold text-blue-600">2,847</p>
                <p className="text-sm text-blue-700 mt-1">+12% from last month</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-green-900 mb-2">Total Sales</h3>
                <p className="text-3xl font-bold text-green-600">₹84,692</p>
                <p className="text-sm text-green-700 mt-1">+8% from last month</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-purple-900 mb-2">New Followers</h3>
                <p className="text-3xl font-bold text-purple-600">127</p>
                <p className="text-sm text-purple-700 mt-1">+23% from last month</p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-orange-900 mb-2">Engagement</h3>
                <p className="text-3xl font-bold text-orange-600">94.2%</p>
                <p className="text-sm text-orange-700 mt-1">+5% from last month</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
