import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

// --- Layout Component ---
import Layout from "../components/layout/Layout"; // Main wrapper with Sidebar/Navbar

// --- Auth Components ---
import LoginPage from "../components/auth/Login";
import ForgotPasswordPage from "../components/auth/ForgotPassword";
import ResetPasswordPage from "../components/auth/ResetPassword";

// --- Protected Routes---
import ProtectedRoute from "./ProtectedRoutes";

// --- Page Components ---

// Dashboard
import Dashboard from "../components/pages/dashboard/Dashboard";

// Customers
import Customers from "../components/pages/customers/Customers";
import CustomerProfile from "../components/pages/customers/CustomerProfile";

// Sellers
import Sellers from "../components/pages/sellers/Sellers";
import SellerProfile from "../components/pages/sellers/SellerProfile";
import DeletedSellers from "../components/pages/sellers/DeletedSellers";

// Farmers (Navin add kelele)
import Farmers from "../components/pages/farmers/Farmers";
import FarmerProfile from "../components/pages/farmers/FarmerProfile";
import DeletedFarmers from "../components/pages/farmers/DeletedFarmers";

// Delivery Partners
import DeliveryPartners from "../components/pages/delivery/DeliveryPartners";
import DeliveryProfile from "../components/pages/delivery/DeliveryProfile";

// Products (General)
import AllProducts from "../components/pages/products/AllProducts";
import ProductDetail from "../components/pages/products/ProductDetail";
import DeletedProducts from "../components/pages/products/DeletedProducts";

// Agri Products
import AgriProducts from "../components/pages/agri_products/AgriProducts";
import AgriProductDetail from "../components/pages/agri_products/AgriProductDetail";

// Farmer Products (Navin add kelele)
import FarmerProducts from "../components/pages/farmer_products/FarmerProducts";
import FarmerProductDetail from "../components/pages/farmer_products/FarmerProductDetail";

// Categories
import Categories from "../components/pages/categories/Categories";

// Catalogues
import Catalogues from "../components/pages/catalogues/Catalogues";
import UploadCatalogue from "../components/pages/catalogues/UploadCatalogue";
import CatalogueDetail from "../components/pages/catalogues/CatalogueDetail";
import ReviewProducts from "../components/pages/catalogues/ReviewProduct";
import ProductPreview from "../components/pages/catalogues/ProductPreview";

// Markets Rates
import MarketRates from "../components/pages/market/MarketRates";

// Weather Settings
import WeatherSettings from "../components/pages/weather/WeatherSettings";

// Websites Content
import BannersManagement from "../components/pages/website-content/Banners";
import BlogsManagement from "../components/pages/website-content/Blogs";
import MediaManagement from "../components/pages/website-content/MediaGallery";
import PagesManagement from "../components/pages/website-content/Pages";

// Admins
import Admins from "../components/pages/admins/Admins";

// Tickets & Support
import TicketsSupport from "../components/pages/support/TicketsSupport";
import TicketDetail from "../components/pages/support/TicketDetail";

// Offers
import Offers from "../components/pages/offers/Offers";

// Notifications
import Notifications from "../components/pages/notifications/Notifications";

import Profile from "../components/pages/profile/Profile";
import Settings from "../components/pages/settings/Settings";
import ActivityLog from "../components/pages/activityLogs/ActivityLog";
import Payments from "../components/pages/payments/Payments";
import Orders from "../components/pages/orders/Orders";
import OrderDetail from "../components/pages/orders/OrderDetail";
import Review from "../components/pages/reviews/Review";
import ReviewDetail from "../components/pages/reviews/ReviewDetail";
import ReferAndEarn from "../components/pages/refer/ReferAndEarn";

const AllRoutes = () => {
  const [products, setProducts] = useState([]);
  const [deletedProducts, setDeletedProducts] = useState([]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Protected Dashboard Layout */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Customers */}
          <Route path="/customers" element={<Customers />} />
          <Route path="/customer/:id" element={<CustomerProfile />} />

          {/* Sellers & Archive */}
          <Route path="/sellers" element={<Sellers />} />
          <Route path="/seller/:id" element={<SellerProfile />} />
          <Route path="/deletedsellers" element={<DeletedSellers />} />

          {/* Farmers & Archive */}
          <Route path="/farmers" element={<Farmers />} />
          <Route path="/farmer/:id" element={<FarmerProfile />} />
          <Route path="/deletedfarmers" element={<DeletedFarmers />} />

          {/* Delivery */}
          <Route path="/delivery" element={<DeliveryPartners />} />
          <Route path="/delivery-profile/:id" element={<DeliveryProfile />} />

          {/* General Products */}
          <Route
            path="/products"
            element={
              <AllProducts
                products={products}
                setProducts={setProducts}
                deletedProducts={deletedProducts}
                setDeletedProducts={setDeletedProducts}
              />
            }
          />
          <Route path="/product/:type/:id" element={<ProductDetail />} />
          <Route
            path="/deletedproducts"
            element={
              <DeletedProducts
                deletedProducts={deletedProducts}
                setDeletedProducts={setDeletedProducts}
                setProducts={setProducts}
              />
            }
          />

          {/* Agri Products */}
          <Route path="/agri-products" element={<AgriProducts />} />
          <Route path="/agri-product/:id" element={<AgriProductDetail />} />

          {/* Farmer Products */}
          <Route path="/farmer-products" element={<FarmerProducts />} />
          <Route path="/farmer-product/:id" element={<FarmerProductDetail />} />

          {/* Catalogues */}
          <Route path="/catalogues" element={<Catalogues />} />
          <Route path="/upload" element={<UploadCatalogue />} />
          <Route path="/catalogues/:id" element={<CatalogueDetail />} />
          <Route path="/catalogues/:id/review" element={<ReviewProducts />} />
          <Route path="/products/:id" element={<ProductPreview />} />

          {/* Orders & Reviews */}
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:orderId" element={<OrderDetail />} />
          <Route path="/review" element={<Review />} />
          <Route path="/review/:id" element={<ReviewDetail />} />

          {/* Market & Others */}
          <Route path="/categories" element={<Categories />} />
          <Route path="/market-rates" element={<MarketRates />} />
          <Route path="/weather-settings" element={<WeatherSettings />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/refer-earn" element={<ReferAndEarn />} />
          <Route path="/payment" element={<Payments />} />

          {/* Website Management */}
          <Route path="/websites-banners" element={<BannersManagement />} />
          <Route path="/websites-blogs" element={<BlogsManagement />} />
          <Route path="/websites-media" element={<MediaManagement />} />
          <Route path="/websites-pages" element={<PagesManagement />} />

          {/* Admins (Super Admin Only) */}
          <Route
            path="/admins"
            element={
              <ProtectedRoute requiresSuperAdmin={true}>
                <Admins />
              </ProtectedRoute>
            }
          />

          {/* Support */}
          <Route path="/support" element={<TicketsSupport />} />
          <Route path="/ticket/:id" element={<TicketDetail />} />

          {/* System & Profile */}
          <Route path="/activity-log" element={<ActivityLog />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AllRoutes;
