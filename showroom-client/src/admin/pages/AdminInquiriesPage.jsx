import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast, { Toaster } from 'react-hot-toast';
import Swal from 'sweetalert2';
import { 
  Mail, MessageSquare, Trash2, Loader2, User, Phone, 
  Search, ArrowUpDown, ChevronLeft, ChevronRight, CheckCircle 
} from 'lucide-react';
import api from '../../services/api';

export default function AdminInquiriesPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Fetch Contact Messages
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['admin-inquiries'],
    queryFn: async () => {
      const res = await api.get('/admin/inquiries');
      return res.data;
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => api.delete(`/admin/inquiries/${id}`),
    onSuccess: () => {
      toast.success('Inquiry deleted successfully.');
      queryClient.invalidateQueries(['admin-inquiries']);
    },
    onError: () => toast.error('Failed to delete inquiry.'),
  });

  // Search & Filter Logic
  const processedMessages = useMemo(() => {
    let result = [...messages];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (m) =>
          m.name?.toLowerCase().includes(term) ||
          m.email?.toLowerCase().includes(term) ||
          m.phone?.toLowerCase().includes(term) ||
          m.subject?.toLowerCase().includes(term) ||
          m.message?.toLowerCase().includes(term)
      );
    }

    result.sort((a, b) => {
      let valA = a[sortField] || '';
      let valB = b[sortField] || '';

      if (sortField === 'created_at') {
        valA = new Date(valA).getTime();
        valB = new Date(valB).getTime();
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [messages, searchTerm, sortField, sortOrder]);

  const totalPages = Math.ceil(processedMessages.length / itemsPerPage) || 1;
  const paginatedMessages = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return processedMessages.slice(start, start + itemsPerPage);
  }, [processedMessages, currentPage]);

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Delete Message?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#27272a',
      confirmButtonText: 'Yes, delete',
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
          <h1 className="text-2xl font-black text-white tracking-tight">Customer Inquiries</h1>
          <p className="text-xs text-zinc-400">View and respond to general inquiries submitted via the store contact form.</p>
        </div>

        <div className="glass-card px-4 py-2 rounded-2xl border border-zinc-800 text-center">
          <p className="text-[10px] text-zinc-500 uppercase font-semibold">Total Inquiries</p>
          <p className="text-sm font-bold text-white">{messages.length}</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="glass-card p-4 rounded-3xl border border-zinc-800 flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search Name, Email, Subject, Content..."
            className="w-full bg-black/60 border border-zinc-800 rounded-2xl pl-10 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="glass-card rounded-3xl border border-zinc-800 overflow-hidden shadow-2xl">
        {isLoading ? (
          <div className="p-16 text-center text-zinc-500 flex flex-col items-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
            <span className="text-xs">Loading customer inquiries...</span>
          </div>
        ) : paginatedMessages.length === 0 ? (
          <div className="p-16 text-center text-zinc-500 space-y-2">
            <MessageSquare className="w-10 h-10 mx-auto text-zinc-700" />
            <p className="text-sm font-semibold">No matching customer messages found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-zinc-800 bg-black/40 text-zinc-400 font-semibold uppercase tracking-wider">
                  <th className="p-4 cursor-pointer hover:text-white" onClick={() => toggleSort('name')}>
                    <div className="flex items-center gap-1">
                      <span>Sender</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="p-4">Subject</th>
                  <th className="p-4">Message Preview</th>
                  <th className="p-4 cursor-pointer hover:text-white" onClick={() => toggleSort('created_at')}>
                    <div className="flex items-center gap-1">
                      <span>Received Date</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {paginatedMessages.map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 space-y-1">
                      <p className="font-bold text-white flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-blue-400" />
                        {item.name}
                      </p>
                      <p className="text-[11px] text-zinc-400 flex items-center gap-1.5">
                        <Mail className="w-3 h-3 text-zinc-500" />
                        {item.email}
                      </p>
                      {item.phone && (
                        <p className="text-[11px] text-zinc-400 flex items-center gap-1.5">
                          <Phone className="w-3 h-3 text-zinc-500" />
                          {item.phone}
                        </p>
                      )}
                    </td>

                    <td className="p-4 font-semibold text-white">
                      {item.subject}
                    </td>

                    <td className="p-4 max-w-xs">
                      <p className="text-zinc-300 truncate">{item.message}</p>
                    </td>

                    <td className="p-4 text-zinc-400 font-medium">
                      {new Date(item.created_at).toLocaleString()}
                    </td>

                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 text-zinc-500 hover:text-red-400 rounded-lg hover:bg-white/5 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        <div className="flex items-center justify-between p-4 border-t border-zinc-800 bg-black/40 text-xs text-zinc-400">
          <span>
            Page <strong className="text-white">{currentPage}</strong> of <strong className="text-white">{totalPages}</strong> ({processedMessages.length} items)
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