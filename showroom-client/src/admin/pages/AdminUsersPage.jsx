import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { User, Mail, Shield, Edit3, Trash2, Plus, Loader2, Search, X } from 'lucide-react';
import api from '../../services/api';

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const currentUser = JSON.parse(localStorage.getItem('admin_user') || '{}');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => (await api.get('/admin/users')).data,
  });

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (editingUser) return api.put(`/admin/users/${editingUser.id}`, data);
      return api.post('/admin/users', data);
    },
    onSuccess: () => {
      toast.success(`User ${editingUser ? 'updated' : 'created'} successfully!`);
      queryClient.invalidateQueries(['admin-users']);
      closeModal();
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Action failed.'),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => api.delete(`/admin/users/${id}`),
    onSuccess: () => {
      toast.success('User removed.');
      queryClient.invalidateQueries(['admin-users']);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Delete failed.'),
  });

  const openModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({ name: user.name, email: user.email, password: '' });
    } else {
      setEditingUser(null);
      setFormData({ name: '', email: '', password: '' });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingUser(null);
  };

  const handleDelete = (user) => {
    if (user.id === currentUser.id) return;

    Swal.fire({
      title: 'Delete User?',
      text: `Are you sure you want to delete ${user.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#27272a',
      confirmButtonText: 'Yes, delete',
      background: '#121215',
      color: '#ffffff',
    }).then((res) => {
      if (res.isConfirmed) deleteMutation.mutate(user.id);
    });
  };

  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) return users;
    return users.filter(
      (u) =>
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-6 rounded-3xl border border-white/10">
        <div>
          <h1 className="text-2xl font-black text-white">Admin Users Management</h1>
          <p className="text-xs text-zinc-400">Manage administrative account access.</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold"
        >
          <Plus className="w-4 h-4" />
          <span>Add Admin User</span>
        </button>
      </div>

      <div className="glass-card p-4 rounded-3xl border border-zinc-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Admin Name or Email..."
            className="w-full bg-black/60 border border-zinc-800 rounded-2xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <div className="glass-card rounded-3xl border border-zinc-800 overflow-hidden shadow-2xl">
        {isLoading ? (
          <div className="p-16 text-center text-zinc-500"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-800 bg-black/40 text-zinc-400 font-semibold uppercase">
                  <th className="p-4">User</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {filteredUsers.map((u) => {
                  const isSelf = u.id === currentUser.id;
                  return (
                    <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-4 font-bold text-white flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-zinc-800 overflow-hidden flex items-center justify-center text-zinc-400">
                          {u.avatar ? <img src={u.avatar.startsWith('http') ? u.avatar : `http://localhost:8000${u.avatar}`} alt="" className="w-full h-full object-cover" /> : <User className="w-4 h-4" />}
                        </div>
                        <span>{u.name}</span>
                        {isSelf && <span className="px-2 py-0.5 text-[10px] bg-blue-500/20 text-blue-400 rounded-full font-semibold">(You)</span>}
                      </td>
                      <td className="p-4 text-zinc-300">{u.email}</td>
                      <td className="p-4 text-zinc-400"><Shield className="w-3.5 h-3.5 text-blue-400 inline mr-1" /> Admin</td>
                      <td className="p-4 text-right space-x-1">
                        <button
                          disabled={isSelf}
                          onClick={() => openModal(u)}
                          title={isSelf ? "You cannot edit yourself here. Use Profile tab." : "Edit User"}
                          className="p-1.5 text-zinc-400 hover:text-blue-400 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          disabled={isSelf}
                          onClick={() => handleDelete(u)}
                          title={isSelf ? "You cannot delete yourself." : "Delete User"}
                          className="p-1.5 text-zinc-400 hover:text-red-400 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-card w-full max-w-md rounded-2xl border border-white/10 p-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <h3 className="text-base font-bold text-white">{editingUser ? 'Edit Admin' : 'Add Admin'}</h3>
              <button onClick={closeModal} className="p-1 text-zinc-400 hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(formData); }} className="space-y-4">
              <div>
                <label className="text-xs text-zinc-400 font-semibold mb-1 block">Name</label>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white" />
              </div>
              <div>
                <label className="text-xs text-zinc-400 font-semibold mb-1 block">Email</label>
                <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white" />
              </div>
              <div>
                <label className="text-xs text-zinc-400 font-semibold mb-1 block">Password {editingUser && '(Optional)'}</label>
                <input type="password" required={!editingUser} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={closeModal} className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400">Cancel</button>
                <button type="submit" disabled={saveMutation.isPending} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold">
                  {saveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}