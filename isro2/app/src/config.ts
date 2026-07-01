export interface SiteConfig {
  language: string
  siteTitle: string
  siteDescription: string
}

export interface NavLink {
  label: string
  targetId: string
}

export interface NavigationConfig {
  brandMark: string
  links: NavLink[]
}

export interface HeroConfig {
  wordmarkText: string
  eyebrow: string
  titleLine1: string
  titleLine2: string
  descriptionLine1: string
  descriptionLine2: string
  ctaText: string
  ctaTargetId: string
}

export interface PhilosophyConfig {
  eyebrow: string
  title: string
  body: string
  rollingWords: string[]
}

export interface ProjectMeta {
  label: string
  value: string
}

export interface ProjectData {
  id: string
  title: string
  location: string
  year: string
  image: string
  subtitle: string
  meta: ProjectMeta[]
  paragraphs: string[]
}

export interface GalleryConfig {
  sectionLabel: string
  title: string
  projects: ProjectData[]
}

export interface MediumItem {
  cn: string
  en: string
  description: string
}

export interface MediumsConfig {
  sectionLabel: string
  items: MediumItem[]
}

export interface FooterEntry {
  text: string
  href?: string
}

export interface FooterColumn {
  heading: string
  entries: FooterEntry[]
}

export interface FooterConfig {
  visionText: string
  brandName: string
  columns: FooterColumn[]
  copyright: string
  videoPath: string
}

export interface ProjectDetailConfig {
  backLabel: string
}

export const siteConfig: SiteConfig = {
  language: "en",
  siteTitle: "Indra — AI Digital Twin of India's Climate",
  siteDescription: "An AI-powered digital twin of India's climate system for prediction, adaptation, and resilience using national datasets.",
}

export const navigationConfig: NavigationConfig = {
  brandMark: "IN",
  links: [
    { label: "Atmosphere", targetId: "hero-section" },
    { label: "Intelligence", targetId: "philosophy" },
    { label: "Sectors", targetId: "gallery" },
    { label: "Connect", targetId: "footer" },
  ],
}

export const heroConfig: HeroConfig = {
  wordmarkText: "INDRA CLIMATE",
  eyebrow: "NATIONAL CLIMATE INTELLIGENCE",
  titleLine1: "AI Digital Twin",
  titleLine2: "of India's Climate",
  descriptionLine1: "High-fidelity dynamic replica using real-time",
  descriptionLine2: "satellite, meteorological, and hydrological data.",
  ctaText: "Explore Data",
  ctaTargetId: "philosophy",
}

export const philosophyConfig: PhilosophyConfig = {
  eyebrow: "CLIMATE INTELLIGENCE",
  title: "Predict. Adapt. Resilient.",
  body: "Integrating INSAT, Oceansat, IMD networks, and reanalysis products with AI/ML to simulate atmospheric, oceanic, and land-surface processes at unprecedented resolution.",
  rollingWords: ["MONSOON", "FORECAST", "ADAPTATION", "RESILIENCE", "PREDICTION", "CLIMATE"],
}

export const galleryConfig: GalleryConfig = {
  sectionLabel: "CLIMATE SECTORS / 004",
  title: "Sector Intelligence",
  projects: [
    {
      id: "monsoon",
      title: "Monsoon",
      location: "All-India",
      year: "2025",
      image: "images/project-1.jpg",
      subtitle: "Dynamic monsoon prediction with 87% accuracy",
      meta: [
        { label: "TYPE", value: "Seasonal Forecast" },
        { label: "STATUS", value: "Active Monitoring" },
        { label: "MODEL", value: "ENSEMBLE-ML v3" },
        { label: "UPDATE", value: "Real-time" },
      ],
      paragraphs: [
        "The Southwest Monsoon is India's most critical climate phenomenon, delivering 70% of annual rainfall across the subcontinent. Our digital twin integrates INSAT-3D satellite imagery, IMD ground station networks, and ocean temperature anomalies to deliver sub-seasonal forecasts with unprecedented accuracy.",
        "Machine learning models process 40+ years of historical monsoon data combined with real-time ENSO indices, Indian Ocean Dipole measurements, and Madden-Julian Oscillation patterns. The ensemble approach considers multiple climate models to quantify prediction uncertainty.",
        "Agricultural stakeholders receive actionable insights including onset date predictions, rainfall distribution maps, and extreme event warnings. The system continuously learns from new observations, improving forecast skill with each season.",
        "Current season outlook indicates normal monsoon onset over Kerala by June 1st with spatial distribution favoring Central and Peninsular India. Farmers in Maharashtra and Karnataka should prepare for enhanced rainfall activity during July.",
      ],
    },
    {
      id: "agriculture",
      title: "Agriculture",
      location: "India",
      year: "2025",
      image: "images/project-2.jpg",
      subtitle: "Crop yield prediction across 600+ districts",
      meta: [
        { label: "TYPE", value: "Yield Forecast" },
        { label: "COVERAGE", value: "600+ Districts" },
        { label: "MODEL", value: "CROP-AI v2.5" },
        { label: "UPDATE", value: "Weekly" },
      ],
      paragraphs: [
        "India's agricultural sector feeds 1.4 billion people and contributes 18% to GDP. Our climate twin monitors soil moisture, temperature stress, and precipitation patterns across 600+ districts to predict crop yields for rice, wheat, pulses, and sugarcane.",
        "The system combines satellite-derived vegetation indices with weather forecasts and historical yield data. Deep learning models identify early stress signals, enabling proactive interventions before crop damage occurs.",
        "Real-time soil moisture maps derived from blended satellite products help optimize irrigation scheduling. Farmers receive district-level advisories via mobile interfaces, reducing water waste by up to 30% while maintaining yield targets.",
        "Current Kharif season projections indicate favorable conditions for rice cultivation in Eastern states, while Western regions may require supplementary irrigation. Wheat planting windows for Rabi season are being optimized based on soil temperature forecasts.",
      ],
    },
    {
      id: "urban",
      title: "Urban Heat",
      location: "Metros",
      year: "2025",
      image: "images/project-3.jpg",
      subtitle: "Urban heat island monitoring for 50+ cities",
      meta: [
        { label: "TYPE", value: "Heat Monitor" },
        { label: "CITIES", value: "50+ Metros" },
        { label: "MODEL", value: "URBAN-THERMAL" },
        { label: "UPDATE", value: "Hourly" },
      ],
      paragraphs: [
        "Indian cities are experiencing accelerated warming due to the Urban Heat Island effect. Our digital twin monitors land surface temperatures, air quality, and heat stress indices across 50+ major urban centers including Delhi, Mumbai, Bangalore, and Chennai.",
        "High-resolution thermal mapping identifies hotspot zones within cities, enabling targeted cooling interventions. The system correlates heat patterns with building density, vegetation cover, and traffic flows to recommend urban planning optimizations.",
        "Heat stress indices combine temperature, humidity, and wind data to calculate perceived comfort levels. Vulnerable populations receive early warnings through integrated city disaster management systems.",
        "Delhi currently shows 4.2°C elevated temperatures compared to surrounding rural areas. Nighttime cooling potential analysis recommends increasing urban green cover by 15% in East Delhi to achieve measurable heat reduction.",
      ],
    },
    {
      id: "hydrology",
      title: "Water",
      location: "Basins",
      year: "2025",
      image: "images/project-4.jpg",
      subtitle: "River basin management across 20 major basins",
      meta: [
        { label: "TYPE", value: "Hydrology" },
        { label: "BASINS", value: "20 Major" },
        { label: "MODEL", value: "AQUA-FLOW v2" },
        { label: "UPDATE", value: "Daily" },
      ],
      paragraphs: [
        "Water security is India's most pressing climate challenge. Our digital twin monitors 20 major river basins, tracking reservoir levels, groundwater tables, and snowmelt patterns to optimize water resource allocation across agricultural, industrial, and domestic sectors.",
        "Real-time reservoir telemetry provides accurate inflow forecasts, enabling dam operators to optimize storage and release decisions. Machine learning models predict water demand patterns weeks in advance, supporting proactive distribution planning.",
        "The Ganga, Godavari, Krishna, and Cauvery basins are monitored with sub-basin resolution. Flood early warning systems integrate rainfall forecasts with terrain models to predict inundation patterns 72 hours in advance.",
        "Current analysis shows normal water availability in most basins, with the exception of the Cauvery basin which remains under stress. Farmers in Tamil Nadu and Karnataka are advised to adopt water-efficient cropping patterns for the upcoming season.",
      ],
    },
  ],
}

export const mediumsConfig: MediumsConfig = {
  sectionLabel: "DATA DOMAINS / 005",
  items: [
    {
      cn: "ATM",
      en: "ATMOSPHERE",
      description: "INSAT-3D/3DR satellite data, IMD radar networks, radiosonde profiles, and reanalysis products driving atmospheric simulation at 4km resolution.",
    },
    {
      cn: "OCE",
      en: "OCEANIC",
      description: "Oceansat-3 observations, sea surface temperature anomalies, ocean color, and subsurface thermal structure from ARGO floats.",
    },
    {
      cn: "LND",
      en: "LAND SURFACE",
      description: "Soil moisture from combined passive/active microwave, land surface temperature, vegetation indices, and hydrological modeling outputs.",
    },
    {
      cn: "ML",
      en: "AI / ML CORE",
      description: "Ensemble neural networks, variational assimilation, transformer-based temporal forecasting, and reinforcement learning for adaptation strategies.",
    },
    {
      cn: "POL",
      en: "POLICY",
      description: "Scenario testing frameworks for policymakers evaluating climate adaptation, urban planning, agricultural risk, and water resource allocation.",
    },
  ],
}

export const footerConfig: FooterConfig = {
  visionText: "Building a self-reliant, data-driven climate intelligence infrastructure for India. Integrating observations from space, land, and ocean with cutting-edge artificial intelligence to safeguard 1.4 billion lives against climate uncertainty.",
  brandName: "INDRA",
  columns: [
    {
      heading: "SECTORS",
      entries: [
        { text: "Agriculture", href: "/agriculture" },
        { text: "Water Resources", href: "/water" },
        { text: "Urban Climate", href: "/urban" },
        { text: "AI Assistant", href: "/ai-assistant" },
      ],
    },
    {
      heading: "DATA",
      entries: [
        { text: "INSAT-3D/3DR", href: "#" },
        { text: "Oceansat-3", href: "#" },
        { text: "IMD Networks", href: "#" },
        { text: "NRSC Archives", href: "#" },
      ],
    },
    {
      heading: "ABOUT",
      entries: [
        { text: "Mission" },
        { text: "Partners\nISRO · IMD · MoES\nNRSC · NCMRWF" },
        { text: "Contact", href: "/contact" },
      ],
    },
  ],
  copyright: "2025 Indra Climate Twin. National Data Initiative.",
  videoPath: "",
}

export const projectDetailConfig: ProjectDetailConfig = {
  backLabel: "Back",
}

export function getProjectById(id: string): ProjectData | undefined {
  return galleryConfig.projects.find((p) => p.id === id)
}
