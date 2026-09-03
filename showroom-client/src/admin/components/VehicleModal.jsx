import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Star, Trash2, GripVertical, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import SearchableSelect from './SearchableSelect';
import api from '../../services/api';

function SortableImage({ id, fileObj, index, isCover, onSetCover, onRemove }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  return (
    <div ref={setNodeRef} style={style} className={`relative group h-24 rounded-xl overflow-hidden border-2 transition-all ${isCover ? 'border-amber-400 ring-2 ring-amber-400/20' : 'border-zinc-800'}`}>
      <img src={fileObj.preview} alt="" className="w-full h-full object-cover" />
      <div {...attributes} {...listeners} className="absolute top-1 left-1 p-1 bg-black/60 rounded-md cursor-grab text-white opacity-0 group-hover:opacity-100">
        <GripVertical className="w-3.5 h-3.5" />
      </div>
      <button type="button" onClick={() => onSetCover(index)} className={`absolute bottom-1 left-1 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 ${isCover ? 'bg-amber-400 text-black' : 'bg-black/60 text-zinc-300 opacity-0 group-hover:opacity-100'}`}>
        <Star className="w-3 h-3 fill-current" />
        <span>{isCover ? 'COVER' : 'Set Cover'}</span>
      </button>
      <button type="button" onClick={() => onRemove(index)} className="absolute top-1 right-1 p-1 bg-red-600/80 text-white rounded-md opacity-0 group-hover:opacity-100">
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export default function VehicleModal({ isOpen, onClose, onSuccess, lookupData }) {
  const [formData, setFormData] = useState({
    make_id: null,
    model_id: null,
    fuel_type_id: null,
    body_type_id: null,
    year: 2026,
    price: '',
    condition: 'Used',
    body_type: 'SUV',
    transmission: 'Automatic',
    exterior_color: '#000000',
    interior_color: '#ffffff',
    mileage: '',
    vin: '',
    lot_number: '',
    description: '',
  });
  const [images, setImages] = useState([]);
  const [coverIndex, setCoverIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleFileSelect = (files) => {
    const selectedFiles = Array.from(files);
    if (images.length + selectedFiles.length > 15) return toast.error('Max 15 images allowed.');
    const mapped = selectedFiles.map((file) => ({
      id: Math.random().toString(36).substring(2, 9),
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...mapped]);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setImages((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        if (coverIndex === oldIndex) setCoverIndex(newIndex);
        else if (coverIndex === newIndex) setCoverIndex(oldIndex);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length === 0) return toast.error('Please upload at least 1 image.');
    setSubmitting(true);
    const payload = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null) payload.append(key, formData[key]);
    });
    payload.append('cover_index', coverIndex);
    images.forEach((imgObj) => payload.append('images[]', imgObj.file));

    try {
      await api.post('/admin/vehicles', payload, { headers: { 'Content-Type': 'multipart/form-data' } });
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save vehicle.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-hidden">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="glass-card w-full max-w-4xl max-h-[90vh] rounded-3xl border border-white/10 shadow-2xl flex flex-col relative my-auto">
          <div className="flex items-center justify-between p-6 border-b border-white/10 shrink-0">
            <h2 className="text-xl font-bold text-white">Add New Vehicle</h2>
            <button onClick={onClose} className="p-2 text-zinc-400 hover:text-white rounded-xl glass-panel"><X className="w-5 h-5" /></button>
          </div>
          <form id="vehicle-form" onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-left custom-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <SearchableSelect
                label="Make"
                options={lookupData.makes || []}
                value={formData.make_id}
                onChange={(id) => setFormData({ ...formData, make_id: id, model_id: null })}
                placeholder="Select Make..."
              />
              <SearchableSelect
                label="Model"
                options={(lookupData.models || []).filter(m => m.make_id === formData.make_id)}
                value={formData.model_id}
                onChange={(id) => setFormData({ ...formData, model_id: id })}
                placeholder="Select Model..."
              />
              <SearchableSelect
                label="Fuel Type"
                options={lookupData.fuelTypes || []}
                value={formData.fuel_type_id}
                onChange={(id) => setFormData({ ...formData, fuel_type_id: id })}
                placeholder="Select Fuel Type..."
              />
              <SearchableSelect
                label="Body Type"
                options={lookupData.bodyTypes || []}
                value={formData.body_type_id}
                onChange={(id) => {
                  const selected = (lookupData.bodyTypes || []).find((b) => Number(b.id) === Number(id));
                  setFormData({
                    ...formData,
                    body_type_id: id,
                    body_type: selected ? selected.name : 'SUV'
                  });
                }}
                placeholder="Select Body Type..."
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <label className="text-xs text-zinc-400 font-semibold mb-1 block">Condition</label>
                <select value={formData.condition} onChange={(e) => setFormData({ ...formData, condition: e.target.value })} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500">
                  <option value="New">New</option>
                  <option value="Used">Used</option>
                  <option value="Certified Pre-Owned">Certified Pre-Owned</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-zinc-400 font-semibold mb-1 block">Transmission</label>
                <select value={formData.transmission} onChange={(e) => setFormData({ ...formData, transmission: e.target.value })} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500">
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                  <option value="CVT">CVT</option>
                  <option value="DCT">Dual Clutch (DCT)</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-zinc-400 font-semibold mb-1 block">Year</label>
                <input type="number" value={formData.year} onChange={(e) => setFormData({ ...formData, year: e.target.value })} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="text-xs text-zinc-400 font-semibold mb-1 block">Price (PKR)</label>
                <input type="number" placeholder="8500000" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500" required />
              </div>
              <div>
                <label className="text-xs text-zinc-400 font-semibold mb-1 block">Mileage (mi)</label>
                <input type="number" placeholder="1200" value={formData.mileage} onChange={(e) => setFormData({ ...formData, mileage: e.target.value })} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500" required />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-black/40 p-4 rounded-2xl border border-zinc-800">
              <div className="flex items-center justify-between">
                <label className="text-xs text-zinc-400 font-semibold">Exterior Color</label>
                <div className="flex items-center gap-3">
                  <input type="color" value={formData.exterior_color} onChange={(e) => setFormData({ ...formData, exterior_color: e.target.value })} className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0" />
                  <span className="text-xs font-mono uppercase text-zinc-300">{formData.exterior_color}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-xs text-zinc-400 font-semibold">Interior Color</label>
                <div className="flex items-center gap-3">
                  <input type="color" value={formData.interior_color} onChange={(e) => setFormData({ ...formData, interior_color: e.target.value })} className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0" />
                  <span className="text-xs font-mono uppercase text-zinc-300">{formData.interior_color}</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-zinc-400 font-semibold mb-1 block">VIN Number</label>
                <input type="text" value={formData.vin} onChange={(e) => setFormData({ ...formData, vin: e.target.value })} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 uppercase" />
              </div>
              <div>
                <label className="text-xs text-zinc-400 font-semibold mb-1 block">LOT Number</label>
                <input type="text" value={formData.lot_number} onChange={(e) => setFormData({ ...formData, lot_number: e.target.value })} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 uppercase" />
              </div>
            </div>
            <div>
              <label className="text-xs text-zinc-400 font-semibold mb-1 block">Description</label>
              <textarea rows="3" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500 resize-none" />
            </div>
            <div>
              <label className="text-xs text-zinc-400 font-semibold mb-2 flex justify-between">
                <span>Vehicle Images (Max 15)</span>
                <span>{images.length}/15 Selected</span>
              </label>
              <div onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); handleFileSelect(e.dataTransfer.files); }} className="border-2 border-dashed border-zinc-800 hover:border-blue-500/50 bg-black/40 rounded-2xl p-6 text-center cursor-pointer" onClick={() => document.getElementById('image-upload-input').click()}>
                <Upload className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-white">Drag & drop image files here, or click to browse</p>
                <input id="image-upload-input" type="file" multiple accept="image/*" onChange={(e) => handleFileSelect(e.target.files)} className="hidden" />
              </div>
              {images.length > 0 && (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={images.map((i) => i.id)} strategy={rectSortingStrategy}>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-4">
                      {images.map((imgObj, idx) => (
                        <SortableImage key={imgObj.id} id={imgObj.id} fileObj={imgObj} index={idx} isCover={coverIndex === idx} onSetCover={(i) => setCoverIndex(i)} onRemove={(i) => setImages(images.filter((_, index) => index !== i))} />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              )}
            </div>
          </form>
          <div className="flex justify-end gap-3 p-4 border-t border-white/10 shrink-0 bg-black/40 rounded-b-3xl">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl glass-panel text-xs font-semibold text-zinc-300">Cancel</button>
            <button type="submit" form="vehicle-form" disabled={submitting} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-semibold flex items-center gap-2">
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save & Publish Listing'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}