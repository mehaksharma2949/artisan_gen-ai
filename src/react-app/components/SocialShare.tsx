import { Share2, MessageCircle, Instagram } from 'lucide-react';

interface SocialShareProps {
  product: {
    name: string;
    price: number;
    description: string;
    images: string[];
  };
  productUrl?: string;
}

export default function SocialShare({ product, productUrl = window.location.href }: SocialShareProps) {
  const shareText = `Check out this amazing handcrafted ${product.name} for ₹${product.price.toLocaleString()}! ${product.description.substring(0, 100)}...`;

  const shareToWhatsApp = () => {
    const text = encodeURIComponent(`${shareText}\n\nView more: ${productUrl}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const shareToInstagram = () => {
    // Instagram doesn't allow direct sharing via URL, so we copy to clipboard
    navigator.clipboard.writeText(`${shareText}\n\n${productUrl}`).then(() => {
      alert('Product details copied to clipboard! You can now paste it in your Instagram story or post.');
    });
  };

  const shareGeneric = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: shareText,
          url: productUrl,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${shareText}\n\n${productUrl}`).then(() => {
        alert('Product details copied to clipboard!');
      });
    }
  };

  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
        <Share2 className="w-4 h-4 mr-2" />
        Share this product
      </h4>
      
      <div className="flex space-x-3">
        <button
          onClick={shareToWhatsApp}
          className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          <span>WhatsApp</span>
        </button>
        
        <button
          onClick={shareToInstagram}
          className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-colors"
        >
          <Instagram className="w-4 h-4" />
          <span>Instagram</span>
        </button>
        
        <button
          onClick={shareGeneric}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          <Share2 className="w-4 h-4" />
          <span>More</span>
        </button>
      </div>
    </div>
  );
}
