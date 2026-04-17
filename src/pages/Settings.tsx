import React, { useState } from 'react';
import { useAuthStore } from '../store/store';
import { Card, Button, Badge } from '../components/ui';
import { useBrands, useCreateBrand, useUpdateBrand, useDeleteBrand } from '../hooks/useApi';
import { Modal } from '../components/Modal';
import { 
  User, 
  Lock, 
  Bell, 
  Globe, 
  Shield,
  Save,
  Zap,
  Activity,
  Tag,
  Plus,
  Pencil,
  Trash2,
  AlertTriangle,
  Upload,
  Link as LinkIcon,
  Twitter,
  Linkedin,
  Instagram,
  Facebook,
  Mail,
  Phone,
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function Settings() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'brands', icon: Tag, label: 'Brands' },
    { id: 'security', icon: Lock, label: 'Security' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'preferences', icon: Globe, label: 'Preferences' },
    { id: 'integrations', icon: Zap, label: 'Integrations' },
    { id: 'workflows', icon: Activity, label: 'Workflows' }
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-sm text-slate-500 text-[13px]">Manage your account settings and preferences.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all",
                activeTab === tab.id 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "text-slate-500 hover:bg-slate-100"
              )}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </aside>

        <div className="space-y-6">
          {activeTab === 'profile' && (
            <Card className="p-8">
              <div className="flex items-center gap-6 mb-8">
                <div className="relative">
                  <div className="h-20 w-20 rounded-full bg-gradient-to-tr from-primary to-indigo-500 flex items-center justify-center text-white text-2xl font-bold">
                    {user?.name?.[0]}
                  </div>
                  <button className="absolute -bottom-1 -right-1 rounded-full bg-white p-2 shadow-lg border border-slate-100">
                    <User className="h-4 w-4 text-slate-500" />
                  </button>
                </div>
                <div>
                  <h3 className="text-xl font-bold">{user?.name}</h3>
                  <p className="text-sm text-slate-500">{user?.role} Account • {user?.email}</p>
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <SettingInput label="Display Name" value={user?.name} />
                <SettingInput label="Email Address" value={user?.email} />
                <SettingInput label="Job Title" value="Senior Brand Manager" />
                <SettingInput label="Timezone" value="(GMT-07:00) Pacific Time" />
                <div className="sm:col-span-2 space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-500">Bio</label>
                  <textarea 
                    className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-primary/20 min-h-[100px]"
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                <Button className="font-bold px-8">
                  <Save className="mr-2 h-4 w-4" /> Save Changes
                </Button>
              </div>
            </Card>
          )}

          {activeTab === 'brands' && (
            <BrandManagement />
          )}

          {activeTab === 'preferences' && (
            <Card className="p-8 space-y-8">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="font-bold">Regional Format</h4>
                  <p className="text-xs text-slate-500">Set your preferred date and currency formats.</p>
                </div>
                <select className="rounded-lg border border-slate-200 p-2 text-xs">
                   <option>United States (USD)</option>
                   <option>United Kingdom (GBP)</option>
                </select>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                <div className="space-y-1">
                  <h4 className="font-bold">Email Notifications</h4>
                  <p className="text-xs text-slate-500">Receive weekly summaries of brand performance.</p>
                </div>
                <div className="h-6 w-11 rounded-full bg-primary relative cursor-pointer shadow-inner shadow-black/10">
                  <div className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white transition-all shadow-sm" />
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'security' && (
             <Card className="p-8 space-y-6">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-amber-50 border border-amber-100">
                  <Shield className="h-10 w-10 text-amber-500" />
                  <div>
                    <h4 className="font-bold text-amber-900">Security Recommendation</h4>
                    <p className="text-xs text-amber-700">Enable two-factor authentication to protect your brand assets.</p>
                  </div>
                </div>
                <div className="space-y-4 pt-4">
                  <Button variant="outline" className="w-full py-6 rounded-2xl border-dashed">Update Password</Button>
                  <Button variant="outline" className="w-full py-6 rounded-2xl border-dashed">Manage API Access</Button>
                </div>
             </Card>
          )}

          {activeTab === 'integrations' && (
            <Card className="p-8 space-y-6">
              <div className="space-y-1">
                <h4 className="font-bold">Connect External Tools</h4>
                <p className="text-xs text-slate-500">Sync your brand data with the tools you use every day.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <IntegrationItem name="Slack" description="Send project updates to channels" connected active />
                <IntegrationItem name="Figma" description="Import designs and assets directly" />
                <IntegrationItem name="Google Drive" description="Sync your project documentation" />
                <IntegrationItem name="Jira" description="Sync tasks with development teams" />
              </div>
            </Card>
          )}

          {activeTab === 'workflows' && (
            <Card className="p-8 space-y-8">
              <div className="space-y-1">
                <h4 className="font-bold">Custom Task Statuses</h4>
                <p className="text-xs text-slate-500">Tailor the Kanban board to your specific business logic.</p>
              </div>
              
              <div className="space-y-3">
                 <WorkflowStatus name="To Do" color="bg-slate-500" />
                 <WorkflowStatus name="In Progress" color="bg-amber-500" />
                 <WorkflowStatus name="Review" color="bg-indigo-500" />
                 <WorkflowStatus name="Completed" color="bg-emerald-500" />
                 <Button variant="outline" className="w-full border-dashed py-6 rounded-2xl">
                   + Add Custom Status
                 </Button>
              </div>

              <div className="pt-8 border-t border-slate-100 space-y-4">
                <h4 className="font-bold">Automated Workflows</h4>
                <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-bold">Auto-Assign Reviewers</p>
                    <p className="text-[10px] text-slate-500">Assign QA lead when status moves to "Review"</p>
                  </div>
                  <div className="h-5 w-10 rounded-full bg-slate-200 relative cursor-pointer">
                    <div className="absolute left-1 top-1 h-3 w-3 rounded-full bg-white transition-all shadow-sm" />
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function IntegrationItem({ name, description, connected, active }: any) {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-all cursor-pointer group">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-xs group-hover:scale-110 transition-transform">
          {name[0]}
        </div>
        <div>
          <p className="text-sm font-bold">{name}</p>
          <p className="text-[10px] text-slate-500">{description}</p>
        </div>
      </div>
      <Button variant={connected ? 'secondary' : 'outline'} size="sm" className="h-8 rounded-lg text-[10px]">
        {connected ? (active ? 'Active' : 'Connected') : 'Connect'}
      </Button>
    </div>
  );
}

function WorkflowStatus({ name, color }: { name: string, color: string }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100">
      <div className="flex items-center gap-3">
        <div className={cn("h-3 w-3 rounded-full", color)} />
        <span className="text-sm font-bold">{name}</span>
      </div>
      <div className="flex gap-2">
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
          <Settings className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}

function SettingInput({ label, value }: { label: string, value?: string }) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold uppercase text-slate-500">{label}</label>
      <input 
        type="text" 
        defaultValue={value}
        className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );
}

function BrandManagement() {
  const { data: brands, isLoading } = useBrands();
  const createBrand = useCreateBrand();
  const updateBrand = useUpdateBrand();
  const deleteBrand = useDeleteBrand();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<any>(null);
  
  const [formData, setFormData] = useState<any>({
    name: '',
    color: '#6366f1',
    secondaryColor: '#f8fafc',
    logo: '',
    description: '',
    tagline: '',
    contact: { website: '', email: '', phone: '' },
    socials: { twitter: '', linkedin: '', facebook: '', instagram: '' },
    styleGuide: '',
    notes: ''
  });

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState<any>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBrand) {
      updateBrand.mutate({ id: editingBrand._id, data: formData }, {
        onSuccess: () => {
          setIsModalOpen(false);
          setEditingBrand(null);
          resetForm();
        }
      });
    } else {
      createBrand.mutate(formData, {
        onSuccess: () => {
          setIsModalOpen(false);
          resetForm();
        }
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      color: '#6366f1',
      secondaryColor: '#f8fafc',
      logo: '',
      description: '',
      tagline: '',
      contact: { website: '', email: '', phone: '' },
      socials: { twitter: '', linkedin: '', facebook: '', instagram: '' },
      styleGuide: '',
      notes: ''
    });
  };

  const handleEdit = (brand: any) => {
    setEditingBrand(brand);
    setFormData({
      name: brand.name || '',
      color: brand.color || '#6366f1',
      secondaryColor: brand.secondaryColor || '#f8fafc',
      logo: brand.logo || '',
      description: brand.description || '',
      tagline: brand.tagline || '',
      contact: brand.contact || { website: '', email: '', phone: '' },
      socials: brand.socials || { twitter: '', linkedin: '', facebook: '', instagram: '' },
      styleGuide: brand.styleGuide || '',
      notes: brand.notes || ''
    });
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingBrand(null);
    resetForm();
    setIsModalOpen(true);
  };

  if (isLoading) return <div className="p-8 text-center text-slate-500 italic">Preparing your brand assets...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-xl font-black uppercase tracking-tight text-slate-900 leading-none">Brand Identities</h3>
          <p className="text-xs text-slate-500 font-medium">Manage your company's growing portfolio of brands.</p>
        </div>
        <Button onClick={handleCreate} size="sm" className="rounded-xl font-bold">
          <Plus className="mr-2 h-4 w-4" /> Add Brand
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {brands?.map((brand: any) => (
          <Card key={brand._id} className="p-0 overflow-hidden flex flex-col group group/brand hover:shadow-2xl hover:shadow-primary/5 transition-all border-slate-200/60">
            <div className="h-24 relative overflow-hidden" style={{ backgroundColor: brand.color }}>
              <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent" />
              {brand.logo && (
                <div className="absolute -bottom-6 left-6 h-16 w-16 rounded-2xl bg-white p-2 shadow-xl border border-slate-100 flex items-center justify-center">
                  <img src={brand.logo} alt={brand.name} className="max-h-full max-w-full object-contain" referrerPolicy="no-referrer" />
                </div>
              )}
              <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                <Button variant="secondary" size="icon" onClick={() => handleEdit(brand)} className="h-8 w-8 bg-white/90 backdrop-blur-sm border-none shadow-lg">
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button 
                  variant="secondary" 
                  size="icon" 
                  onClick={() => {
                    setBrandToDelete(brand);
                    setIsDeleteModalOpen(true);
                  }} 
                  className="h-8 w-8 bg-white/90 backdrop-blur-sm border-none shadow-lg text-red-500 hover:text-red-600"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
            
            <div className="p-6 pt-10 space-y-4 flex-1">
              <div>
                <h4 className="text-lg font-black text-slate-900 leading-tight">{brand.name}</h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{brand.tagline || 'No tagline set'}</p>
              </div>
              
              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed min-h-[32px]">
                {brand.description || 'Provide a brief overview of this brand identity.'}
              </p>

              <div className="flex flex-wrap gap-2 pt-2">
                 {brand.contact?.website && (
                   <a href={brand.contact.website} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-slate-50 text-slate-400 hover:text-primary transition-colors">
                     <Globe className="h-3.5 w-3.5" />
                   </a>
                 )}
                 {brand.contact?.email && (
                   <a href={`mailto:${brand.contact.email}`} className="p-2 rounded-lg bg-slate-50 text-slate-400 hover:text-primary transition-colors">
                     <Mail className="h-3.5 w-3.5" />
                   </a>
                 )}
                 <div className="ml-auto flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full border border-white shadow-sm" style={{ backgroundColor: brand.color }} />
                    <div className="h-3 w-3 rounded-full border border-white shadow-sm" style={{ backgroundColor: brand.secondaryColor }} />
                 </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setEditingBrand(null);
        }} 
        title={editingBrand ? "Polish Brand Identity" : "Launch New Brand"}
        className="max-w-4xl"
      >
        <div className="grid lg:grid-cols-[1fr_320px] gap-8">
          <form onSubmit={handleSubmit} className="space-y-8 max-h-[70vh] overflow-y-auto pr-4 scrollbar-hide">
            {/* Core Info */}
            <div className="space-y-4">
               <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-2">Core Identity</h4>
               <div className="grid gap-4 sm:grid-cols-2">
                 <div className="sm:col-span-2 space-y-2">
                   <label className="text-xs font-bold uppercase text-slate-500">Official Brand Name <span className="text-red-500">*</span></label>
                   <input 
                     type="text" 
                     required
                     className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-primary/20 bg-slate-50/50" 
                     placeholder="e.g. Nike" 
                     value={formData.name}
                     onChange={e => setFormData({ ...formData, name: e.target.value })}
                   />
                 </div>
                 <div className="space-y-2">
                   <label className="text-xs font-bold uppercase text-slate-500">Tagline</label>
                   <input 
                     type="text" 
                     className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-primary/20 bg-slate-50/50" 
                     placeholder="Just Do It" 
                     value={formData.tagline}
                     onChange={e => setFormData({ ...formData, tagline: e.target.value })}
                   />
                 </div>
                 <div className="space-y-2">
                   <label className="text-xs font-bold uppercase text-slate-500">Style Guide Link</label>
                   <div className="relative">
                      <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                      <input 
                        type="url" 
                        className="w-full rounded-xl border border-slate-200 p-3 pl-9 text-sm focus:ring-2 focus:ring-primary/20 bg-slate-50/50" 
                        placeholder="https://..." 
                        value={formData.styleGuide}
                        onChange={e => setFormData({ ...formData, styleGuide: e.target.value })}
                      />
                   </div>
                 </div>
                 <div className="sm:col-span-2 space-y-2">
                   <label className="text-xs font-bold uppercase text-slate-500">Brand Overview</label>
                   <textarea 
                     className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-primary/20 bg-slate-50/50 min-h-[80px]" 
                     placeholder="Briefly describe the brand's mission and personality..." 
                     value={formData.description}
                     onChange={e => setFormData({ ...formData, description: e.target.value })}
                   />
                 </div>
               </div>
            </div>

            {/* Visuals */}
            <div className="space-y-4">
               <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-2">Visual Palette</h4>
               <div className="grid gap-6 sm:grid-cols-2">
                 <div className="space-y-3">
                   <label className="text-xs font-bold uppercase text-slate-500">Primary Color</label>
                   <div className="flex gap-2">
                      <input 
                        type="color" 
                        className="h-11 w-11 rounded-xl border border-slate-200 p-1 cursor-pointer" 
                        value={formData.color}
                        onChange={e => setFormData({ ...formData, color: e.target.value })}
                      />
                      <input 
                        type="text" 
                        className="flex-1 rounded-xl border border-slate-200 p-2.5 text-xs font-mono uppercase bg-slate-50/50"
                        value={formData.color}
                        onChange={e => setFormData({ ...formData, color: e.target.value })}
                      />
                   </div>
                 </div>
                 <div className="space-y-3">
                   <label className="text-xs font-bold uppercase text-slate-500">Secondary Color</label>
                   <div className="flex gap-2">
                      <input 
                        type="color" 
                        className="h-11 w-11 rounded-xl border border-slate-200 p-1 cursor-pointer" 
                        value={formData.secondaryColor}
                        onChange={e => setFormData({ ...formData, secondaryColor: e.target.value })}
                      />
                      <input 
                        type="text" 
                        className="flex-1 rounded-xl border border-slate-200 p-2.5 text-xs font-mono uppercase bg-slate-50/50"
                        value={formData.secondaryColor}
                        onChange={e => setFormData({ ...formData, secondaryColor: e.target.value })}
                      />
                   </div>
                 </div>
                 <div className="sm:col-span-2 space-y-3">
                   <label className="text-xs font-bold uppercase text-slate-500">Brand Logo URL</label>
                   <div className="flex gap-3">
                     <div className="flex-1 relative">
                        <Upload className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                        <input 
                          type="text" 
                          className="w-full rounded-xl border border-slate-200 p-3 pl-9 text-sm focus:ring-2 focus:ring-primary/20 bg-slate-50/50" 
                          placeholder="https://logo-url.png" 
                          value={formData.logo}
                          onChange={e => setFormData({ ...formData, logo: e.target.value })}
                        />
                     </div>
                     <button 
                        type="button"
                        className="p-3 rounded-xl border border-slate-200 bg-white text-slate-400 hover:text-primary transition-all"
                        onClick={() => setFormData({ ...formData, logo: `https://picsum.photos/seed/${Math.random()}/200/200` })}
                      >
                       <Zap className="h-4 w-4" />
                     </button>
                   </div>
                   <p className="text-[10px] text-slate-400 italic">Optimal dimensions: 512x512px. Supported: SVG, PNG, JPG.</p>
                 </div>
               </div>
            </div>

            {/* Contact & Socials */}
            <div className="space-y-4">
               <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-2">Business Presence</h4>
               <div className="grid gap-4 sm:grid-cols-2">
                 <div className="space-y-2">
                   <label className="text-xs font-bold uppercase text-slate-500">Website</label>
                   <input 
                     type="url" 
                     className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-primary/20 bg-slate-50/50" 
                     placeholder="nike.com" 
                     value={formData.contact.website}
                     onChange={e => setFormData({ ...formData, contact: { ...formData.contact, website: e.target.value } })}
                   />
                 </div>
                 <div className="space-y-2">
                   <label className="text-xs font-bold uppercase text-slate-500">Public Email</label>
                   <input 
                     type="email" 
                     className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-primary/20 bg-slate-50/50" 
                     placeholder="media@brand.com" 
                     value={formData.contact.email}
                     onChange={e => setFormData({ ...formData, contact: { ...formData.contact, email: e.target.value } })}
                   />
                 </div>
                 <div className="space-y-2">
                   <label className="text-xs font-bold uppercase text-slate-500">Twitter (X)</label>
                   <input 
                     type="text" 
                     className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-primary/20 bg-slate-50/50" 
                     placeholder="@handle" 
                     value={formData.socials.twitter}
                     onChange={e => setFormData({ ...formData, socials: { ...formData.socials, twitter: e.target.value } })}
                   />
                 </div>
                 <div className="space-y-2">
                   <label className="text-xs font-bold uppercase text-slate-500">Instagram</label>
                   <input 
                     type="text" 
                     className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-primary/20 bg-slate-50/50" 
                     placeholder="@handle" 
                     value={formData.socials.instagram}
                     onChange={e => setFormData({ ...formData, socials: { ...formData.socials, instagram: e.target.value } })}
                   />
                 </div>
               </div>
            </div>

            {/* Additional Notes */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-500">Special Notes</label>
              <textarea 
                className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-primary/20 bg-slate-50/50 min-h-[60px]" 
                placeholder="Any other relevant context for this brand..." 
                value={formData.notes}
                onChange={e => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-slate-50">
              <Button variant="ghost" type="button" onClick={() => {
                setIsModalOpen(false);
                setEditingBrand(null);
              }} className="font-bold">Cancel</Button>
              <Button type="submit" loading={createBrand.isPending || updateBrand.isPending} className="font-black uppercase tracking-tight shadow-xl shadow-primary/20">
                {editingBrand ? "Apply Global Updates" : "Register Brand Entity"}
              </Button>
            </div>
          </form>

          {/* Real-time Preview */}
          <div className="hidden lg:block space-y-4">
             <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Live Card Preview</h4>
             <Card 
               className="p-0 overflow-hidden flex flex-col shadow-2xl border-slate-200 scale-95 origin-top transition-all"
               style={{ boxShadow: `0 25px 50px -12px ${formData.color}20` }}
             >
                <div className="h-28 relative" style={{ backgroundColor: formData.color }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent" />
                  {formData.logo && (
                    <div className="absolute -bottom-6 left-6 h-16 w-16 rounded-2xl bg-white p-2 shadow-xl border border-slate-100 flex items-center justify-center">
                      <img src={formData.logo} alt="Preview" className="max-h-full max-w-full object-contain" referrerPolicy="no-referrer" />
                    </div>
                  )}
                </div>
                <div className="p-6 pt-10 space-y-3">
                  <div>
                    <h4 className="text-lg font-black text-slate-900 leading-tight truncate">{formData.name || 'Brand Name'}</h4>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest truncate">{formData.tagline || 'Tagline placeholder'}</p>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-3 leading-relaxed">
                    {formData.description || 'Your brand description will appear here as you type. It helps team members understand the core identity.'}
                  </p>
                  <div className="flex gap-1.5 pt-2">
                     <div className="h-4 w-4 rounded-full border border-white shadow-sm" style={{ backgroundColor: formData.color }} />
                     <div className="h-4 w-4 rounded-full border border-white shadow-sm" style={{ backgroundColor: formData.secondaryColor }} />
                  </div>
                </div>
             </Card>

             <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
                <div className="flex items-center gap-2 text-slate-500">
                   <Info className="h-3.5 w-3.5" />
                   <span className="text-[10px] font-bold uppercase">Dynamic Assets</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  The primary color will be used for task cards, project grouping, and chart segments across the entire Brivo suite.
                </p>
             </div>
          </div>
        </div>
      </Modal>

      <Modal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        title="Permanently remove brand?"
      >
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-red-50 border border-red-100 flex gap-3">
             <AlertTriangle className="h-5 w-5 text-red-500 shrink-0" />
             <div className="space-y-1">
               <p className="text-xs text-red-700 font-bold uppercase transition-widest tracking-widest">Critical Warning</p>
               <p className="text-xs text-red-700 leading-relaxed">
                 De-registering <span className="font-bold underline">{brandToDelete?.name}</span> will remove all associated metadata, social links, and the visual palette. This action is irreversible.
               </p>
             </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)} className="font-bold">Abort</Button>
            <Button 
              variant="secondary" 
              className="bg-red-500 hover:bg-red-600 text-white font-black" 
              loading={deleteBrand.isPending}
              onClick={() => {
                deleteBrand.mutate(brandToDelete._id, {
                  onSuccess: () => setIsDeleteModalOpen(false)
                });
              }}
            >
              Confirm Deletion
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
