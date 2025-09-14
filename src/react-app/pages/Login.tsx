import { useEffect } from 'react';
import { useAuth } from '@getmocha/users-service/react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Smartphone } from 'lucide-react';

export default function Login() {
  const { user, redirectToLogin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleGoogleLogin = async () => {
    await redirectToLogin();
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="max-w-md w-full">
        {/* Back Button */}
        <button 
          onClick={() => navigate('/')}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </button>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">CC</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to CraftConnect</h1>
            <p className="text-gray-600">Join thousands of artisans and craft lovers</p>
          </div>

          {/* User Type Selection */}
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-700 mb-3">I am a</p>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-orange-300 transition-colors">
                <input type="radio" name="userType" value="buyer" className="sr-only" />
                <div className="flex-1 text-center">
                  <div className="text-lg font-medium text-gray-900">Buyer</div>
                  <div className="text-xs text-gray-500">I want to discover crafts</div>
                </div>
              </label>
              <label className="flex items-center p-4 border-2 border-orange-300 bg-orange-50 rounded-xl cursor-pointer">
                <input type="radio" name="userType" value="artisan" className="sr-only" defaultChecked />
                <div className="flex-1 text-center">
                  <div className="text-lg font-medium text-orange-900">Artisan</div>
                  <div className="text-xs text-orange-600">I want to sell my crafts</div>
                </div>
              </label>
            </div>
          </div>

          {/* Login Options */}
          <div className="space-y-4">
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or</span>
              </div>
            </div>

            <button 
              className="w-full flex items-center justify-center px-4 py-3 bg-orange-600 text-white rounded-xl font-medium hover:bg-orange-700 transition-colors"
              disabled
            >
              <Smartphone className="w-5 h-5 mr-3" />
              Continue with Phone OTP (Coming Soon)
            </button>
          </div>

          <div className="mt-6 text-center text-sm text-gray-500">
            By continuing, you agree to our{' '}
            <a href="#" className="text-orange-600 hover:text-orange-700">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-orange-600 hover:text-orange-700">Privacy Policy</a>
          </div>
        </div>
      </div>
    </div>
  );
}
