import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createVehicle } from '../services/adminVehicleService';
import { Plus, Loader2, CheckCircle } from 'lucide-react';

export default function VehicleUploadModal({ onSuccess }) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: 2026,
    price: '',
    condition: 'New',
    body_type: 'SUV',
    fuel_type: 'Electric',
    transmission: 'Automatic',
    mileage: '',
    image_url: '',
  });

  const mutation = useMutation({
    mutationFn: createVehicle,
    onSuccess: () => {
      queryClient.invalidateQueries(['adminVehicles']);
      queryClient.invalidateQueries(['vehicles']);
      if (onSuccess) onSuccess();
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({
      ...formData,
      images: formData.image_url ? [formData.image_url] : [],
    });
  };

  return (
    <div className="glass-card p-6 rounded-3xl border border-white/10 max-w-2xl mx-auto">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <Plus className="w-5 h-5 text-blue-400" />
        <span>Add New Vehicle Listing</span>
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-zinc-400 font-semibold mb-1 block">Make</label>
            <input
              type="text"
              placeholder="e.g. Porsche"
              value={formData.make}
              onChange={(e) => setFormData({ ...formData, make: e.target.value })}
              className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="text-xs text-zinc-400 font-semibold mb-1 block">Model</label>
            <input
              type="text"
              placeholder="e.g. Taycan"
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-zinc-400 font-semibold mb-1 block">Year</label>
            <input
              type="number"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="text-xs text-zinc-400 font-semibold mb-1 block">Price (Rs.)</label>
            <input
              type="number"
              placeholder="120000"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="text-xs text-zinc-400 font-semibold mb-1 block">Mileage</label>
            <input
              type="number"
              placeholder="0"
              value={formData.mileage}
              onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
              className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-zinc-400 font-semibold mb-1 block">Fuel Type</label>
            <select
              value={formData.fuel_type}
              onChange={(e) => setFormData({ ...formData, fuel_type: e.target.value })}
              className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
            >
              <option value="Electric">Electric</option>
              <option value="Petrol">Petrol</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-zinc-400 font-semibold mb-1 block">Image URL</label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full mt-4 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/25"
        >
          {mutation.isPending ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : mutation.isSuccess ? (
            <>
              <CheckCircle className="w-5 h-5 text-emerald-300" />
              <span>Vehicle Added!</span>
            </>
          ) : (
            <span>Publish Vehicle</span>
          )}
        </button>
      </form>
    </div>
  );
}