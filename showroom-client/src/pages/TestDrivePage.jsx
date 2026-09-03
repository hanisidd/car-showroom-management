import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { Calendar as CalendarIcon, Clock, Car, CheckCircle2, Loader2, Search, ChevronDown, Check } from 'lucide-react';
import api from '../services/api';

export default function TestDrivePage() {
  const [searchParams] = useSearchParams();
  const initialVehicleId = searchParams.get('vehicle_id');

  const [selectedVehicleId, setSelectedVehicleId] = useState(initialVehicleId ? Number(initialVehicleId) : null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [vehicleSearch, setVehicleSearch] = useState('');
  
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    scheduled_date: '',
    scheduled_time: '10:00',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Fetch all vehicles for standalone selection
  const { data: vehicleData, isLoading: loadingVehicles } = useQuery({
    queryKey: ['vehicles', 'all-test-drive'],
    queryFn: async () => {
      const res = await api.get('/vehicles');
      return Array.isArray(res.data) ? res.data : (res.data?.data || []);
    },
  });

  const vehicles = vehicleData || [];

  // Filter vehicles for dropdown
  const filteredVehicles = useMemo(() => {
    if (!vehicleSearch.trim()) return vehicles;
    return vehicles.filter((v) => {
      const makeName = typeof v.make === 'object' ? v.make?.name : v.make;
      const modelName = typeof v.model === 'object' ? v.model?.name : v.model;
      const matchString = `${makeName || ''} ${modelName || ''} ${v.year || ''} ${v.vin || ''}`.toLowerCase();
      return matchString.includes(vehicleSearch.toLowerCase());
    });
  }, [vehicles, vehicleSearch]);

  const selectedVehicle = vehicles.find((v) => Number(v.id) === Number(selectedVehicleId));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedVehicleId) {
      toast.error('Please select a vehicle for your test drive.');
      return;
    }

    setSubmitting(true);
    try {
      const fullScheduledAt = `${formData.scheduled_date} ${formData.scheduled_time}:00`;
      await api.post('/test-drives', {
        vehicle_id: selectedVehicleId,
        customer_name: formData.customer_name,
        customer_email: formData.customer_email,
        customer_phone: formData.customer_phone,
        scheduled_at: fullScheduledAt,
      });

      setSubmitted(true);
      toast.success('Test drive booked successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to book test drive.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-left space-y-8">
      <Toaster position="top-right" />

      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider">
          <CalendarIcon className="w-3.5 h-3.5" />
          <span>VIP Experience</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight">Book a VIP Test Drive</h1>
        <p className="text-zinc-400 text-xs sm:text-sm">
          Select your desired vehicle, pick a date and time slot, and experience luxury performance firsthand.
        </p>
      </div>

      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl">
        {submitted ? (
          <div className="py-12 text-center space-y-4">
            <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto" />
            <h2 className="text-2xl font-bold text-white">Booking Confirmed!</h2>
            <p className="text-sm text-zinc-400 max-w-md mx-auto">
              Your test drive for the <strong className="text-white">{selectedVehicle?.make?.name || selectedVehicle?.make} {selectedVehicle?.model?.name || selectedVehicle?.model}</strong> is reserved. Our sales executive will call you shortly.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition-all"
            >
              Book Another Session
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Interactive Searchable Vehicle Dropdown */}
            <div className="space-y-1.5 relative">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Select Vehicle
              </label>
              
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-full bg-black/80 border border-zinc-800 rounded-2xl px-4 py-3 text-left flex items-center justify-between text-sm transition-all focus:border-blue-500"
              >
                {selectedVehicle ? (
                  <div className="flex items-center gap-3">
                    <Car className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="font-bold text-white">
                        {selectedVehicle.make?.name || selectedVehicle.make} {selectedVehicle.model?.name || selectedVehicle.model} ({selectedVehicle.year})
                      </p>
                      <p className="text-[11px] font-mono text-zinc-400">VIN: {selectedVehicle.vin || 'N/A'}</p>
                    </div>
                  </div>
                ) : (
                  <span className="text-zinc-500">Choose a car from showroom fleet...</span>
                )}
                <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Floating Custom Selection Panel */}
              {dropdownOpen && (
                <div className="absolute z-50 left-0 right-0 mt-2 bg-[#121215] border border-zinc-800 rounded-2xl shadow-2xl p-3 backdrop-blur-2xl space-y-2">
                  <div className="relative">
                    <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={vehicleSearch}
                      onChange={(e) => setVehicleSearch(e.target.value)}
                      placeholder="Search Make, Model, Year, VIN..."
                      className="w-full bg-black/60 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                      autoFocus
                    />
                  </div>

                  <div className="max-h-56 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                    {loadingVehicles ? (
                      <div className="p-4 text-center text-xs text-zinc-500">Loading fleet...</div>
                    ) : filteredVehicles.length === 0 ? (
                      <div className="p-4 text-center text-xs text-zinc-500">No matching vehicles found</div>
                    ) : (
                      filteredVehicles.map((v) => {
                        const makeName = typeof v.make === 'object' ? v.make?.name : v.make;
                        const modelName = typeof v.model === 'object' ? v.model?.name : v.model;
                        const isSelected = Number(v.id) === Number(selectedVehicleId);

                        return (
                          <button
                            key={v.id}
                            type="button"
                            onClick={() => {
                              setSelectedVehicleId(v.id);
                              setDropdownOpen(false);
                            }}
                            className={`w-full text-left p-2.5 rounded-xl text-xs flex items-center justify-between transition-all ${
                              isSelected
                                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                                : 'hover:bg-white/5 text-zinc-300 hover:text-white'
                            }`}
                          >
                            <div className="space-y-0.5">
                              <p className="font-bold text-white">{makeName} {modelName} ({v.year})</p>
                              <p className="font-mono text-[10px] text-zinc-400">VIN: {v.vin || 'N/A'}</p>
                            </div>
                            {isSelected && <Check className="w-4 h-4 text-blue-400" />}
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Date Picker & Time Picker Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CalendarIcon className="w-3.5 h-3.5 text-blue-400" />
                  <span>Select Date</span>
                </label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={formData.scheduled_date}
                  onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
                  className="w-full bg-black/80 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 [color-scheme:dark]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-400" />
                  <span>Select Time Slot</span>
                </label>
                <select
                  value={formData.scheduled_time}
                  onChange={(e) => setFormData({ ...formData, scheduled_time: e.target.value })}
                  className="w-full bg-black/80 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="09:00">09:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="14:00">02:00 PM</option>
                  <option value="16:00">04:00 PM</option>
                  <option value="18:00">06:00 PM</option>
                </select>
              </div>
            </div>

            {/* User Contact Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-zinc-400 font-semibold mb-1 block">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={formData.customer_name}
                  onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                  className="w-full bg-black/80 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-xs text-zinc-400 font-semibold mb-1 block">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="john@example.com"
                  value={formData.customer_email}
                  onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                  className="w-full bg-black/80 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-xs text-zinc-400 font-semibold mb-1 block">Phone Number</label>
                <input
                  type="tel"
                  required
                  placeholder="+92 300 1234567"
                  value={formData.customer_phone}
                  onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                  className="w-full bg-black/80 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Test Drive Booking'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}