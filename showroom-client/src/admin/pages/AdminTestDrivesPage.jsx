import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast, { Toaster } from 'react-hot-toast';
import Swal from 'sweetalert2';
import { 
  Calendar, CheckCircle2, XCircle, Clock, Trash2, Loader2, Car, 
  User, Mail, Phone, Search, ArrowUpDown, ChevronLeft, ChevronRight 
} from 'lucide-react';
import api from '../../services/api';

export default function AdminTestDrivesPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('scheduled_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [updatingId, setUpdatingId] = useState(null); // Track ID currently being modified
  const itemsPerPage = 8;

  // Fetch Test Drives
  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['admin-test-drives'],
    queryFn: async () => {
      const res = await api.get('/admin/test-drives');
      return res.data;
    },
  });

  // Status Mutation
  const statusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      setUpdatingId(id);
      return api.put(`/admin/test-drives/${id}/status`, { status });
    },
    onSuccess: (_, variables) => {
      toast.success(`Booking marked as ${variables.status}. Confirmation email sent.`);
      queryClient.invalidateQueries(['admin-test-drives']);
    },
    onError: () => toast.error('Failed to update booking status.'),
    onSettled: () => setUpdatingId(null),
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      setUpdatingId(id);
      return api.delete(`/admin/test-drives/${id}`);
    },
    onSuccess: () => {
      toast.success('Record deleted successfully.');
      queryClient.invalidateQueries(['admin-test-drives']);
    },
    onError: () => toast.error('Failed to delete booking.'),
    onSettled: () => setUpdatingId(null),
  });

  // Filtering, Searching, & Sorting Logic
  const processedBookings = useMemo(() => {
    let result = [...bookings];

    if (activeTab !== 'All') {
      result = result.filter((b) => b.status === activeTab);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter((b) => {
        const makeName = typeof b.vehicle?.make === 'object' ? b.vehicle?.make?.name : b.vehicle?.make;
        const modelName = typeof b.vehicle?.model === 'object' ? b.vehicle?.model?.name : b.vehicle?.model;
        const vehicleStr = `${makeName || ''} ${modelName || ''} ${b.vehicle?.vin || ''}`.toLowerCase();
        
        return (
          b.customer_name?.toLowerCase().includes(term) ||
          b.customer_email?.toLowerCase().includes(term) ||
          b.customer_phone?.toLowerCase().includes(term) ||
          vehicleStr.includes(term)
        );
      });
    }

    result.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      if (sortField === 'scheduled_at') {
        valA = new Date(valA).getTime();
        valB = new Date(valB).getTime();
      }
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [bookings, activeTab, searchTerm, sortField, sortOrder]);

  const totalPages = Math.ceil(processedBookings.length / itemsPerPage) || 1;
  const paginatedBookings = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return processedBookings.slice(start, start + itemsPerPage);
  }, [processedBookings, currentPage]);

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleStatusChange = (id, newStatus) => {
    Swal.fire({
      title: `${newStatus} Request?`,
      text: `An automated notification email will be dispatched to the customer.`,
      icon: newStatus === 'Confirmed' ? 'question' : 'warning',
      showCancelButton: true,
      confirmButtonColor: newStatus === 'Confirmed' ? '#10b981' : '#ef4444',
      confirmButtonText: `Yes, ${newStatus}`,
      background: '#121215',
      color: '#ffffff',
      customClass: { popup: 'border border-zinc-800 rounded-3xl' },
    }).then((res) => {
      if (res.isConfirmed) statusMutation.mutate({ id, status: newStatus });
    });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Delete Request?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      background: '#121215',
      color: '#ffffff',
      customClass: { popup: 'border border-zinc-800 rounded-3xl' },
    }).then((res) => {
      if (res.isConfirmed) deleteMutation.mutate(id);
    });
  };

  return (
    <div className="space-y-6 text-left">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Test Drive Reservations</h1>
          <p className="text-xs text-zinc-400">Manage showroom appointments, search entries, and manage email alerts.</p>
        </div>

        {/* Stats Badges */}
        <div className="flex items-center gap-2">
          <div className="glass-card px-3.5 py-2 rounded-2xl border border-zinc-800 text-center">
            <p className="text-[10px] text-zinc-500 uppercase font-semibold">Total</p>
            <p className="text-sm font-bold text-white">{bookings.length}</p>
          </div>
          <div className="glass-card px-3.5 py-2 rounded-2xl border border-zinc-800 text-center">
            <p className="text-[10px] text-amber-500 uppercase font-semibold">Pending</p>
            <p className="text-sm font-bold text-amber-400">{bookings.filter((b) => b.status === 'Pending').length}</p>
          </div>
          <div className="glass-card px-3.5 py-2 rounded-2xl border border-zinc-800 text-center">
            <p className="text-[10px] text-emerald-500 uppercase font-semibold">Confirmed</p>
            <p className="text-sm font-bold text-emerald-400">{bookings.filter((b) => b.status === 'Confirmed').length}</p>
          </div>
        </div>
      </div>

      {/* Search & Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-card p-4 rounded-3xl border border-zinc-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search Name, Email, Phone, VIN..."
            className="w-full bg-black/60 border border-zinc-800 rounded-2xl pl-10 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-1 bg-black/60 p-1 rounded-2xl border border-zinc-800 w-full sm:w-auto overflow-x-auto">
          {['All', 'Pending', 'Confirmed', 'Cancelled', 'Completed'].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                activeTab === tab ? 'bg-blue-600 text-white shadow-md' : 'text-zinc-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Table Section */}
      <div className="glass-card rounded-3xl border border-zinc-800 overflow-hidden shadow-2xl">
        {isLoading ? (
          <div className="p-16 text-center text-zinc-500 flex flex-col items-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
            <span className="text-xs">Loading appointments...</span>
          </div>
        ) : paginatedBookings.length === 0 ? (
          <div className="p-16 text-center text-zinc-500 space-y-2">
            <Calendar className="w-10 h-10 mx-auto text-zinc-700" />
            <p className="text-sm font-semibold">No matching test drive requests found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-zinc-800/80 bg-black/40 text-zinc-400 font-semibold uppercase tracking-wider">
                  <th className="p-4 cursor-pointer hover:text-white" onClick={() => toggleSort('customer_name')}>
                    <div className="flex items-center gap-1">
                      <span>Customer</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="p-4">Requested Vehicle</th>
                  <th className="p-4 cursor-pointer hover:text-white" onClick={() => toggleSort('scheduled_at')}>
                    <div className="flex items-center gap-1">
                      <span>Scheduled Time</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="p-4 cursor-pointer hover:text-white" onClick={() => toggleSort('status')}>
                    <div className="flex items-center gap-1">
                      <span>Status</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {paginatedBookings.map((item) => {
                  const makeName = typeof item.vehicle?.make === 'object' ? item.vehicle?.make?.name : item.vehicle?.make;
                  const modelName = typeof item.vehicle?.model === 'object' ? item.vehicle?.model?.name : item.vehicle?.model;
                  const isItemUpdating = updatingId === item.id;

                  return (
                    <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-4 space-y-1">
                        <p className="font-bold text-white flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-blue-400" />
                          {item.customer_name}
                        </p>
                        <p className="text-[11px] text-zinc-400 flex items-center gap-1.5">
                          <Mail className="w-3 h-3 text-zinc-500" />
                          {item.customer_email}
                        </p>
                        <p className="text-[11px] text-zinc-400 flex items-center gap-1.5">
                          <Phone className="w-3 h-3 text-zinc-500" />
                          {item.customer_phone}
                        </p>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2.5">
                          <Car className="w-4 h-4 text-zinc-500 shrink-0" />
                          <div>
                            <p className="font-semibold text-white">{makeName} {modelName} ({item.vehicle?.year})</p>
                            <p className="font-mono text-[10px] text-zinc-500">VIN: {item.vehicle?.vin || 'N/A'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5 text-zinc-300 font-medium">
                          <Clock className="w-3.5 h-3.5 text-amber-400" />
                          <span>{new Date(item.scheduled_at).toLocaleString()}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1 ${
                          item.status === 'Confirmed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          item.status === 'Cancelled' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                          item.status === 'Completed' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                          'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        {item.status === 'Pending' && (
                          <>
                            <button
                              disabled={isItemUpdating}
                              onClick={() => handleStatusChange(item.id, 'Confirmed')}
                              className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white rounded-xl font-semibold border border-emerald-500/30 transition-all inline-flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isItemUpdating ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              )}
                              <span>Confirm</span>
                            </button>
                            <button
                              disabled={isItemUpdating}
                              onClick={() => handleStatusChange(item.id, 'Cancelled')}
                              className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white rounded-xl font-semibold border border-red-500/30 transition-all inline-flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isItemUpdating ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <XCircle className="w-3.5 h-3.5" />
                              )}
                              <span>Cancel</span>
                            </button>
                          </>
                        )}
                        <button
                          disabled={isItemUpdating}
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 text-zinc-500 hover:text-red-400 rounded-lg hover:bg-white/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isItemUpdating ? (
                            <Loader2 className="w-4 h-4 animate-spin text-zinc-400" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-zinc-800 bg-black/40 text-xs text-zinc-400">
          <span>
            Page <strong className="text-white">{currentPage}</strong> of <strong className="text-white">{totalPages}</strong> ({processedBookings.length} items)
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="p-2 rounded-xl bg-black border border-zinc-800 text-zinc-400 hover:text-white disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="p-2 rounded-xl bg-black border border-zinc-800 text-zinc-400 hover:text-white disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}