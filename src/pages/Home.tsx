import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Badge } from '../components/ui';
import { 
  Zap, 
  Shield, 
  Rocket, 
  CheckCircle2, 
  Layout, 
  BarChart, 
  Users, 
  ChevronRight,
  Github
} from 'lucide-react';
import { motion } from 'motion/react';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-primary/30">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-[#020617]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white font-bold text-xl shadow-lg shadow-primary/20">
              B
            </div>
            <span className="text-xl font-bold tracking-tighter">Brivo</span>
          </div>
          <div className="hidden items-center gap-8 text-sm font-medium text-slate-400 md:flex">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#about" className="hover:text-white transition-colors">About</a>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="text-slate-400 hover:text-white" onClick={() => navigate('/login')}>
              Log in
            </Button>
            <Button onClick={() => navigate('/login')} className="hidden sm:flex">
              Start Free Trial
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl opacity-30 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-full h-full bg-primary/20 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-[10%] right-[-10%] w-full h-full bg-indigo-500/20 blur-[120px] rounded-full animate-pulse delay-700" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="info" className="mb-6 px-4 py-1.5 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold">
              Productivity Redefined
            </Badge>
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl lg:text-8xl mb-8 leading-[0.9]">
              Manage multi-brand <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-400 italic">workflows</span> with ease.
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-slate-400 mb-10 leading-relaxed">
              Brivo is the all-in-one workstation for creative teams managing multiple identities. 
              Built for performance, designed for clarity.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="h-14 px-8 text-lg font-bold group" onClick={() => navigate('/login')}>
                Get Started Now
                <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="lg" className="h-14 px-8 text-lg font-bold border-white/10 hover:bg-white/5">
                <Github className="mr-2 h-5 w-5" />
                View on GitHub
              </Button>
            </div>
          </motion.div>

          <motion.div 
            className="mt-20 relative mx-auto max-w-6xl rounded-3xl border border-white/10 bg-white/5 p-2 shadow-2xl backdrop-blur-sm"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <img 
              src="https://picsum.photos/seed/dashboard/1920/1080" 
              alt="Dashboard Preview" 
              className="rounded-2xl w-full"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-[#020617]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 sm:text-4xl text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400">Everything you need to scale</h2>
            <p className="text-slate-400 max-w-xl mx-auto">One platform to take your brand management from chaotic spreadsheets to streamlined automation.</p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard 
              icon={Zap} 
              title="Lightning Fast" 
              description="Optimized for speed. No lag, no spinners, just pure productivity." 
            />
            <FeatureCard 
              icon={Shield} 
              title="Enterprise Security" 
              description="Role-based access control and high-level encryption for your brand assets." 
            />
            <FeatureCard 
              icon={Layout} 
              title="Multi-Brand Workstation" 
              description="Switch between Nike, Puma, or your own brand in a single click." 
            />
            <FeatureCard 
              icon={BarChart} 
              title="Deep Analytics" 
              description="Track productivity across teams and brands with automated reports." 
            />
            <FeatureCard 
              icon={Users} 
              title="Team Collaboration" 
              description="Assign tasks, set priorities, and keep everyone on the same page." 
            />
            <FeatureCard 
              icon={CheckCircle2} 
              title="Built-in Approvals" 
              description="Seamless review cycles to ensure every asset meets brand standards." 
            />
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="py-20 border-t border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center text-slate-500 text-sm">
           <div className="flex items-center justify-center gap-2 mb-8 grayscale hover:grayscale-0 transition-all opacity-50 hover:opacity-100">
             <div className="h-8 w-8 rounded-lg bg-primary text-white flex items-center justify-center font-bold">B</div>
             <span className="font-bold text-white text-lg">Brivo</span>
           </div>
           <p>© 2026 Brivo Workstation. Built for high-performance teams.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
  return (
    <div className="p-8 rounded-3xl border border-white/5 bg-white/2 bg-gradient-to-tr from-white/5 to-transparent hover:border-primary/50 transition-all group">
      <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
