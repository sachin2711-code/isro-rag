import { useState, useEffect, useRef } from 'react';
import { trpc } from '@/providers/trpc';
import AppLayout from '@/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Droplets,
  Waves,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  MapPin,
  Activity,
  BarChart3,
  Play,
  Loader2,
  Thermometer,
  Gauge,
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const RESERVOIR_DATA = [
  { name: 'Bhakra Nangal', basin: 'Sutlej', capacity: 78, inflow: 12500, outflow: 8900, status: 'normal' as const },
  { name: 'Nagarjuna Sagar', basin: 'Krishna', capacity: 45, inflow: 8200, outflow: 10200, status: 'warning' as const },
  { name: 'Sardar Sarovar', basin: 'Narmada', capacity: 62, inflow: 15600, outflow: 12300, status: 'normal' as const },
  { name: 'Hirakud', basin: 'Mahanadi', capacity: 71, inflow: 9800, outflow: 7400, status: 'normal' as const },
  { name: 'Mettur', basin: 'Cauvery', capacity: 34, inflow: 3200, outflow: 5600, status: 'critical' as const },
  { name: 'Ukai', basin: 'Tapi', capacity: 55, inflow: 6700, outflow: 5900, status: 'warning' as const },
];

const BASIN_DATA = [
  { name: 'Ganga', storage: 42.8, capacity: 55.2, status: 'normal' as const, states: 'UP, Bihar, WB' },
  { name: 'Godavari', storage: 18.5, capacity: 22.1, status: 'normal' as const, states: 'Maharashtra, TS, AP' },
  { name: 'Krishna', storage: 15.2, capacity: 20.8, status: 'normal' as const, states: 'Maharashtra, Karnataka, AP' },
  { name: 'Cauvery', storage: 6.8, capacity: 12.5, status: 'warning' as const, states: 'Karnataka, Tamil Nadu' },
  { name: 'Narmada', storage: 12.4, capacity: 16.2, status: 'normal' as const, states: 'MP, Gujarat' },
  { name: 'Brahmaputra', storage: 28.6, capacity: 35.0, status: 'normal' as const, states: 'Assam, Arunachal' },
];

const RIVER_NODES = [
  { id: 1, name: 'Gangotri', x: 25, y: 15, data: 'Source: 3,048m' },
  { id: 2, name: 'Haridwar', x: 35, y: 30, data: 'Flow: 2,500 m³/s' },
  { id: 3, name: 'Kanpur', x: 45, y: 40, data: 'Quality: Moderate' },
  { id: 4, name: 'Patna', x: 55, y: 50, data: 'Flow: 5,800 m³/s' },
  { id: 5, name: 'Delta', x: 70, y: 65, data: 'Basin: 72% Full' },
];

export default function WaterPage() {
  const [selectedBasin, setSelectedBasin] = useState('Ganga');
  const [simLoading, setSimLoading] = useState(false);
  const [activeNode, setActiveNode] = useState<number | null>(null);
  const riverRef = useRef<SVGSVGElement>(null);

  const basinQuery = trpc.climate.getRegionalData.useQuery(
    { region: selectedBasin, parameters: ['temperature', 'rainfall', 'humidity'] },
    { staleTime: 30000 }
  );

  const alertsQuery = trpc.alerts.getActive.useQuery(
    { sector: 'water' },
    { staleTime: 30000 }
  );

  const simulationMutation = trpc.simulation.run.useMutation();

  useEffect(() => {
    if (!riverRef.current) return;
    gsap.fromTo('.river-path',
      { strokeDashoffset: 1000 },
      { strokeDashoffset: 0, duration: 3, ease: 'power2.out' }
    );
    gsap.fromTo('.river-node',
      { opacity: 0, scale: 0 },
      { opacity: 1, scale: 1, stagger: 0.2, duration: 0.5, ease: 'back.out(1.7)', delay: 1 }
    );
  }, []);

  const runSimulation = async () => {
    setSimLoading(true);
    try {
      await simulationMutation.mutateAsync({
        type: 'water',
        region: selectedBasin,
        parameters: { basin_type: 'river', scenario: 'monsoon' },
      });
    } finally {
      setSimLoading(false);
    }
  };

  return (
    <AppLayout>
      {/* Hero */}
      <section className="relative overflow-hidden py-20 lg:py-32 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 to-transparent" />
        <div className="relative max-w-7xl mx-auto">
          <Badge variant="outline" className="border-blue-500/30 text-blue-400 mb-4">
            <Droplets size={12} className="mr-1" /> HYDROLOGY
          </Badge>
          <h1 className="text-4xl lg:text-6xl font-light tracking-tight text-white mb-4">
            Water Resources
          </h1>
          <p className="text-lg text-white/50 max-w-2xl">
            Real-time monitoring of 20 major river basins, reservoir telemetry, and flood early warning systems. AI-powered water resource optimization for agricultural, industrial, and domestic sectors.
          </p>
        </div>
      </section>

      {/* Animated River Infographic */}
      <section className="px-4 mb-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl font-light text-white tracking-wide mb-6">Ganga Basin Flow Monitor</h2>
          <Card className="bg-white/[0.03] border-white/10 overflow-hidden">
            <CardContent className="p-0">
              <div className="relative w-full aspect-[16/7] bg-gradient-to-b from-[#0a1628] to-[#050A0F]">
                <svg ref={riverRef} viewBox="0 0 100 80" className="w-full h-full">
                  <defs>
                    <linearGradient id="riverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3B82F6" />
                      <stop offset="100%" stopColor="#2DD4BF" />
                    </linearGradient>
                  </defs>
                  {/* River path */}
                  <path
                    className="river-path"
                    d="M 15 10 Q 20 15, 25 15 Q 30 15, 35 25 Q 40 35, 45 38 Q 50 40, 55 48 Q 60 55, 65 58 Q 70 60, 78 68"
                    fill="none"
                    stroke="url(#riverGrad)"
                    strokeWidth="0.8"
                    strokeLinecap="round"
                    strokeDasharray="1000"
                    strokeDashoffset="1000"
                  />
                  {/* Tributaries */}
                  <path
                    className="river-path"
                    d="M 35 20 Q 38 22, 42 28 Q 44 32, 45 38"
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="0.4"
                    strokeLinecap="round"
                    strokeDasharray="500"
                    strokeDashoffset="500"
                    opacity="0.5"
                  />
                  <path
                    className="river-path"
                    d="M 50 30 Q 52 35, 55 48"
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="0.4"
                    strokeLinecap="round"
                    strokeDasharray="500"
                    strokeDashoffset="500"
                    opacity="0.5"
                  />
                  {/* Nodes */}
                  {RIVER_NODES.map((node) => (
                    <g
                      key={node.id}
                      className="river-node cursor-pointer"
                      onClick={() => setActiveNode(activeNode === node.id ? null : node.id)}
                    >
                      <circle cx={node.x} cy={node.y} r="2" fill="#3B82F6" opacity="0.8">
                        <animate attributeName="r" values="2;2.5;2" dur="3s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.8;0.5;0.8" dur="3s" repeatCount="indefinite" />
                      </circle>
                      <text x={node.x} y={node.y - 4} textAnchor="middle" fill="white" fontSize="2.5" opacity="0.8">
                        {node.name}
                      </text>
                    </g>
                  ))}
                </svg>
                {/* Tooltip overlay */}
                {activeNode && (
                  <div
                    className="absolute bg-[#0f1729]/95 backdrop-blur border border-blue-500/30 rounded-lg px-3 py-2 text-sm"
                    style={{
                      left: `${RIVER_NODES.find(n => n.id === activeNode)!.x}%`,
                      top: `${RIVER_NODES.find(n => n.id === activeNode)!.y - 10}%`,
                      transform: 'translate(-50%, -100%)',
                    }}
                  >
                    <p className="text-white font-medium">{RIVER_NODES.find(n => n.id === activeNode)!.name}</p>
                    <p className="text-blue-400 text-xs">{RIVER_NODES.find(n => n.id === activeNode)!.data}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Reservoir Telemetry */}
      <section className="px-4 mb-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-light text-white tracking-wide">Reservoir Telemetry</h2>
            <Badge className="bg-blue-500/20 text-blue-400">
              <Activity size={12} className="mr-1" /> Live
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {RESERVOIR_DATA.map((res) => (
              <Card key={res.name} className="bg-white/[0.03] border-white/10">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="text-white font-medium text-sm">{res.name}</h3>
                      <p className="text-white/40 text-xs">{res.basin} Basin</p>
                    </div>
                    <Badge
                      className={
                        res.status === 'normal'
                          ? 'bg-blue-500/20 text-blue-400'
                          : res.status === 'warning'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-red-500/20 text-red-400'
                      }
                    >
                      {res.status}
                    </Badge>
                  </div>
                  <div className="mb-2">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-white/40">Capacity</span>
                      <span className="text-white">{res.capacity}%</span>
                    </div>
                    <Progress value={res.capacity} className="h-2 bg-white/10" />
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                    <div className="flex items-center gap-1.5">
                      <TrendingUp size={10} className="text-emerald-400" />
                      <span className="text-white/40">In: </span>
                      <span className="text-white">{res.inflow.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <TrendingDown size={10} className="text-amber-400" />
                      <span className="text-white/40">Out: </span>
                      <span className="text-white">{res.outflow.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Basin Overview */}
      <section className="px-4 mb-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl font-light text-white tracking-wide mb-6">River Basin Status</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-3">
              {BASIN_DATA.map((basin) => (
                <Card
                  key={basin.name}
                  className={`bg-white/[0.03] border-white/10 cursor-pointer transition-all hover:border-white/20 ${
                    selectedBasin === basin.name ? 'ring-1 ring-blue-500/50' : ''
                  }`}
                  onClick={() => setSelectedBasin(basin.name)}
                >
                  <CardContent className="p-3 flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-white text-sm font-medium">{basin.name}</span>
                        <Badge
                          className={
                            basin.status === 'normal' ? 'bg-blue-500/20 text-blue-400' : 'bg-amber-500/20 text-amber-400'
                          }
                        >
                          {basin.status}
                        </Badge>
                      </div>
                      <div className="mt-1.5">
                        <Progress
                          value={(basin.storage / basin.capacity) * 100}
                          className="h-1.5 bg-white/10"
                        />
                        <div className="flex items-center justify-between text-[10px] text-white/30 mt-1">
                          <span>{basin.storage} BCM</span>
                          <span>{basin.capacity} BCM</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-white/[0.03] border-white/10">
              <CardHeader>
                <CardTitle className="text-white font-light text-lg flex items-center gap-2">
                  <BarChart3 size={18} className="text-blue-400" />
                  {selectedBasin} Basin Detail
                </CardTitle>
              </CardHeader>
              <CardContent>
                {basinQuery.isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {basinQuery.data?.map((param: any) => (
                      <div key={param.parameter} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                        <div className="flex items-center gap-2">
                          {param.parameter === 'temperature' && <Thermometer size={16} className="text-amber-400" />}
                          {param.parameter === 'rainfall' && <Droplets size={16} className="text-blue-400" />}
                          {param.parameter === 'humidity' && <Gauge size={16} className="text-teal-400" />}
                          <span className="text-white/60 text-sm capitalize">{param.parameter}</span>
                        </div>
                        <span className="text-white font-medium">
                          {param.value} {param.unit}
                        </span>
                      </div>
                    ))}
                    <Button
                      onClick={runSimulation}
                      disabled={simLoading}
                      className="w-full mt-4 bg-blue-600 hover:bg-blue-500 text-white"
                    >
                      {simLoading ? (
                        <><Loader2 size={16} className="animate-spin mr-2" /> Running...</>
                      ) : (
                        <><Play size={16} className="mr-2" /> Run Water Simulation</>
                      )}
                    </Button>
                    {simulationMutation.data && (
                      <div className="mt-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                        <p className="text-blue-400 text-sm">Simulation ID: {simulationMutation.data.id}</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Water Alerts */}
      <section className="px-4 mb-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl font-light text-white tracking-wide mb-6">Active Water Alerts</h2>
          <div className="space-y-3">
            {alertsQuery.data?.map((alert: any) => (
              <Card key={alert.id} className="bg-white/[0.03] border-white/10">
                <CardContent className="p-4 flex items-start gap-3">
                  <AlertTriangle
                    size={18}
                    className={
                      alert.severity === 'critical'
                        ? 'text-red-400 flex-shrink-0 mt-0.5'
                        : alert.severity === 'warning'
                        ? 'text-amber-400 flex-shrink-0 mt-0.5'
                        : 'text-blue-400 flex-shrink-0 mt-0.5'
                    }
                  />
                  <div>
                    <h4 className="text-white text-sm font-medium">{alert.title}</h4>
                    <p className="text-white/50 text-sm mt-1">{alert.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="border-white/10 text-white/40 text-[10px]">
                        {alert.region}
                      </Badge>
                      <span className="text-white/30 text-[10px]">
                        {new Date(alert.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )) || (
              <div className="text-center py-8 text-white/30">No active water alerts</div>
            )}
          </div>
        </div>
      </section>
    </AppLayout>
  );
}
