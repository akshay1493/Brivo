import React, { useState } from 'react';
import { useAuthStore } from '../store/store';
import { Card, Button } from '../components/ui';
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
  Settings as SettingsIcon,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { BrandManagement } from '../components/BrandManagement';

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
                  <h4 className="font-bold text-slate-900">Regional Format</h4>
                  <p className="text-xs text-slate-500">Set your preferred date and currency formats.</p>
                </div>
                <select className="rounded-lg border border-slate-200 p-2 text-xs">
                   <option>United States (USD)</option>
                   <option>United Kingdom (GBP)</option>
                </select>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900">Email Notifications</h4>
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
                <h4 className="font-bold text-slate-900">Connect External Tools</h4>
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
                <h4 className="font-bold text-slate-900">Custom Task Statuses</h4>
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
                <h4 className="font-bold text-slate-900">Automated Workflows</h4>
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
          <p className="text-sm font-bold text-slate-900">{name}</p>
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
        <span className="text-sm font-bold text-slate-900">{name}</span>
      </div>
      <div className="flex gap-2">
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-slate-400">
          <SettingsIcon className="h-3 w-3" />
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
        className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-primary/20 text-slate-900"
      />
    </div>
  );
}
