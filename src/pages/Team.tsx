import React, { useState } from 'react';
import { useUsers, useUpdateUser } from '../hooks/useApi';
import { Card, Badge, Button } from '../components/ui';
import { Mail, Phone, Shield, UserPlus, Pencil } from 'lucide-react';
import { Modal } from '../components/Modal';

export default function Team() {
  const { data: users, isLoading } = useUsers();
  const updateUser = useUpdateUser();
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [inviteData, setInviteData] = useState({ name: '', email: '', role: 'MEMBER' });
  const [editData, setEditData] = useState({ name: '', email: '', role: 'MEMBER' });

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Invite sent to ${inviteData.email}`);
    setIsInviteModalOpen(false);
    setInviteData({ name: '', email: '', role: 'MEMBER' });
  };

  const openEditModal = (user: any) => {
    setEditingUser(user);
    setEditData({ name: user.name, email: user.email, role: user.role });
    setIsEditModalOpen(true);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      updateUser.mutate({ id: editingUser._id, data: editData }, {
        onSuccess: () => {
          setIsEditModalOpen(false);
          setEditingUser(null);
        }
      });
    }
  };

  if (isLoading) return <div className="p-8 text-center text-slate-500">Loading team...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
         <p className="text-sm text-slate-500">View and manage your organization's team members.</p>
         <Button onClick={() => setIsInviteModalOpen(true)}>
           <UserPlus className="mr-2 h-4 w-4" />
           Invite Member
         </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {users?.map((user: any) => (
          <Card key={user._id} className="p-6 relative overflow-hidden group hover:shadow-xl transition-all border-white/20">
            <div className="absolute top-0 right-0 p-4 flex gap-2">
               <button 
                 onClick={() => openEditModal(user)}
                 className="p-1.5 rounded-full bg-white/50 hover:bg-white opacity-0 group-hover:opacity-100 transition-all border border-transparent hover:border-primary/20"
               >
                 <Pencil className="h-3 w-3 text-slate-600" />
               </button>
               <Badge variant={user.role === 'ADMIN' ? 'danger' : user.role === 'MANAGER' ? 'info' : 'default'} className="rounded-full px-3">
                 {user.role}
               </Badge>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-slate-100 to-white border-4 border-white flex items-center justify-center text-2xl font-bold shadow-inner group-hover:scale-110 transition-transform">
                {user.name[0]}
              </div>
              <div>
                <h3 className="text-lg font-bold">{user.name}</h3>
                <p className="text-xs text-slate-500 font-mono italic">{user.email}</p>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-50">
               <div className="flex items-center gap-3 text-[11px] text-slate-500">
                 <Mail className="h-3.5 w-3.5 text-primary" />
                 {user.email}
               </div>
               <div className="flex items-center gap-3 text-[11px] text-slate-500">
                 <Shield className="h-3.5 w-3.5 text-primary" />
                 Permissions: <span className="font-bold text-slate-700">
                   {user.role === 'ADMIN' ? 'Owner/Full Access' : user.role === 'MANAGER' ? 'Admin Access' : 'Limited Access'}
                 </span>
               </div>
               
               <div className="flex gap-2 pt-2">
                 <Button variant="ghost" size="sm" className="flex-1 text-[10px] uppercase font-bold bg-slate-50" onClick={() => openEditModal(user)}>Edit Profile</Button>
                 <Button variant="ghost" size="sm" className="flex-1 text-[10px] uppercase font-bold bg-slate-50">Message</Button>
               </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal isOpen={isInviteModalOpen} onClose={() => setIsInviteModalOpen(false)} title="Invite Team Member">
        <form onSubmit={handleInvite} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-slate-500">Full Name</label>
            <input 
              type="text" 
              required
              className="w-full rounded-xl border border-slate-200 p-3 text-sm" 
              value={inviteData.name}
              onChange={e => setInviteData({ ...inviteData, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-slate-500">Email Address</label>
            <input 
              type="email" 
              required
              className="w-full rounded-xl border border-slate-200 p-3 text-sm" 
              value={inviteData.email}
              onChange={e => setInviteData({ ...inviteData, email: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-slate-500">Role</label>
            <select 
              className="w-full rounded-xl border border-slate-200 p-3 text-sm" 
              value={inviteData.role}
              onChange={e => setInviteData({ ...inviteData, role: e.target.value })}
            >
              <option value="MEMBER">Member</option>
              <option value="MANAGER">Manager</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-6">
            <Button variant="ghost" type="button" onClick={() => setIsInviteModalOpen(false)}>Cancel</Button>
            <Button type="submit" className="px-8 font-bold">Send Invitation</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Team Member Profile">
        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-slate-500">Full Name</label>
            <input 
              type="text" 
              required
              className="w-full rounded-xl border border-slate-200 p-3 text-sm" 
              value={editData.name}
              onChange={e => setEditData({ ...editData, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-slate-500">Email Address</label>
            <input 
              type="email" 
              required
              className="w-full rounded-xl border border-slate-200 p-3 text-sm" 
              value={editData.email}
              onChange={e => setEditData({ ...editData, email: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-slate-500">Role</label>
            <select 
              className="w-full rounded-xl border border-slate-200 p-3 text-sm" 
              value={editData.role}
              onChange={e => setEditData({ ...editData, role: e.target.value })}
            >
              <option value="MEMBER">Member</option>
              <option value="MANAGER">Manager</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-6">
            <Button variant="ghost" type="button" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            <Button type="submit" className="px-8 font-bold" loading={updateUser.isPending}>Save Changes</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
