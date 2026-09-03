import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import CarCard from '../components/CarCard';
import { fetchVehicles } from '../services/vehicleService';
import api from '../services/api';
import { 
  Loader2, Search, SlidersHorizontal, Car, ChevronLeft, 
  ChevronRight, ArrowUpDown, RotateCcw, Fuel
} from 'lucide-react';

export default function InventoryPage() {
  const [selectedFuel, setSelectedFuel] = useState('All');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // 1. Fetch Dynamic Fuel Types from DB
  const { data: dbFuelTypes = [] } = useQuery({
    queryKey: ['public-fuel-types'],
    queryFn: async () => {
      const res = await api.get('/fuel-types');
      return res.data;
    },
  });

  // 2. Fetch Vehicle Inventory
  const { data: vehicleResponse, isLoading } = useQuery({
    queryKey: ['vehicles', selectedFuel],
    queryFn: () => fetchVehicles(selectedFuel),
  });

  const rawVehicles = Array.isArray(vehicleResponse)
    ? vehicleResponse
    : (vehicleResponse?.data || []);

  // 3. Search & Filter Logic
  const filteredVehicles = useMemo(() => {
    let result = [...rawVehicles];

    // Search query filter
    if (search.trim()) {
      const term = search.toLowerCase();
      result = result.filter((v) => {
        const makeName = typeof v.make === 'object' ? v.make?.name : v.make;
        const modelName = typeof v.model === 'object' ? v.model?.name : v.model;
        const title = `${makeName || ''} ${modelName || ''} ${v.year || ''} ${v.vin || ''}`.toLowerCase();
        return title.includes(term);
      });
    }

    // Sort Logic
    result.sort((a, b) => {
      if (sortBy === 'price-low') return Number(a.price) - Number(b.price);
      if (sortBy === 'price-high') return Number(b.price) - Number(a.price);
      if (sortBy === 'year-desc') return Number(b.year) - Number(a.year);
      if (sortBy === 'mileage-low') return Number(a.mileage) - Number(b.mileage);
      return new Date(b.created_at || 0) - new Date(a.created_at || 0); // Default newest
    });

    return result;
  }, [rawVehicles, search, sortBy]);

  // 4. Pagination Calculations
  const totalPages = Math.ceil(filteredVehicles.length / pageSize) || 1;
  const paginatedVehicles = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredVehicles.slice(start, start + pageSize);
  }, [filteredVehicles, currentPage, pageSize]);

  const handleResetFilters = () => {
    setSelectedFuel('All');
    setSearch('');
    setSortBy('newest');
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 antialiased flex flex-col">
      <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-32 pb-20 text-left flex-1 w-full">
        {/* Page Header */}
        <div className="mb-8 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider">
            <Car className="w-3.5 h-3.5" />
            <span>Showroom Catalog</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Full Showroom Inventory
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base">
            Explore verified luxury, electric, and performance vehicles in our active stock.
          </p>
        </div>

        {/* Enhanced Glassmorphism Filter Console */}
        <div className="glass-card p-5 rounded-3xl border border-white/10 shadow-2xl mb-8 space-y-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative w-full lg:w-96">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search Make, Model, Year, VIN..."
                className="w-full bg-black/60 border border-zinc-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>

            {/* Sorting & Reset Action Controls */}
            <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-black/60 border border-zinc-800 rounded-2xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="newest">Sort by: Recently Added</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="year-desc">Year: Newest First</option>
                  <option value="mileage-low">Lowest Mileage</option>
                </select>
              </div>

              {(selectedFuel !== 'All' || search || sortBy !== 'newest') && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold transition-all shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* Dynamic DB Fuel Type Pill Buttons */}
          <div className="pt-2 border-t border-zinc-800/60 flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1">
            <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider shrink-0 flex items-center gap-1 mr-1">
              <Fuel className="w-3.5 h-3.5 text-blue-400" />
              <span>Fuel:</span>
            </span>

            {/* 'All' Option */}
            <button
              onClick={() => {
                setSelectedFuel('All');
                setCurrentPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedFuel === 'All'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                  : 'bg-black/40 text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700'
              }`}
            >
              All Types
            </button>

            {/* Dynamic Database Fuel Options */}
            {dbFuelTypes.map((fuel) => {
              const isActive = selectedFuel === fuel.name;
              return (
                <button
                  key={fuel.id}
                  onClick={() => {
                    setSelectedFuel(fuel.name);
                    setCurrentPage(1);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                      : 'bg-black/40 text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  {fuel.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Inventory Catalog Grid */}
        {isLoading ? (
          <div className="py-24 text-center flex flex-col items-center gap-3 text-zinc-400">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <p className="text-sm">Fetching vehicle fleet catalog...</p>
          </div>
        ) : filteredVehicles.length === 0 ? (
          <div className="py-20 text-center text-zinc-500 glass-card rounded-3xl border border-zinc-800 space-y-3">
            <Car className="w-12 h-12 mx-auto text-zinc-700" />
            <p className="text-base font-semibold text-white">No vehicles match your search criteria.</p>
            <p className="text-xs text-zinc-400">Try adjusting your filters or resetting search parameters.</p>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedVehicles.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-between border-t border-zinc-800/80 pt-6 text-xs text-zinc-400">
                <span className="font-medium">
                  Page <strong className="text-white">{currentPage}</strong> of <strong className="text-white">{totalPages}</strong> ({filteredVehicles.length} total cars)
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 px-3.5 py-2 rounded-xl glass-panel text-xs font-semibold text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/5 transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 px-3.5 py-2 rounded-xl glass-panel text-xs font-semibold text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/5 transition-all"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>

    </div>
  );
}