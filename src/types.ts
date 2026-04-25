export type AnnouncementType = "text" | "image" | "youtube";

export interface Announcement {
  id: string;
  type: AnnouncementType;
  text?: string;
  mediaUrl?: string; // For images or YouTube IDs
  duration: number;
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

export interface SignageData {
  storeName: string;
  logoUrl?: string;
  announcements: Announcement[];
  conditions: GardenCondition[];
  weatherConfig: WeatherConfig;
  tickerText?: string;
  theme: ThemeConfig;
  lastUpdated: number;
}
