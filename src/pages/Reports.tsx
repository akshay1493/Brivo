import React, { useState } from 'react';
import { useReports, useUsers, useGenerateReport } from '../hooks/useApi';
import { Button, Card, Badge } from '../components/ui';
import { 
  FileText, 
  Download, 
  RefreshCw, 
  User as UserIcon,
  Calendar as CalendarIcon,
  Search
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { cn, formatDate } from '../lib/utils';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { TrendingUp, Award, Zap, AlertTriangle } from 'lucide-react';

export default function Reports() {
  const [filters, setFilters] = useState({
    employeeId: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  });

  const { data: reports, isLoading } = useReports(filters);
  const { data: users } = useUsers();
  const generateReport = useGenerateReport();

  const handleGenerate = async () => {
    if (!filters.employeeId) return alert('Select an employee first');
    generateReport.mutate(filters);
  };

  const exportPDF = (report: any) => {
    const doc = new jsPDF();
    const margin = 20;
    let y = 30;

    doc.setFontSize(22);
    doc.text('Monthly Productivity Report', margin, y);
    y += 10;
    doc.setFontSize(12);
    doc.text(`Employee: ${report.employeeId?.name}`, margin, y);
    y += 6;
    doc.text(`Period: ${report.month}/${report.year}`, margin, y);
    y += 15;

    doc.setFont('helvetica', 'bold');
    doc.text('Performance Summary', margin, y);
    y += 10;
    doc.setFont('helvetica', 'normal');
    doc.text(`Total Assigned: ${report.totalAssigned}`, margin, y); y += 6;
    doc.text(`Total Completed: ${report.totalCompleted}`, margin, y); y += 6;
    doc.text(`In Progress: ${report.totalInProgress}`, margin, y); y += 6;
    doc.text(`Overdue: ${report.totalOverdue}`, margin, y); y += 6;
    doc.text(`Avg. Completion Time: ${report.averageCompletionTime.toFixed(1)} hrs`, margin, y); y += 6;
    doc.text(`Estimated vs Actual: ${report.estimatedHours}h / ${report.actualHours}h`, margin, y); y += 15;

    doc.setFont('helvetica', 'bold');
    doc.text('Brand Breakdown', margin, y);
    y += 10;
    doc.setFont('helvetica', 'normal');
    report.brandBreakdown.forEach((b: any) => {
      doc.text(`${b.brandName}: ${b.count} tasks`, margin, y);
      y += 6;
    });

    doc.save(`Report_${report.employeeId?.name}_${report.month}_${report.year}.pdf`);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold tracking-tight">Advanced Analytics</h2>
        <p className="text-sm text-slate-500">In-depth performance tracking and productivity insights.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-6 col-span-3 lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                <TrendingUp className="h-5 w-5" />
              </div>
              <h3 className="font-bold">Team Productivity Quotient</h3>
            </div>
            <Badge variant="success">Up 12% vs LY</Badge>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[
                { period: 'Jan', efficiency: 65 },
                { period: 'Feb', efficiency: 72 },
                { period: 'Mar', efficiency: 68 },
                { period: 'Apr', efficiency: 85 },
                { period: 'May', efficiency: 82 },
                { period: 'Jun', efficiency: 91 },
              ]}>
                <defs>
                  <linearGradient id="efficiencyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.3} />
                <XAxis dataKey="period" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="efficiency" 
                  stroke="#10b981" 
                  strokeWidth={3} 
                  fill="url(#efficiencyGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 flex flex-col items-center justify-center text-center bg-primary text-white ring-8 ring-primary/10">
          <Zap className="h-12 w-12 mb-4 text-emerald-300 animate-pulse" />
          <h3 className="text-xl font-bold mb-2">Brivo AI Insight</h3>
          <p className="text-sm opacity-80 leading-relaxed mb-6">
            Based on current task velocity, your team is expected to finish the "Summer Launch" project 4 days ahead of schedule.
          </p>
          <Button variant="secondary" className="w-full bg-white text-primary hover:bg-slate-50 border-none shadow-xl">
            View Forecast
          </Button>
        </Card>
      </div>

      <Card className="p-6">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6">Execution & Compliance</p>
        <div className="grid gap-6 sm:grid-cols-3">
          <InsightCard 
            icon={Award} 
            label="Top Performer" 
            value="Akshay K." 
            subValue="14 Tasks Completed" 
            color="text-emerald-500" 
            bg="bg-emerald-500/10"
          />
          <InsightCard 
            icon={Zap} 
            label="Velocity Rating" 
            value="Exceptional" 
            subValue="Avg. 1.2 Days/Task" 
            color="text-amber-500" 
            bg="bg-amber-500/10"
          />
          <InsightCard 
            icon={AlertTriangle} 
            label="SLA Risks" 
            value="3 Projects" 
            subValue="Approaching Deadline" 
            color="text-red-500" 
            bg="bg-red-500/10"
          />
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-8">
          <h3 className="font-bold">Team Breakdown</h3>
          <p className="text-xs text-slate-400">Monthly Snapshot</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-4 items-end mb-8">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-slate-500">Employee</label>
            <select 
              className="w-full rounded-lg border border-slate-200 p-2 text-sm"
              value={filters.employeeId}
              onChange={e => setFilters({ ...filters, employeeId: e.target.value })}
            >
              <option value="">Select Employee</option>
              {users?.map((u: any) => <option key={u._id} value={u._id}>{u.name}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-slate-500">Month</label>
            <select 
              className="w-full rounded-lg border border-slate-200 p-2 text-sm"
              value={filters.month}
              onChange={e => setFilters({ ...filters, month: Number(e.target.value) })}
            >
              {[1,2,3,4,5,6,7,8,9,10,11,12].map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-slate-500">Year</label>
            <select 
              className="w-full rounded-lg border border-slate-200 p-2 text-sm"
              value={filters.year}
              onChange={e => setFilters({ ...filters, year: Number(e.target.value) })}
            >
              {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <Button onClick={handleGenerate} loading={generateReport.isPending}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Generate / Refresh
          </Button>
        </div>
      </Card>

      <div className="space-y-4">
        {reports?.length === 0 && !isLoading && (
          <div className="py-12 text-center text-slate-500 bg-white rounded-xl border border-dashed border-slate-200">
            <FileText className="mx-auto h-12 w-12 opacity-20 mb-4" />
            <p>No reports found for this period. Click generate to create one.</p>
          </div>
        )}

        {reports?.map((report: any) => (
          <Card key={report._id} className="p-6">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                   <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xl">
                     {report.employeeId?.name?.[0]}
                   </div>
                   <div>
                     <h3 className="text-lg font-bold">{report.employeeId?.name}</h3>
                     <p className="text-sm text-slate-500">Report for {report.month}/{report.year}</p>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-x-12 gap-y-4 sm:grid-cols-3">
                  <StatItem label="Total Tasks" value={report.totalAssigned} />
                  <StatItem label="Completed" value={report.totalCompleted} />
                  <StatItem label="Overdue" value={report.totalOverdue} />
                  <StatItem label="Completion Time" value={`${report.averageCompletionTime.toFixed(1)}h`} />
                  <StatItem label="Actual Hours" value={`${report.actualHours}h`} />
                  <StatItem label="Brand Counts" value={report.brandBreakdown.length} />
                </div>
              </div>

              <Button variant="outline" onClick={() => exportPDF(report)}>
                <Download className="mr-2 h-4 w-4" />
                Export PDF
              </Button>
            </div>
            
            <div className="mt-8 pt-6 border-t border-slate-100">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Brand Breakdown</p>
              <div className="flex flex-wrap gap-2">
                {report.brandBreakdown.map((b: any) => (
                  <Badge key={b.brandId} variant="info" className="px-3 py-1">
                    {b.brandName}: {b.count}
                  </Badge>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function InsightCard({ icon: Icon, label, value, subValue, color, bg }: any) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
      <div className={cn("p-3 rounded-xl", bg)}>
        <Icon className={cn("h-6 w-6", color)} />
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</p>
        <p className="text-lg font-black text-slate-800">{value}</p>
        <p className="text-[10px] text-slate-500">{subValue}</p>
      </div>
    </div>
  );
}

function StatItem({ label, value }: { label: string, value: any }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</p>
      <p className="text-xl font-bold text-slate-800">{value}</p>
    </div>
  );
}
