import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '../components/Navbar';
import CarCard from '../components/CarCard';
import Footer from '../components/Footer';
import { fetchVehicles } from '../services/vehicleService';
import { Loader2, Search, SlidersHorizontal, Car, ChevronLeft, ChevronRight } from 'lucide-react';

export default function InventoryPage() {
  const [selectedFuel, setSelectedFuel] = useState('All');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const { data: vehicleResponse, isLoading } = useQuery({
    queryKey: ['vehicles', selectedFuel],
    queryFn: () => fetchVehicles(selectedFuel),
  });

  const rawVehicles = Array.isArray(vehicleResponse)
    ? vehicleResponse
    : (vehicleResponse?.data || []);

  const filteredVehicles = useMemo(() => {
    if (!search.trim()) return rawVehicles;
    return rawVehicles.filter((v) => {
      const makeName = typeof v.make === 'object' ? v.make?.name : v.make;
      const modelName = typeof v.model === 'object' ? v.model?.name : v.model;
      const title = `${makeName || ''} ${modelName || ''} ${v.year || ''}`.toLowerCase();
      return title.includes(search.toLowerCase());
    });
  }, [rawVehicles, search]);

  const totalPages = Math.ceil(filteredVehicles.length / pageSize) || 1;
  const paginatedVehicles = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredVehicles.slice(start, start + pageSize);
  }, [filteredVehicles, currentPage, pageSize]);

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 antialiased flex flex-col">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-32 pb-20 text-left flex-1 w-full">
        {/* Page Title */}
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Full Showroom Inventory
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base">
            Browse our complete catalog of luxury and electric vehicles.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="glass-panel p-4 rounded-2xl mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search make, model, or year..."
              className="w-full bg-black/60 border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <SlidersHorizontal className="w-4 h-4 text-zinc-400 mr-2 shrink-0" />
            {['All', 'Electric', 'Petrol', 'Hybrid'].map((type) => (
              <button
                key={type}
                onClick={() => {
                  setSelectedFuel(type);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedFuel === type
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                    : 'glass-panel text-zinc-400 hover:text-white'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="py-20 text-center flex flex-col items-center gap-3 text-zinc-400">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <p className="text-sm">Loading vehicle fleet...</p>
          </div>
        ) : filteredVehicles.length === 0 ? (
          <div className="py-20 text-center text-zinc-500">
            <Car className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-base font-semibold">No vehicles found matching your criteria.</p>
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
              <div className="mt-12 flex items-center justify-between border-t border-zinc-800/80 pt-6 text-sm text-zinc-400">
                <span className="font-medium">
                  Page {currentPage} of {totalPages} ({filteredVehicles.length} total cars)
                </span>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl glass-panel text-xs font-semibold text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/5 transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl glass-panel text-xs font-semibold text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/5 transition-all"
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

      <Footer />
    </div>
  );
}