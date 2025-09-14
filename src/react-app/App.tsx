import { BrowserRouter as Router, Routes, Route } from "react-router";
import { AuthProvider } from "@getmocha/users-service/react";
import HomePage from "@/react-app/pages/Home";
import AuthCallbackPage from "@/react-app/pages/AuthCallback";
import LoginPage from "@/react-app/pages/Login";
import DashboardPage from "@/react-app/pages/Dashboard";
import ProfileSetupPage from "@/react-app/pages/ProfileSetup";
import ArtisanDashboardPage from "@/react-app/pages/ArtisanDashboard";
import BuyerDashboardPage from "@/react-app/pages/BuyerDashboard";
import ProductsPage from "@/react-app/pages/Products";
import AddProductPage from "@/react-app/pages/AddProduct";
import CategoriesPage from "@/react-app/pages/Categories";
import ArtisanOrdersPage from "@/react-app/pages/ArtisanOrders";
import ArtisanMessagesPage from "@/react-app/pages/ArtisanMessages";
import ArtisanProfilePage from "@/react-app/pages/ArtisanProfile";
import BuyerOrdersPage from "@/react-app/pages/BuyerOrders";
import BuyerProfilePage from "@/react-app/pages/BuyerProfile";
import AboutPage from "@/react-app/pages/About";
import ChatbotWidget from "@/react-app/components/ChatbotWidget";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/auth/callback" element={<AuthCallbackPage />} />
            <Route path="/profile-setup" element={<ProfileSetupPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/artisan-dashboard" element={<ArtisanDashboardPage />} />
            <Route path="/buyer-dashboard" element={<BuyerDashboardPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/add-product" element={<AddProductPage />} />
            <Route path="/artisan/orders" element={<ArtisanOrdersPage />} />
            <Route path="/artisan/messages" element={<ArtisanMessagesPage />} />
            <Route path="/artisan/profile" element={<ArtisanProfilePage />} />
            <Route path="/buyer/orders" element={<BuyerOrdersPage />} />
            <Route path="/buyer/profile" element={<BuyerProfilePage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
          <ChatbotWidget />
        </div>
      </Router>
    </AuthProvider>
  );
}
