import { useState } from 'react';
import { User, Mail, Lock, Camera, Loader2, Save } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import api from '../../services/api';

export default function AdminProfilePage() {
  const currentUser = JSON.parse(localStorage.getItem('admin_user') || '{}');
  
  const [formData, setFormData] = useState({
    name: currentUser.name || '',
    email: currentUser.email || '',
    password: '',
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [preview, setPreview] = useState(currentUser.avatar || null);
  const [loading, setLoading] = useState(false);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = new FormData();
    payload.append('name', formData.name);
    payload.append('email', formData.email);
    if (formData.password) payload.append('password', formData.password);
    if (avatarFile) payload.append('avatar', avatarFile);

    try {
      const res = await api.post('/admin/profile', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Profile updated successfully!');
      localStorage.setItem('admin_user', JSON.stringify(res.data));
      setFormData((prev) => ({ ...prev, password: '' }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const avatarSrc = preview
    ? (preview.startsWith('blob:') || preview.startsWith('http')
        ? preview
        : `http://localhost:8000${preview}`)
    : null;

  return (
    <div className="max-w-2xl mx-auto space-y-6 text-left">
      <Toaster position="top-right" />
      <div className="glass-card p-6 rounded-3xl border border-white/10">
        <h1 className="text-2xl font-black text-white">Admin Profile Settings</h1>
        <p className="text-xs text-zinc-400 mt-1">Update your profile details and upload a photo.</p>
      </div>

      <form onSubmit={handleSubmit} className="glass-card p-8 rounded-3xl border border-white/10 space-y-6">
        {/* Avatar Upload */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-blue-500/50 bg-zinc-900 group">
            {avatarSrc ? (
              <img src={avatarSrc} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-600">
                <User className="w-12 h-12" />
              </div>
            )}
            <label
              htmlFor="avatar-upload"
              className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <Camera className="w-6 h-6 mb-1" />
              <span className="text-[10px] font-bold">Change</span>
            </label>
            <input id="avatar-upload" type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-zinc-400 mb-1 block">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-black/60 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-400 mb-1 block">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-black/60 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-400 mb-1 block">New Password (leave blank to keep current)</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-black/60 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> Save Profile Changes</>}
        </button>
      </form>
    </div>
  );
}