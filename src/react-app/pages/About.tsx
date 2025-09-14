import { Users, Heart, Award, Globe, Palette, Handshake } from 'lucide-react';
import Header from '@/react-app/components/Header';
import Footer from '@/react-app/components/Footer';

export default function About() {
  const features = [
    {
      icon: Palette,
      title: "Authentic Craftsmanship",
      description: "Every product is handcrafted by skilled artisans using traditional techniques passed down through generations."
    },
    {
      icon: Heart,
      title: "Supporting Communities",
      description: "We directly connect buyers with artisans, ensuring fair prices and sustainable livelihoods for craftspeople."
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Bringing Indian handicrafts to a global audience while preserving our rich cultural heritage."
    },
    {
      icon: Award,
      title: "Quality Assured",
      description: "Each artisan and product goes through our quality verification process to ensure authentic craftsmanship."
    }
  ];

  const team = [
    {
      name: "Priya Sharma",
      role: "Founder & CEO",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b789?w=200&h=200&fit=crop&crop=face",
      bio: "Passionate about preserving traditional crafts and empowering artisans through technology."
    },
    {
      name: "Rajesh Kumar",
      role: "Head of Artisan Relations",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
      bio: "Former artisan turned advocate, connecting craftspeople with modern markets."
    },
    {
      name: "Meera Patel",
      role: "Chief Technology Officer",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
      bio: "Building technology that bridges the gap between tradition and innovation."
    }
  ];

  const stats = [
    { number: "5,000+", label: "Active Artisans" },
    { number: "50,000+", label: "Happy Customers" },
    { number: "100+", label: "Craft Categories" },
    { number: "25+", label: "States Covered" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600 via-amber-600 to-orange-700"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center text-white">
          <h1 className="text-5xl lg:text-6xl font-bold mb-6">
            Preserving Heritage, 
            <span className="text-yellow-300"> Empowering Artisans</span>
          </h1>
          <p className="text-xl mb-8 text-orange-100 max-w-3xl mx-auto">
            CraftConnect is more than a marketplace. We're a bridge between ancient traditions 
            and modern commerce, connecting skilled artisans with appreciative customers worldwide.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              To preserve India's rich craft heritage while providing sustainable livelihoods 
              to artisans and bringing authentic handmade treasures to design enthusiasts globally.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Impact</h2>
            <p className="text-xl text-gray-600">Numbers that tell our story</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-orange-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-sm">
            <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">Our Story</h2>
            
            <div className="prose prose-lg mx-auto text-gray-600">
              <p className="text-xl leading-relaxed mb-6">
                CraftConnect was born from a simple yet powerful vision: to create a bridge between 
                India's incredible artisan heritage and the modern world's appreciation for authentic, 
                handcrafted goods.
              </p>
              
              <p className="leading-relaxed mb-6">
                Our journey began when our founder, Priya Sharma, traveled through rural India and 
                witnessed the extraordinary skills of local artisans whose beautiful work was often 
                undervalued or unknown beyond their immediate communities. She saw talented potters, 
                weavers, woodcarvers, and metalworkers creating masterpieces that deserved global recognition.
              </p>
              
              <p className="leading-relaxed mb-6">
                The challenge was clear: these artisans needed a platform that could showcase their 
                work to a broader audience while ensuring they received fair compensation for their 
                skills. Traditional middlemen often took large cuts, leaving artisans with minimal 
                profits from their hard work.
              </p>
              
              <p className="leading-relaxed">
                Today, CraftConnect has become that bridge. We use technology to connect artisans 
                directly with customers who value authenticity and craftsmanship. Every purchase 
                on our platform directly supports the artisan and their community, helping preserve 
                traditional techniques while providing sustainable livelihoods.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600">Passionate people working to preserve craft heritage</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <div className="relative inline-block mb-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-32 h-32 rounded-full object-cover mx-auto"
                  />
                  <div className="absolute inset-0 w-32 h-32 rounded-full bg-gradient-to-br from-orange-400 to-amber-400 opacity-20"></div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-orange-600 font-medium mb-4">{member.role}</p>
                <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">Our Values</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <Handshake className="w-12 h-12 text-orange-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Fair Trade</h3>
              <p className="text-gray-600">Ensuring artisans receive fair compensation for their skills and craftsmanship.</p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <Heart className="w-12 h-12 text-orange-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Community First</h3>
              <p className="text-gray-600">Supporting artisan communities and preserving traditional knowledge.</p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <Users className="w-12 h-12 text-orange-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Authenticity</h3>
              <p className="text-gray-600">Promoting genuine handcrafted products and traditional techniques.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-orange-600 to-amber-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-6">Join Our Mission</h2>
          <p className="text-xl mb-8 text-orange-100">
            Whether you're an artisan looking to share your craft or a customer who appreciates 
            authentic handmade goods, you can be part of preserving India's rich craft heritage.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => window.location.href = '/login'}
              className="bg-white text-orange-600 px-8 py-3 rounded-xl font-semibold hover:bg-orange-50 transition-colors"
            >
              Become an Artisan
            </button>
            <button 
              onClick={() => window.location.href = '/products'}
              className="border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-orange-600 transition-colors"
            >
              Shop Handcrafted Items
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
