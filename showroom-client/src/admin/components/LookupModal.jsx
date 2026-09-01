import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import SearchableSelect from './SearchableSelect';

export default function LookupModal({ isOpen, onClose, onSubmit, type, initialData, makes = [] }) {
  const [name, setName] = useState('');
  const [selectedMakeId, setSelectedMakeId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setSelectedMakeId(initialData.make_id || null);
    } else {
      setName('');
      setSelectedMakeId(null);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = type === 'Model' ? { name, make_id: selectedMakeId } : { name };
    await onSubmit(payload);
    setLoading(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="glass-card w-full max-w-md rounded-2xl border border-white/10 shadow-2xl p-6 relative"
        >
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
            <h3 className="text-lg font-bold text-white">
              {initialData ? `Edit ${type}` : `Add New ${type}`}
            </h3>
            <button onClick={onClose} className="p-1.5 text-zinc-400 hover:text-white rounded-xl glass-panel">
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            {type === 'Model' && (
              <div>
                <SearchableSelect
                  label="Parent Make"
                  options={makes}
                  value={selectedMakeId}
                  onChange={(id) => setSelectedMakeId(id)}
                  placeholder="Select Make..."
                />
              </div>
            )}

            <div>
              <label className="text-xs text-zinc-400 font-semibold mb-1 block">{type} Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={`e.g. ${type === 'Make' ? 'Toyota' : type === 'Model' ? 'Corolla' : 'Hybrid'}`}
                className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl glass-panel text-xs font-semibold text-zinc-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-blue-500/20 flex items-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Record'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}