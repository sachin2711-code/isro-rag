import { useState, useEffect, useRef } from 'react';
import { trpc } from '@/providers/trpc';
import AppLayout from '@/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  Building2,
  Thermometer,
  Wind,
  Droplets,
  Sun,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  MapPin,
  Activity,
  Play,
  Loader2,
  TreePine,
  Car,
  Factory,
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const CITIES = [
  {
    name: 'Delhi', temp: 41.2, heatIndex: 48.5, aqi: 312, humidity: 42, wind: 8.5,
    uhi: 4.2, greenCover: 12, status: 'critical' as const, population: '32M',
    cooling: 'Nighttime: 34°C', recommendations: ['Expand urban forests', 'Cool roof mandates', 'Shaded transit shelters'],
  },
  {
    name: 'Mumbai', temp: 34.8, heatIndex: 41.2, aqi: 156, humidity: 78, wind: 14.2,
    uhi: 2.8, greenCover: 18, status: 'warning' as const, population: '21M',
    cooling: 'Nighttime: 30°C', recommendations: ['Coastal ventilation corridors', 'Mangrove restoration', 'Elevated walkways'],
  },
  {
    name: 'Chennai', temp: 38.5, heatIndex: 45.1, aqi: 178, humidity: 68, wind: 12.8,
    uhi: 3.6, greenCover: 9, status: 'critical' as const, population: '11M',
    cooling: 'Nighttime: 32°C', recommendations: ['Lake restoration', 'Green belts', 'Permeable surfaces'],
  },
  {
    name: 'Bangalore', temp: 31.2, heatIndex: 34.8, aqi: 98, humidity: 55, wind: 10.4,
    uhi: 2.1, greenCover: 22, status: 'moderate' as const, population: '13M',
    cooling: 'Nighttime: 24°C', recommendations: ['Lake rejuvenation', 'Metro expansion', 'Tree cover increase'],
  },
  {
    name: 'Kolkata', temp: 36.7, heatIndex: 43.2, aqi: 189, humidity: 72, wind: 7.8,
    uhi: 3.1, greenCover: 8, status: 'warning' as const, population: '15M',
    cooling: 'Nighttime: 30°C', recommendations: ['East-west ventilation', 'Wetland preservation', 'Cool pavements'],
  },
  {
    name: 'Hyderabad', temp: 39.1, heatIndex: 44.8, aqi: 145, humidity: 45, wind: 9.2,
    uhi: 3.8, greenCover: 10, status: 'critical' as const, population: '10M',
    cooling: 'Nighttime: 31°C', recommendations: ['HMDA lake program', 'Urban forestry', 'Transit shading'],
  },
];

const HEAT_SOURCES = [
  { source: 'Buildings', contribution: 35, icon: Building2, color: 'bg-amber-500' },
  { source: 'Transport', contribution: 28, icon: Car, color: 'bg-red-500' },
  { source: 'Industry', contribution: 22, icon: Factory, color: 'bg-orange-500' },
  { source: 'Green Deficit', contribution: 15, icon: TreePine, color: 'bg-emerald-500' },
];

export default function UrbanPage() {
  const [selectedCity, setSelectedCity] = useState(CITIES[0]);
  const [simLoading, setSimLoading] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  const alertsQuery = trpc.alerts.getActive.useQuery(
    { sector: 'urban' },
    { staleTime: 30000 }
  );

  const simulationMutation = trpc.simulation.run.useMutation();

  useEffect(() => {
    if (!carouselRef.current) return;
    const cards = carouselRef.current.querySelectorAll('.city-card');
    gsap.fromTo(cards,
      { opacity: 0, rotateY: -45, x: -100 },
      {
        opacity: 1, rotateY: 0, x: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: carouselRef.current,
          start: 'top 80%',
        },
      }
    );
  }, []);

  const runSimulation = async () => {
    setSimLoading(true);
    try {
      await simulationMutation.mutateAsync({
        type: 'urban',
        region: selectedCity.name,
        parameters: { heat_mitigation: 'green_infrastructure' },
      });
    } finally {
      setSimLoading(false);
    }
  };

  return (
    <AppLayout>
      {/* Hero */}
      <section className="relative overflow-hidden py-20 lg:py-32 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-900/10 to-transparent" />
        <div className="relative max-w-7xl mx-auto">
          <Badge variant="outline" className="border-amber-500/30 text-amber-400 mb-4">
            <Building2 size={12} className="mr-1" /> URBAN THERMAL MONITORING
          </Badge>
          <h1 className="text-4xl lg:text-6xl font-light tracking-tight text-white mb-4">
            Urban Heat Intelligence
          </h1>
          <p className="text-lg text-white/50 max-w-2xl">
            High-resolution thermal mapping across 50+ Indian metros. AI-driven heat stress prediction, urban heat island analysis, and adaptive cooling strategies for resilient cities.
          </p>
        </div>
      </section>

      {/* City Carousel */}
      <section className="px-4 mb-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl font-light text-white tracking-wide mb-6">Metro Heat Stress Index</h2>
          <div
            ref={carouselRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            style={{ perspective: '900px' }}
          >
            {CITIES.map((city) => (
              <Card
                key={city.name}
                className={`city-card bg-white/[0.03] border-white/10 cursor-pointer transition-all hover:border-amber-500/30 ${
                  selectedCity.name === city.name ? 'ring-1 ring-amber-500/50' : ''
                }`}
                onClick={() => setSelectedCity(city)}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-white font-medium text-lg">{city.name}</h3>
                      <p className="text-white/40 text-xs flex items-center gap-1">
                        <MapPin size={10} /> {city.population} people
                      </p>
                    </div>
                    <Badge
                      className={
                        city.status === 'critical'
                          ? 'bg-red-500/20 text-red-400'
                          : city.status === 'warning'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-emerald-500/20 text-emerald-400'
                      }
                    >
                      {city.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-3xl font-light text-white">{city.temp}°C</div>
                      <p className="text-white/40 text-xs">Temperature</p>
                    </div>
                    <div>
                      <div className="text-3xl font-light text-amber-400">{city.heatIndex}°C</div>
                      <p className="text-white/40 text-xs">Feels Like</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/40 flex items-center gap-1"><Droplets size={10} /> Humidity</span>
                      <span className="text-white">{city.humidity}%</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/40 flex items-center gap-1"><Wind size={10} /> Wind</span>
                      <span className="text-white">{city.wind} km/h</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/40">AQI</span>
                      <Badge className={city.aqi > 200 ? 'bg-red-500/20 text-red-400' : city.aqi > 100 ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}>
                        {city.aqi}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* City Detail */}
      <section className="px-4 mb-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white/[0.03] border-white/10">
              <CardHeader>
                <CardTitle className="text-white font-light text-lg flex items-center gap-2">
                  <Thermometer size={18} className="text-amber-400" />
                  {selectedCity.name} — Heat Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg bg-white/5">
                      <p className="text-white/40 text-xs">UHI Effect</p>
                      <p className="text-white text-lg font-medium">+{selectedCity.uhi}°C</p>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5">
                      <p className="text-white/40 text-xs">Green Cover</p>
                      <p className="text-white text-lg font-medium">{selectedCity.greenCover}%</p>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5">
                      <p className="text-white/40 text-xs">Nighttime Low</p>
                      <p className="text-white text-lg font-medium">{selectedCity.cooling.split(': ')[1]}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5">
                      <p className="text-white/40 text-xs">Population</p>
                      <p className="text-white text-lg font-medium">{selectedCity.population}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-white/60 text-sm mb-2">Heat Sources Breakdown</p>
                    <div className="space-y-2">
                      {HEAT_SOURCES.map((src) => (
                        <div key={src.source}>
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-white/40 flex items-center gap-1">
                              <src.icon size={10} /> {src.source}
                            </span>
                            <span className="text-white">{src.contribution}%</span>
                          </div>
                          <Progress value={src.contribution} className="h-1.5 bg-white/10" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Card className="bg-white/[0.03] border-white/10">
                <CardHeader>
                  <CardTitle className="text-white font-light text-lg flex items-center gap-2">
                    <Sun size={18} className="text-amber-400" />
                    Adaptive Cooling Strategies
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedCity.recommendations.map((rec, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-white/5">
                        <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-amber-400 text-xs font-medium">{i + 1}</span>
                        </div>
                        <p className="text-white/70 text-sm">{rec}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/[0.03] border-white/10">
                <CardContent className="p-5">
                  <Button
                    onClick={runSimulation}
                    disabled={simLoading}
                    className="w-full bg-amber-600 hover:bg-amber-500 text-white"
                  >
                    {simLoading ? (
                      <><Loader2 size={16} className="animate-spin mr-2" /> Running Heat Sim...</>
                    ) : (
                      <><Play size={16} className="mr-2" /> Run Urban Heat Simulation</>
                    )}
                  </Button>
                  {simulationMutation.data && (
                    <div className="mt-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                      <p className="text-amber-400 text-sm">Sim ID: {simulationMutation.data.id}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Alerts */}
      <section className="px-4 mb-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl font-light text-white tracking-wide mb-6">Urban Heat Alerts</h2>
          <div className="space-y-3">
            {alertsQuery.data?.map((alert: any) => (
              <Card key={alert.id} className="bg-white/[0.03] border-white/10">
                <CardContent className="p-4 flex items-start gap-3">
                  <AlertTriangle
                    size={18}
                    className={
                      alert.severity === 'critical'
                        ? 'text-red-400 flex-shrink-0 mt-0.5'
                        : 'text-amber-400 flex-shrink-0 mt-0.5'
                    }
                  />
                  <div>
                    <h4 className="text-white text-sm font-medium">{alert.title}</h4>
                    <p className="text-white/50 text-sm mt-1">{alert.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="border-white/10 text-white/40 text-[10px]">
                        {alert.region}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )) || (
              <div className="text-center py-8 text-white/30">No active urban alerts</div>
            )}
          </div>
        </div>
      </section>
    </AppLayout>
  );
}
