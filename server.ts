import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import multer from "multer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(process.cwd(), "data");
const UPLOADS_DIR = path.join(DATA_DIR, "uploads");
const SETTINGS_FILE = path.join(DATA_DIR, "settings.json");

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /image\/(jpeg|jpg|png|gif|webp)/;
    if (allowedTypes.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed"));
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Serve uploads directory
  app.use("/uploads", express.static(UPLOADS_DIR));

  // Default state
  const defaultData = {
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
      forecastDays: 3,
      units: "metric",
      showAsSlide: true,
    },
    forecast: [],
    musicConfig: {
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      volume: 0.5,
      enabled: false,
    },
    tickerText: "Visit The Pond Warehouse for premium koi and aquatic supplies • Free water testing available in-store • Ask about our pond maintenance plans",
    theme: {
      backgroundColor: "#062021",
      accentColor: "#10b981",
      textColor: "#f0fdfa",
      fontFamily: "sans",
      safeAreaPadding: "3%",
    },
    lastUpdated: Date.now(),
  };

  // Load from file or use defaults
  let signageData = { ...defaultData };
  if (fs.existsSync(SETTINGS_FILE)) {
    try {
      const savedData = JSON.parse(fs.readFileSync(SETTINGS_FILE, "utf-8"));
      signageData = { ...defaultData, ...savedData };
    } catch (e) {
      console.error("Failed to load settings.json, using defaults", e);
    }
  }

  function saveSettings() {
    try {
      fs.writeFileSync(SETTINGS_FILE, JSON.stringify(signageData, null, 2));
    } catch (e) {
      console.error("Failed to save settings.json", e);
    }
  }

  // Weather update logic
  async function updateWeather() {
    if (!signageData.weatherConfig.enabled) return;
    
    try {
      const { lat, lon, city, forecastDays, units } = signageData.weatherConfig;
      const unitParam = units === 'imperial' ? '&temperature_unit=fahrenheit&wind_speed_unit=mph' : '';
      
      // We fetch current temp, wind, current uv index, daily max UV index, and forecast
      // We specifically use gem_seamless for Canadian accuracy, falling back to default ensemble
      const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m,uv_index&daily=uv_index_max,temperature_2m_max,temperature_2m_min,weather_code&timezone=auto${unitParam}&models=gem_seamless`);
      const data = await response.json();
      
      // Extract data from standard keys or model-specific keys
      const current = data.current || data.current_gem_seamless;
      const daily = data.daily || data.daily_gem_seamless;

      if (current && daily) {
        const uvIndexMax = daily.uv_index_max?.[0] ?? 0;
        const currentUV = current.uv_index ?? 0;
        const temp = current.temperature_2m;
        const tempSymbol = units === 'imperial' ? '°F' : '°C';
        const windSymbol = units === 'imperial' ? 'mph' : 'km/h';
        
        // Calculate Algae Risk: High Temp (using Celsius for logic)
        const tempC = units === 'imperial' ? (temp - 32) * (5/9) : temp;
        let risk = "Low";
        if (tempC > 25 && uvIndexMax > 6) risk = "Critical";
        else if (tempC > 20 || uvIndexMax > 5) risk = "Moderate";
        else if (tempC > 15) risk = "Low";
        else risk = "Minimal";
  
        signageData.conditions = signageData.conditions.map(c => {
          if (c.id === "weather-temp") return { 
            ...c, 
            label: `${city} Air`, 
            // Use 1 decimal for better precision as requested for accuracy
            value: `${temp.toFixed(1)}${tempSymbol}` 
          };
          if (c.id === "weather-wind") return { ...c, value: `${Math.round(current.wind_speed_10m)} ${windSymbol}` };
          if (c.id === "weather-uv") return { ...c, value: `${currentUV.toFixed(1)}` };
          if (c.id === "weather-algae") return { ...c, value: risk };
          return c;
        });
  
        // Set forecast data (always provide 7 days for flexible slides)
        signageData.forecast = daily.time.slice(1, 8).map((time: string, index: number) => ({
          date: time,
          maxTemp: Math.round(daily.temperature_2m_max[index + 1] ?? 0),
          minTemp: Math.round(daily.temperature_2m_min[index + 1] ?? 0),
          condition: (daily.weather_code[index + 1] ?? 0).toString()
        }));
  
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

  app.post("/api/upload", upload.single("image"), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ url: imageUrl });
  });

  app.post("/api/signage", (req, res) => {
    const oldConfig = JSON.stringify(signageData.weatherConfig);
    signageData = {
      ...signageData,
      ...req.body,
      lastUpdated: Date.now(),
    };
    
    // Save to file
    saveSettings();

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
