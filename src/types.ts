export type AnnouncementType = "text" | "image" | "youtube" | "template";

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
}

export interface ThemeConfig {
  backgroundColor: string;
  accentColor: string;
  textColor: string;
  fontFamily: string;
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
  musicConfig: MusicConfig;
  tickerText?: string;
  theme: ThemeConfig;
  lastUpdated: number;
}
