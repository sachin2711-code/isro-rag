import { useState, useEffect, useRef } from 'react';
import { trpc } from '@/providers/trpc';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Sprout,
  TrendingUp,
  TrendingDown,
  Droplets,
  Sun,
  Wind,
  MapPin,
  Activity,
  BarChart3,
  Leaf,
  Wheat,
  Bean,
  Loader2,
  Play,
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const CROP_DATA = [
  { name: 'Rice', yield: '112.4 MT', change: '+2.1%', trend: 'up', area: '43.8M ha', status: 'normal' as const },
  { name: 'Wheat', yield: '105.0 MT', change: '+1.5%', trend: 'up', area: '31.6M ha', status: 'normal' as const },
  { name: 'Pulses', yield: '27.2 MT', change: '+3.8%', trend: 'up', area: '29.4M ha', status: 'normal' as const },
  { name: 'Sugarcane', yield: '405.0 MT', change: '-0.5%', trend: 'down', area: '5.5M ha', status: 'warning' as const },
  { name: 'Cotton', yield: '35.8 MT', change: '+4.3%', trend: 'up', area: '12.8M ha', status: 'normal' as const },
  { name: 'Soybean', yield: '13.2 MT', change: '+1.8%', trend: 'up', area: '12.2M ha', status: 'normal' as const },
];

const REGIONAL_DATA = [
  { region: 'Punjab', moisture: 62, temp: 34.2, rainfall: 650, risk: 'low' as const },
  { region: 'Maharashtra', moisture: 48, temp: 31.8, rainfall: 890, risk: 'moderate' as const },
  { region: 'Uttar Pradesh', moisture: 55, temp: 36.5, rainfall: 720, risk: 'low' as const },
  { region: 'Karnataka', moisture: 42, temp: 28.4, rainfall: 950, risk: 'moderate' as const },
  { region: 'West Bengal', moisture: 78, temp: 33.0, rainfall: 1600, risk: 'low' as const },
  { region: 'Tamil Nadu', moisture: 38, temp: 34.1, rainfall: 780, risk: 'high' as const },
];

export default function AgriculturePage() {
  const [selectedRegion, setSelectedRegion] = useState('Maharashtra');
  const [simLoading, setSimLoading] = useState(false);
  const bentoRef = useRef<HTMLDivElement>(null);

  const regionalQuery = trpc.climate.getRegionalData.useQuery(
    { region: selectedRegion, parameters: ['temperature', 'rainfall', 'humidity', 'soil_moisture'] },
    { staleTime: 30000 }
  );

  const simulationMutation = trpc.simulation.run.useMutation();

  useEffect(() => {
    if (!bentoRef.current) return;
    const cards = bentoRef.current.querySelectorAll('.bento-card');
    cards.forEach((card, i) => {
      gsap.fromTo(card,
        { opacity: 0, y: 40, scale: 0.95 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 0.6,
          delay: i * 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
          },
        }
      );
    });
    return () => { ScrollTrigger.getAll().forEach(t => t.kill()); };
  }, []);

  const runSimulation = async () => {
    setSimLoading(true);
    try {
      await simulationMutation.mutateAsync({
        type: 'agriculture',
        region: selectedRegion,
        parameters: { crop: 'rice', season: 'kharif' },
      });
    } finally {
      setSimLoading(false);
    }
  };

  return (
    <AppLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/10 to-transparent" />
        <div className="relative max-w-7xl mx-auto">
          <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 mb-4">
            <Sprout size={12} className="mr-1" /> AGRICULTURAL INTELLIGENCE
          </Badge>
          <h1 className="text-4xl lg:text-6xl font-light tracking-tight text-white mb-4">
            Predictive Agriculture
          </h1>
          <p className="text-lg text-white/50 max-w-2xl">
            AI-powered crop yield forecasting, soil moisture monitoring, and climate-risk assessment across 600+ districts. Integrating satellite data with ground observations for actionable agricultural intelligence.
          </p>
        </div>
      </section>

      {/* Crop Yield Bento Grid */}
      <section className="px-4 mb-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-light text-white tracking-wide">Crop Yield Forecasts</h2>
            <Badge className="bg-emerald-500/20 text-emerald-400">
              <Activity size={12} className="mr-1" /> Live
            </Badge>
          </div>
          <div ref={bentoRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {CROP_DATA.map((crop) => (
              <Card key={crop.name} className="bento-card bg-white/[0.03] border-white/10 hover:border-emerald-500/30 transition-all duration-300 group">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                        {crop.name === 'Rice' && <Leaf size={20} className="text-emerald-400" />}
                        {crop.name === 'Wheat' && <Wheat size={20} className="text-amber-400" />}
                        {crop.name === 'Pulses' && <Bean size={20} className="text-green-400" />}
                        {crop.name === 'Sugarcane' && <Sprout size={20} className="text-teal-400" />}
                        {crop.name === 'Cotton' && <Leaf size={20} className="text-indigo-400" />}
                        {crop.name === 'Soybean' && <Bean size={20} className="text-lime-400" />}
                      </div>
                      <div>
                        <h3 className="text-white font-medium">{crop.name}</h3>
                        <p className="text-white/40 text-xs">{crop.area}</p>
                      </div>
                    </div>
                    <Badge
                      variant={crop.trend === 'up' ? 'default' : 'destructive'}
                      className={crop.trend === 'up' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}
                    >
                      {crop.trend === 'up' ? <TrendingUp size={12} className="mr-1" /> : <TrendingDown size={12} className="mr-1" />}
                      {crop.change}
                    </Badge>
                  </div>
                  <div className="text-2xl font-light text-white">{crop.yield}</div>
                  <div className="mt-3">
                    <Progress value={crop.status === 'normal' ? 75 : 45} className="h-1.5 bg-white/10" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Regional Analysis */}
      <section className="px-4 mb-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl font-light text-white tracking-wide mb-6">Regional Soil Moisture & Risk</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {REGIONAL_DATA.map((region) => (
              <Card
                key={region.region}
                className={`bg-white/[0.03] border-white/10 cursor-pointer transition-all hover:border-white/20 ${
                  selectedRegion === region.region ? 'ring-1 ring-emerald-500/50' : ''
                }`}
                onClick={() => setSelectedRegion(region.region)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-white/40" />
                      <span className="text-white font-medium text-sm">{region.region}</span>
                    </div>
                    <Badge
                      className={
                        region.risk === 'low'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : region.risk === 'moderate'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-red-500/20 text-red-400'
                      }
                    >
                      {region.risk}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/40 flex items-center gap-1"><Droplets size={10} /> Moisture</span>
                      <span className="text-white">{region.moisture}%</span>
                    </div>
                    <Progress value={region.moisture} className="h-1 bg-white/10" />
                    <div className="flex items-center justify-between text-xs mt-2">
                      <span className="text-white/40 flex items-center gap-1"><Sun size={10} /> Temp</span>
                      <span className="text-white">{region.temp}°C</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/40 flex items-center gap-1"><Wind size={10} /> Rainfall</span>
                      <span className="text-white">{region.rainfall}mm</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Regional Detail + Simulation */}
      <section className="px-4 mb-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white/[0.03] border-white/10">
              <CardHeader>
                <CardTitle className="text-white font-light text-lg flex items-center gap-2">
                  <BarChart3 size={18} className="text-emerald-400" />
                  {selectedRegion} — Climate Parameters
                </CardTitle>
              </CardHeader>
              <CardContent>
                {regionalQuery.isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 size={24} className="animate-spin text-emerald-400" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {regionalQuery.data?.map((param: any) => (
                      <div key={param.parameter}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-white/60 capitalize">{param.parameter}</span>
                          <span className="text-sm text-white font-medium">
                            {param.value} {param.unit}
                          </span>
                        </div>
                        <div className="flex gap-1">
                          {param.forecast?.map((f: any, i: number) => (
                            <div key={i} className="flex-1">
                              <div
                                className="h-8 rounded bg-emerald-500/20 flex items-end justify-center pb-1"
                                style={{ opacity: 0.4 + (i * 0.1) }}
                              >
                                <div
                                  className="w-full rounded bg-emerald-500/40"
                                  style={{
                                    height: `${Math.min((f.value / (param.value * 1.2)) * 100, 100)}%`,
                                  }}
                                />
                              </div>
                              <p className="text-[10px] text-white/30 text-center mt-1">{f.day}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-white/[0.03] border-white/10">
              <CardHeader>
                <CardTitle className="text-white font-light text-lg flex items-center gap-2">
                  <Sprout size={18} className="text-emerald-400" />
                  Run Crop Simulation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/50 text-sm mb-4">
                  Run an AI-powered crop yield simulation for {selectedRegion} based on current climate parameters and historical yield patterns.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/40">Selected Region</span>
                    <Badge variant="outline" className="border-white/20 text-white">{selectedRegion}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/40">Simulation Type</span>
                    <span className="text-white text-sm">Agricultural Yield</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/40">Season</span>
                    <span className="text-white text-sm">Kharif 2025</span>
                  </div>
                </div>
                <Button
                  onClick={runSimulation}
                  disabled={simLoading}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white"
                >
                  {simLoading ? (
                    <><Loader2 size={16} className="animate-spin mr-2" /> Running Simulation...</>
                  ) : (
                    <><Play size={16} className="mr-2" /> Run Simulation</>
                  )}
                </Button>
                {simulationMutation.data && (
                  <div className="mt-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <p className="text-emerald-400 text-sm font-medium">Simulation Started</p>
                    <p className="text-white/40 text-xs mt-1">ID: {simulationMutation.data.id} — Status: {simulationMutation.data.status}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Advisory Section */}
      <section className="px-4 mb-16">
        <div className="max-w-7xl mx-auto">
          <Card className="bg-gradient-to-br from-emerald-900/20 to-[#050A0F] border-emerald-500/20">
            <CardContent className="p-6 lg:p-8">
              <h3 className="text-lg font-light text-white mb-3 flex items-center gap-2">
                <Sprout size={20} className="text-emerald-400" />
                Current Agricultural Advisory
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-white/60">
                <div>
                  <Badge className="bg-emerald-500/20 text-emerald-400 mb-2">Eastern India</Badge>
                  <p>Ideal sowing window for rice. Soil moisture adequate across Bihar, West Bengal, and Odisha.</p>
                </div>
                <div>
                  <Badge className="bg-amber-500/20 text-amber-400 mb-2">Maharashtra</Badge>
                  <p>Monitor for delayed monsoon. Have contingency short-duration crops ready.</p>
                </div>
                <div>
                  <Badge className="bg-emerald-500/20 text-emerald-400 mb-2">Gujarat</Badge>
                  <p>Cotton planting progressing well. Watch for early pest outbreaks.</p>
                </div>
                <div>
                  <Badge className="bg-red-500/20 text-red-400 mb-2">Tamil Nadu</Badge>
                  <p>Water stress detected. Adopt drip irrigation and drought-resistant varieties.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </AppLayout>
  );
}
