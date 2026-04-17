import React, { useState } from 'react';
import { useBrands, useCreateBrand, useUpdateBrand } from '../hooks/useApi';
import { Button, Card } from '../components/ui';
import { Plus, Tag, Palette } from 'lucide-react';
import { Modal } from '../components/Modal';

export default function Brands() {
  const { data: brands, isLoading } = useBrands();
  const createBrand = useCreateBrand();
  const updateBrand = useUpdateBrand();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<any>(null);
  const [name, setName] = useState('');
  const [color, setColor] = useState('#000000');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBrand) {
      updateBrand.mutate({ id: editingBrand._id, data: { name, color } }, {
        onSuccess: () => {
          setIsModalOpen(false);
          setEditingBrand(null);
          setName('');
        }
      });
    } else {
      createBrand.mutate({ name, color }, {
        onSuccess: () => {
          setIsModalOpen(false);
          setName('');
        }
      });
    }
  };

  const handleEdit = (brand: any) => {
    setEditingBrand(brand);
    setName(brand.name);
    setColor(brand.color);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingBrand(null);
    setName('');
    setColor('#6366f1');
    setIsModalOpen(true);
  };

  if (isLoading) return <div className="p-8 text-center text-slate-500">Loading brands...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">Manage your multiple brand identities and assets.</p>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Add Brand
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {brands?.map((brand: any) => (
          <Card key={brand._id} className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div 
                className="h-12 w-12 rounded-xl flex items-center justify-center text-white text-xl font-bold uppercase shadow-lg shadow-black/10 transition-transform hover:scale-110"
                style={{ backgroundColor: brand.color }}
              >
                {brand.name[0]}
              </div>
              <div>
                <h3 className="text-lg font-bold">{brand.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className="h-2 w-2 rounded-full animate-pulse" style={{ backgroundColor: brand.color }} />
                  <span className="text-xs font-mono text-slate-500">{brand.color}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
               <span className="text-xs text-slate-500 italic">Last updated: Just now</span>
               <Button variant="ghost" size="sm" onClick={() => handleEdit(brand)} className="text-primary font-bold">Edit Details</Button>
            </div>
          </Card>
        ))}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingBrand ? "Edit Brand" : "Add New Brand"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-slate-500">Brand Name</label>
            <input 
              type="text" 
              required
              className="w-full rounded-lg border border-slate-200 p-2 text-sm" 
              placeholder="e.g. Nike" 
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-slate-500">Primary Color</label>
            <input 
              type="color" 
              className="w-full h-10 rounded-lg border border-slate-200 p-1" 
              value={color}
              onChange={e => setColor(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" loading={createBrand.isPending}>Create Brand</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
