import { useQuery } from '@tanstack/react-query';
import { Car, Calendar, Layers, ShieldCheck, TrendingUp, Users, ArrowUpRight, Clock } from 'lucide-react';
import { getAdminVehicles } from '../services/adminVehicleService';
import api from '../../services/api';

export default function AdminOverview({ setActiveTab }) {
  const { data: vehicleData } = useQuery({
    queryKey: ['adminVehicles'],
    queryFn: getAdminVehicles,
  });

  const { data: bookings = [] } = useQuery({
    queryKey: ['admin-test-drives'],
    queryFn: async () => {
      const res = await api.get('/admin/test-drives');
      return res.data;
    },
  });

  const vehicles = vehicleData?.data || [];
  const pendingTestDrives = bookings.filter((b) => b.status === 'Pending');
  const totalValue = vehicles.reduce((sum, item) => sum + (Number(item.price) || 0), 0);

  return (
    <div className="space-y-8 text-left">
      {/* Top Banner */}
      <div className="glass-card p-6 rounded-3xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Showroom Command Center</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Executive Dashboard Overview</h1>
          <p className="text-xs text-zinc-400 mt-1">Real-time performance stats across fleet inventory and customer appointments.</p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-zinc-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-semibold uppercase">Active Fleet</span>
            <div className="p-2 bg-blue-500/10 rounded-xl text-blue-400"><Car className="w-4 h-4" /></div>
          </div>
          <p className="text-2xl font-black text-white">{vehicles.length}</p>
          <button onClick={() => setActiveTab('inventory')} className="text-[11px] text-blue-400 flex items-center gap-1 hover:underline">
            <span>Manage fleet catalog</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-zinc-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-semibold uppercase">Pending Drives</span>
            <div className="p-2 bg-amber-500/10 rounded-xl text-amber-400"><Clock className="w-4 h-4" /></div>
          </div>
          <p className="text-2xl font-black text-amber-400">{pendingTestDrives.length}</p>
          <button onClick={() => setActiveTab('test-rides')} className="text-[11px] text-amber-400 flex items-center gap-1 hover:underline">
            <span>Review appointments</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-zinc-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-semibold uppercase">Total Reservations</span>
            <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400"><Calendar className="w-4 h-4" /></div>
          </div>
          <p className="text-2xl font-black text-emerald-400">{bookings.length}</p>
          <button onClick={() => setActiveTab('test-rides')} className="text-[11px] text-emerald-400 flex items-center gap-1 hover:underline">
            <span>View booking logs</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-zinc-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-semibold uppercase">Inventory Capital</span>
            <div className="p-2 bg-purple-500/10 rounded-xl text-purple-400"><TrendingUp className="w-4 h-4" /></div>
          </div>
          <p className="text-2xl font-black text-white">PKR {(totalValue / 1000000).toFixed(1)}M</p>
          <p className="text-[11px] text-zinc-500">Combined portfolio value</p>
        </div>
      </div>

      {/* Recent Appointment Snapshot Table */}
      <div className="glass-card rounded-2xl border border-white/10 overflow-hidden shadow-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-white text-sm">Recent VIP Test Drive Requests</h3>
          <button onClick={() => setActiveTab('test-rides')} className="text-xs text-blue-400 hover:underline">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-500 uppercase font-semibold">
                <th className="py-2.5">Customer</th>
                <th className="py-2.5">Scheduled Date</th>
                <th className="py-2.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {bookings.slice(0, 4).map((b) => (
                <tr key={b.id} className="text-zinc-300">
                  <td className="py-3 font-semibold text-white">{b.customer_name}</td>
                  <td className="py-3">{new Date(b.scheduled_at).toLocaleString()}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      b.status === 'Confirmed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                    }`}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}