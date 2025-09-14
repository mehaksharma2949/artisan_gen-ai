import { useEffect, useState } from 'react';
import { Star, MapPin, ArrowRight } from 'lucide-react';

interface Artisan {
  id: string;
  full_name: string;
  location: string;
  profile_image: string;
  craft_type: string;
  specialty: string;
  years_experience: number;
}

export default function FeaturedArtisans() {
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedArtisans();
  }, []);

  const fetchFeaturedArtisans = async () => {
    try {
      const response = await fetch('/api/featured-artisans');
      const data = await response.json();
      setArtisans(data);
    } catch (error) {
      console.error('Error fetching featured artisans:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mock data for demo
  const mockArtisans = [
    {
      id: '1',
      full_name: 'Priya Sharma',
      location: 'Jaipur, Rajasthan',
      profile_image: 'https://images.unsplash.com/photo-1494790108755-2616b612b1d8?w=400&h=400&fit=crop&crop=face',
      craft_type: 'Pottery',
      specialty: 'Traditional Ceramic Vessels',
      years_experience: 8
    },
    {
      id: '2',
      full_name: 'Arjun Patel',
      location: 'Kutch, Gujarat',
      profile_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
      craft_type: 'Textile Weaving',
      specialty: 'Handwoven Scarves',
      years_experience: 12
    },
    {
      id: '3',
      full_name: 'Meera Roy',
      location: 'Kolkata, West Bengal',
      profile_image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
      craft_type: 'Wooden Crafts',
      specialty: 'Handcarved Sculptures',
      years_experience: 15
    }
  ];

  const displayArtisans = artisans.length > 0 ? artisans : mockArtisans;

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Featured Artisan Stories
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Meet the talented creators behind our unique handcrafted pieces. 
            Each artisan brings generations of tradition and skill to every creation.
          </p>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-2xl h-64 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayArtisans.map((artisan) => (
              <div key={artisan.id} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-2xl mb-6 aspect-square">
                  <img
                    src={artisan.profile_image}
                    alt={artisan.full_name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="flex items-center space-x-1 mb-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    </div>
                    <p className="text-sm opacity-90">{artisan.specialty}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {artisan.full_name}
                  </h3>
                  
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span className="text-sm">{artisan.location}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-orange-600 font-medium">
                        {artisan.craft_type}
                      </p>
                      <p className="text-xs text-gray-500">
                        {artisan.years_experience} years experience
                      </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-orange-600 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <button className="bg-orange-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-orange-700 transition-colors">
            Explore All Artisans
          </button>
        </div>
      </div>
    </section>
  );
}
