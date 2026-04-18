import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  CheckSquare, 
  Tag, 
  Calendar, 
  BarChart3, 
  Users, 
  Settings,
  LogOut,
  Search,
  Bell,
  Menu,
  ChevronRight
} from 'lucide-react';
import { useAuthStore } from '../store/store';
import { Logo } from './Logo';
import { useNotifications, useGlobalSearch, useMarkNotificationRead } from '../hooks/useApi';
import { Button, Card, Badge } from './ui';
import { cn } from '../lib/utils';
import { OnboardingTour } from './OnboardingTour';

export function Sidebar({ isOpen, onClose }: { isOpen?: boolean, onClose?: () => void }) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Briefcase, label: 'Projects', path: '/projects' },
    { icon: CheckSquare, label: 'Tasks', path: '/tasks' },
    { icon: Tag, label: 'Brands', path: '/brands' },
    { icon: Calendar, label: 'Calendar', path: '/calendar' },
    { icon: BarChart3, label: 'Reports', path: '/reports' },
    { icon: Users, label: 'Team', path: '/team', roles: ['ADMIN', 'MANAGER'] },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      <aside className={cn(
        "fixed left-0 top-0 z-50 h-screen w-64 border-r border-white/20 bg-white/40 p-4 backdrop-blur-2xl transition-all duration-300 lg:translate-x-0 lg:block",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between mb-8 px-2 lg:mb-12">
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => { navigate('/'); onClose?.(); }}
          >
            <Logo size={20} />
          </div>
          {/* Close button for mobile */}
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={onClose}>
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            if (item.roles && user && !item.roles.includes(user.role)) return null;
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:bg-white/50",
                  isActive ? "bg-primary text-white shadow-md shadow-primary/20" : "text-slate-500"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

      <div className="absolute bottom-4 left-4 right-4">
        <div className="glass rounded-xl p-3 bg-white/30">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
              {user?.name?.[0]}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-bold text-slate-900 truncate">{user?.name}</p>
              <p className="text-[10px] text-slate-500 truncate uppercase tracking-wider">{user?.role}</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full justify-start text-xs h-8 px-2 text-red-500 hover:text-red-600 hover:bg-red-50/50"
            onClick={() => {
              logout();
              navigate('/login');
            }}
          >
            <LogOut className="mr-2 h-3 w-3" />
            Logout
          </Button>
        </div>
      </div>
    </aside>
    </>
  );
}

export function Navbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isNotificationsOpen, setIsNotificationsOpen] = React.useState(false);
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);

  const { data: notifications } = useNotifications();
  const { data: searchResults } = useGlobalSearch(searchQuery);
  const markAsRead = useMarkNotificationRead();

  const unreadCount = notifications?.filter(n => !n.read).length || 0;
  const pageName = location.pathname === '/dashboard' ? 'Dashboard' : location.pathname.split('/')[1];

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/20 bg-white/20 px-4 backdrop-blur-md lg:px-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-bold text-slate-900 capitalize">
          {pageName}
        </h1>
      </div>

      <div className="flex items-center gap-2 lg:gap-4">
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search tasks, projects..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 w-64 rounded-full border border-white/30 bg-white/40 pl-10 pr-4 text-xs focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all focus:w-80"
          />
          {searchQuery.length >= 2 && searchResults && (
            <div className="absolute top-full mt-2 w-full glass rounded-xl overflow-hidden shadow-2xl border border-white/20 bg-white/90 backdrop-blur-xl max-h-96 overflow-y-auto">
                <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
                  {searchResults.projects.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Briefcase className="h-3 w-3 text-slate-400" />
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Projects</p>
                      </div>
                      <div className="grid gap-2">
                        {searchResults.projects.map(p => (
                          <div key={p._id} className="text-xs p-3 rounded-xl bg-slate-50 hover:bg-primary/10 hover:text-primary cursor-pointer border border-transparent hover:border-primary/20 transition-all flex items-center justify-between group" onClick={() => { navigate('/projects'); setSearchQuery(''); }}>
                            <span className="font-bold">{p.name}</span>
                            <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {searchResults.tasks.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <CheckSquare className="h-3 w-3 text-slate-400" />
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Tasks</p>
                      </div>
                      <div className="grid gap-2">
                        {searchResults.tasks.map(t => (
                          <div key={t._id} className="text-xs p-3 rounded-xl bg-slate-50 hover:bg-primary/10 hover:text-primary cursor-pointer border border-transparent hover:border-primary/20 transition-all flex items-center justify-between group" onClick={() => { navigate('/tasks'); setSearchQuery(''); }}>
                            <div>
                               <p className="font-bold">{t.title}</p>
                               <p className="text-[10px] text-slate-400">In {t.projectId?.name}</p>
                            </div>
                            <Badge variant={t.status === 'COMPLETED' ? 'success' : 'info'} className="text-[9px]">{t.status}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {searchResults.users.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Users className="h-3 w-3 text-slate-400" />
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Team</p>
                      </div>
                      <div className="grid gap-2">
                        {searchResults.users.map(u => (
                          <div key={u._id} className="text-xs p-3 rounded-xl bg-slate-50 hover:bg-primary/10 hover:text-primary cursor-pointer border border-transparent hover:border-primary/20 transition-all flex items-center justify-between group" onClick={() => { navigate('/team'); setSearchQuery(''); }}>
                            <div className="flex items-center gap-3">
                               <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold">{u.name[0]}</div>
                               <span className="font-bold">{u.name}</span>
                            </div>
                            <span className="text-[10px] text-slate-400 uppercase tracking-widest">{u.role}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {searchResults.brands.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Tag className="h-3 w-3 text-slate-400" />
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Brands</p>
                      </div>
                      <div className="grid gap-2">
                        {searchResults.brands.map(b => (
                          <div key={b._id} className="text-xs p-2 rounded-xl bg-slate-50 hover:bg-primary/10 hover:text-primary cursor-pointer border border-transparent hover:border-primary/20 transition-all flex items-center gap-3" onClick={() => { navigate('/brands'); setSearchQuery(''); }}>
                            <div className="h-6 w-6 rounded-lg shadow-sm" style={{ backgroundColor: b.color }} />
                            <span className="font-bold">{b.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {searchResults.projects.length === 0 && searchResults.tasks.length === 0 && searchResults.users.length === 0 && searchResults.brands.length === 0 && (
                    <div className="py-8 text-center text-xs text-slate-500">No results found for "{searchQuery}"</div>
                  )}
                </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 border-r border-white/20 pr-2 lg:gap-2 lg:pr-4">
          <div className="relative">
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative h-8 w-8 px-0"
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 border-2 border-white" />
              )}
            </Button>
            
            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 glass rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-white/95 backdrop-blur-2xl">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                  <p className="text-sm font-bold">Notifications</p>
                  <Badge variant="info" className="text-[10px]">{unreadCount} New</Badge>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications?.map(n => (
                    <div 
                      key={n._id} 
                      className={cn(
                        "p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer",
                        !n.read && "bg-primary/5 border-l-2 border-l-primary"
                      )}
                      onClick={() => markAsRead.mutate(n._id)}
                    >
                      <p className="text-xs font-bold mb-1">{n.title}</p>
                      <p className="text-[11px] text-slate-500 line-clamp-2">{n.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 pl-2 cursor-pointer group relative" onClick={() => setIsProfileOpen(!isProfileOpen)}>
          <div className="hidden text-right lg:block">
            <p className="text-xs font-bold text-slate-900 group-hover:text-primary transition-colors">{user?.name}</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest">{user?.role}</p>
          </div>
          <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-primary to-indigo-500 shadow-sm flex items-center justify-center text-white font-bold text-sm">
            {user?.name?.[0]}
          </div>

          {isProfileOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 glass rounded-xl overflow-hidden shadow-2xl border border-white/20 bg-white">
               <div className="p-2">
                 <Button variant="ghost" size="sm" className="w-full justify-start text-xs" onClick={() => navigate('/settings')}>
                   <Settings className="mr-2 h-3 w-3" /> Profile Settings
                 </Button>
                 <Button variant="ghost" size="sm" className="w-full justify-start text-xs text-red-500 hover:text-red-600" onClick={() => { logout(); navigate('/login'); }}>
                   <LogOut className="mr-2 h-3 w-3" /> Sign Out
                 </Button>
               </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  return (
    <div className="min-h-screen font-sans duration-300">
      <OnboardingTour />
      <div className="text-slate-900">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <div className="lg:pl-64">
          <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
          <main className="p-4 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
