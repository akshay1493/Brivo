import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['ADMIN', 'MANAGER', 'EMPLOYEE'], default: 'EMPLOYEE' },
  teamId: { type: String },
  departmentId: { type: String },
}, { timestamps: true });

userSchema.pre('save', async function() {
  const user = this as any;
  if (!user.isModified('password')) return;
  user.password = await bcrypt.hash(user.password, 10);
});

export const User = mongoose.model('User', userSchema);
