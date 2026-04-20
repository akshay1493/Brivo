import React, { useState } from 'react';
import { useTasks, useBrands, useProjects, useUsers, useUpdateTask, useCreateTask, useCreateBrand } from '../hooks/useApi';
import { Button, Card, Badge } from '../components/ui';
import { Modal } from '../components/Modal';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  LayoutGrid, 
  List as ListIcon,
  Clock,
  User as UserIcon,
  Tag,
  ArrowRight
} from 'lucide-react';
import { cn, formatDate } from '../lib/utils';
import { useAuthStore } from '../store/store';
import { useNavigate } from 'react-router-dom';

import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const TypedDraggable = Draggable as any;
const TypedDroppable = Droppable as any;

export default function Tasks() {
  const navigate = useNavigate();
  const [view, setView] = useState<'list' | 'kanban'>('list');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [comments, setComments] = useState<any[]>([
    { id: 1, user: 'Akshay K', text: 'Working on the final renders now.', time: '2h ago' },
    { id: 2, user: 'Admin User', text: 'Great, let me know if you need the high-res logos.', time: '1h ago' }
  ]);
  const [newComment, setNewComment] = useState('');
  
  const { data: tasks, isLoading } = useTasks();
  const { data: brands } = useBrands();
  const { data: projects } = useProjects();
  const { data: users } = useUsers();
  const updateTask = useUpdateTask();
  const { user } = useAuthStore();

  const handleStatusChange = (taskId: string, newStatus: string) => {
    updateTask.mutate({ id: taskId, data: { status: newStatus } });
  };

  const openDetails = (task: any) => {
    setSelectedTask(task);
    setIsDetailsOpen(true);
  };

  const onDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    handleStatusChange(draggableId, destination.droppableId);
  };

  if (isLoading) return <div className="p-8 text-center text-slate-500">Loading tasks...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 rounded-lg bg-white p-1 shadow-sm border border-slate-200">
          <Button 
            variant={view === 'list' ? 'secondary' : 'ghost'} 
            size="sm" 
            onClick={() => setView('list')}
          >
            <ListIcon className="mr-2 h-4 w-4" />
            List
          </Button>
          <Button 
            variant={view === 'kanban' ? 'secondary' : 'ghost'} 
            size="sm" 
            onClick={() => setView('kanban')}
          >
            <LayoutGrid className="mr-2 h-4 w-4" />
            Board
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {user?.role !== 'EMPLOYEE' && (
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Task
            </Button>
          )}
        </div>
      </div>

      {view === 'list' ? (
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-100 bg-slate-50/50 text-slate-500">
                <tr>
                  <th className="px-6 py-4 font-medium uppercase tracking-wider text-[10px]">Task</th>
                  <th className="px-6 py-4 font-medium uppercase tracking-wider text-[10px]">Brand</th>
                  <th className="px-6 py-4 font-medium uppercase tracking-wider text-[10px]">Assignee</th>
                  <th className="px-6 py-4 font-medium uppercase tracking-wider text-[10px]">Due Date</th>
                  <th className="px-6 py-4 font-medium uppercase tracking-wider text-[10px]">Status</th>
                  <th className="px-6 py-4 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tasks?.map((task: any) => (
                  <tr key={task._id} className="group hover:bg-white transition-all border-l-2 border-transparent hover:border-primary">
                    <td className="px-6 py-4" onClick={() => openDetails(task)}>
                      <div className="cursor-pointer group/task">
                        <p className="font-bold text-slate-900 capitalize group-hover/task:text-primary transition-colors">{task.title}</p>
                        <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                          {task.projectId?.name} <ArrowRight className="h-2 w-2 opacity-0 group-hover/task:opacity-100 transition-opacity" />
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div 
                        className="flex items-center gap-2 cursor-pointer hover:underline text-slate-600 group/brand"
                        onClick={() => navigate('/brands')}
                      >
                        <div className="h-2 w-2 rounded-full shadow-sm" style={{ backgroundColor: task.brandId?.color }} />
                        <span className="text-xs group-hover/brand:text-slate-900">{task.brandId?.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div 
                        className="flex items-center gap-2 cursor-pointer group/user"
                        onClick={() => navigate('/team')}
                      >
                        <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold border border-primary/20 group-hover/user:scale-110 transition-transform">
                          {task.assignedTo?.name?.[0]}
                        </div>
                        <span className="text-xs group-hover/user:text-primary transition-colors">{task.assignedTo?.name || 'Unassigned'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-[10px] font-medium text-slate-500">
                        <Clock className="h-3 w-3 text-slate-400" />
                        {task.dueDate ? formatDate(task.dueDate) : 'No deadline'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select 
                        className="bg-slate-100 px-2 py-1 rounded-md text-[10px] font-bold focus:outline-none border-none shadow-sm cursor-pointer"
                        value={task.status}
                        onChange={(e) => handleStatusChange(task._id, e.target.value)}
                      >
                        <option value="TODO">To Do</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="REVIEW">Review</option>
                        <option value="COMPLETED">Completed</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {['TODO', 'IN_PROGRESS', 'REVIEW', 'COMPLETED'].map(status => (
              <div key={status} className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{status.replace('_', ' ')}</h3>
                  <Badge variant="default" className="text-[10px] rounded-full px-2 bg-slate-200 text-slate-700">{tasks?.filter((t: any) => t.status === status).length}</Badge>
                </div>
                <TypedDroppable droppableId={status}>
                  {(provided: any, snapshot: any) => (
                    <div 
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={cn(
                        "space-y-4 min-h-[400px] rounded-2xl transition-all duration-300 p-2",
                        snapshot.isDraggingOver ? "bg-slate-100" : "bg-slate-50"
                      )}
                    >
                      {tasks?.filter((t: any) => t.status === status).map((task: any, index: number) => (
                        <TypedDraggable key={task._id} draggableId={task._id} index={index}>
                          {(provided: any, snapshot: any) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <Card 
                                onClick={() => openDetails(task)}
                                className={cn(
                                  "p-5 border-l-4 transition-all relative group/card cursor-pointer",
                                  snapshot.isDragging ? "shadow-2xl scale-105 rotate-2 z-50 border-primary ring-4 ring-primary/10" : ""
                                )}
                                style={{ borderLeftColor: task.brandId?.color }}
                              >
                                <div className="mb-3 flex items-center justify-between">
                                  <span 
                                    className="text-[9px] font-bold text-slate-400 uppercase tracking-widest cursor-pointer hover:text-primary transition-colors"
                                    onClick={(e) => { e.stopPropagation(); navigate('/brands'); }}
                                  >
                                    {task.brandId?.name}
                                  </span>
                                  <PriorityBadge priority={task.priority} />
                                </div>
                                <p 
                                  className="mb-4 text-sm font-bold text-slate-900 leading-tight cursor-pointer hover:text-primary transition-colors"
                                  onClick={() => navigate('/projects')}
                                >
                                  {task.title}
                                </p>
                                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                  <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-500">
                                     <Clock className="h-3 w-3 text-slate-400" />
                                     {task.dueDate && formatDate(task.dueDate)}
                                  </div>
                                  <div 
                                    className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center text-[9px] font-black border-2 border-white shadow-sm cursor-pointer hover:scale-110 transition-transform"
                                    onClick={(e) => { e.stopPropagation(); navigate('/team'); }}
                                  >
                                    {task.assignedTo?.name?.[0]}
                                  </div>
                                </div>
                              </Card>
                            </div>
                          )}
                        </TypedDraggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </TypedDroppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Task">
        <TaskForm brands={brands} projects={projects} users={users} onClose={() => setIsModalOpen(false)} />
      </Modal>

      <Modal isOpen={isDetailsOpen} onClose={() => setIsDetailsOpen(false)} title="Task Details">
        {selectedTask && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
               <div className="flex items-center gap-2">
                 <Badge variant="info" className="uppercase tracking-widest text-[10px]">{selectedTask.brandId?.name}</Badge>
                 <Badge variant="default" className="text-[10px]">{selectedTask.projectId?.name}</Badge>
               </div>
               <Badge variant={selectedTask.status === 'COMPLETED' ? 'success' : 'warning'}>{selectedTask.status.replace('_', ' ')}</Badge>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold">{selectedTask.title}</h3>
              <p className="text-sm text-slate-500">Assignee: <span className="font-bold text-slate-900">{selectedTask.assignedTo?.name}</span></p>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">Activity & Comments</h4>
              <div className="space-y-4 max-h-48 overflow-y-auto pr-2">
                {comments.map(comment => (
                  <div key={comment.id} className="flex gap-3">
                    <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-[10px] shrink-0">
                      {comment.user[0]}
                    </div>
                    <div className="flex-1 rounded-xl bg-slate-50 p-3 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold">{comment.user}</span>
                        <span className="text-[10px] text-slate-400">{comment.time}</span>
                      </div>
                      <p className="text-xs">{comment.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-2">
                 <input 
                   type="text" 
                   placeholder="Write a comment..."
                   className="flex-1 rounded-xl border border-slate-200 p-2 text-xs focus:ring-2 focus:ring-primary/20"
                   value={newComment}
                   onChange={e => setNewComment(e.target.value)}
                   onKeyDown={e => {
                     if (e.key === 'Enter' && newComment) {
                       setComments([...comments, { id: Date.now(), user: user?.name || 'Me', text: newComment, time: 'Just now' }]);
                       setNewComment('');
                     }
                   }}
                 />
                 <Button size="sm" onClick={() => {
                   if (newComment) {
                     setComments([...comments, { id: Date.now(), user: user?.name || 'Me', text: newComment, time: 'Just now' }]);
                     setNewComment('');
                   }
                 }}>
                   Send
                 </Button>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
               <Button variant="ghost" className="text-xs" onClick={() => setIsDetailsOpen(false)}>Close</Button>
               <Button variant="outline" className="text-xs">Schedule Meeting</Button>
               <Button className="text-xs font-bold">Mark as Compete</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export function PriorityBadge({ priority }: { priority: string }) {
  const variants: any = {
    LOW: 'default',
    MEDIUM: 'info',
    HIGH: 'warning',
    URGENT: 'danger',
  };
  return <Badge variant={variants[priority] || 'default'} className="text-[9px] px-1 py-0">{priority}</Badge>;
}

export function TaskForm({ brands, projects, users, onClose, initialData }: any) {
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const createBrand = useCreateBrand();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    brandId: brands?.[0]?._id || '',
    projectId: projects?.[0]?._id || '',
    assignedTo: users?.[0]?._id || '',
    dueDate: '',
    priority: 'MEDIUM',
    ...initialData
  });

  const [isCreatingBrand, setIsCreatingBrand] = useState(false);
  const [newBrandName, setNewBrandName] = useState('');
  const [newBrandColor, setNewBrandColor] = useState('#6366f1');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let brandId = formData.brandId;
    
    if (isCreatingBrand) {
      const brand = await createBrand.mutateAsync({ name: newBrandName, color: newBrandColor });
      brandId = brand._id;
    }

    if (initialData?._id) {
      updateTask.mutate({ id: initialData._id, data: { ...formData, brandId } }, {
        onSuccess: () => {
          onClose();
        }
      });
    } else {
      createTask.mutate({ ...formData, brandId }, {
        onSuccess: () => {
          onClose();
        }
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2 space-y-2">
          <label className="text-xs font-bold uppercase text-slate-500">Task Title</label>
          <input 
            type="text" 
            required 
            className="w-full rounded-lg border border-slate-200 p-2 text-sm"
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
          />
        </div>

        <div className="sm:col-span-2 space-y-4 rounded-xl bg-slate-50 p-4">
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
              value={formData.brandId}
              onChange={e => setFormData({ ...formData, brandId: e.target.value })}
            >
              {brands?.map((b: any) => <option key={b._id} value={b._id}>{b.name}</option>)}
            </select>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-slate-500">Project</label>
          <select 
            className="w-full rounded-lg border border-slate-200 p-2 text-sm"
            value={formData.projectId}
            onChange={e => setFormData({ ...formData, projectId: e.target.value })}
          >
            {projects?.map((p: any) => <option key={p._id} value={p._id}>{p.name}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-slate-500">Assign To</label>
          <select 
            className="w-full rounded-lg border border-slate-200 p-2 text-sm"
            value={formData.assignedTo}
            onChange={e => setFormData({ ...formData, assignedTo: e.target.value })}
          >
            {users?.map((u: any) => <option key={u._id} value={u._id}>{u.name}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-slate-500">Due Date</label>
          <input 
            type="date" 
            className="w-full rounded-lg border border-slate-200 p-2 text-sm"
            value={formData.dueDate}
            onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
          />
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-4">
        <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
        <Button type="submit">Create Task</Button>
      </div>
    </form>
  );
}
