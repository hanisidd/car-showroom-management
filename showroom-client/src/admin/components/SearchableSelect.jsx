import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Check, Layers } from 'lucide-react';

export default function SearchableSelect({ label, options = [], value, onChange, placeholder = 'Select item...' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const wrapperRef = useRef(null);

  const filtered = options.filter((opt) =>
    opt.name.toLowerCase().includes(query.toLowerCase())
  );

  // Loose equality check handles String vs Number mismatches ("11" vs 11)
  const selectedOption = options.find((opt) => String(opt.id) === String(value));

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative text-left" ref={wrapperRef}>
      {label && (
        <label className="text-xs font-semibold text-zinc-400 mb-1.5 block tracking-wide uppercase">
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-[#121215] border rounded-xl px-4 py-2.5 text-sm text-left flex items-center justify-between transition-all duration-200 ${
          isOpen
            ? 'border-blue-500 ring-2 ring-blue-500/20 text-white'
            : 'border-zinc-800 hover:border-zinc-700 text-zinc-200'
        }`}
      >
        <span className={selectedOption ? 'font-medium text-white' : 'text-zinc-500'}>
          {selectedOption ? selectedOption.name : placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-blue-400' : ''
          }`}
        />
      </button>

      {/* Floating Dropdown Panel */}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-full bg-[#121215] border border-zinc-800 rounded-2xl shadow-2xl p-2.5 backdrop-blur-2xl">
          <div className="relative mb-2">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${label || 'options'}...`}
              className="w-full bg-black/60 border border-zinc-800 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500/60"
              autoFocus
            />
          </div>

          <div className="max-h-48 overflow-y-auto space-y-1 custom-scrollbar pr-1">
            {filtered.length === 0 ? (
              <div className="p-4 text-center text-xs text-zinc-500 flex flex-col items-center gap-1">
                <Layers className="w-4 h-4 opacity-40" />
                <span>No matching options</span>
              </div>
            ) : (
              filtered.map((item) => {
                const isSelected = String(value) === String(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onChange(item.id);
                      setIsOpen(false);
                      setQuery('');
                    }}
                    className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                        : 'text-zinc-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span>{item.name}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-blue-400" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}