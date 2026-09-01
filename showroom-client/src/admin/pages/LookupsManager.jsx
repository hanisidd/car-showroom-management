import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import { Plus, Tag, Car, Fuel, Sparkles, Box } from 'lucide-react';
import DataTable from '../components/DataTable';
import LookupModal from '../components/LookupModal';
import {
  getMakes, createMake, updateMake, deleteMake,
  getModels, createModel, updateModel, deleteModel,
  getFuelTypes, createFuelType, updateFuelType, deleteFuelType,
  getBodyTypes, createBodyType, updateBodyType, deleteBodyType
} from '../services/lookupService';

export default function LookupsManager() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('makes');
  const [modalState, setModalState] = useState({ isOpen: false, type: null, initialData: null });

  const { data: makes = [] } = useQuery({ queryKey: ['makes'], queryFn: getMakes });
  const { data: models = [] } = useQuery({ queryKey: ['models'], queryFn: getModels });
  const { data: fuelTypes = [] } = useQuery({ queryKey: ['fuelTypes'], queryFn: getFuelTypes });
  const { data: bodyTypes = [] } = useQuery({ queryKey: ['bodyTypes'], queryFn: getBodyTypes });

  const confirmDelete = async (type, id, deleteFn) => {
    const result = await Swal.fire({
      title: `Delete ${type}?`,
      text: "This action cannot be undone!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#27272a',
      confirmButtonText: 'Yes, delete it',
      background: '#121215',
      color: '#ffffff',
      customClass: { popup: 'border border-zinc-800 rounded-3xl backdrop-blur-2xl' }
    });

    if (result.isConfirmed) {
      try {
        await deleteFn(id);
        toast.success(`${type} deleted successfully!`);
        queryClient.invalidateQueries([type.toLowerCase().replace(' ', '') + 's']);
      } catch (err) {
        toast.error(err.response?.data?.message || `Failed to delete ${type}.`);
      }
    }
  };

  const handleSave = async (payload) => {
    const { type, initialData } = modalState;
    try {
      if (type === 'Make') {
        initialData ? await updateMake(initialData.id, payload) : await createMake(payload);
      } else if (type === 'Model') {
        initialData ? await updateModel(initialData.id, payload) : await createModel(payload);
      } else if (type === 'Fuel Type') {
        initialData ? await updateFuelType(initialData.id, payload) : await createFuelType(payload);
      } else if (type === 'Body Type') {
        initialData ? await updateBodyType(initialData.id, payload) : await createBodyType(payload);
      }
      toast.success(`${type} ${initialData ? 'updated' : 'created'} successfully!`);
      queryClient.invalidateQueries([type.toLowerCase().replace(' ', '') + 's']);
      setModalState({ isOpen: false, type: null, initialData: null });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving record.');
    }
  };

  const tabs = [
    { id: 'makes', label: 'Car Makes', icon: Tag, count: makes.length, typeName: 'Make' },
    { id: 'models', label: 'Car Models', icon: Car, count: models.length, typeName: 'Model' },
    { id: 'fuelTypes', label: 'Fuel Options', icon: Fuel, count: fuelTypes.length, typeName: 'Fuel Type' },
    { id: 'bodyTypes', label: 'Body Types', icon: Box, count: bodyTypes.length, typeName: 'Body Type' },
  ];

  const currentTab = tabs.find(t => t.id === activeTab);

  return (
    <div className="space-y-6 text-left">
      {/* Banner */}
      <div className="glass-card p-6 rounded-3xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Master Catalog Settings</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">System Lookups Management</h1>
          <p className="text-xs text-zinc-400 mt-1">Configure attributes used across showroom inventory forms.</p>
        </div>
        <button
          onClick={() => setModalState({ isOpen: true, type: currentTab.typeName, initialData: null })}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New {currentTab.typeName}</span>
        </button>
      </div>

      {/* Separate Tab Navigation Bar */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-2 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                  : 'glass-panel text-zinc-400 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              <span className="ml-1 px-1.5 py-0.5 rounded-md text-[10px] bg-black/40 text-zinc-300">
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Tab View */}
      <div className="glass-card p-6 rounded-2xl border border-white/10 shadow-2xl">
        {activeTab === 'makes' && (
          <DataTable
            title="Car Makes Management"
            columns={[{ header: 'Make Name', accessor: 'name' }]}
            data={makes}
            onEdit={(row) => setModalState({ isOpen: true, type: 'Make', initialData: row })}
            onDelete={(id) => confirmDelete('Make', id, deleteMake)}
          />
        )}
        {activeTab === 'models' && (
          <DataTable
            title="Car Models Management"
            columns={[
              { header: 'Model Name', accessor: 'name' },
              { header: 'Parent Make', accessor: 'make', render: (row) => row.make?.name || 'Unassigned' },
            ]}
            data={models}
            onEdit={(row) => setModalState({ isOpen: true, type: 'Model', initialData: row })}
            onDelete={(id) => confirmDelete('Model', id, deleteModel)}
          />
        )}
        {activeTab === 'fuelTypes' && (
          <DataTable
            title="Fuel Types Management"
            columns={[{ header: 'Fuel Name', accessor: 'name' }]}
            data={fuelTypes}
            onEdit={(row) => setModalState({ isOpen: true, type: 'Fuel Type', initialData: row })}
            onDelete={(id) => confirmDelete('Fuel Type', id, deleteFuelType)}
          />
        )}
        {activeTab === 'bodyTypes' && (
          <DataTable
            title="Body Types Management"
            columns={[{ header: 'Body Type Name', accessor: 'name' }]}
            data={bodyTypes}
            onEdit={(row) => setModalState({ isOpen: true, type: 'Body Type', initialData: row })}
            onDelete={(id) => confirmDelete('Body Type', id, deleteBodyType)}
          />
        )}
      </div>

      <LookupModal
        isOpen={modalState.isOpen}
        type={modalState.type}
        initialData={modalState.initialData}
        makes={makes}
        onClose={() => setModalState({ isOpen: false, type: null, initialData: null })}
        onSubmit={handleSave}
      />
    </div>
  );
}