import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  User,
  Shield,
  Bell,
  Monitor,
  LogOut,
  Loader2,
  CheckCircle,
  Settings,
} from 'lucide-react';

export default function SettingsPage() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(true);
  const [dataRefresh, setDataRefresh] = useState(true);
  const [highContrast, setHighContrast] = useState(false);

  if (!isAuthenticated) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="bg-white/[0.03] border-white/10 max-w-sm">
            <CardContent className="p-8 text-center">
              <User size={48} className="text-white/20 mx-auto mb-4" />
              <h3 className="text-white font-medium mb-2">Sign In Required</h3>
              <p className="text-white/40 text-sm mb-4">Please sign in to access settings.</p>
              <Button onClick={() => navigate('/login')} className="bg-white/10 hover:bg-white/20 text-white">
                Sign In
              </Button>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Settings size={24} className="text-white/60" />
            <h1 className="text-3xl font-light text-white">Settings</h1>
          </div>

          {/* Profile */}
          <Card className="bg-white/[0.03] border-white/10 mb-6">
            <CardHeader>
              <CardTitle className="text-white font-light flex items-center gap-2">
                <User size={18} className="text-indigo-400" /> Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center text-xl font-bold text-white">
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <div>
                  <h3 className="text-white font-medium">{user?.name}</h3>
                  <p className="text-white/40 text-sm">{user?.email || 'No email'}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className="bg-indigo-500/20 text-indigo-400 text-[10px]">
                      {user?.authType === 'oauth' ? 'OAuth' : 'Local'}
                    </Badge>
                    <Badge className={user?.role === 'admin' ? 'bg-amber-500/20 text-amber-400 text-[10px]' : 'bg-white/10 text-white/40 text-[10px]'}>
                      {user?.role || 'user'}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="bg-white/[0.03] border-white/10 mb-6">
            <CardHeader>
              <CardTitle className="text-white font-light flex items-center gap-2">
                <Bell size={18} className="text-amber-400" /> Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white text-sm">Climate Alerts</Label>
                  <p className="text-white/40 text-xs">Get notified about extreme weather events</p>
                </div>
                <Switch checked={notifications} onCheckedChange={setNotifications} />
              </div>
              <Separator className="bg-white/10" />
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white text-sm">Auto Data Refresh</Label>
                  <p className="text-white/40 text-xs">Automatically refresh climate data every 5 minutes</p>
                </div>
                <Switch checked={dataRefresh} onCheckedChange={setDataRefresh} />
              </div>
            </CardContent>
          </Card>

          {/* Display */}
          <Card className="bg-white/[0.03] border-white/10 mb-6">
            <CardHeader>
              <CardTitle className="text-white font-light flex items-center gap-2">
                <Monitor size={18} className="text-emerald-400" /> Display
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white text-sm">High Contrast Mode</Label>
                  <p className="text-white/40 text-xs">Enhanced contrast for better readability</p>
                </div>
                <Switch checked={highContrast} onCheckedChange={setHighContrast} />
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card className="bg-white/[0.03] border-white/10 mb-6">
            <CardHeader>
              <CardTitle className="text-white font-light flex items-center gap-2">
                <Shield size={18} className="text-red-400" /> Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white text-sm">Session</Label>
                  <p className="text-white/40 text-xs">Manage your active session</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                >
                  <LogOut size={14} className="mr-1.5" /> Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </AppLayout>
  );
}
