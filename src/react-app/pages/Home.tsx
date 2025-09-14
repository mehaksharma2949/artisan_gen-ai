import { Link, useNavigate } from 'react-router';
import { Star, Users, ShoppingBag, Heart } from 'lucide-react';
import Header from '@/react-app/components/Header';
import FeaturedArtisans from '@/react-app/components/FeaturedArtisans';
import HowItWorks from '@/react-app/components/HowItWorks';
import Footer from '@/react-app/components/Footer';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600 via-amber-600 to-orange-700"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Bringing Tradition to the{' '}
                <span className="text-yellow-300">Digital World</span>
              </h1>
              <p className="text-xl mb-8 text-orange-100">
                Discover unique handmade treasures and connect directly with authentic artisans. 
                Support local craftsmanship while finding one-of-a-kind pieces.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link 
                  to="/products"
                  className="bg-white text-orange-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-orange-50 transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-5 h-5" />
                  Shop Unique Crafts
                </Link>
                <button 
                  onClick={() => navigate('/login')}
                  className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-orange-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Users className="w-5 h-5" />
                  Join as Artisan
                </button>
              </div>
              
              <div className="flex items-center gap-8 text-orange-100">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span>4.9/5 Rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>5000+ Artisans</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  <span>50k+ Happy Customers</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="https://mocha-cdn.com/01994526-a8e4-78b0-aab4-edf48171127f/Untitled-(1).png"
                  alt="Artisan crafting pottery"
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>
              
              {/* Floating cards */}
              <div className="absolute -top-4 -right-4 bg-white rounded-xl p-4 shadow-lg">
                <div className="text-orange-600 font-semibold">New Order!</div>
                <div className="text-sm text-gray-600">Handwoven Scarf</div>
              </div>
              
              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl p-4 shadow-lg">
                <div className="text-orange-600 font-semibold">⭐ 4.9</div>
                <div className="text-sm text-gray-600">Customer Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FeaturedArtisans />
      <HowItWorks />
      <Footer />
    </div>
  );
}
