import { useState } from 'react';
import { X, CreditCard, Smartphone, Building2, ShieldCheck, Lock, Phone } from 'lucide-react';
import OTPModal from './OTPModal';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: number;
    name: string;
    price: number;
    artisan_name: string;
    images?: string;
  };
  quantity: number;
  onPaymentSuccess: () => void;
}

export default function PaymentModal({ isOpen, onClose, product, quantity, onPaymentSuccess }: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [phoneForUPI, setPhoneForUPI] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });

  const totalAmount = product.price * quantity;
  const platformFee = Math.max(totalAmount * 0.03, 10); // 3% or minimum ₹10
  const finalAmount = totalAmount + platformFee;

  if (!isOpen) return null;

  const handlePayment = async () => {
    // For UPI payments, verify phone first
    if (paymentMethod === 'upi' && !phoneVerified) {
      if (!phoneForUPI || phoneForUPI.length < 10) {
        alert('Please enter a valid phone number');
        return;
      }
      
      try {
        await fetch('/api/send-otp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ phone: phoneForUPI }),
        });
        setShowOTP(true);
        return;
      } catch (error) {
        alert('Failed to send OTP. Please try again.');
        return;
      }
    }

    setLoading(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create order
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: product.id,
          quantity,
          total_amount: finalAmount,
          payment_method: paymentMethod,
          payment_details: paymentMethod === 'upi' ? { phone: phoneForUPI } : cardDetails
        }),
      });

      if (response.ok) {
        onPaymentSuccess();
        onClose();
        alert('Payment successful! Your order has been placed.');
      } else {
        throw new Error('Payment failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneVerification = () => {
    setPhoneVerified(true);
    setShowOTP(false);
  };

  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: CreditCard, popular: true },
    { id: 'upi', name: 'UPI/Digital Wallet', icon: Smartphone, popular: true },
    { id: 'netbanking', name: 'Net Banking', icon: Building2, popular: false },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Complete Payment</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          {/* Order Summary */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Order Summary</h3>
            <div className="flex items-center space-x-4 mb-4">
              <img
                src={product.images ? JSON.parse(product.images)[0] : 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop'}
                alt={product.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{product.name}</h4>
                <p className="text-sm text-gray-600">by {product.artisan_name}</p>
                <p className="text-sm text-gray-600">Quantity: {quantity}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">₹{totalAmount.toLocaleString()}</p>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Item Total</span>
                <span>₹{totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Platform Fee</span>
                <span>₹{platformFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg border-t border-gray-200 pt-2">
                <span>Total Amount</span>
                <span className="text-orange-600">₹{finalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Select Payment Method</h3>
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <label
                  key={method.id}
                  className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-colors ${
                    paymentMethod === method.id
                      ? 'border-orange-300 bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.id}
                    checked={paymentMethod === method.id}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="sr-only"
                  />
                  <method.icon className="w-6 h-6 text-gray-600 mr-3" />
                  <span className="font-medium text-gray-900 flex-1">{method.name}</span>
                  {method.popular && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Popular</span>
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Payment Details */}
          {paymentMethod === 'card' && (
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-4">Card Details</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={cardDetails.number}
                    onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={cardDetails.expiry}
                      onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                    <input
                      type="text"
                      placeholder="123"
                      value={cardDetails.cvv}
                      onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={cardDetails.name}
                    onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>
          )}

          {paymentMethod === 'upi' && (
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-4">UPI Details</h4>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number for UPI</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phoneForUPI}
                    onChange={(e) => setPhoneForUPI(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  {phoneVerified && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-600">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                  )}
                </div>
                {phoneVerified && (
                  <p className="text-sm text-green-600 mt-2 flex items-center">
                    <ShieldCheck className="w-4 h-4 mr-1" />
                    Phone number verified
                  </p>
                )}
              </div>
            </div>
          )}

          {paymentMethod === 'netbanking' && (
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-4">Select Your Bank</h4>
              <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500">
                <option value="">Choose your bank</option>
                <option value="sbi">State Bank of India</option>
                <option value="hdfc">HDFC Bank</option>
                <option value="icici">ICICI Bank</option>
                <option value="axis">Axis Bank</option>
                <option value="kotak">Kotak Mahindra Bank</option>
              </select>
            </div>
          )}

          {/* Security Badge */}
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 mb-6">
            <ShieldCheck className="w-4 h-4 text-green-600" />
            <span>256-bit SSL encrypted</span>
            <Lock className="w-4 h-4 text-green-600" />
            <span>Secure payment</span>
          </div>

          {/* Pay Button */}
          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full bg-orange-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 animate-spin border-2 border-white border-t-transparent rounded-full"></div>
                <span>Processing Payment...</span>
              </div>
            ) : paymentMethod === 'upi' && !phoneVerified ? (
              'Verify Phone & Pay'
            ) : (
              `Pay ₹${finalAmount.toLocaleString()}`
            )}
          </button>

          <p className="text-xs text-gray-500 text-center mt-4">
            By proceeding with payment, you agree to our Terms of Service and Privacy Policy.
            Your payment information is secure and encrypted.
          </p>
        </div>

        {/* OTP Modal */}
        <OTPModal
          isOpen={showOTP}
          onClose={() => setShowOTP(false)}
          phoneNumber={phoneForUPI}
          onVerificationSuccess={handlePhoneVerification}
        />
      </div>
    </div>
  );
}
