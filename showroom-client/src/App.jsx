import { BrowserRouter, Routes, Route, Navigate, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import CarCard from './components/CarCard';
import Footer from './components/Footer';
import InventoryPage from './pages/InventoryPage';
import AdminLogin from './admin/pages/AdminLogin';
import AdminDashboard from './admin/pages/AdminDashboard';
import ProtectedRoute from './admin/components/ProtectedRoute';
import { fetchVehicles } from './services/vehicleService';
import { ArrowRight, Sparkles, Loader2, Car } from 'lucide-react';
import VehicleDetailsPage from './pages/VehicleDetailsPage';
import ServicesPage from './pages/ServicesPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import Layout from './components/Layout';

function ShowroomHome() {
  const { data: vehicleResponse, isLoading } = useQuery({
    queryKey: ['vehicles', 'featured'],
    queryFn: () => fetchVehicles('All'),
  });

  const rawVehicles = Array.isArray(vehicleResponse)
    ? vehicleResponse
    : (vehicleResponse?.data || []);

  const featuredVehicles = rawVehicles.slice(0, 6);

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 antialiased flex flex-col">
      <main className="flex-1">
        <HeroSection />

        {/* Featured Vehicles Section */}
        <section id="inventory" className="max-w-7xl mx-auto px-4 sm:px-8 py-16 text-left">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Curated Fleet</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Featured Vehicles
              </h2>
            </div>
            
            <Link
              to="/inventory"
              className="inline-flex items-center gap-2 text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors"
            >
              <span>View All Inventory</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {isLoading ? (
            <div className="py-16 text-center text-zinc-400 flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              <p className="text-sm">Fetching showroom fleet...</p>
            </div>
          ) : featuredVehicles.length === 0 ? (
            <div className="py-16 text-center text-zinc-500 glass-card rounded-2xl">
              <Car className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-base font-semibold">No vehicles currently listed.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredVehicles.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <Link
              to="/inventory"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02]"
            >
              <span>Explore Complete Inventory</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
} // Fixed missing closing bracket for ShowroomHome

function AdminLoginWrapper() {
  const navigate = useNavigate();
  const token = localStorage.getItem('admin_token');
  if (token) return <Navigate to="/admin/dashboard" replace />;
  return <AdminLogin onLoginSuccess={() => navigate('/admin/dashboard')} />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <ShowroomHome />
            </Layout>
          }
        />
        <Route
          path="/inventory"
          element={
            <Layout>
              <InventoryPage />
            </Layout>
          }
        />
        <Route
          path="/inventory/:id"
          element={
            <Layout>
              <VehicleDetailsPage />
            </Layout>
          }
        />
        <Route
          path="/services"
          element={
            <Layout>
              <ServicesPage />
            </Layout>
          }
        />
        <Route
          path="/about"
          element={
            <Layout>
              <AboutPage />
            </Layout>
          }
        />
        <Route
          path="/contact"
          element={
            <Layout>
              <ContactPage />
            </Layout>
          }
        />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLoginWrapper />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}