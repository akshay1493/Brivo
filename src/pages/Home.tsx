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
  Globe,
  Tag,
  Activity,
  LifeBuoy
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

import { Logo } from '../components/Logo';
import { useAuthStore } from '../store/store';

export default function Home() {
  const navigate = useNavigate();
  const { token, logout, user } = useAuthStore();

  const handleGetStarted = () => {
    const tourParam = '?tour=true';
    if (token) {
      navigate(`/dashboard${tourParam}`);
    } else {
      navigate(`/login${tourParam}`);
    }
  };

  const handleHeroLogin = () => {
    if (token) {
      logout();
    }
    navigate('/login?tour=true');
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-primary/30">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-[#020617]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Logo onClick={() => navigate('/')} className="cursor-pointer" light size={24} />
          <div className="hidden items-center gap-8 text-sm font-medium text-slate-400 md:flex">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#about" className="hover:text-white transition-colors">About</a>
          </div>
          <div className="flex items-center gap-4">
            {token ? (
              <>
                <Button variant="ghost" className="h-10 px-6 font-bold text-slate-400 hover:text-white" onClick={() => navigate('/dashboard')}>
                  Dashboard
                </Button>
                <Button className="h-10 px-6 font-bold" onClick={() => { logout(); navigate('/'); }}>
                  Log out
                </Button>
              </>
            ) : (
              <>
                <Button className="h-10 px-6 font-bold" onClick={() => navigate('/login')}>
                  Log in
                </Button>
                <Button variant="ghost" onClick={handleGetStarted} className="hidden sm:flex text-slate-400 hover:text-white">
                  Get Started
                </Button>
              </>
            )}
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
              <Button size="lg" className="h-14 px-8 text-lg font-bold group" onClick={handleHeroLogin}>
                Login to Workspace
                <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </motion.div>

          <motion.div 
            className="mt-20 relative mx-auto max-w-6xl rounded-3xl border border-white/10 bg-white/5 p-2 shadow-2xl backdrop-blur-sm group"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />
            <img 
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop" 
              alt="Team collaborating on multi-brand creative projects in Brivo" 
              className="rounded-2xl w-full shadow-2xl transition-transform duration-700 group-hover:scale-[1.01] object-cover max-h-[600px]"
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

      {/* About Section */}
      <section id="about" className="py-24 relative overflow-hidden">
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-primary/10 blur-[120px] rounded-full" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-black mb-6 sm:text-5xl leading-tight">
                Your Comprehensive <br />
                <span className="text-primary">Workspace Solution</span>
              </h2>
              <div className="space-y-6 text-slate-400 text-lg leading-relaxed">
                <p>
                  Brivo represents a groundbreaking and transformative advancement in the realm of multi-brand workspace management. 
                  It is not merely software; it is a meticulously crafted, holistic suite designed to revolutionize and significantly 
                  enhance how modern agencies and creative teams operate in today's fast-paced environment.
                </p>
                <p>
                  Brivo streamlines and simplifies the often-complex processes of productivity tracking, brand identity management, 
                  and automated, yet insightful, performance reporting. All these powerful capabilities are elegantly and seamlessly 
                  integrated into a unified, visually-driven, and user-friendly interface.
                </p>
                <p className="font-medium text-slate-300">
                  Join hundreds of agencies empowering their teams to focus on what truly matters most: 
                  crafting exceptional, innovative, and impactful work.
                </p>
              </div>
            </motion.div>
            <motion.div 
              className="grid grid-cols-2 gap-6"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <div className="space-y-6">
                <div className="aspect-square rounded-3xl bg-white/5 border border-white/10 p-8 flex flex-col justify-between relative overflow-hidden group">
                  <Globe className="h-8 w-8 text-primary/40" />
                  <div className="relative z-10">
                    <div className="text-4xl font-black text-white mb-2">99%</div>
                    <div className="text-xs font-bold uppercase tracking-widest text-slate-500">Uptime Reliability</div>
                  </div>
                  <div className="absolute -right-4 -top-4 h-24 w-24 bg-primary/5 rounded-full blur-2xl border border-white/5 group-hover:scale-150 transition-transform duration-700" />
                </div>
                <div className="aspect-[4/5] rounded-3xl bg-primary p-8 flex flex-col justify-between text-white relative overflow-hidden group">
                   <Tag className="h-10 w-10 text-white/40" />
                   <div className="relative z-10">
                    <div className="text-4xl font-black mb-2">250+</div>
                    <div className="text-xs font-bold uppercase tracking-widest opacity-80">Brands Managed</div>
                   </div>
                   <img 
                    src="https://picsum.photos/seed/branding/400/500" 
                    alt="Brands decorative" 
                    className="absolute inset-0 w-full h-full object-cover opacity-10 mix-blend-overlay group-hover:scale-110 transition-transform duration-700" 
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
              <div className="space-y-6 pt-12">
                <div className="aspect-[4/5] rounded-3xl bg-indigo-500 p-8 flex flex-col justify-between text-white relative overflow-hidden group">
                  <Activity className="h-10 w-10 text-white/40" />
                  <div className="relative z-10">
                    <div className="text-4xl font-black mb-2">12M</div>
                    <div className="text-xs font-bold uppercase tracking-widest opacity-80">Tasks Completed</div>
                  </div>
                   <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50" />
                </div>
                <div className="aspect-square rounded-3xl bg-white/5 border border-white/10 p-8 flex flex-col justify-between relative overflow-hidden group">
                   <LifeBuoy className="h-8 w-8 text-indigo-400/40" />
                   <div className="relative z-10">
                    <div className="text-4xl font-black text-white mb-2">24/7</div>
                    <div className="text-xs font-bold uppercase tracking-widest text-slate-500">Expert Support</div>
                   </div>
                   <img 
                    src="https://picsum.photos/seed/support/400/400" 
                    alt="Support decorative" 
                    className="absolute inset-0 w-full h-full object-cover opacity-5 grayscale group-hover:opacity-10 transition-opacity duration-700" 
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-white/[0.02]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-16">
            <h2 className="text-3xl font-black mb-4 sm:text-5xl text-white">Scale your workflow</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              Brivo presents a flexible pricing structure, meticulously crafted to not only adapt but also scale effectively, 
              aligning perfectly with the ever-evolving demands and dynamic requirements of your team.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            <PricingCard 
              title="Basic Plan"
              price="0"
              description="Tailored specifically for small teams and individual users, streamlining basic project management tasks and brand organization."
              features={[
                "Up to 3 Brands",
                "Basic Kanban Board",
                "Core Reporting",
                "Standard Priority Support"
              ]}
            />
            <PricingCard 
              title="Pro Plan"
              price="49"
              description="Engineered for growing agencies and dynamic creative teams, unlocking advanced collaboration tools and deep analytics."
              popular
              features={[
                "Unlimited Brands",
                "Advanced Collaboration",
                "Actionable Perf Insights",
                "Increased Storage Capacity"
              ]}
            />
            <PricingCard 
              title="Enterprise Plan"
              price="Custom"
              description="Tailored exclusively for large, multifaceted organizations with bespoke integration and dedicated support requirements."
              features={[
                "Bespoke Integrations",
                "Dedicated Account Manager",
                "Granular Access Control",
                "Highest Security Standards"
              ]}
            />
          </div>
          <p className="mt-12 text-slate-500 text-sm italic">
            All plans are specifically engineered to furnish an optimal balance of essential features and readily available resources.
          </p>
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

function PricingCard({ title, price, description, features, popular }: any) {
  return (
    <div className={cn(
      "p-8 rounded-3xl border transition-all relative flex flex-col group",
      popular 
        ? "bg-primary border-primary shadow-2xl shadow-primary/20 scale-105 z-10" 
        : "bg-white/5 border-white/10 hover:border-primary/50"
    )}>
      {popular && (
        <span className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-white text-primary rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
          Most Popular
        </span>
      )}
      <div className="mb-8">
        <h3 className={cn("text-xl font-black mb-2", popular ? "text-white" : "text-white")}>{title}</h3>
        <p className={cn("text-sm leading-relaxed", popular ? "text-white/80" : "text-slate-400")}>{description}</p>
      </div>
      <div className="mb-8 flex items-baseline gap-1">
        <span className={cn("text-4xl font-black", popular ? "text-white" : "text-white")}>
          {price === 'Custom' ? '' : '$'}{price}
        </span>
        {price !== 'Custom' && (
          <span className={cn("text-sm font-bold opacity-60", popular ? "text-white" : "text-white")}>/mo</span>
        )}
      </div>
      <ul className="space-y-4 mb-8 flex-1">
        {features.map((f: string, i: number) => (
          <li key={i} className="flex items-center gap-3 text-sm">
            <CheckCircle2 className={cn("h-4 w-4 shrink-0", popular ? "text-white" : "text-primary")} />
            <span className={popular ? "text-white/90" : "text-slate-300"}>{f}</span>
          </li>
        ))}
      </ul>
      <Button 
        variant={popular ? "secondary" : "outline"} 
        className={cn(
          "w-full h-12 rounded-xl font-bold",
          popular ? "bg-white text-primary border-none hover:bg-white/90" : "border-white/10"
        )}
      >
        Choose {title}
      </Button>
    </div>
  );
}
