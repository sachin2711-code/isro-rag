import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import { trpc } from '@/providers/trpc';
import AppLayout from '@/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Shield,
  Users,
  MessageSquare,
  Activity,
  AlertTriangle,
  Mail,
  Clock,
  CheckCircle,
  Loader2,
} from 'lucide-react';

export default function AdminPage() {
  const { isAdmin, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isAdmin)) {
      navigate('/');
    }
  }, [isLoading, isAuthenticated, isAdmin, navigate]);

  const contactsQuery = trpc.contact.list.useQuery(undefined, { enabled: isAdmin, staleTime: 30000 });
  const alertsQuery = trpc.alerts.getAll.useQuery(undefined, { enabled: isAdmin, staleTime: 30000 });
  const simulationsQuery = trpc.simulation.listAll.useQuery(undefined, { enabled: isAdmin, staleTime: 30000 });
  const climateQuery = trpc.climate.getSnapshots.useQuery({ limit: 10 }, { enabled: isAdmin, staleTime: 30000 });

  const updateStatusMutation = trpc.contact.updateStatus.useMutation({
    onSuccess: () => contactsQuery.refetch(),
  });
  const resolveAlertMutation = trpc.alerts.resolve.useMutation({
    onSuccess: () => alertsQuery.refetch(),
  });

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 size={32} className="animate-spin text-white/50" />
        </div>
      </AppLayout>
    );
  }

  if (!isAdmin) return null;

  const stats = [
    { label: 'Total Contacts', value: contactsQuery.data?.length || 0, icon: Mail, color: 'text-blue-400' },
    { label: 'Active Alerts', value: alertsQuery.data?.filter((a: any) => a.isActive).length || 0, icon: AlertTriangle, color: 'text-amber-400' },
    { label: 'Simulations', value: simulationsQuery.data?.length || 0, icon: Activity, color: 'text-emerald-400' },
    { label: 'Climate Data', value: climateQuery.data?.length || 0, icon: Activity, color: 'text-indigo-400' },
  ];

  return (
    <AppLayout>
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Shield size={24} className="text-amber-400" />
            <h1 className="text-3xl font-light text-white">Admin Dashboard</h1>
            <Badge className="bg-amber-500/20 text-amber-400 ml-2">Admin</Badge>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat) => (
              <Card key={stat.label} className="bg-white/[0.03] border-white/10">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/40 text-xs">{stat.label}</p>
                      <p className="text-white text-2xl font-light">{stat.value}</p>
                    </div>
                    <stat.icon size={24} className={stat.color} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Tabs */}
          <Tabs defaultValue="contacts" className="space-y-4">
            <TabsList className="bg-white/5 border border-white/10">
              <TabsTrigger value="contacts" className="data-[state=active]:bg-white/10 text-white/60 data-[state=active]:text-white">
                <Mail size={14} className="mr-1.5" /> Contacts
              </TabsTrigger>
              <TabsTrigger value="alerts" className="data-[state=active]:bg-white/10 text-white/60 data-[state=active]:text-white">
                <AlertTriangle size={14} className="mr-1.5" /> Alerts
              </TabsTrigger>
              <TabsTrigger value="simulations" className="data-[state=active]:bg-white/10 text-white/60 data-[state=active]:text-white">
                <Activity size={14} className="mr-1.5" /> Simulations
              </TabsTrigger>
            </TabsList>

            <TabsContent value="contacts">
              <Card className="bg-white/[0.03] border-white/10">
                <CardHeader>
                  <CardTitle className="text-white font-light">Contact Submissions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {contactsQuery.data?.map((contact: any) => (
                      <div key={contact.id} className="p-4 rounded-lg bg-white/5 border border-white/5">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="text-white text-sm font-medium">{contact.name}</h4>
                            <p className="text-white/40 text-xs">{contact.email} {contact.organization && `· ${contact.organization}`}</p>
                            <p className="text-white/60 text-sm mt-2">{contact.message}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              className={
                                contact.status === 'new'
                                  ? 'bg-blue-500/20 text-blue-400'
                                  : contact.status === 'read'
                                  ? 'bg-amber-500/20 text-amber-400'
                                  : 'bg-emerald-500/20 text-emerald-400'
                              }
                            >
                              {contact.status}
                            </Badge>
                            {contact.status === 'new' && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-white/40 hover:text-white"
                                onClick={() => updateStatusMutation.mutate({ id: contact.id, status: 'read' })}
                              >
                                <CheckCircle size={14} />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    )) || (
                      <div className="text-center py-8 text-white/30">No contact submissions</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="alerts">
              <Card className="bg-white/[0.03] border-white/10">
                <CardHeader>
                  <CardTitle className="text-white font-light">Climate Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {alertsQuery.data?.map((alert: any) => (
                      <div key={alert.id} className="p-4 rounded-lg bg-white/5 border border-white/5">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="text-white text-sm font-medium">{alert.title}</h4>
                              <Badge
                                className={
                                  alert.severity === 'critical'
                                    ? 'bg-red-500/20 text-red-400'
                                    : alert.severity === 'warning'
                                    ? 'bg-amber-500/20 text-amber-400'
                                    : 'bg-blue-500/20 text-blue-400'
                                }
                              >
                                {alert.severity}
                              </Badge>
                            </div>
                            <p className="text-white/50 text-sm mt-1">{alert.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline" className="border-white/10 text-white/40 text-[10px]">
                                {alert.sector}
                              </Badge>
                              <Badge variant="outline" className="border-white/10 text-white/40 text-[10px]">
                                {alert.region}
                              </Badge>
                              <span className="text-white/30 text-[10px] flex items-center gap-1">
                                <Clock size={8} />
                                {new Date(alert.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          {alert.isActive && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-white/40 hover:text-white"
                              onClick={() => resolveAlertMutation.mutate({ id: alert.id })}
                            >
                              <CheckCircle size={14} />
                            </Button>
                          )}
                        </div>
                      </div>
                    )) || (
                      <div className="text-center py-8 text-white/30">No alerts</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="simulations">
              <Card className="bg-white/[0.03] border-white/10">
                <CardHeader>
                  <CardTitle className="text-white font-light">Simulation Runs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {simulationsQuery.data?.map((sim: any) => (
                      <div key={sim.id} className="p-4 rounded-lg bg-white/5 border border-white/5">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-white text-sm font-medium capitalize">{sim.simulationType}</h4>
                              <Badge
                                className={
                                  sim.status === 'completed'
                                    ? 'bg-emerald-500/20 text-emerald-400'
                                    : sim.status === 'running'
                                    ? 'bg-blue-500/20 text-blue-400'
                                    : 'bg-red-500/20 text-red-400'
                                }
                              >
                                {sim.status}
                              </Badge>
                            </div>
                            <p className="text-white/40 text-xs mt-1">
                              {sim.region} · User: {sim.userId} · Started: {new Date(sim.startedAt).toLocaleDateString()}
                            </p>
                          </div>
                          {sim.completedAt && (
                            <span className="text-white/30 text-xs">
                              Completed: {new Date(sim.completedAt).toLocaleTimeString()}
                            </span>
                          )}
                        </div>
                      </div>
                    )) || (
                      <div className="text-center py-8 text-white/30">No simulations</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </AppLayout>
  );
}
