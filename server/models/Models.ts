import mongoose from 'mongoose';

const brandSchema = new mongoose.Schema({
  name: { type: String, required: true },
  color: { type: String, required: true },
  icon: { type: String }, // Lucide icon name
}, { timestamps: true });

export const Brand = mongoose.model('Brand', brandSchema);

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brandId: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },
  teamIds: [{ type: String }],
  status: { type: String, enum: ['PLANNED', 'ACTIVE', 'ON_HOLD', 'COMPLETED'], default: 'PLANNED' },
  progress: { type: Number, default: 0 },
}, { timestamps: true });

export const Project = mongoose.model('Project', projectSchema);

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  brandId: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  priority: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'], default: 'MEDIUM' },
  status: { type: String, enum: ['TODO', 'IN_PROGRESS', 'REVIEW', 'COMPLETED'], default: 'TODO' },
  startDate: { type: Date },
  dueDate: { type: Date },
  estimatedHours: { type: Number, default: 0 },
  actualHours: { type: Number, default: 0 },
  tags: [String],
  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: String,
    createdAt: { type: Date, default: Date.now }
  }],
}, { timestamps: true });

export const Task = mongoose.model('Task', taskSchema);

const reportSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  month: { type: Number, required: true },
  year: { type: Number, required: true },
  totalAssigned: { type: Number, default: 0 },
  totalCompleted: { type: Number, default: 0 },
  totalOverdue: { type: Number, default: 0 },
  totalInProgress: { type: Number, default: 0 },
  averageCompletionTime: { type: Number, default: 0 }, // in hours
  estimatedHours: { type: Number, default: 0 },
  actualHours: { type: Number, default: 0 },
  brandBreakdown: [{
    brandId: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand' },
    brandName: String,
    count: Number
  }],
  generatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

export const MonthlyReport = mongoose.model('MonthlyReport', reportSchema);
