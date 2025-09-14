import { useState } from 'react';
import { ShoppingCart, Plus, Minus, Heart } from 'lucide-react';
import PaymentModal from './PaymentModal';

interface AddToCartButtonProps {
  product: {
    id: number;
    name: string;
    price: number;
    stock_quantity: number;
    artisan_name?: string;
    images?: string;
  };
  className?: string;
}

export default function AddToCartButton({ product, className = '' }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert(`Added ${quantity} x ${product.name} to cart!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart. Please try again.');
    } finally {
      setIsAdding(false);
    }
  };

  const handleBuyNow = () => {
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    // Reset quantity or redirect to orders page
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  const increaseQuantity = () => {
    if (quantity < product.stock_quantity) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Stock Status */}
      {product.stock_quantity === 0 ? (
        <div className="text-center py-3 px-4 bg-red-50 border border-red-200 rounded-xl">
          <span className="text-red-600 font-medium">Out of Stock</span>
        </div>
      ) : product.stock_quantity <= 5 ? (
        <div className="text-center py-2 px-4 bg-amber-50 border border-amber-200 rounded-xl">
          <span className="text-amber-700 font-medium">Only {product.stock_quantity} left in stock!</span>
        </div>
      ) : null}

      {/* Quantity Selector & Wishlist */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1 bg-gray-100 rounded-xl p-1">
          <button
            onClick={decreaseQuantity}
            disabled={quantity <= 1}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white shadow-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Minus className="w-4 h-4 text-gray-600" />
          </button>
          
          <div className="flex items-center justify-center min-w-[3rem] px-3 py-2 bg-white rounded-xl shadow-sm font-semibold text-gray-900">
            {quantity}
          </div>
          
          <button
            onClick={increaseQuantity}
            disabled={quantity >= product.stock_quantity}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white shadow-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Wishlist Button */}
        <button
          onClick={toggleWishlist}
          className={`p-3 rounded-xl transition-colors ${
            isWishlisted 
              ? 'bg-red-50 text-red-600 hover:bg-red-100' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Price Display */}
      <div className="text-center py-3 px-4 bg-orange-50 rounded-xl border border-orange-200">
        <div className="text-sm text-orange-700 mb-1">Total Price</div>
        <div className="text-2xl font-bold text-orange-800">
          ₹{(product.price * quantity).toLocaleString()}
        </div>
        {quantity > 1 && (
          <div className="text-sm text-orange-600">
            ₹{product.price.toLocaleString()} × {quantity}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <button
          onClick={handleAddToCart}
          disabled={isAdding || product.stock_quantity === 0}
          className="flex-1 border-2 border-orange-600 text-orange-600 py-3 px-6 rounded-xl font-semibold hover:bg-orange-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isAdding ? (
            <>
              <div className="w-5 h-5 animate-spin border-2 border-orange-600 border-t-transparent rounded-full"></div>
              <span>Adding...</span>
            </>
          ) : (
            <>
              <ShoppingCart className="w-5 h-5" />
              <span>Add to Cart</span>
            </>
          )}
        </button>

        <button
          onClick={handleBuyNow}
          disabled={product.stock_quantity === 0}
          className="flex-1 bg-orange-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Buy Now
        </button>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        product={{
          id: product.id,
          name: product.name,
          price: product.price,
          artisan_name: product.artisan_name || 'Unknown Artisan',
          images: product.images
        }}
        quantity={quantity}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
}
