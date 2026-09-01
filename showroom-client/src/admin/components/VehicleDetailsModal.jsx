import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, Edit3, Loader2, ChevronLeft, ChevronRight, Upload, Trash2 } from 'lucide-react';
import SearchableSelect from './SearchableSelect';
import api from '../../services/api';

export default function VehicleDetailsModal({ isOpen, onClose, vehicle, lookupData, onSuccess }) {
    const [mode, setMode] = useState('view'); // 'view' or 'edit'
    const [selectedImg, setSelectedImg] = useState(0);
    const [loading, setLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        make_id: null,
        model_id: null,
        fuel_type_id: null,
        year: '',
        price: '',
        condition: 'Used',
        body_type: '',
        transmission: 'Automatic',
        exterior_color: '#000000',
        interior_color: '#ffffff',
        mileage: '',
        vin: '',
        lot_number: '',
        description: '',
    });

    // Image Management State
    const [existingImages, setExistingImages] = useState([]);
    const [newImages, setNewImages] = useState([]);

    useEffect(() => {
        if (vehicle && isOpen) {
            const initialMakeId = vehicle.make_id ?? vehicle.make?.id ?? null;
            const initialModelId = vehicle.model_id ?? vehicle.model?.id ?? null;
            const initialFuelId = vehicle.fuel_type_id ?? vehicle.fuel_type?.id ?? null;
            const initialBodyId = vehicle.body_type_id ?? vehicle.body_type?.id ?? null; // <-- ADD THIS

            setFormData({
                make_id: initialMakeId ? Number(initialMakeId) : null,
                model_id: initialModelId ? Number(initialModelId) : null,
                fuel_type_id: initialFuelId ? Number(initialFuelId) : null,
                body_type_id: initialBodyId ? Number(initialBodyId) : null, // <-- ADD THIS
                year: vehicle.year || '',
                price: vehicle.price || '',
                condition: vehicle.condition || 'Used',
                body_type: vehicle.body_type || '',
                transmission: vehicle.transmission || 'Automatic',
                exterior_color: vehicle.exterior_color || '#000000',
                interior_color: vehicle.interior_color || '#ffffff',
                mileage: vehicle.mileage || '',
                vin: vehicle.vin || '',
                lot_number: vehicle.lot_number || '',
                description: vehicle.description || '',
            });

            setExistingImages(vehicle.images || []);
            setNewImages([]);
            setSelectedImg(0);
            setMode('view');
        }
    }, [vehicle, isOpen]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.put(`/admin/vehicles/${vehicle.id}`, formData);

            if (newImages.length > 0) {
                const uploadPayload = new FormData();
                newImages.forEach((imgObj) => uploadPayload.append('images[]', imgObj.file));
                await api.post(`/admin/vehicles/${vehicle.id}/images`, uploadPayload, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            }

            if (onSuccess) onSuccess();
            onClose();
        } catch (err) {
            alert('Failed to update vehicle details.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !vehicle) return null;

    const currentImages = existingImages;
    const primaryImageUrl = currentImages[selectedImg]?.image_url
        ? `http://localhost:8000${currentImages[selectedImg].image_url}`
        : 'https://images.unsplash.com/photo-1503376780353-7e6692767b70';

    const handlePrevImage = () => {
        setSelectedImg((prev) => (prev === 0 ? currentImages.length - 1 : prev - 1));
    };

    const handleNextImage = () => {
        setSelectedImg((prev) => (prev === currentImages.length - 1 ? 0 : prev + 1));
    };

    const handleNewFiles = (files) => {
        const selected = Array.from(files);
        const mapped = selected.map((file) => ({
            id: Math.random().toString(36).substring(2, 9),
            file,
            preview: URL.createObjectURL(file),
        }));
        setNewImages((prev) => [...prev, ...mapped]);
    };

    const handleDeleteExistingImage = async (imageId) => {
        if (!confirm('Remove this image from listing?')) return;
        try {
            await api.delete(`/admin/vehicle-images/${imageId}`);
            setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
            setSelectedImg(0);
        } catch (err) {
            alert('Failed to delete image.');
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-hidden">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="glass-card w-full max-w-4xl max-h-[90vh] rounded-3xl border border-white/10 shadow-2xl flex flex-col relative my-auto"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-white/10 shrink-0">
                        <div className="flex items-center gap-3">
                            <h2 className="text-xl font-bold text-white">
                                {vehicle.make?.name} {vehicle.model?.name} ({vehicle.year})
                            </h2>
                            <div className="flex items-center gap-1 bg-black/60 p-1 rounded-xl border border-white/10">
                                <button
                                    type="button"
                                    onClick={() => setMode('view')}
                                    className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${mode === 'view' ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-white'}`}
                                >
                                    <Eye className="w-3.5 h-3.5" />
                                    <span>View</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setMode('edit')}
                                    className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${mode === 'edit' ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-white'}`}
                                >
                                    <Edit3 className="w-3.5 h-3.5" />
                                    <span>Edit</span>
                                </button>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 text-zinc-400 hover:text-white rounded-xl glass-panel">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Modal Content */}
                    <div className="p-6 overflow-y-auto space-y-6 flex-1 text-left custom-scrollbar">
                        {mode === 'view' ? (
                            <div className="space-y-6">
                                <div className="relative w-full h-80 rounded-2xl bg-black border border-zinc-800 overflow-hidden group">
                                    <img src={primaryImageUrl} alt="" className="w-full h-full object-cover transition-all duration-300" />
                                    {currentImages.length > 1 && (
                                        <>
                                            <button
                                                type="button"
                                                onClick={handlePrevImage}
                                                className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/70 hover:bg-black text-white border border-white/10 backdrop-blur-md transition-all opacity-80 hover:opacity-100"
                                                title="Previous Image"
                                            >
                                                <ChevronLeft className="w-5 h-5" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleNextImage}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/70 hover:bg-black text-white border border-white/10 backdrop-blur-md transition-all opacity-80 hover:opacity-100"
                                                title="Next Image"
                                            >
                                                <ChevronRight className="w-5 h-5" />
                                            </button>
                                            <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-black/80 border border-white/10 text-xs font-mono text-white backdrop-blur-md">
                                                {selectedImg + 1} / {currentImages.length}
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    <div className="bg-black/60 p-3.5 rounded-xl border border-zinc-800">
                                        <p className="text-[10px] text-zinc-500 uppercase font-semibold">Price</p>
                                        <p className="text-base font-extrabold text-emerald-400">PKR {Number(vehicle.price)?.toLocaleString()}</p>
                                    </div>
                                    <div className="bg-black/60 p-3.5 rounded-xl border border-zinc-800">
                                        <p className="text-[10px] text-zinc-500 uppercase font-semibold">Fuel Type</p>
                                        <p className="text-sm font-bold text-white">{vehicle.fuel_type?.name || 'N/A'}</p>
                                    </div>
                                    <div className="bg-black/60 p-3.5 rounded-xl border border-zinc-800">
                                        <p className="text-[10px] text-zinc-500 uppercase font-semibold">Transmission</p>
                                        <p className="text-sm font-bold text-white">{vehicle.transmission || 'Automatic'}</p>
                                    </div>
                                    <div className="bg-black/60 p-3.5 rounded-xl border border-zinc-800">
                                        <p className="text-[10px] text-zinc-500 uppercase font-semibold">VIN / Chassis</p>
                                        <p className="text-sm font-bold text-blue-400">{vehicle.vin || ' '}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-black/40 p-4 rounded-xl border border-zinc-800/80">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-zinc-500">Exterior Color:</span>
                                        <span className="w-4 h-4 rounded-full border border-white/20 shadow-sm" style={{ backgroundColor: vehicle.exterior_color || '#000000' }} />
                                        <span className="text-xs font-mono uppercase text-zinc-300">{vehicle.exterior_color || '#000000'}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-zinc-500">Interior Color:</span>
                                        <span className="w-4 h-4 rounded-full border border-white/20 shadow-sm" style={{ backgroundColor: vehicle.interior_color || '#ffffff' }} />
                                        <span className="text-xs font-mono uppercase text-zinc-300">{vehicle.interior_color || '#ffffff'}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-3 text-xs bg-black/40 p-4 rounded-xl border border-zinc-800/80">
                                    <div><span className="text-zinc-500">LOT:</span> <span className="text-amber-400 font-bold">{vehicle.lot_number || ' '}</span></div>
                                    <div><span className="text-zinc-500">Mileage:</span> <span className="text-white font-semibold">{vehicle.mileage?.toLocaleString()} mi</span></div>
                                    <div><span className="text-zinc-500">Condition:</span> <span className="text-white font-semibold">{vehicle.condition}</span></div>
                                </div>

                                {vehicle.description && (
                                    <div>
                                        <h4 className="text-xs font-semibold text-zinc-400 mb-1">Description & Notes</h4>
                                        <p className="text-xs text-zinc-300 bg-black/40 p-3 rounded-xl border border-zinc-800 leading-relaxed">{vehicle.description}</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            /* Editable Form View */
                            <form id="edit-vehicle-form" onSubmit={handleUpdate} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <SearchableSelect
                                        label="Make"
                                        options={lookupData.makes || []}
                                        value={formData.make_id}
                                        onChange={(id) => setFormData({ ...formData, make_id: Number(id), model_id: null })}
                                    />
                                    <SearchableSelect
                                        label="Model"
                                        options={(lookupData.models || []).filter(
                                            (m) => String(m.make_id) === String(formData.make_id)
                                        )}
                                        value={formData.model_id}
                                        onChange={(id) => setFormData({ ...formData, model_id: Number(id) })}
                                    />
                                    <SearchableSelect
                                        label="Fuel Type"
                                        options={lookupData.fuelTypes || []}
                                        value={formData.fuel_type_id}
                                        onChange={(id) => setFormData({ ...formData, fuel_type_id: Number(id) })}
                                    />
                                    <SearchableSelect
                                        label="Body Type"
                                        options={lookupData.bodyTypes || []}
                                        value={formData.body_type_id}
                                        onChange={(id) => {
                                            const selected = (lookupData.bodyTypes || []).find((b) => Number(b.id) === Number(id));
                                            setFormData({
                                                ...formData,
                                                body_type_id: Number(id),
                                                body_type: selected ? selected.name : formData.body_type
                                            });
                                        }}
                                    />
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                    <div>
                                        <label className="text-xs text-zinc-400 font-semibold mb-1 block">Condition</label>
                                        <select
                                            value={formData.condition}
                                            onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                                            className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                                        >
                                            <option value="New">New</option>
                                            <option value="Used">Used</option>
                                            <option value="Certified Pre-Owned">Certified Pre-Owned</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs text-zinc-400 font-semibold mb-1 block">Transmission</label>
                                        <select
                                            value={formData.transmission}
                                            onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}
                                            className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                                        >
                                            <option value="Automatic">Automatic</option>
                                            <option value="Manual">Manual</option>
                                            <option value="CVT">CVT</option>
                                            <option value="DCT">Dual Clutch (DCT)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs text-zinc-400 font-semibold mb-1 block">Year</label>
                                        <input
                                            type="number"
                                            value={formData.year}
                                            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                            className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-zinc-400 font-semibold mb-1 block">Price (PKR)</label>
                                        <input
                                            type="number"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-zinc-400 font-semibold mb-1 block">Mileage</label>
                                        <input
                                            type="number"
                                            value={formData.mileage}
                                            onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
                                            className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-black/40 p-4 rounded-2xl border border-zinc-800">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs text-zinc-400 font-semibold">Exterior Color</label>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="color"
                                                value={formData.exterior_color}
                                                onChange={(e) => setFormData({ ...formData, exterior_color: e.target.value })}
                                                className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                                            />
                                            <span className="text-xs font-mono uppercase text-zinc-300">{formData.exterior_color}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs text-zinc-400 font-semibold">Interior Color</label>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="color"
                                                value={formData.interior_color}
                                                onChange={(e) => setFormData({ ...formData, interior_color: e.target.value })}
                                                className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                                            />
                                            <span className="text-xs font-mono uppercase text-zinc-300">{formData.interior_color}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs text-zinc-400 font-semibold mb-1 block">VIN Number (Chassis)</label>
                                        <input
                                            type="text"
                                            value={formData.vin}
                                            onChange={(e) => setFormData({ ...formData, vin: e.target.value })}
                                            className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500 uppercase"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-zinc-400 font-semibold mb-1 block">LOT Number</label>
                                        <input
                                            type="text"
                                            value={formData.lot_number}
                                            onChange={(e) => setFormData({ ...formData, lot_number: e.target.value })}
                                            className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500 uppercase"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs text-zinc-400 font-semibold mb-1 block">Description</label>
                                    <textarea
                                        rows="3"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500 resize-none"
                                    />
                                </div>

                                <div className="space-y-3 pt-2">
                                    <label className="text-xs text-zinc-400 font-semibold block">Manage Gallery Photos</label>
                                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                                        {existingImages.map((img) => (
                                            <div key={img.id} className="relative group h-20 rounded-xl overflow-hidden border border-zinc-800">
                                                <img src={`http://localhost:8000${img.image_url}`} alt="" className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteExistingImage(img.id)}
                                                    className="absolute top-1 right-1 p-1 bg-red-600/80 hover:bg-red-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        ))}
                                        {newImages.map((imgObj, idx) => (
                                            <div key={imgObj.id} className="relative group h-20 rounded-xl overflow-hidden border-2 border-blue-500">
                                                <img src={imgObj.preview} alt="" className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => setNewImages(newImages.filter((_, i) => i !== idx))}
                                                    className="absolute top-1 right-1 p-1 bg-red-600/80 text-white rounded-md"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <div
                                        onClick={() => document.getElementById('edit-image-upload').click()}
                                        className="border border-dashed border-zinc-800 hover:border-blue-500/50 bg-black/40 rounded-xl p-4 text-center cursor-pointer flex items-center justify-center gap-2 text-xs text-zinc-300"
                                    >
                                        <Upload className="w-4 h-4 text-blue-400" />
                                        <span>Upload Additional Photos</span>
                                        <input
                                            id="edit-image-upload"
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={(e) => handleNewFiles(e.target.files)}
                                            className="hidden"
                                        />
                                    </div>
                                </div>
                            </form>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 p-4 border-t border-white/10 shrink-0 bg-black/40 rounded-b-3xl">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-xl glass-panel text-xs font-semibold text-zinc-300 hover:text-white"
                        >
                            Close
                        </button>
                        {mode === 'edit' && (
                            <button
                                type="submit"
                                form="edit-vehicle-form"
                                disabled={loading}
                                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2"
                            >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Changes'}
                            </button>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}