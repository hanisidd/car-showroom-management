import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Car, Layers, LogOut, Menu, X } from 'lucide-react';

export default function AdminSidebar({ activeTab, setActiveTab }) {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { id: 'inventory', label: 'Inventory Management', icon: Car },
    { id: 'lookups', label: 'Makes, Models & Fuels', icon: Layers },
  ];

  const handleExitAdmin = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    navigate('/');
  };

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2.5 glass-panel text-white rounded-xl shadow-lg"
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar Container */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 glass-panel border-r border-white/10 p-6 flex flex-col justify-between transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0 bg-black/95 backdrop-blur-2xl' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          <div className="flex items-center gap-3 mb-10 pt-8 md:pt-0">
            <div className="p-2 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-500/30">
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold text-white tracking-wide">ADMIN PORTAL</span>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <button
          onClick={handleExitAdmin}
          className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all w-full text-left"
        >
          <LogOut className="w-4 h-4" />
          <span>Exit Admin</span>
        </button>
      </aside>
    </>
  );
}