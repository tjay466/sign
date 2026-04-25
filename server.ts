import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // In-memory state for the signage
  let signageData = {
    storeName: "The Pond Warehouse",
    logoUrl: "https://petandpondwarehouse.com/cdn/shop/files/Logo.png?v=1748881219&width=90",
    announcements: [
      { id: "1", type: "text", text: "PREMIUM KOI ARRIVAL", duration: 8000 },
      { id: "2", type: "image", mediaUrl: "https://images.unsplash.com/photo-1544476074-ce453982cd6d?auto=format&fit=crop&q=80&w=2000", text: "NEW AQUATIC PLANTS", duration: 7000 },
      { id: "3", type: "youtube", mediaUrl: "P9yF599p21I", duration: 30000 },
      { id: "4", type: "text", text: "WATERFALL STONES 20% OFF", duration: 7000 },
    ],
    conditions: [
      { id: "weather-temp", label: "Edmonton Air", value: "--°C", icon: "Thermometer" },
      { id: "weather-wind", label: "Wind Speed", value: "-- km/h", icon: "Wind" },
      { id: "weather-uv", label: "UV Index", value: "--", icon: "Sun" },
      { id: "weather-algae", label: "Algae Risk", value: "Low", icon: "Leaf" },
      { id: "c1", label: "PH Level", value: "7.2", icon: "Droplets" },
    ],
    weatherConfig: {
      city: "Edmonton",
      lat: 53.5444,
      lon: -113.4909,
      enabled: true,
    },
    tickerText: "Visit The Pond Warehouse for premium koi and aquatic supplies • Free water testing available in-store • Ask about our pond maintenance plans",
    theme: {
      backgroundColor: "#062021",
      accentColor: "#10b981",
      textColor: "#f0fdfa",
      fontFamily: "sans",
    },
    lastUpdated: Date.now(),
  };

  // Weather update logic
  async function updateWeather() {
    if (!signageData.weatherConfig.enabled) return;
    
    try {
      const { lat, lon, city } = signageData.weatherConfig;
      // We fetch current temp, wind, and daily max UV index
      const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m&daily=uv_index_max&timezone=auto`);
      const data = await response.json();
      
      if (data.current && data.daily) {
        const uvIndex = data.daily.uv_index_max[0];
        const temp = data.current.temperature_2m;
        
        // Calculate Algae Risk: High Temp + High UV = High Risk
        let risk = "Low";
        if (temp > 25 && uvIndex > 6) risk = "Critical";
        else if (temp > 20 || uvIndex > 5) risk = "Moderate";
        else if (temp > 15) risk = "Low";
        else risk = "Minimal";

        signageData.conditions = signageData.conditions.map(c => {
          if (c.id === "weather-temp") return { ...c, label: `${city} Air`, value: `${Math.round(temp)}°C` };
          if (c.id === "weather-wind") return { ...c, value: `${Math.round(data.current.wind_speed_10m)} km/h` };
          if (c.id === "weather-uv") return { ...c, value: `${uvIndex.toFixed(1)}` };
          if (c.id === "weather-algae") return { ...c, value: risk };
          return c;
        });
        signageData.lastUpdated = Date.now();
      }
    } catch (error) {
      console.error("Failed to fetch weather:", error);
    }
  }

  // Initial fetch and set interval (every 15 mins)
  updateWeather();
  setInterval(updateWeather, 15 * 60 * 1000);

  // API Routes
  app.get("/api/signage", (req, res) => {
    res.json(signageData);
  });

  app.post("/api/signage", (req, res) => {
    const oldConfig = JSON.stringify(signageData.weatherConfig);
    signageData = {
      ...signageData,
      ...req.body,
      lastUpdated: Date.now(),
    };
    
    // If weather config changed, refetch
    if (JSON.stringify(signageData.weatherConfig) !== oldConfig) {
      updateWeather();
    }
    
    res.json(signageData);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
