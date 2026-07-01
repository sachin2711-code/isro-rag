import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sprout,
  Droplets,
  Building2,
  Brain,
  Shield,
  User,
  Settings,
  LogOut,
  Home,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const navLinks = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/agriculture', label: 'Agriculture', icon: Sprout },
    { path: '/water', label: 'Water', icon: Droplets },
    { path: '/urban', label: 'Urban', icon: Building2 },
    { path: '/ai-assistant', label: 'AI Assistant', icon: Brain },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-[#050A0F] text-[#F4F4F5]">
      {/* Header */}
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-[#050A0F]/80 backdrop-blur-xl border-b border-white/10'
            : 'bg-transparent'
        }`}
      >
        <div className="flex items-center justify-between px-4 lg:px-8 py-3">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-lg font-light tracking-[0.2em] text-white">INDRA</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs tracking-wider uppercase transition-all ${
                  isActive(link.path)
                    ? 'bg-white/10 text-white'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
              >
                <link.icon size={14} />
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs tracking-wider uppercase transition-all ${
                  isActive('/admin')
                    ? 'bg-amber-500/20 text-amber-400'
                    : 'text-amber-400/60 hover:text-amber-400 hover:bg-amber-500/10'
                }`}
              >
                <Shield size={14} />
                Admin
              </Link>
            )}
          </nav>

          {/* Auth Section */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-xs font-bold text-white">
                      {user?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <span className="hidden sm:inline">{user?.name}</span>
                    <ChevronDown size={12} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-[#0f1729] border-white/10 text-white">
                  <DropdownMenuItem asChild className="hover:bg-white/10 cursor-pointer">
                    <Link to="/settings" className="flex items-center gap-2">
                      <Settings size={14} /> Settings
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild className="hover:bg-white/10 cursor-pointer">
                      <Link to="/admin" className="flex items-center gap-2">
                        <Shield size={14} /> Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem onClick={logout} className="hover:bg-white/10 cursor-pointer text-red-400">
                    <LogOut size={14} className="mr-2" /> Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-xs tracking-wider uppercase text-white/70 hover:text-white hover:bg-white/10"
                >
                  <User size={14} className="mr-1.5" /> Sign In
                </Button>
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              className="lg:hidden text-white/70 hover:text-white"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="lg:hidden bg-[#050A0F]/95 backdrop-blur-xl border-t border-white/10 px-4 py-4">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                    isActive(link.path)
                      ? 'bg-white/10 text-white'
                      : 'text-white/50 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <link.icon size={16} />
                  {link.label}
                </Link>
              ))}
              {isAdmin && (
                <Link
                  to="/admin"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-amber-400/60 hover:text-amber-400 hover:bg-amber-500/10"
                >
                  <Shield size={16} />
                  Admin Dashboard
                </Link>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="pt-14">{children}</main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#010102] px-4 lg:px-8 py-8 mt-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <span className="text-lg font-light tracking-[0.2em] text-white">INDRA</span>
              <p className="text-white/40 text-sm mt-3 max-w-md">
                AI-Powered Digital Twin of India's Climate. Building a self-reliant, data-driven climate intelligence infrastructure.
              </p>
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-wider text-white/60 mb-3">Sectors</h4>
              <div className="flex flex-col gap-2">
                <Link to="/agriculture" className="text-sm text-white/40 hover:text-white transition-colors">Agriculture</Link>
                <Link to="/water" className="text-sm text-white/40 hover:text-white transition-colors">Water Resources</Link>
                <Link to="/urban" className="text-sm text-white/40 hover:text-white transition-colors">Urban Climate</Link>
                <Link to="/ai-assistant" className="text-sm text-white/40 hover:text-white transition-colors">AI Assistant</Link>
              </div>
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-wider text-white/60 mb-3">Connect</h4>
              <div className="flex flex-col gap-2">
                <Link to="/contact" className="text-sm text-white/40 hover:text-white transition-colors">Contact</Link>
                <Link to="/settings" className="text-sm text-white/40 hover:text-white transition-colors">Settings</Link>
              </div>
            </div>
          </div>
          <div className="border-t border-white/5 mt-8 pt-6 text-center text-xs text-white/30">
            2025 Indra Climate Twin. National Data Initiative.
          </div>
        </div>
      </footer>
    </div>
  );
}
