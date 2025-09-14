import { Search, Heart, ShoppingBag, Users } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      icon: Search,
      title: "Share Your Story",
      description: "Share what you're looking for, from traditional pieces to custom designs. Our artisans are here to bring your vision to life."
    },
    {
      icon: Users,
      title: "AI Transactions",
      description: "Our intelligent system connects you with the perfect artisan based on your preferences, style, and location."
    },
    {
      icon: ShoppingBag,
      title: "Global Reach",
      description: "Browse through authentic handcrafted items, each with a unique story and made with generations of traditional techniques."
    },
    {
      icon: Heart,
      title: "Grow Together",
      description: "Connect directly with artisans, learn about their craft, and support sustainable traditional art forms."
    }
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            How Artisan AI Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connecting traditional craftsmanship with modern technology to create 
            meaningful relationships between artisans and art lovers.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {index + 1}
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {step.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to discover authentic craftsmanship?
            </h3>
            <p className="text-gray-600 mb-6">
              Join thousands of customers who have found their perfect handcrafted pieces
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-orange-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-orange-700 transition-colors">
                Start Shopping
              </button>
              <button className="border-2 border-orange-600 text-orange-600 px-8 py-3 rounded-xl font-medium hover:bg-orange-600 hover:text-white transition-colors">
                Become an Artisan
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
