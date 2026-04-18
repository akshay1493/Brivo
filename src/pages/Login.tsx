import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/store';
import { Logo } from '../components/Logo';
import { Button, Card } from '../components/ui';
import { Mail, Lock, Loader2 } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [seeding, setSeeding] = useState(false);
  
  const [seedSuccess, setSeedSuccess] = useState('');
  
  const { login, token } = useAuthStore();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (token) {
      navigate('/dashboard');
    }
  }, [token, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSeedSuccess('');
    
    // Simulating mock login for the standalone version
    setTimeout(() => {
      const mockUser = {
        id: 'u1',
        name: 'Admin User',
        email: email || 'admin@brivo.com',
        role: 'ADMIN' as const
      };
      login(mockUser, 'mock-jwt-token');
      setLoading(false);
      navigate('/dashboard');
    }, 1000);
  };

  const handleSeed = async () => {
    setSeeding(true);
    setError('');
    setSeedSuccess('');
    
    setTimeout(() => {
      setSeedSuccess('Demo data successfully loaded into memory!');
      setSeeding(false);
    }, 1200);
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-4 text-center">
          <Logo size={40} />
          <p className="text-slate-500">Manage brands, tasks, and productivity.</p>
        </div>

        <Card className="p-8 backdrop-blur-2xl">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 w-full rounded-lg border border-white/30 bg-white/40 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 w-full rounded-lg border border-white/30 bg-white/40 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && <p className="text-sm font-medium text-red-500">{error}</p>}
            {seedSuccess && <p className="text-sm font-medium text-green-500">{seedSuccess}</p>}

            <Button type="submit" className="w-full h-11 shadow-lg shadow-primary/20 font-bold" loading={loading}>
              Sign In
            </Button>
          </form>

          <div className="mt-6 flex flex-col gap-3">
             <Button variant="ghost" className="w-full text-xs h-9 bg-white/20 border border-white/20" onClick={handleSeed} loading={seeding}>
               Seed Demo Data
             </Button>
             <p className="text-center text-xs text-slate-500">
               Don't have an account? Contact your administrator.
             </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
