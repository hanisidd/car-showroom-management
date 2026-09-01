import { motion } from 'framer-motion';
import { Fuel, Gauge, Cog, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CarCard({ car }) {
  const navigate = useNavigate();

  const makeName = typeof car.make === 'object' ? car.make?.name : car.make;
  const modelName = typeof car.model === 'object' ? car.model?.name : car.model;

  const primaryImg = car.images?.find((i) => i.is_primary)?.image_url || car.images?.[0]?.image_url;
  const coverSrc = primaryImg
    ? (primaryImg.startsWith('http') ? primaryImg : `http://localhost:8000${primaryImg}`)
    : (car.image || "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=600");

  const displayTitle = [makeName, modelName].filter(Boolean).join(' ') || 'Vehicle Listing';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="glass-card rounded-2xl p-4 flex flex-col justify-between hover:border-blue-500/40 transition-colors group text-left cursor-pointer"
      onClick={() => navigate(`/inventory/${car.id}`)}
    >
      <div>
        <div className="relative h-48 rounded-xl overflow-hidden mb-4 bg-zinc-900 border border-zinc-800">
          <img 
            src={coverSrc} 
            alt={displayTitle}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <span className="absolute top-3 right-3 text-xs font-semibold px-3 py-1 rounded-full glass-panel text-white backdrop-blur-md">
            {car.condition || 'Used'}
          </span>
        </div>

        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
              {makeName || 'Showroom Vehicle'}
            </p>
            <h3 className="text-lg font-bold text-white leading-snug">
              {displayTitle} {car.year ? `(${car.year})` : ''}
            </h3>
          </div>
          <p className="text-base font-extrabold text-emerald-400 shrink-0">
            {car.price ? `Rs. ${Number(car.price).toLocaleString()}` : 'Inquire'}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 py-3 border-y border-zinc-800/80 text-xs text-zinc-400 my-3">
          <div className="flex items-center gap-1.5">
            <Gauge className="w-3.5 h-3.5 text-zinc-500" />
            <span>{car.mileage ? Number(car.mileage).toLocaleString() : '0'} mi</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Fuel className="w-3.5 h-3.5 text-zinc-500" />
            <span>{typeof car.fuel_type === 'object' ? car.fuel_type?.name : (car.fuel_type || car.fuelType?.name || 'Petrol')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Cog className="w-3.5 h-3.5 text-zinc-500" />
            <span>{car.transmission || 'Auto'}</span>
          </div>
        </div>
      </div>

      <button 
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/inventory/${car.id}`);
        }}
        className="w-full py-2.5 rounded-xl glass-panel hover:bg-blue-600 hover:border-blue-500 text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all"
      >
        <span>View Details</span>
        <ArrowUpRight className="w-4 h-4" />
      </button>
    </motion.div>
  );
}