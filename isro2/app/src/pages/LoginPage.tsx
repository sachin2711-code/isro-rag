import { useState } from 'react';
import { Link } from 'react-router';
import { trpc } from '@/providers/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import {
  LogIn,
  UserPlus,
  Loader2,
  Brain,
  ArrowLeft,
  Globe,
} from 'lucide-react';

function getOAuthUrl() {
  const kimiAuthUrl = import.meta.env.VITE_KIMI_AUTH_URL;
  const appID = import.meta.env.VITE_APP_ID;
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  const url = new URL(`${kimiAuthUrl}/api/oauth/authorize`);
  url.searchParams.set("client_id", appID);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "profile");
  url.searchParams.set("state", state);

  return url.toString();
}

export default function LoginPage() {
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regDisplayName, setRegDisplayName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [error, setError] = useState('');

  const loginMutation = trpc.localAuth.login.useMutation({
    onSuccess: (data) => {
      localStorage.setItem('local_auth_token', data.token);
      window.location.href = '/';
    },
    onError: (err) => setError(err.message),
  });

  const registerMutation = trpc.localAuth.register.useMutation({
    onSuccess: (data) => {
      localStorage.setItem('local_auth_token', data.token);
      window.location.href = '/';
    },
    onError: (err) => setError(err.message),
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    loginMutation.mutate({ username: loginUsername, password: loginPassword });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    registerMutation.mutate({
      username: regUsername,
      password: regPassword,
      displayName: regDisplayName || undefined,
      email: regEmail || undefined,
    });
  };

  return (
    <div className="min-h-screen bg-[#050A0F] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Back to home */}
        <Link
          to="/"
          className="flex items-center gap-2 text-white/40 hover:text-white text-sm mb-6 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Indra
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center mx-auto mb-4">
            <Brain size={28} className="text-indigo-400" />
          </div>
          <h1 className="text-2xl font-light text-white">INDRA</h1>
          <p className="text-white/40 text-sm mt-1">Climate Intelligence Platform</p>
        </div>

        {/* OAuth */}
        <Card className="bg-white/[0.03] border-white/10 mb-4">
          <CardContent className="p-4">
            <Button
              className="w-full bg-white/10 hover:bg-white/20 text-white"
              onClick={() => { window.location.href = getOAuthUrl(); }}
            >
              <Globe size={16} className="mr-2" /> Sign in with Kimi OAuth
            </Button>
          </CardContent>
        </Card>

        <div className="flex items-center gap-4 my-4">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-white/30 text-xs">OR</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Local Auth Tabs */}
        <Card className="bg-white/[0.03] border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-white font-light text-base text-center">
              Account Access
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="w-full bg-white/5 border border-white/10 mb-4">
                <TabsTrigger value="signin" className="flex-1 data-[state=active]:bg-white/10 text-white/60 data-[state=active]:text-white">
                  <LogIn size={14} className="mr-1.5" /> Sign In
                </TabsTrigger>
                <TabsTrigger value="register" className="flex-1 data-[state=active]:bg-white/10 text-white/60 data-[state=active]:text-white">
                  <UserPlus size={14} className="mr-1.5" /> Register
                </TabsTrigger>
              </TabsList>

              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <TabsContent value="signin">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-white/60 text-xs uppercase">Username</Label>
                    <Input
                      value={loginUsername}
                      onChange={(e) => setLoginUsername(e.target.value)}
                      placeholder="Enter username"
                      required
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white/60 text-xs uppercase">Password</Label>
                    <Input
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Enter password"
                      required
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={loginMutation.isPending}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white"
                  >
                    {loginMutation.isPending ? (
                      <><Loader2 size={16} className="animate-spin mr-2" /> Signing in...</>
                    ) : (
                      <><LogIn size={16} className="mr-2" /> Sign In</>
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-white/60 text-xs uppercase">Username *</Label>
                    <Input
                      value={regUsername}
                      onChange={(e) => setRegUsername(e.target.value)}
                      placeholder="Choose a username"
                      required
                      minLength={3}
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white/60 text-xs uppercase">Password *</Label>
                    <Input
                      type="password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      required
                      minLength={6}
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white/60 text-xs uppercase">Display Name</Label>
                    <Input
                      value={regDisplayName}
                      onChange={(e) => setRegDisplayName(e.target.value)}
                      placeholder="Optional"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white/60 text-xs uppercase">Email</Label>
                    <Input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="Optional"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={registerMutation.isPending}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white"
                  >
                    {registerMutation.isPending ? (
                      <><Loader2 size={16} className="animate-spin mr-2" /> Creating...</>
                    ) : (
                      <><UserPlus size={16} className="mr-2" /> Create Account</>
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
