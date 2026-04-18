import React, { useState } from 'react';
import { useBrands, useCreateBrand, useUpdateBrand } from '../hooks/useApi';
import { Button, Card } from '../components/ui';
import { Plus, Tag, Palette } from 'lucide-react';
import { Modal } from '../components/Modal';

import { BrandManagement } from '../components/BrandManagement';

export default function Brands() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 mb-4">
        <h2 className="text-2xl font-bold tracking-tight">Portfolio Management</h2>
        <p className="text-sm text-slate-500">Administrate your multiple brand identities, visual palettes, and contact assets from a single unified view.</p>
      </div>
      <BrandManagement />
    </div>
  );
}
