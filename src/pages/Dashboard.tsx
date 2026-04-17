import React from 'react';
import { useTasks, useProjects, useBrands } from '../hooks/useApi';
import { Card, Badge } from '../components/ui';
import { cn } from '../lib/utils';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Briefcase,
  TrendingUp,
  Users,
  Activity
} from 'lucide-react';
import { motion } from 'motion/react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const chartData = [
  { name: 'Mon', tasks: 4 },
  { name: 'Tue', tasks: 7 },
  { name: 'Wed', tasks: 5 },
  { name: 'Thu', tasks: 12 },
  { name: 'Fri', tasks: 9 },
  { name: 'Sat', tasks: 3 },
  { name: 'Sun', tasks: 2 },
];

export default function Dashboard() {
  const { data: tasks, isLoading: tasksLoading } = useTasks();
  const { data: projects } = useProjects();
  const { data: brands } = useBrands();

  const stats = [
    { label: 'Total Tasks', value: tasks?.length || 0, icon: CheckCircle2, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'In Progress', value: tasks?.filter((t: any) => t.status === 'IN_PROGRESS').length || 0, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Completed', value: tasks?.filter((t: any) => t.status === 'COMPLETED').length || 0, icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Active Projects', value: projects?.filter((p: any) => p.status === 'ACTIVE').length || 0, icon: Briefcase, color: 'text-indigo-500', bg: 'bg-indigo-50' },
  ];

  if (tasksLoading) return <div className="flex h-64 items-center justify-center">Loading...</div>;

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                  <h3 className="mt-1 text-2xl font-bold text-slate-900">{stat.value}</h3>
                </div>
                <div className={cn("p-3 rounded-lg", stat.bg)}>
                  <stat.icon className={cn("h-6 w-6", stat.color)} />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <Card className="lg:col-span-2 p-6">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold leading-none mb-1">Weekly Activity</h3>
                <p className="text-xs text-slate-500">Tasks completion trend over the last 7 days.</p>
              </div>
            </div>
            <Badge variant="info">Real-time</Badge>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-slate-200" opacity={0.5} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 600, fill: '#94a3b8' }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 600, fill: '#94a3b8' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                    fontSize: '11px',
                    fontWeight: '700',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  }}
                  itemStyle={{ padding: '0' }}
                  cursor={{ stroke: '#3B82F6', strokeWidth: 2, strokeDasharray: '5 5' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="tasks" 
                  stroke="#3B82F6" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorTasks)"
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="mb-6 text-lg font-bold">Brands Performance</h3>
          <div className="space-y-6">
            {brands?.map((brand: any) => {
              const brandTasks = tasks?.filter((t: any) => t.brandId?._id === brand._id);
              const progress = brandTasks?.length ? (brandTasks.filter((t: any) => t.status === 'COMPLETED').length / brandTasks.length) * 100 : 0;
              return (
                <div key={brand._id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{brand.name}</span>
                    <span className="text-xs font-bold">{Math.round(progress)}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      className="h-full rounded-full" 
                      style={{ backgroundColor: brand.color }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-bold">Recent Activity</h3>
          <Badge variant="info">{tasks?.length} Total Tasks</Badge>
        </div>
        <div className="space-y-4">
          {tasks?.slice(0, 5).map((task: any) => (
            <div key={task._id} className="flex items-center justify-between rounded-xl border border-slate-50 p-4 bg-slate-50/50 hover:bg-white transition-all group">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-white shadow-sm border border-slate-100 font-bold text-lg group-hover:scale-110 transition-transform" style={{ color: task.brandId?.color }}>
                  {task.brandId?.name?.[0]}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{task.title}</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest">{task.projectId?.name} • {task.brandId?.name}</p>
                </div>
              </div>
              <Badge variant={task.status === 'COMPLETED' ? 'success' : task.status === 'IN_PROGRESS' ? 'warning' : 'default'} className="rounded-full px-3">
                {task.status.replace('_', ' ')}
              </Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
