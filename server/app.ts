import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { connectDB } from './lib/db.js';
import { User } from './models/User.js';
import { Brand, Project, Task, MonthlyReport } from './models/Models.js';
import { authMiddleware, AuthRequest, roleMiddleware } from './middleware/auth.js';
import { startOfMonth, endOfMonth, differenceInHours } from 'date-fns';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export async function createApp() {
  const app = express();
  app.use(express.json());

  // Bare health check - must be before ANY middleware that might block
  app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

  // Request Logging
  app.use((req, res, next) => {
    if (!req.path.startsWith('/@vite') && !req.path.startsWith('/src')) {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    }
    next();
  });

  const apiRouter = express.Router();

  // Seed Data (Development only) - Move ABOVE the DB middleware
  apiRouter.post('/seed', async (req, res) => {
    try {
      console.log('Seed request received. Connecting to DB...');
      await connectDB(); 
    } catch (err: any) {
      const isMissingUri = err.message?.includes('MONGO_URI');
      return res.status(isMissingUri ? 503 : 500).json({ 
        message: isMissingUri 
          ? 'MongoDB configuration missing. Please add MONGO_URI in Settings > Secrets.' 
          : 'Seeding failed to connect: ' + err.message 
      });
    }

    try {
      const count = await User.countDocuments();
      if (count > 0) {
        return res.status(400).json({ message: 'Database already seeded. Use admin@brivo.com / password123.' });
      }

      const admin = new User({ name: 'Admin User', email: 'admin@brivo.com', password: 'password123', role: 'ADMIN' });
      const manager = new User({ name: 'Manager User', email: 'manager@brivo.com', password: 'password123', role: 'MANAGER' });
      const emp = new User({ name: 'Jane Employee', email: 'jane@brivo.com', password: 'password123', role: 'EMPLOYEE' });
      await Promise.all([admin.save(), manager.save(), emp.save()]);

      const nike = new Brand({ name: 'Nike', color: '#000000', icon: 'zap' });
      const puma = new Brand({ name: 'Puma', color: '#f97316', icon: 'cat' });
      const adidas = new Brand({ name: 'Adidas', color: '#2563eb', icon: 'award' });
      await Promise.all([nike.save(), puma.save(), adidas.save()]);

      console.log('Seeding successful');
      res.json({ message: 'Seeded successfully. Log in with admin@brivo.com / password123' });
    } catch (err: any) {
      console.error('Seeding error:', err);
      res.status(500).json({ message: 'Seeding failed: ' + err.message });
    }
  });

  // Ensure DB is connected for API routes
  apiRouter.use(async (req, res, next) => {
    try {
      if (req.path !== '/health') {
        await connectDB();
      }
      next();
    } catch (err: any) {
      // If DB fails, we still allow next() if it's a non-destructive path? 
      // No, for these routes we need DB.
      res.status(503).json({ 
        message: err.message || 'Database connection currently unavailable.' 
      });
    }
  });

  // --- API ROUTES ---

  // Auth
  apiRouter.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: 'Invalid credentials' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

      const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
      res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ message: 'Server error' });
    }
  });

  apiRouter.get('/auth/me', authMiddleware, async (req: AuthRequest, res) => {
    try {
      const user = await User.findById(req.user?.userId).select('-password');
      res.json(user);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Brands
  apiRouter.get('/brands', authMiddleware, async (req, res) => {
    try {
      const brands = await Brand.find();
      res.json(brands);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  apiRouter.post('/brands', authMiddleware, roleMiddleware(['ADMIN']), async (req, res) => {
    try {
      const brand = new Brand(req.body);
      await brand.save();
      res.json(brand);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Projects
  apiRouter.get('/projects', authMiddleware, async (req, res) => {
    try {
      const projects = await Project.find().populate('brandId');
      res.json(projects);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  apiRouter.post('/projects', authMiddleware, roleMiddleware(['ADMIN', 'MANAGER']), async (req, res) => {
    try {
      const project = new Project(req.body);
      await project.save();
      res.json(project);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Tasks
  apiRouter.get('/tasks', authMiddleware, async (req, res) => {
    try {
      const { brandId, status, assignedTo, projectId } = req.query;
      const filter: any = {};
      if (brandId) filter.brandId = brandId;
      if (status) filter.status = status;
      if (assignedTo) filter.assignedTo = assignedTo;
      if (projectId) filter.projectId = projectId;

      const tasks = await Task.find(filter)
        .populate('brandId')
        .populate('projectId')
        .populate('assignedTo', 'name email')
        .sort({ createdAt: -1 });
      res.json(tasks);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  apiRouter.post('/tasks', authMiddleware, roleMiddleware(['ADMIN', 'MANAGER']), async (req: AuthRequest, res) => {
    try {
      const task = new Task({ ...req.body, assignedBy: req.user?.userId });
      await task.save();
      res.json(task);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  apiRouter.patch('/tasks/:id', authMiddleware, async (req: AuthRequest, res) => {
    try {
      const task = await Task.findById(req.params.id);
      if (!task) return res.status(404).json({ message: 'Task not found' });
      
      if (req.user?.role === 'EMPLOYEE' && task.assignedTo?.toString() !== req.user.userId) {
        return res.status(403).json({ message: 'Unauthorized' });
      }

      Object.assign(task, req.body);
      await task.save();
      res.json(task);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Reports Engine
  apiRouter.get('/reports', authMiddleware, async (req: AuthRequest, res) => {
    try {
      const { employeeId, month, year } = req.query;
      const filter: any = {};
      if (employeeId) filter.employeeId = employeeId;
      if (month) filter.month = Number(month);
      if (year) filter.year = Number(year);

      const reports = await MonthlyReport.find(filter).populate('employeeId', 'name email');
      res.json(reports);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  apiRouter.post('/reports/generate', authMiddleware, roleMiddleware(['ADMIN', 'MANAGER']), async (req, res) => {
    try {
      const { employeeId, month, year } = req.body;
      
      const start = startOfMonth(new Date(Number(year), Number(month) - 1));
      const end = endOfMonth(new Date(Number(year), Number(month) - 1));

      const tasks = await Task.find({
        assignedTo: employeeId,
        createdAt: { $gte: start, $lte: end }
      }).populate('brandId');

      const totalAssigned = tasks.length;
      const completedTasks = tasks.filter(t => t.status === 'COMPLETED');
      const totalCompleted = completedTasks.length;
      const totalInProgress = tasks.filter(t => t.status === 'IN_PROGRESS').length;
      const totalOverdue = tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'COMPLETED').length;
      
      let totalCompTime = 0;
      completedTasks.forEach(t => {
        if (t.createdAt && t.updatedAt) {
          totalCompTime += differenceInHours(new Date(t.updatedAt), new Date(t.createdAt));
        }
      });
      const averageCompletionTime = totalCompleted > 0 ? totalCompTime / totalCompleted : 0;

      const estimatedHours = tasks.reduce((acc, t) => acc + (t.estimatedHours || 0), 0);
      const actualHours = tasks.reduce((acc, t) => acc + (t.actualHours || 0), 0);

      const brandMap: any = {};
      tasks.forEach(t => {
        const brand = t.brandId as any;
        if (brand) {
          brandMap[brand._id] = {
            brandId: brand._id,
            brandName: brand.name,
            count: (brandMap[brand._id]?.count || 0) + 1
          };
        }
      });

      const report = await MonthlyReport.findOneAndUpdate(
        { employeeId, month, year },
        {
          totalAssigned,
          totalCompleted,
          totalInProgress,
          totalOverdue,
          averageCompletionTime,
          estimatedHours,
          actualHours,
          brandBreakdown: Object.values(brandMap),
          generatedAt: new Date()
        },
        { upsert: true, new: true }
      );

      res.json(report);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Users Management (Admin)
  apiRouter.get('/users', authMiddleware, roleMiddleware(['ADMIN', 'MANAGER']), async (req, res) => {
    try {
      const users = await User.find().select('-password');
      res.json(users);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Mounting the router
  app.use('/api', apiRouter);

  // 404 for API routes
  app.use('/api*', (req, res) => {
    res.status(404).json({ message: `API endpoint ${req.originalUrl} not found` });
  });

  return app;
}
