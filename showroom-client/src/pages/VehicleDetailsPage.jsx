import { useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import toast, { Toaster } from 'react-hot-toast';
import api from '../services/api';
import {
  ArrowLeft, Fuel, Gauge, Cog, Calendar,
  ShieldCheck, MapPin, Loader2, Car, ChevronLeft, ChevronRight, MessageCircle
} from 'lucide-react';

export default function VehicleDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const thumbnailContainerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const { data: vehicle, isLoading, isError } = useQuery({
    queryKey: ['vehicle', id],
    queryFn: async () => {
      const res = await api.get(`/vehicles/${id}`);
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3 text-zinc-400">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <p className="text-sm">Loading vehicle details...</p>
      </div>
    );
  }

  if (isError || !vehicle) {
    return (
      <div className="max-w-md mx-auto py-32 text-center space-y-4">
        <Car className="w-12 h-12 text-zinc-600 mx-auto" />
        <h2 className="text-xl font-bold text-white">Vehicle Not Found</h2>
        <p className="text-xs text-zinc-400">The requested vehicle listing is unavailable or has been removed.</p>
        <button
          onClick={() => navigate('/inventory')}
          className="px-5 py-2.5 bg-blue-600 text-white text-xs font-semibold rounded-xl"
        >
          Back to Inventory
        </button>
      </div>
    );
  }

  const images = vehicle.images || [];
  const primaryImg = images[selectedImageIndex]?.image_url || vehicle.image;
  const currentCoverSrc = primaryImg
    ? (primaryImg.startsWith('http') ? primaryImg : `http://localhost:8000${primaryImg}`)
    : 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1200';

  const makeName = typeof vehicle.make === 'object' ? vehicle.make?.name : vehicle.make;
  const modelName = typeof vehicle.model === 'object' ? vehicle.model?.name : vehicle.model;
  const fuelName = typeof vehicle.fuel_type === 'object'
    ? vehicle.fuel_type?.name
    : (vehicle.fuelType?.name || vehicle.fuel_type || 'Petrol');
  const bodyTypeName = typeof vehicle.body_type === 'object'
    ? vehicle.body_type?.name
    : (vehicle.bodyType?.name || vehicle.body_type || 'SUV');

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - thumbnailContainerRef.current.offsetLeft);
    setScrollLeft(thumbnailContainerRef.current.scrollLeft);
  };

  const handleMouseLeaveOrUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - thumbnailContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    thumbnailContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  // WhatsApp Negotiation Handler
  const handleNegotiateWhatsApp = () => {
    const phoneNumber = '923001234567'; // Replace with your dealership WhatsApp number
    const vehicleTitle = `${makeName || ''} ${modelName || ''} (${vehicle.year || ''})`.trim();
    const priceText = vehicle.price ? `PKR ${Number(vehicle.price).toLocaleString()}` : 'Contact for Price';
    const vinText = vehicle.vin || 'N/A';
    const pageUrl = window.location.href;

    const textMessage = `Hello VELOCITY Team! 👋\n\nI am interested in negotiating the price for this vehicle:\n🚗 *Car:* ${vehicleTitle}\n💰 *Listed Price:* ${priceText}\n🔍 *VIN/Chassis:* ${vinText}\n🔗 *Link:* ${pageUrl}\n\nPlease let me know the best final price you can offer.`;

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(textMessage)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-28 pb-20 text-left flex-1 w-full">
      <Toaster position="top-right" />
      <Link
        to="/inventory"
        className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Inventory</span>
      </Link>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full glass-panel text-blue-400 text-xs font-semibold uppercase tracking-wider">
              {makeName || 'Luxury Fleet'}
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              {vehicle.condition || 'Used'}
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            {makeName || ''} {modelName || ''} {vehicle.year ? `(${vehicle.year})` : ''}
          </h1>
        </div>
        <div className="text-left md:text-right">
          <p className="text-xs text-zinc-500 uppercase font-semibold">Listing Price</p>
          <p className="text-3xl font-extrabold text-emerald-400">
            {vehicle.price ? `PKR ${Number(vehicle.price).toLocaleString()}` : 'Contact for Price'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-3">
            <div className="relative h-80 sm:h-[450px] w-full rounded-3xl bg-black border border-zinc-800 overflow-hidden shadow-2xl group">
              <img
                src={currentCoverSrc}
                alt={`${makeName || ''} ${modelName || ''}`}
                className="w-full h-full object-cover transition-all duration-300 select-none"
              />
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/70 hover:bg-black text-white border border-white/10 backdrop-blur-md transition-all opacity-80 hover:opacity-100 hover:scale-110 shadow-lg"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/70 hover:bg-black text-white border border-white/10 backdrop-blur-md transition-all opacity-80 hover:opacity-100"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-black/80 border border-white/10 text-xs font-mono text-white backdrop-blur-md">
                    {selectedImageIndex + 1} / {images.length}
                  </div>
                </>
              )}
            </div>

            {images.length > 1 && (
              <div
                ref={thumbnailContainerRef}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeaveOrUp}
                onMouseUp={handleMouseLeaveOrUp}
                onMouseMove={handleMouseMove}
                className="flex items-center gap-3 overflow-x-auto select-none cursor-grab active:cursor-grabbing [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden py-1"
              >
                {images.map((img, idx) => {
                  const thumbUrl = img.image_url.startsWith('http') ? img.image_url : `http://localhost:8000${img.image_url}`;
                  return (
                    <button
                      key={img.id || idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative h-20 w-28 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                        selectedImageIndex === idx
                          ? 'border-blue-500 ring-2 ring-blue-500/20 scale-95'
                          : 'border-zinc-800 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={thumbUrl} alt="" className="w-full h-full object-cover pointer-events-none" />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="glass-card p-4 rounded-2xl border border-zinc-800">
              <Gauge className="w-5 h-5 text-blue-400 mb-2" />
              <p className="text-[10px] text-zinc-500 uppercase font-semibold">Mileage</p>
              <p className="text-sm font-bold text-white">{vehicle.mileage ? Number(vehicle.mileage).toLocaleString() : '0'} mi</p>
            </div>
            <div className="glass-card p-4 rounded-2xl border border-zinc-800">
              <Fuel className="w-5 h-5 text-emerald-400 mb-2" />
              <p className="text-[10px] text-zinc-500 uppercase font-semibold">Fuel Type</p>
              <p className="text-sm font-bold text-white">{fuelName}</p>
            </div>
            <div className="glass-card p-4 rounded-2xl border border-zinc-800">
              <Cog className="w-5 h-5 text-amber-400 mb-2" />
              <p className="text-[10px] text-zinc-500 uppercase font-semibold">Transmission</p>
              <p className="text-sm font-bold text-white">{vehicle.transmission || 'Automatic'}</p>
            </div>
            <div className="glass-card p-4 rounded-2xl border border-zinc-800">
              <Calendar className="w-5 h-5 text-purple-400 mb-2" />
              <p className="text-[10px] text-zinc-500 uppercase font-semibold">Model Year</p>
              <p className="text-sm font-bold text-white">{vehicle.year}</p>
            </div>
          </div>

          <div className="glass-card p-6 rounded-3xl space-y-4">
            <h3 className="text-lg font-bold text-white">Full Specifications</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm border-t border-zinc-800/80 pt-4">
              <div className="flex justify-between py-2 border-b border-zinc-800/40">
                <span className="text-zinc-500">VIN / Chassis:</span>
                <span className="font-mono text-blue-400 font-bold uppercase">{vehicle.vin || 'Available upon request'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-zinc-800/40">
                <span className="text-zinc-500">LOT Number:</span>
                <span className="font-mono text-amber-400 font-bold uppercase">{vehicle.lot_number || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-zinc-800/40">
                <span className="text-zinc-500">Body Type:</span>
                <span className="text-white font-medium">{bodyTypeName}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-zinc-800/40">
                <span className="text-zinc-500">Condition Status:</span>
                <span className="text-white font-medium">{vehicle.condition || 'Used'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-zinc-800/40">
                <span className="text-zinc-500">Exterior Color:</span>
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: vehicle.exterior_color || '#000000' }} />
                  <span className="font-mono text-xs uppercase text-zinc-300">{vehicle.exterior_color || '#000000'}</span>
                </div>
              </div>
              <div className="flex justify-between py-2 border-b border-zinc-800/40">
                <span className="text-zinc-500">Interior Color:</span>
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: vehicle.interior_color || '#ffffff' }} />
                  <span className="font-mono text-xs uppercase text-zinc-300">{vehicle.interior_color || '#ffffff'}</span>
                </div>
              </div>
            </div>
          </div>

          {vehicle.description && (
            <div className="glass-card p-6 rounded-3xl space-y-3">
              <h3 className="text-lg font-bold text-white">Vehicle Description & Remarks</h3>
              <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
                {vehicle.description}
              </p>
            </div>
          )}
        </div>

        {/* Action Sidebar */}
        <div className="space-y-6">
          <div className="glass-card p-6 rounded-3xl border border-zinc-800 sticky top-28 space-y-6">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">Experience & Purchase</h3>
              <p className="text-xs text-zinc-400">
                Book a test drive or negotiate directly with our sales team.
              </p>
            </div>

            {/* Book Test Drive Button */}
            <button
              type="button"
              onClick={() => navigate(`/book-test-drive?vehicle_id=${vehicle.id}`)}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.01]"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Test Drive for This Car</span>
            </button>

            {/* Negotiate Price via WhatsApp Button */}
            <button
              type="button"
              onClick={handleNegotiateWhatsApp}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.01]"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Negotiate Price on WhatsApp</span>
            </button>

            <div className="border-t border-zinc-800/80 pt-4 space-y-2 text-xs text-zinc-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                <span>Inspected & Certified Vehicle</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-400" />
                <span>Available at Blue Area Showroom</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}