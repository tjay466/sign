export type AnnouncementType = "text" | "image" | "youtube" | "template" | "weather";

export interface Announcement {
  id: string;
  type: AnnouncementType;
  text?: string;
  subtitle?: string;
  mediaUrl?: string; // For images, YouTube IDs, or template background
  duration: number;
  templateId?: string;
  cta?: string;
  price?: string;
  forecastDays?: 3 | 7;
}

export interface ThemeConfig {
  backgroundColor: string;
  accentColor: string;
  textColor: string;
  fontFamily: string;
  safeAreaPadding?: string; // e.g. "5%" or "20px"
}

export interface GardenCondition {
  id: string;
  label: string;
  value: string;
  icon: "Sun" | "Cloud" | "Droplets" | "Thermometer" | "Wind";
}

export interface WeatherConfig {
  city: string;
  lat: number;
  lon: number;
  enabled: boolean;
  forecastDays: 1 | 3 | 7;
  units: 'metric' | 'imperial';
  showAsSlide: boolean;
}

export interface ForecastDay {
  date: string;
  maxTemp: number;
  minTemp: number;
  condition: string;
}

export interface MusicConfig {
  url: string;
  volume: number;
  enabled: boolean;
}

export interface SignageData {
  storeName: string;
  logoUrl?: string;
  announcements: Announcement[];
  conditions: GardenCondition[];
  weatherConfig: WeatherConfig;
  forecast: ForecastDay[];
  musicConfig: MusicConfig;
  tickerText?: string;
  theme: ThemeConfig;
  lastUpdated: number;
}
