import React, { useState } from 'react';
import { useProjects, useBrands, useCreateProject, useUpdateProject, useDeleteProject, useCreateBrand } from '../hooks/useApi';
import { Button, Card, Badge } from '../components/ui';
import { Plus, MoreVertical, ExternalLink, Pencil, Trash2 } from 'lucide-react';
import { Modal } from '../components/Modal';

export default function Projects() {
  const { data: projects, isLoading } = useProjects();
  const { data: brands } = useBrands();
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();
  const createBrand = useCreateBrand();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [projectName, setProjectName] = useState('');
  const [projectBrand, setProjectBrand] = useState('');
  const [projectProgress, setProjectProgress] = useState(0);
  
  const [isCreatingBrand, setIsCreatingBrand] = useState(false);
  const [newBrandName, setNewBrandName] = useState('');
  const [newBrandColor, setNewBrandColor] = useState('#6366f1');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let brandId = projectBrand;
    
    if (isCreatingBrand) {
      const brand = await createBrand.mutateAsync({ name: newBrandName, color: newBrandColor });
      brandId = brand._id;
    }
    
    if (editingProject) {
      updateProject.mutate({
        id: editingProject._id,
        data: {
          name: projectName,
          brandId: brandId || brands?.[0]?._id,
          progress: projectProgress
        }
      }, {
        onSuccess: () => {
          handleClose();
        }
      });
    } else {
      createProject.mutate({ 
        name: projectName, 
        brandId: brandId || brands?.[0]?._id 
      }, {
        onSuccess: () => {
          handleClose();
        }
      });
    }
  };

  const handleEdit = (project: any) => {
    setEditingProject(project);
    setProjectName(project.name);
    setProjectBrand(project.brandId?._id || project.brandId);
    setProjectProgress(project.progress || 0);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteProject.mutate(deleteId);
      setIsDeleteModalOpen(false);
      setDeleteId(null);
    }
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingProject(null);
    setProjectName('');
    setProjectBrand('');
    setProjectProgress(0);
    setIsCreatingBrand(false);
    setNewBrandName('');
  };

  if (isLoading) return <div className="p-8 text-center text-slate-500">Loading projects...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">Organize your workflow into distinct projects.</p>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects?.map((project: any) => (
          <Card key={project._id} className="group overflow-hidden">
            <div className="h-2 w-full" style={{ backgroundColor: project.brandId?.color }} />
            <div className="p-6">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <Badge variant="default" className="mb-2 text-[9px] uppercase tracking-wider">{project.brandId?.name}</Badge>
                  <h3 className="text-lg font-bold">{project.name}</h3>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(project)} className="h-8 w-8">
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(project._id)} className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-500">Progress</span>
                    <span>{project.progress || 0}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500" 
                      style={{ width: `${project.progress || 0}%`, backgroundColor: project.brandId?.color }} 
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-7 w-7 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold">
                        U{i}
                      </div>
                    ))}
                  </div>
                  <Button variant="ghost" size="sm" className="h-7 text-[10px] uppercase font-bold tracking-widest">
                    Open <ExternalLink className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={handleClose} 
        title={editingProject ? "Edit Project" : "Create New Project"}
      >
         <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-slate-500">Project Name</label>
            <input 
              type="text" 
              required
              className="w-full rounded-lg border border-slate-200 p-2 text-sm" 
              placeholder="e.g. Q2 Marketing Campaign" 
              value={projectName}
              onChange={e => setProjectName(e.target.value)}
            />
          </div>

          {editingProject && (
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-500">Progress ({projectProgress}%)</label>
              <input 
                type="range" 
                min="0" 
                max="100"
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                value={projectProgress}
                onChange={e => setProjectProgress(Number(e.target.value))}
              />
            </div>
          )}

          <div className="space-y-4 rounded-xl bg-slate-50 p-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase text-slate-500">Brand Selection</label>
              <button 
                type="button"
                onClick={() => setIsCreatingBrand(!isCreatingBrand)}
                className="text-[10px] font-bold text-primary uppercase hover:underline"
              >
                {isCreatingBrand ? "Select Existing" : "Create New Brand Instead"}
              </button>
            </div>

            {isCreatingBrand ? (
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-slate-400">Brand Name</label>
                  <input 
                    type="text"
                    required
                    className="w-full rounded-lg border border-slate-200 p-2 text-sm" 
                    placeholder="e.g. Nike"
                    value={newBrandName}
                    onChange={e => setNewBrandName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-slate-400">Brand Color</label>
                  <input 
                    type="color"
                    className="h-9 w-full rounded-lg border border-slate-200 p-1" 
                    value={newBrandColor}
                    onChange={e => setNewBrandColor(e.target.value)}
                  />
                </div>
              </div>
            ) : (
              <select 
                className="w-full rounded-lg border border-slate-200 p-2 text-sm"
                value={projectBrand}
                onChange={e => setProjectBrand(e.target.value)}
              >
                <option value="">Select Brand</option>
                {brands?.map((b: any) => <option key={b._id} value={b._id}>{b.name}</option>)}
              </select>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" type="button" onClick={handleClose}>Cancel</Button>
            <Button type="submit" loading={createProject.isPending || updateProject.isPending || createBrand.isPending}>
              {editingProject ? "Update Project" : "Create Project"}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        title="Delete Project"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-500">
            Are you sure you want to delete this project? All associated tasks will remain but the project link will be removed. This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
            <Button variant="secondary" className="bg-red-500 hover:bg-red-600 text-white" onClick={confirmDelete} loading={deleteProject.isPending}>
              Delete Project
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
