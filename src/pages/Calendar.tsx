import React, { useState } from 'react';
import { useTasks, useDeleteTask, useBrands, useProjects, useUsers } from '../hooks/useApi';
import { Card, Button, Badge } from '../components/ui';
import { Modal } from '../components/Modal';
import { TaskForm, PriorityBadge } from './Tasks';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus,
  Clock,
  Briefcase,
  Pencil,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'MONTH' | 'LIST'>('MONTH');
  const { data: tasks } = useTasks();
  const { data: brands } = useBrands();
  const { data: projects } = useProjects();
  const { data: users } = useUsers();
  const deleteTask = useDeleteTask();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');

  const handleAddEvent = (date?: string) => {
    setSelectedDate(date || new Date().toISOString().split('T')[0]);
    setIsCreateModalOpen(true);
  };

  const handleDelete = (task: any) => {
    setSelectedTask(task);
    setIsDeleteModalOpen(true);
  };

  const handleEdit = (task: any) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedTask) {
      deleteTask.mutate(selectedTask._id, {
        onSuccess: () => setIsDeleteModalOpen(false)
      });
    }
  };

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const totalDays = daysInMonth(year, month);
  const startDay = firstDayOfMonth(year, month);

  const days = [];
  // Padding for start of month
  for (let i = 0; i < startDay; i++) {
    days.push(null);
  }
  // Month days
  for (let i = 1; i <= totalDays; i++) {
    days.push(i);
  }

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const getTasksForDay = (day: number) => {
    if (!tasks) return [];
    return tasks.filter(t => {
      if (!t.dueDate) return false;
      const d = new Date(t.dueDate);
      return d.getDate() === day && d.getMonth() === month && d.getFullYear() === year;
    });
  };

  const allMonthTasks = tasks?.filter(t => {
    if (!t.dueDate) return false;
    const d = new Date(t.dueDate);
    return d.getMonth() === month && d.getFullYear() === year;
  }).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{monthNames[month]} {year}</h2>
          <p className="text-sm text-slate-500">Track task deadlines across all brands.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-white rounded-xl p-1 border border-slate-200 shadow-sm">
            <Button 
              variant={view === 'MONTH' ? 'primary' : 'ghost'} 
              size="sm" 
              className="h-8 rounded-lg text-xs"
              onClick={() => setView('MONTH')}
            >
              Month
            </Button>
            <Button 
              variant={view === 'LIST' ? 'primary' : 'ghost'} 
              size="sm" 
              className="h-8 rounded-lg text-xs"
              onClick={() => setView('LIST')}
            >
              Agenda
            </Button>
          </div>
          <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
            <Button variant="ghost" size="icon" onClick={prevMonth} className="h-8 w-8"><ChevronLeft className="h-4 w-4" /></Button>
            <Button variant="ghost" size="sm" onClick={() => setCurrentDate(new Date())} className="text-xs">Today</Button>
            <Button variant="ghost" size="icon" onClick={nextMonth} className="h-8 w-8"><ChevronRight className="h-4 w-4" /></Button>
          </div>
          <Button onClick={() => handleAddEvent()}>
            <Plus className="mr-2 h-4 w-4" />
            Add Event
          </Button>
        </div>
      </div>

      {view === 'MONTH' ? (
        <Card className="p-0 overflow-hidden shadow-2xl">
          <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/50">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="py-3 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7">
            {days.map((day, idx) => {
              const dayTasks = day ? getTasksForDay(day) : [];
              const isToday = day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();

              return (
                <div 
                  key={idx} 
                  className={cn(
                    "min-h-[140px] border-r border-b border-slate-100 p-2 transition-colors cursor-pointer group/cell",
                    day ? "hover:bg-slate-50/50" : "bg-slate-50/30",
                    (idx + 1) % 7 === 0 && "border-r-0"
                  )}
                  onClick={() => {
                    if (day) {
                      const d = new Date(year, month, day);
                      d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
                      handleAddEvent(d.toISOString().split('T')[0]);
                    }
                  }}
                >
                  {day && (
                    <div className="flex flex-col h-full">
                      <div className="flex items-center justify-between mb-2">
                        <span className={cn(
                          "inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition-colors",
                          isToday ? "bg-primary text-white" : "text-slate-500"
                        )}>
                          {day}
                        </span>
                        <div className="opacity-0 group-hover/cell:opacity-100 transition-opacity">
                          <Plus className="h-3 w-3 text-primary" />
                        </div>
                      </div>
                      <div className="space-y-1.5 overflow-y-auto max-h-[100px] scrollbar-hide">
                        {dayTasks.map((task: any) => (
                          <div 
                            key={task._id} 
                            className="group/task relative flex flex-col p-2 rounded-lg border border-slate-100 bg-white shadow-sm transition-all hover:-translate-y-0.5"
                            style={{ borderLeft: `3px solid ${task.brandId?.color || '#ccc'}` }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(task);
                            }}
                          >
                            <span className="text-[9px] font-bold text-slate-400 uppercase truncate">{task.brandId?.name}</span>
                            <span className="text-[10px] font-bold text-slate-900 line-clamp-2 leading-tight">{task.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Personalized Agenda</h3>
            <p className="text-[10px] text-slate-500 italic">Customize your schedule for {monthNames[month]}</p>
          </div>
          {allMonthTasks?.map((task: any) => (
            <Card key={task._id} className="p-4 flex items-center justify-between group hover:border-primary transition-all hover:shadow-md">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center min-w-[60px]">
                  <p className="text-[10px] uppercase font-bold text-slate-400">{new Date(task.dueDate).toLocaleDateString('en-US', { weekday: 'short' })}</p>
                  <p className="text-xl font-bold leading-none mt-1">{new Date(task.dueDate).getDate()}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: task.brandId?.color }}>{task.brandId?.name}</span>
                    <PriorityBadge priority={task.priority} />
                  </div>
                  <h4 className="font-bold text-slate-900 group-hover:text-primary transition-colors">{task.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="default" className="text-[10px]">{task.projectId?.name}</Badge>
                    <span className="text-[11px] text-slate-500">•</span>
                    <span className="text-[11px] text-slate-400">Assigned to {task.assignedTo?.name}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(task)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(task)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <div className="h-10 w-1 rounded-full" style={{ backgroundColor: task.brandId?.color }} />
              </div>
            </Card>
          ))}
          {allMonthTasks?.length === 0 && (
            <div className="py-20 text-center text-slate-500 glass rounded-2xl border-dashed border-2 border-slate-200">
               <Clock className="mx-auto h-12 w-12 opacity-20 mb-4" />
               <p>No tasks scheduled for this month.</p>
            </div>
          )}
        </div>
      ) }

      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create New Scheduled Task">
        <TaskForm 
          brands={brands} 
          projects={projects} 
          users={users} 
          onClose={() => setIsCreateModalOpen(false)} 
          initialData={{
             dueDate: selectedDate,
             priority: 'MEDIUM',
             title: ''
          }}
        />
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Customize Event Details">
        {selectedTask && (
          <TaskForm 
            brands={brands} 
            projects={projects} 
            users={users} 
            onClose={() => setIsEditModalOpen(false)} 
            initialData={{
              ...selectedTask,
              brandId: selectedTask.brandId?._id || selectedTask.brandId,
              projectId: selectedTask.projectId?._id || selectedTask.projectId,
              assignedTo: selectedTask.assignedTo?._id || selectedTask.assignedTo,
              dueDate: selectedTask.dueDate ? new Date(selectedTask.dueDate).toISOString().split('T')[0] : ''
            }}
          />
        )}
      </Modal>

      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Remove Agenda Item?">
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-red-50 border border-red-100 flex gap-3">
             <AlertTriangle className="h-5 w-5 text-red-500 shrink-0" />
             <p className="text-xs text-red-700 leading-relaxed">
               You are about to remove <span className="font-bold">{selectedTask?.title}</span> from the schedule. This action will permanently delete the task.
             </p>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
            <Button 
              variant="secondary" 
              className="bg-red-500 hover:bg-red-600 text-white" 
              loading={deleteTask.isPending}
              onClick={confirmDelete}
            >
              Delete Task
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
