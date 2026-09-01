import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import toast, { Toaster } from 'react-hot-toast';
import { getAdminVehicles, deleteVehicle } from '../services/adminVehicleService';
import api from '../../services/api';
import AdminSidebar from '../components/AdminSidebar';
import VehicleModal from '../components/VehicleModal';
import VehicleDetailsModal from '../components/VehicleDetailsModal';
import { Trash2, Plus, Car, Loader2, RefreshCw, Eye, ArrowUpDown, ChevronLeft, ChevronRight, Search, Sparkles, ShieldCheck } from 'lucide-react';
import LookupsManager from './LookupsManager';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('inventory');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Table controls
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const queryClient = useQueryClient();

  const { data: vehicleData, isLoading: isLoadingVehicles, refetch } = useQuery({
    queryKey: ['adminVehicles'],
    queryFn: getAdminVehicles,
  });

 const { data: lookupData = { makes: [], models: [], fuelTypes: [], bodyTypes: [] } } = useQuery({
  queryKey: ['lookupData'],
  queryFn: async () => {
    const [makesRes, modelsRes, fuelsRes, bodyRes] = await Promise.all([
      api.get('/makes'),
      api.get('/models'),
      api.get('/fuel-types'),
      api.get('/body-types'),
    ]);
    return {
      makes: makesRes.data,
      models: modelsRes.data,
      fuelTypes: fuelsRes.data,
      bodyTypes: bodyRes.data,
    };
  },
});

  // Delete vehicle mutation with Toast feedback
  const deleteMutation = useMutation({
    mutationFn: deleteVehicle,
    onSuccess: () => {
      toast.success('Vehicle listing removed successfully!');
      queryClient.invalidateQueries(['adminVehicles']);
      queryClient.invalidateQueries(['vehicles']);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to remove vehicle listing.');
    }
  });

  // SweetAlert Confirmation for Inventory Deletion
  const handleDeleteVehicle = (id, carName) => {
    Swal.fire({
      title: 'Remove Listing?',
      text: `Are you sure you want to delete "${carName}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#27272a',
      confirmButtonText: 'Yes, delete listing',
      background: '#121215',
      color: '#ffffff',
      customClass: {
        popup: 'border border-zinc-800 rounded-3xl backdrop-blur-2xl',
      }
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(id);
      }
    });
  };

  const rawVehicles = vehicleData?.data || [];

  const filteredVehicles = useMemo(() => {
    if (!search.trim()) return rawVehicles;
    return rawVehicles.filter((v) => {
      const title = `${v.make?.name || ''} ${v.model?.name || ''} ${v.vin || ''} ${v.lot_number || ''}`.toLowerCase();
      return title.includes(search.toLowerCase());
    });
  }, [rawVehicles, search]);

  const sortedVehicles = useMemo(() => {
    return [...filteredVehicles].sort((a, b) => {
      let valA = a[sortField] || '';
      let valB = b[sortField] || '';
      if (sortField === 'price' || sortField === 'year' || sortField === 'mileage') {
        valA = Number(valA) || 0;
        valB = Number(valB) || 0;
      } else {
        valA = String(valA).toLowerCase();
        valB = String(valB).toLowerCase();
      }

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredVehicles, sortField, sortDirection]);

  const totalPages = Math.ceil(sortedVehicles.length / pageSize) || 1;
  const paginatedVehicles = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedVehicles.slice(start, start + pageSize);
  }, [sortedVehicles, currentPage, pageSize]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <div className="flex min-h-screen bg-[#09090b] text-zinc-100 antialiased">
      <Toaster position="top-right" />
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 p-8 overflow-y-auto">
        {activeTab === 'lookups' ? (
          <LookupsManager />
        ) : (
          <div className="space-y-8 text-left">
            {/* Premium Header Banner */}
            <div className="glass-card p-6 rounded-3xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Showroom Operations</span>
                </div>
                <h1 className="text-2xl font-extrabold text-white tracking-tight">Inventory Management</h1>
                <p className="text-xs text-zinc-400 mt-1">Manage active vehicle listings, media galleries, pricing, and configurations.</p>
              </div>

              <div className="flex items-center gap-3 z-10">
                <button
                  onClick={() => {
                    refetch();
                    toast.success('Inventory refreshed!');
                  }}
                  className="p-2.5 rounded-xl glass-panel text-zinc-400 hover:text-white transition-all border border-zinc-800"
                  title="Refresh List"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02]"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Vehicle</span>
                </button>
              </div>
            </div>

            {/* Inventory Table Card */}
            <div className="glass-card rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
              {/* Search & Counter Bar */}
              <div className="p-4 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/5">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400"><Car className="w-4 h-4" /></div>
                  <h3 className="font-bold text-white text-sm">Vehicle Fleet Catalog</h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {filteredVehicles.length} Active
                  </span>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Search Make, Model, VIN..."
                    className="w-full bg-black/60 border border-zinc-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500/60"
                  />
                </div>
              </div>

              {isLoadingVehicles ? (
                <div className="p-16 text-center text-zinc-400 flex flex-col items-center gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                  <p className="text-sm">Fetching vehicle listings...</p>
                </div>
              ) : paginatedVehicles.length === 0 ? (
                <div className="p-16 text-center text-zinc-500">
                  <Car className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm font-semibold">No vehicles found matching your criteria.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-zinc-300">
                    <thead className="bg-black/60 border-b border-white/10 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                      <tr>
                        <th className="p-4">Cover</th>
                        <th className="p-4 cursor-pointer hover:text-white" onClick={() => handleSort('year')}>
                          <div className="flex items-center gap-1.5">
                            <span>Vehicle Details</span>
                            <ArrowUpDown className="w-3 h-3 text-zinc-500" />
                          </div>
                        </th>
                        <th className="p-4">Transmission</th>
                        <th className="p-4">Colors (Ext / Int)</th>
                        <th className="p-4">VIN / LOT</th>
                        <th className="p-4 cursor-pointer hover:text-white" onClick={() => handleSort('price')}>
                          <div className="flex items-center gap-1.5">
                            <span>Price (PKR)</span>
                            <ArrowUpDown className="w-3 h-3 text-zinc-500" />
                          </div>
                        </th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60">
                      {paginatedVehicles.map((car) => {
                        const primaryImg = car.images?.find((i) => i.is_primary)?.image_url || car.images?.[0]?.image_url;
                        const coverSrc = primaryImg
                          ? `http://localhost:8000${primaryImg}`
                          : 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=300';
                        const fullName = `${car.make?.name || ''} ${car.model?.name || ''}`;

                        return (
                          <tr key={car.id} className="hover:bg-white/5 transition-colors group">
                            <td className="p-4">
                              <div className="w-16 h-12 rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden relative shadow-inner">
                                <img src={coverSrc} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                              </div>
                            </td>

                            <td className="p-4">
                              <p className="font-bold text-white text-base tracking-tight">{fullName || '—'}</p>
                              <p className="text-xs text-zinc-500">Year: {car.year} • {car.fuel_type?.name || '—'}</p>
                            </td>

                            <td className="p-4">
                              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/30">
                                {car.transmission || 'Automatic'}
                              </span>
                            </td>

                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1.5">
                                  <span className="w-4 h-4 rounded-full border border-white/20 shadow-sm" style={{ backgroundColor: car.exterior_color || '#000000' }} />
                                  <span className="text-[10px] font-mono text-zinc-400 uppercase">{car.exterior_color || '#000'}</span>
                                </div>
                                <span className="text-zinc-600">/</span>
                                <div className="flex items-center gap-1.5">
                                  <span className="w-4 h-4 rounded-full border border-white/20 shadow-sm" style={{ backgroundColor: car.interior_color || '#ffffff' }} />
                                  <span className="text-[10px] font-mono text-zinc-400 uppercase">{car.interior_color || '#fff'}</span>
                                </div>
                              </div>
                            </td>

                            <td className="p-4 text-xs font-mono">
                              <p className="text-blue-400 font-semibold">VIN: {car.vin || '—'}</p>
                              <p className="text-amber-400">LOT: {car.lot_number || '—'}</p>
                            </td>

                            <td className="p-4 font-extrabold text-emerald-400">
                              PKR {Number(car.price)?.toLocaleString()}
                            </td>

                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => {
                                    setSelectedVehicle(car);
                                    setIsDetailsModalOpen(true);
                                  }}
                                  className="p-2 text-zinc-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-xl transition-all"
                                  title="View & Edit All Details"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteVehicle(car.id, fullName)}
                                  className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                                  title="Delete Listing"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Table Pagination Footer */}
              <div className="p-3.5 border-t border-white/10 bg-black/40 flex items-center justify-between text-xs text-zinc-400">
                <span className="font-medium">Page {currentPage} of {totalPages}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-xl glass-panel hover:text-white disabled:opacity-40 disabled:cursor-not-allowed border border-zinc-800 transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-xl glass-panel hover:text-white disabled:opacity-40 disabled:cursor-not-allowed border border-zinc-800 transition-all"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <VehicleModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        lookupData={lookupData}
        onSuccess={() => {
          toast.success('New vehicle added successfully!');
          queryClient.invalidateQueries(['adminVehicles']);
          queryClient.invalidateQueries(['vehicles']);
        }}
      />

      <VehicleDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        vehicle={selectedVehicle}
        lookupData={lookupData}
        onSuccess={() => {
          toast.success('Vehicle updated successfully!');
          queryClient.invalidateQueries(['adminVehicles']);
          queryClient.invalidateQueries(['vehicles']);
        }}
      />
    </div>
  );
}