import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MOCK_TASKS, MOCK_PROJECTS, MOCK_BRANDS, MOCK_USERS, MOCK_REPORTS, MOCK_NOTIFICATIONS } from '../lib/mockData';

// Simulated delay to mimic API latency
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export function useNotifications() {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      await delay(300);
      return MOCK_NOTIFICATIONS;
    },
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await delay(200);
      const n = MOCK_NOTIFICATIONS.find(not => not._id === id);
      if (n) n.read = true;
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });
}

export function useGlobalSearch(query: string) {
  return useQuery({
    queryKey: ['search', query],
    queryFn: async () => {
      if (!query || query.length < 2) return { projects: [], tasks: [], brands: [], users: [] };
      await delay(300);
      const q = query.toLowerCase();
      return {
        projects: MOCK_PROJECTS.filter(p => p.name.toLowerCase().includes(q)),
        tasks: MOCK_TASKS.filter(t => t.title.toLowerCase().includes(q)),
        brands: MOCK_BRANDS.filter(b => b.name.toLowerCase().includes(q)),
        users: MOCK_USERS.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)),
      };
    },
    enabled: query.length >= 2,
  });
}

export function useCreateBrand() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      await delay(600);
      const newBrand = {
        _id: `b${MOCK_BRANDS.length + 1}`,
        ...data,
      };
      MOCK_BRANDS.push(newBrand);
      return newBrand;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
    }
  });
}

export function useTasks(filters?: any) {
  return useQuery({
    queryKey: ['tasks', filters],
    queryFn: async () => {
      await delay(400);
      // Denormalize for the UI
      return MOCK_TASKS.map((task: any) => ({
        ...task,
        brandId: typeof task.brandId === 'string' ? MOCK_BRANDS.find(b => b._id === task.brandId) : task.brandId,
        projectId: typeof task.projectId === 'string' ? MOCK_PROJECTS.find(p => p._id === task.projectId) : task.projectId,
        assignedTo: typeof task.assignedTo === 'string' ? MOCK_USERS.find(u => u._id === task.assignedTo) : task.assignedTo,
      }));
    },
  });
}

export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      await delay(300);
      // Denormalize for the UI
      return MOCK_PROJECTS.map((proj: any) => ({
        ...proj,
        brandId: typeof proj.brandId === 'string' ? MOCK_BRANDS.find(b => b._id === proj.brandId) : proj.brandId
      }));
    },
  });
}

export function useBrands() {
  return useQuery({
    queryKey: ['brands'],
    queryFn: async () => {
      await delay(300);
      return MOCK_BRANDS;
    },
  });
}

export function useReports(filters: any) {
  return useQuery({
    queryKey: ['reports', filters],
    queryFn: async () => {
      await delay(500);
      return MOCK_REPORTS;
    },
  });
}

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      await delay(200);
      return MOCK_USERS;
    },
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      await delay(600);
      const newTask = {
        _id: `t${MOCK_TASKS.length + 1}`,
        ...data,
        createdAt: new Date().toISOString(),
      };
      MOCK_TASKS.unshift(newTask as any);
      return newTask;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      await delay(600);
      const newProject = {
        _id: `p${MOCK_PROJECTS.length + 1}`,
        ...data,
        progress: 0,
        status: 'ACTIVE'
      };
      MOCK_PROJECTS.push(newProject);
      return newProject;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    }
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string, data: any }) => {
      await delay(400);
      const taskIndex = MOCK_TASKS.findIndex(t => t._id === id);
      if (taskIndex !== -1) {
        MOCK_TASKS[taskIndex] = { ...MOCK_TASKS[taskIndex], ...data };
      }
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
  });
}

export function useGenerateReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      await delay(800);
      const user = MOCK_USERS.find(u => u._id === data.employeeId);
      const newReport = {
        _id: `r${MOCK_REPORTS.length + 1}`,
        employeeId: user || MOCK_USERS[0],
        month: data.month,
        year: data.year,
        totalAssigned: Math.floor(Math.random() * 20) + 10,
        totalCompleted: Math.floor(Math.random() * 10) + 5,
        totalInProgress: 3,
        totalOverdue: 1,
        averageCompletionTime: Math.random() * 48 + 12,
        estimatedHours: 160,
        actualHours: 145,
        brandBreakdown: [
          { brandId: 'b1', brandName: 'Brand Alpha', count: 8 },
          { brandId: 'b2', brandName: 'Brand Beta', count: 5 }
        ]
      };
      MOCK_REPORTS.unshift(newReport as any);
      return newReport;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    }
  });
}

export function useUpdateBrand() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string, data: any }) => {
      await delay(400);
      const index = MOCK_BRANDS.findIndex(b => b._id === id);
      if (index !== -1) {
        MOCK_BRANDS[index] = { ...MOCK_BRANDS[index], ...data };
      }
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
    }
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string, data: any }) => {
      await delay(400);
      const index = MOCK_PROJECTS.findIndex(p => p._id === id);
      if (index !== -1) {
        MOCK_PROJECTS[index] = { ...MOCK_PROJECTS[index], ...data };
      }
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    }
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string, data: any }) => {
      await delay(400);
      const index = MOCK_USERS.findIndex(u => u._id === id);
      if (index !== -1) {
        MOCK_USERS[index] = { ...MOCK_USERS[index], ...data };
      }
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await delay(400);
      const index = MOCK_PROJECTS.findIndex(p => p._id === id);
      if (index !== -1) {
        MOCK_PROJECTS.splice(index, 1);
      }
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    }
  });
}

export function useDeleteBrand() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await delay(400);
      const index = MOCK_BRANDS.findIndex(b => b._id === id);
      if (index !== -1) {
        MOCK_BRANDS.splice(index, 1);
      }
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
    }
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await delay(400);
      const index = MOCK_TASKS.findIndex(t => t._id === id);
      if (index !== -1) {
        MOCK_TASKS.splice(index, 1);
      }
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
  });
}
