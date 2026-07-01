import { useState, useMemo } from 'react';
import { Zap, CloudRain, Thermometer, Droplets, TrendingDown, AlertTriangle } from 'lucide-react';

interface Inputs {
  monsoonDeficit: number;
  tempAnomaly: number;
  reservoirLevel: number;
  groundwaterStress: number;
}

interface Impact {
  category: string;
  metric: string;
  value: string;
  severity: 'critical' | 'warning' | 'moderate' | 'low';
  detail: string;
}

function compute(inp: Inputs): Impact[] {
  const { monsoonDeficit, tempAnomaly, reservoirLevel, groundwaterStress } = inp;

  const kharifHit = (monsoonDeficit * 0.65) + (tempAnomaly * 3.2) + Math.max(0, (50 - reservoirLevel) * 0.3);
  const kharifChange = -Math.min(kharifHit, 45);

  const waterStressScore = (monsoonDeficit * 0.8) + (groundwaterStress * 0.4) + Math.max(0, (60 - reservoirLevel) * 0.5);
  const criticalDistricts = Math.round(Math.min(waterStressScore * 3.8, 310));

  const reservoirFill = Math.max(18, reservoirLevel - monsoonDeficit * 0.7);
  const foodInflation = Math.abs(kharifChange) * 0.28 + monsoonDeficit * 0.12;
  const heatRiskPct = Math.min((tempAnomaly * 18) + (monsoonDeficit * 0.4), 100);
  const farmersAffected = Math.round((Math.abs(kharifChange) / 100) * 142);
  const economicLoss = ((Math.abs(kharifChange) * 850) + (waterStressScore * 120) + (heatRiskPct * 45)) / 1000;

  const sev = (val: number, t: [number, number, number]): Impact['severity'] =>
    val >= t[2] ? 'critical' : val >= t[1] ? 'warning' : val >= t[0] ? 'moderate' : 'low';

  return [
    {
      category: 'Kharif Crop Yield',
      metric: `${kharifChange.toFixed(1)}%`,
      value: `${(14.2 + 14.2 * kharifChange / 100).toFixed(1)} Cr Tonnes`,
      severity: sev(Math.abs(kharifChange), [5, 15, 25]),
      detail: `Rice, Cotton, Soybean most affected. ${Math.abs(kharifChange) > 20 ? 'National food security at risk.' : 'Manageable with intervention.'}`,
    },
    {
      category: 'Districts Water Critical',
      metric: `${criticalDistricts}`,
      value: `${Math.round(criticalDistricts / 6.4)}% of India`,
      severity: sev(criticalDistricts, [30, 80, 150]),
      detail: `Rajasthan, Gujarat, TN, AP basins under stress. Reservoir fill: ${reservoirFill.toFixed(0)}%.`,
    },
    {
      category: 'Reservoir Fill',
      metric: `${reservoirFill.toFixed(0)}%`,
      value: `${(reservoirFill * 2.1).toFixed(0)} BCM stored`,
      severity: reservoirFill < 40 ? 'critical' : reservoirFill < 60 ? 'warning' : reservoirFill < 75 ? 'moderate' : 'low',
      detail: reservoirFill < 50 ? 'Kharif + Rabi irrigation in jeopardy.' : 'Irrigation supply manageable.',
    },
    {
      category: 'Food Inflation Risk',
      metric: `+${foodInflation.toFixed(1)}%`,
      value: `${foodInflation > 8 ? 'High' : foodInflation > 5 ? 'Moderate' : 'Low'} CPI pressure`,
      severity: sev(foodInflation, [3, 6, 10]),
      detail: 'Pulses & vegetables most volatile. RBI stagflation risk.',
    },
    {
      category: 'Urban Heat Risk',
      metric: `${heatRiskPct.toFixed(0)}%`,
      value: `${Math.round(heatRiskPct * 0.6)} cities on alert`,
      severity: sev(heatRiskPct, [20, 45, 70]),
      detail: 'Delhi, Jaipur, Ahmedabad at extreme risk. NDMA Heat Action Plans needed.',
    },
    {
      category: 'Farmers Affected',
      metric: `${farmersAffected}M`,
      value: `₹${economicLoss.toFixed(1)}L Cr loss`,
      severity: sev(farmersAffected, [5, 15, 30]),
      detail: `${Math.round(farmersAffected * 0.35)}M marginal farmers need emergency MSP support.`,
    },
  ];
}

const sevStyle = {
  critical: { border: 'border-red-500/30', bg: 'bg-red-500/10', text: 'text-red-400' },
  warning: { border: 'border-amber-500/30', bg: 'bg-amber-500/10', text: 'text-amber-400' },
  moderate: { border: 'border-blue-500/30', bg: 'bg-blue-500/10', text: 'text-blue-400' },
  low: { border: 'border-green-500/30', bg: 'bg-green-500/10', text: 'text-green-400' },
};

const PRESETS = [
  { name: 'Normal Year', inputs: { monsoonDeficit: 0, tempAnomaly: 0, reservoirLevel: 78, groundwaterStress: 35 } },
  { name: '2023 Drought', inputs: { monsoonDeficit: 22, tempAnomaly: 1.8, reservoirLevel: 48, groundwaterStress: 55 } },
  { name: '2050 Scenario', inputs: { monsoonDeficit: 35, tempAnomaly: 3.5, reservoirLevel: 35, groundwaterStress: 70 } },
  { name: 'Worst Case', inputs: { monsoonDeficit: 48, tempAnomaly: 5, reservoirLevel: 22, groundwaterStress: 80 } },
];

export default function ScenarioSimulator() {
  const [inputs, setInputs] = useState<Inputs>({ monsoonDeficit: 0, tempAnomaly: 0, reservoirLevel: 78, groundwaterStress: 35 });
  const [isRunning, setIsRunning] = useState(false);
  const [hasRun, setHasRun] = useState(false);

  const impacts = useMemo(() => compute(inputs), [inputs]);
  const criticalImpacts = impacts.filter(i => i.severity === 'critical').length;
  const overallSev = criticalImpacts >= 2 ? 'critical' : impacts.filter(i => i.severity === 'warning').length >= 2 ? 'warning' : 'moderate';

  const run = () => {
    setIsRunning(true);
    setTimeout(() => { setIsRunning(false); setHasRun(true); }, 1200);
  };

  const set = (key: keyof Inputs, val: number) => setInputs(p => ({ ...p, [key]: val }));

  const showResults = hasRun || inputs.monsoonDeficit > 0 || inputs.tempAnomaly > 0;

  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-white font-light text-xl">Scenario Simulator</h2>
          <p className="text-white/30 text-xs mt-0.5">Model "what if" climate events — see cascading real-world impacts</p>
        </div>
        <div className="flex items-center gap-1.5">
          <Zap size={14} className="text-amber-400" />
          <span className="text-amber-400 text-xs">Digital Twin Engine</span>
        </div>
      </div>

      {/* Presets */}
      <div className="flex flex-wrap gap-2 mb-5">
        {PRESETS.map(p => (
          <button
            key={p.name}
            onClick={() => { setInputs(p.inputs); setHasRun(true); }}
            className="px-3 py-1.5 rounded-lg border border-white/10 text-white/40 text-xs hover:text-white hover:border-white/25 transition-all"
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
        {[
          { key: 'monsoonDeficit' as const, label: 'Monsoon Deficit', min: 0, max: 50, step: 1, unit: '% below normal', Icon: CloudRain, color: '#60a5fa' },
          { key: 'tempAnomaly' as const, label: 'Temp Anomaly', min: 0, max: 5, step: 0.1, unit: '°C above avg', Icon: Thermometer, color: '#f87171' },
          { key: 'reservoirLevel' as const, label: 'Reservoir Level', min: 20, max: 100, step: 1, unit: '% capacity', Icon: Droplets, color: '#22d3ee' },
          { key: 'groundwaterStress' as const, label: 'Groundwater Stress', min: 0, max: 80, step: 1, unit: '% stressed', Icon: TrendingDown, color: '#fbbf24' },
        ].map(({ key, label, min, max, step, unit, Icon, color }) => {
          const val = inputs[key];
          const pct = ((val - min) / (max - min)) * 100;
          return (
            <div key={key}>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-1.5">
                  <Icon size={12} style={{ color }} />
                  <span className="text-white/50 text-xs">{label}</span>
                </div>
                <span className="text-sm font-light" style={{ color }}>
                  {key === 'tempAnomaly' ? val.toFixed(1) : val}
                  <span className="text-white/25 text-xs ml-1">{unit}</span>
                </span>
              </div>
              <input
                type="range"
                min={min} max={max} step={step} value={val}
                onChange={e => set(key, parseFloat(e.target.value))}
                className="w-full h-1 rounded-full appearance-none cursor-pointer bg-white/10"
                style={{ accentColor: color }}
              />
            </div>
          );
        })}
      </div>

      {/* Run button */}
      <button
        onClick={run}
        disabled={isRunning}
        className="w-full py-2.5 rounded-lg border border-amber-500/30 text-amber-400 text-xs tracking-widest uppercase hover:bg-amber-500/10 transition-all disabled:opacity-40 mb-5"
      >
        {isRunning ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-3 h-3 border border-amber-400 border-t-transparent rounded-full animate-spin" />
            Running cascade model...
          </span>
        ) : 'Run Cascade Simulation'}
      </button>

      {/* Results */}
      {showResults && (
        <>
          <div className={`p-3 rounded-lg mb-4 flex items-center gap-2 ${
            overallSev === 'critical' ? 'bg-red-500/10 border border-red-500/20' :
            overallSev === 'warning' ? 'bg-amber-500/10 border border-amber-500/20' :
            'bg-blue-500/10 border border-blue-500/20'
          }`}>
            <AlertTriangle size={13} className={overallSev === 'critical' ? 'text-red-400' : overallSev === 'warning' ? 'text-amber-400' : 'text-blue-400'} />
            <span className={`text-xs ${overallSev === 'critical' ? 'text-red-300' : overallSev === 'warning' ? 'text-amber-300' : 'text-blue-300'}`}>
              {overallSev === 'critical' ? `Critical cascading failure across ${criticalImpacts} sectors` :
               overallSev === 'warning' ? 'Significant multi-sector stress — policy intervention required' :
               'Low impact — current systems can absorb this scenario'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {impacts.map((impact, i) => {
              const s = sevStyle[impact.severity];
              return (
                <div key={i} className={`p-3 rounded-lg border ${s.border} ${s.bg}`}>
                  <p className="text-white/30 text-[10px] uppercase tracking-wider mb-1">{impact.category}</p>
                  <p className={`text-xl font-light ${s.text}`}>{impact.metric}</p>
                  <p className="text-white/40 text-xs mb-1.5">{impact.value}</p>
                  <p className="text-white/25 text-[10px] leading-relaxed">{impact.detail}</p>
                </div>
              );
            })}
          </div>
        </>
      )}

      {!showResults && (
        <div className="text-center py-10 text-white/15 text-sm">
          Adjust sliders or pick a preset scenario above
        </div>
      )}
    </div>
  );
}