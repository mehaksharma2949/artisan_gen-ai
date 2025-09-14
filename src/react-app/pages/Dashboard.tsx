import { useEffect } from 'react';
import { useAuth } from '@getmocha/users-service/react';
import { useNavigate } from 'react-router';
import { Loader2 } from 'lucide-react';

export default function Dashboard() {
  const { user, isPending } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isPending && !user) {
      navigate('/login');
      return;
    }

    if (user) {
      // Check if user has completed profile setup
      const checkProfile = async () => {
        try {
          const response = await fetch('/api/users/me');
          const userData = await response.json();
          
          if (!userData.profile) {
            navigate('/profile-setup');
          } else {
            // Redirect based on user type
            if (userData.profile.user_type === 'artisan') {
              navigate('/artisan-dashboard');
            } else {
              navigate('/buyer-dashboard');
            }
          }
        } catch (error) {
          console.error('Error checking profile:', error);
          navigate('/profile-setup');
        }
      };

      checkProfile();
    }
  }, [user, isPending, navigate]);

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="text-center">
          <div className="animate-spin mb-4">
            <Loader2 className="w-12 h-12 text-orange-600 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Loading your dashboard...
          </h2>
        </div>
      </div>
    );
  }

  return null;
}
