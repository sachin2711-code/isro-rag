import { useState, useEffect } from 'react';

type StressLevel = 'critical' | 'warning' | 'normal' | 'good';

interface StateData {
  id: string;
  name: string;
  x: number;
  y: number;
  temp: number;
  rainfall: number;
  stress: StressLevel;
  alertType?: string;
  population: number;
  affectedCrops?: string[];
}

const STATES: StateData[] = [
  { id: 'rajasthan', name: 'Rajasthan', x: 110, y: 190, temp: 43.5, rainfall: 28, stress: 'critical', alertType: 'Extreme Heat + Drought', population: 78, affectedCrops: ['Wheat', 'Bajra'] },
  { id: 'gujarat', name: 'Gujarat', x: 72, y: 268, temp: 42.1, rainfall: 52, stress: 'warning', alertType: 'Heat Wave', population: 68, affectedCrops: ['Cotton', 'Groundnut'] },
  { id: 'delhi', name: 'Delhi NCR', x: 158, y: 162, temp: 41.2, rainfall: 35, stress: 'critical', alertType: 'Heat Wave + Poor AQI', population: 32 },
  { id: 'haryana', name: 'Haryana', x: 145, y: 150, temp: 40.2, rainfall: 42, stress: 'critical', alertType: 'Extreme Heat', population: 29 },
  { id: 'up', name: 'Uttar Pradesh', x: 212, y: 195, temp: 39.8, rainfall: 78, stress: 'warning', alertType: 'Flood Risk (East UP)', population: 236, affectedCrops: ['Rice', 'Wheat', 'Sugarcane'] },
  { id: 'bihar', name: 'Bihar', x: 290, y: 218, temp: 37.2, rainfall: 95, stress: 'warning', alertType: 'Flood Risk', population: 128, affectedCrops: ['Rice', 'Maize'] },
  { id: 'wb', name: 'West Bengal', x: 345, y: 272, temp: 35.8, rainfall: 112, stress: 'warning', alertType: 'Cyclone Watch', population: 100 },
  { id: 'assam', name: 'Assam', x: 402, y: 208, temp: 32.5, rainfall: 168, stress: 'warning', alertType: 'Flood Alert', population: 35 },
  { id: 'odisha', name: 'Odisha', x: 302, y: 318, temp: 33.8, rainfall: 125, stress: 'warning', alertType: 'Cyclone Watch', population: 46 },
  { id: 'mp', name: 'Madhya Pradesh', x: 175, y: 265, temp: 38.5, rainfall: 92, stress: 'normal', population: 85, affectedCrops: ['Soybean', 'Wheat'] },
  { id: 'maharashtra', name: 'Maharashtra', x: 128, y: 342, temp: 36.2, rainfall: 88, stress: 'normal', population: 128, affectedCrops: ['Sugarcane', 'Cotton', 'Soybean'] },
  { id: 'chhattisgarh', name: 'Chhattisgarh', x: 240, y: 308, temp: 34.5, rainfall: 118, stress: 'good', population: 30 },
  { id: 'jharkhand', name: 'Jharkhand', x: 285, y: 262, temp: 34.2, rainfall: 108, stress: 'normal', population: 38 },
  { id: 'telangana', name: 'Telangana', x: 195, y: 375, temp: 36.8, rainfall: 68, stress: 'warning', alertType: 'Water Stress', population: 38, affectedCrops: ['Cotton', 'Rice'] },
  { id: 'andhra', name: 'Andhra Pradesh', x: 232, y: 400, temp: 35.2, rainfall: 75, stress: 'normal', population: 54 },
  { id: 'karnataka', name: 'Karnataka', x: 155, y: 428, temp: 32.5, rainfall: 62, stress: 'warning', alertType: 'Cauvery Water Crisis', population: 68, affectedCrops: ['Sugarcane', 'Ragi'] },
  { id: 'tamil_nadu', name: 'Tamil Nadu', x: 210, y: 460, temp: 34.8, rainfall: 58, stress: 'warning', alertType: 'Below Normal Rainfall', population: 78, affectedCrops: ['Rice', 'Banana'] },
  { id: 'kerala', name: 'Kerala', x: 148, y: 478, temp: 30.2, rainfall: 145, stress: 'good', population: 35 },
  { id: 'punjab', name: 'Punjab', x: 132, y: 132, temp: 38.8, rainfall: 55, stress: 'warning', alertType: 'Groundwater Depletion', population: 31, affectedCrops: ['Wheat', 'Rice'] },
  { id: 'kashmir', name: 'J&K / Ladakh', x: 122, y: 62, temp: 18.5, rainfall: 72, stress: 'normal', population: 14 },
];

const stressColors: Record<StressLevel, string> = {
  critical: '#ef4444',
  warning: '#f59e0b',
  normal: '#3b82f6',
  good: '#22c55e',
};

const stressGlow: Record<StressLevel, string> = {
  critical: 'rgba(239,68,68,0.35)',
  warning: 'rgba(245,158,11,0.25)',
  normal: 'rgba(59,130,246,0.2)',
  good: 'rgba(34,197,94,0.2)',
};

export default function IndiaMap({ onStateSelect }: { onStateSelect?: (state: StateData | null) => void }) {
  const [selectedState, setSelectedState] = useState<StateData | null>(null);
  const [hoveredState, setHoveredState] = useState<StateData | null>(null);
  const [tick, setTick] = useState(0);
  const [liveData, setLiveData] = useState<Record<string, number>>({});

  useEffect(() => {
    const interval = setInterval(() => {
      setTick(t => t + 1);
      const updated: Record<string, number> = {};
      STATES.forEach(s => {
        updated[s.id] = s.temp + (Math.random() - 0.5) * 0.4;
      });
      setLiveData(updated);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleStateClick = (state: StateData) => {
    const next = selectedState?.id === state.id ? null : state;
    setSelectedState(next);
    onStateSelect?.(next);
  };

  const criticalCount = STATES.filter(s => s.stress === 'critical').length;
  const warningCount = STATES.filter(s => s.stress === 'warning').length;
  const activeState = selectedState || hoveredState;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-white/50 text-xs uppercase tracking-wider">Live Climate Feed</span>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="text-red-400">{criticalCount} Critical</span>
          <span className="text-amber-400">{warningCount} Warning</span>
          <span className="text-white/20">{tick > 0 ? `${tick * 3}s` : 'now'}</span>
        </div>
      </div>

      <div className="flex gap-4">
        {/* SVG Map */}
        <div className="flex-1">
          <svg
            viewBox="0 0 500 560"
            className="w-full max-h-[480px]"
            style={{ filter: 'drop-shadow(0 0 30px rgba(59,130,246,0.08))' }}
          >
            <defs>
              <pattern id="indra-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.025)" strokeWidth="0.8" />
              </pattern>
              <filter id="indra-blur">
                <feGaussianBlur stdDeviation="4" />
              </filter>
              <style>{`
                @keyframes indra-pulse {
                  0% { opacity: 0.7; r: 0; }
                  100% { opacity: 0; r: 22; }
                }
                .pulse-a { animation: indra-pulse 2s ease-out infinite; transform-box: fill-box; transform-origin: center; }
                .pulse-b { animation: indra-pulse 2s ease-out infinite 0.6s; transform-box: fill-box; transform-origin: center; }
              `}</style>
            </defs>

            <rect width="500" height="560" fill="url(#indra-grid)" />

            {/* India outline */}
            <path
              d="M 120,58 C 125,35 145,15 175,10 L 240,8 L 300,22 L 355,42 L 398,72 L 435,98 L 458,128 L 468,162 L 462,195 L 448,222 L 432,248 L 415,262 L 402,272 L 385,288 L 362,308 L 338,335 L 315,362 L 290,388 L 268,412 L 248,436 L 228,455 L 210,472 L 192,488 L 175,500 L 160,510 L 155,505 L 143,492 L 130,475 L 115,455 L 100,432 L 88,408 L 78,382 L 70,355 L 64,328 L 58,300 L 52,272 L 46,245 L 40,218 L 36,190 L 38,162 L 45,138 L 55,115 L 68,94 L 85,76 L 100,62 L 112,56 Z"
              fill="rgba(255,255,255,0.018)"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="1.2"
            />

            {/* Sri Lanka */}
            <ellipse cx="198" cy="528" rx="7" ry="11" fill="rgba(255,255,255,0.018)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

            {/* Andaman islands */}
            <circle cx="462" cy="378" r="2.5" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" />
            <circle cx="460" cy="398" r="2" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" />

            {/* Glow zones */}
            {STATES.filter(s => s.stress === 'critical' || s.stress === 'warning').map(state => (
              <circle
                key={`glow-${state.id}`}
                cx={state.x}
                cy={state.y}
                r="30"
                fill={stressGlow[state.stress]}
                filter="url(#indra-blur)"
              />
            ))}

            {/* State points */}
            {STATES.map(state => {
              const isCritical = state.stress === 'critical';
              const isWarning = state.stress === 'warning';
              const isSelected = selectedState?.id === state.id;
              const isHovered = hoveredState?.id === state.id;
              const color = stressColors[state.stress];
              const r = isCritical ? 7 : isWarning ? 6 : 5;

              return (
                <g
                  key={state.id}
                  onClick={() => handleStateClick(state)}
                  onMouseEnter={() => setHoveredState(state)}
                  onMouseLeave={() => setHoveredState(null)}
                  style={{ cursor: 'pointer' }}
                >
                  {(isCritical || isWarning) && (
                    <circle cx={state.x} cy={state.y} r={r} fill={color} className="pulse-a" />
                  )}
                  {isCritical && (
                    <circle cx={state.x} cy={state.y} r={r} fill={color} className="pulse-b" />
                  )}
                  {isSelected && (
                    <circle cx={state.x} cy={state.y} r={r + 10} fill="none" stroke="white" strokeWidth="1" opacity="0.5" />
                  )}
                  <circle
                    cx={state.x}
                    cy={state.y}
                    r={isSelected || isHovered ? r + 2 : r}
                    fill={color}
                    opacity="0.9"
                  />
                  <circle cx={state.x} cy={state.y} r="2" fill="white" opacity="0.9" />
                  {(isCritical || isSelected || isHovered) && (
                    <text x={state.x + r + 3} y={state.y + 4} fontSize="7.5" fill="rgba(255,255,255,0.7)" style={{ pointerEvents: 'none', userSelect: 'none' }}>
                      {state.name.split(' ')[0]}
                    </text>
                  )}
                  {isCritical && (
                    <text x={state.x - 6} y={state.y - 11} fontSize="7" fill="#ef4444" opacity="0.9" style={{ pointerEvents: 'none' }}>
                      {(liveData[state.id] ?? state.temp).toFixed(1)}°
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Info panel */}
        <div className="w-48 flex flex-col gap-3 flex-shrink-0">
          {/* Legend */}
          <div className="bg-white/[0.03] border border-white/10 rounded-lg p-3">
            <p className="text-white/30 text-[10px] uppercase tracking-wider mb-2">Stress Index</p>
            {([
              ['critical', 'Critical', 'bg-red-500'],
              ['warning', 'Warning', 'bg-amber-500'],
              ['normal', 'Monitoring', 'bg-blue-500'],
              ['good', 'Normal', 'bg-green-500'],
            ] as const).map(([, label, dotColor]) => (
              <div key={label} className="flex items-center gap-2 mb-1.5">
                <div className={`w-2 h-2 rounded-full ${dotColor}`} />
                <span className="text-white/50 text-xs">{label}</span>
              </div>
            ))}
          </div>

          {/* State detail or summary */}
          {activeState ? (
            <div className="bg-white/[0.03] border border-white/10 rounded-lg p-3 flex-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: stressColors[activeState.stress] }} />
                <p className="text-white text-xs font-medium">{activeState.name}</p>
              </div>
              <div className="space-y-2.5">
                <div>
                  <p className="text-white/30 text-[10px]">Temperature</p>
                  <p className="text-white text-sm font-light">
                    {(liveData[activeState.id] ?? activeState.temp).toFixed(1)}°C
                    <span className={`ml-1 text-[10px] ${activeState.temp > 40 ? 'text-red-400' : 'text-amber-400'}`}>
                      {activeState.temp > 40 ? '▲ Extreme' : '▲ Elevated'}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-white/30 text-[10px]">Rainfall vs Normal</p>
                  <p className={`text-sm font-light ${activeState.rainfall < 60 ? 'text-red-400' : activeState.rainfall < 85 ? 'text-amber-400' : 'text-green-400'}`}>
                    {activeState.rainfall}%
                  </p>
                </div>
                <div>
                  <p className="text-white/30 text-[10px]">Population</p>
                  <p className="text-white text-sm font-light">{activeState.population}M</p>
                </div>
                {activeState.alertType && (
                  <div className="p-2 rounded bg-red-500/10 border border-red-500/20">
                    <p className="text-red-400 text-[10px]">{activeState.alertType}</p>
                  </div>
                )}
                {activeState.affectedCrops && (
                  <div>
                    <p className="text-white/30 text-[10px]">Crops at Risk</p>
                    <p className="text-amber-400/80 text-[10px]">{activeState.affectedCrops.join(', ')}</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white/[0.03] border border-white/10 rounded-lg p-3">
              <p className="text-white/30 text-[10px] mb-3 uppercase tracking-wider">System Status</p>
              <div className="space-y-2">
                {[
                  ['States Critical', criticalCount.toString(), 'text-red-400'],
                  ['States Warning', warningCount.toString(), 'text-amber-400'],
                  ['Pop. at Risk', `${STATES.filter(s => s.stress === 'critical' || s.stress === 'warning').reduce((a, s) => a + s.population, 0)}M`, 'text-white'],
                  ['Monsoon', '-6% Normal', 'text-amber-400'],
                ].map(([label, value, color]) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-white/40 text-xs">{label}</span>
                    <span className={`text-xs ${color}`}>{value}</span>
                  </div>
                ))}
              </div>
              <p className="text-white/15 text-[10px] mt-3">Click any point to explore</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}