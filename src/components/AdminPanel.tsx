import React, { useState } from "react";
import { Plus, Trash2, Save, Monitor, Settings2, Palette, XCircle, ExternalLink, Store, Thermometer, Wind, Sun, Cloud, Droplets, Leaf } from "lucide-react";
import { SignageData, Announcement, GardenCondition } from "../types";

interface AdminPanelProps {
  data: SignageData;
  onUpdate: (newData: Partial<SignageData>) => void;
  onClose: () => void;
}

export default function AdminPanel({ data, onUpdate, onClose }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<"control" | "style" | "brand" | "weather">("control");
  const [announcements, setAnnouncements] = useState<Announcement[]>(data.announcements);
  const [theme, setTheme] = useState(data.theme);
  const [storeName, setStoreName] = useState(data.storeName);
  const [logoUrl, setLogoUrl] = useState(data.logoUrl || "");
  const [tickerText, setTickerText] = useState(data.tickerText || "");
  const [conditions, setConditions] = useState<GardenCondition[]>(data.conditions || []);
  const [weatherConfig, setWeatherConfig] = useState(data.weatherConfig);

  const [isSaving, setIsSaving] = useState(false);

  const extractYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : url;
  };

  const handleAddAnnouncement = () => {
    const newAnn: Announcement = {
      id: Math.random().toString(36).substr(2, 9),
      type: "text",
      text: "NEW WATER FEATURE",
      duration: 5000,
    };
    setAnnouncements([...announcements, newAnn]);
  };

  const handleRemoveAnnouncement = (id: string) => {
    setAnnouncements(announcements.filter((a) => a.id !== id));
  };

  const handleAnnouncementChange = (id: string, text: string) => {
    setAnnouncements(
      announcements.map((a) => (a.id === id ? { ...a, text: text.toUpperCase() } : a))
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    await onUpdate({ announcements, theme, storeName, logoUrl, conditions, weatherConfig, tickerText });
    setTimeout(() => setIsSaving(false), 2000);
  };

  return (
    <div 
      className="min-h-screen flex font-sans text-slate-100"
      style={{ backgroundColor: data.theme.backgroundColor }}
    >
      {/* Sidebar */}
      <aside className="w-72 bg-black/30 border-r border-white/5 p-8 flex flex-col gap-10 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rotate-45 flex items-center justify-center shadow-lg"
            style={{ backgroundColor: theme.accentColor }}
          >
            <Monitor className="w-5 h-5 -rotate-45 text-slate-950" />
          </div>
          <span className="text-2xl font-black tracking-tighter uppercase">
            {storeName.split(" ").map((word, i) => (
              <span key={i} className={i === storeName.split(" ").length - 1 ? "" : "mr-1"} style={i === storeName.split(" ").length - 1 ? { color: theme.accentColor } : {}}>
                {word}
              </span>
            ))}
          </span>
        </div>

        <nav className="flex flex-col gap-2">
          <button 
            onClick={() => setActiveTab("control")}
            className={`flex items-center gap-3 px-5 py-4 rounded-none border-l-4 font-bold uppercase text-xs tracking-widest transition-all ${
              activeTab === "control" 
                ? "bg-white/5" 
                : "text-slate-500 hover:bg-white/5 border-transparent"
            }`}
            style={activeTab === "control" ? { borderColor: theme.accentColor, color: theme.accentColor } : {}}
          >
            <Settings2 className="w-4 h-4" />
            Signage Control
          </button>
          <button 
            onClick={() => setActiveTab("style")}
            className={`flex items-center gap-3 px-5 py-4 rounded-none border-l-4 font-bold uppercase text-xs tracking-widest transition-all ${
              activeTab === "style" 
                ? "bg-white/5" 
                : "text-slate-500 hover:bg-white/5 border-transparent"
            }`}
            style={activeTab === "style" ? { borderColor: theme.accentColor, color: theme.accentColor } : {}}
          >
            <Palette className="w-4 h-4" />
            Visual Style
          </button>
          
          <button 
            onClick={() => setActiveTab("brand")}
            className={`flex items-center gap-3 px-5 py-4 rounded-none border-l-4 font-bold uppercase text-xs tracking-widest transition-all ${
              activeTab === "brand" 
                ? "bg-white/5" 
                : "text-slate-500 hover:bg-white/5 border-transparent"
            }`}
            style={activeTab === "brand" ? { borderColor: theme.accentColor, color: theme.accentColor } : {}}
          >
            <Store className="w-4 h-4" />
            Store Branding
          </button>

          <button 
            onClick={() => setActiveTab("weather")}
            className={`flex items-center gap-3 px-5 py-4 rounded-none border-l-4 font-bold uppercase text-xs tracking-widest transition-all ${
              activeTab === "weather" 
                ? "bg-white/5" 
                : "text-slate-500 hover:bg-white/5 border-transparent"
            }`}
            style={activeTab === "weather" ? { borderColor: theme.accentColor, color: theme.accentColor } : {}}
          >
            <Thermometer className="w-4 h-4" />
            Garden Stats
          </button>
          
          <div className="pt-4 mt-4 border-t border-white/5 flex flex-col gap-2">
            <button 
              onClick={onClose}
              className="flex items-center gap-3 px-5 py-4 text-slate-400 hover:text-white hover:bg-white/5 rounded-none font-bold uppercase text-xs tracking-widest transition-all"
            >
              <ExternalLink className="w-4 h-4" />
              View Signage
            </button>
          </div>
        </nav>

        <div className="mt-auto p-6 bg-white/5 border border-white/5">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-3">Feed Status</p>
          <div className="flex items-center gap-3" style={{ color: theme.accentColor }}>
            <div 
              className="w-2 h-2 rounded-full animate-pulse" 
              style={{ backgroundColor: theme.accentColor, boxShadow: `0 0 10px ${theme.accentColor}` }}
            />
            <span className="text-xs font-mono uppercase font-bold tracking-widest">Display Live</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-16 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <header className="flex justify-between items-end mb-16 border-b border-white/5 pb-10">
            <div>
              <h1 className="text-6xl font-black uppercase tracking-tighter mb-4">
                {activeTab === "control" ? "Content Loop" : 
                 activeTab === "style" ? "Store Theme" : 
                 activeTab === "brand" ? "Branding" : 
                 "Garden Stats"}
              </h1>
              <p className="text-slate-400 font-medium text-lg">
                {activeTab === "control" 
                  ? "Manage the sequence of videos, images, and promos." 
                  : activeTab === "style"
                  ? "Customize the aquatic environment and colors."
                  : activeTab === "brand"
                  ? "Set your store identity and logo."
                  : "Configure automated weather and manual pond stats."}
              </p>
            </div>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-3 text-slate-950 px-8 py-4 rounded-none font-black uppercase text-sm tracking-widest hover:opacity-90 active:scale-95 transition-all shadow-xl disabled:opacity-50"
              style={{ backgroundColor: theme.accentColor }}
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Publish Changes
                </>
              )}
            </button>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              {activeTab === "control" ? (
                <div className="space-y-10">
                  {/* ... Existing Announcements Logic ... */}
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-2xl font-black uppercase tracking-tight">Active Slides</h3>
                    <button
                      onClick={handleAddAnnouncement}
                      className="text-xs flex items-center gap-2 hover:opacity-80 font-black uppercase tracking-widest border-b-2 border-white/10"
                      style={{ color: theme.accentColor }}
                    >
                      <Plus className="w-4 h-4" />
                      Add Media Slide
                    </button>
                  </div>

                  <div className="space-y-6">
                    {announcements.map((ann, idx) => (
                      <div key={ann.id} className="bg-white/5 p-8 border border-white/5 flex flex-col gap-6 group hover:border-white/10 transition-colors">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-4">
                            <span className="text-4xl font-mono text-white/10 font-black">0{idx + 1}</span>
                            <select 
                              value={ann.type}
                              onChange={(e) => {
                                setAnnouncements(announcements.map(a => a.id === ann.id ? { ...a, type: e.target.value as any } : a));
                              }}
                              className="bg-slate-900 border border-white/10 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded cursor-pointer"
                            >
                              <option value="text">Text Billboard</option>
                              <option value="image">Hero Image</option>
                              <option value="youtube">YouTube Feed</option>
                            </select>
                          </div>
                          <button
                            onClick={() => handleRemoveAnnouncement(ann.id)}
                            className="p-3 text-white/20 hover:text-red-500 transition-colors bg-white/5"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="space-y-6">
                          {(ann.type === 'text' || ann.type === 'image') && (
                            <div>
                              <label className="text-[10px] font-black opacity-30 uppercase tracking-widest mb-3 block">Display Text Content</label>
                              <textarea
                                value={ann.text || ""}
                                onChange={(e) => handleAnnouncementChange(ann.id, e.target.value)}
                                className="w-full text-2xl font-bold text-white border-none focus:ring-0 p-0 resize-none h-auto min-h-[40px] bg-transparent uppercase tracking-tight"
                                placeholder="TYPE MESSAGE HERE..."
                              />
                            </div>
                          )}

                          {(ann.type === 'image' || ann.type === 'youtube') && (
                            <div>
                              <label className="text-[10px] font-black opacity-30 uppercase tracking-widest mb-3 block">
                                {ann.type === 'image' ? 'Hosted Image URL' : 'YouTube Video ID'}
                              </label>
                              <div className="flex gap-4">
                                <input
                                  type="text"
                                  value={ann.mediaUrl || ""}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    const cleanValue = ann.type === 'youtube' ? extractYoutubeId(value) : value;
                                    setAnnouncements(announcements.map(a => a.id === ann.id ? { ...a, mediaUrl: cleanValue } : a));
                                  }}
                                  className="flex-1 bg-slate-950 border border-white/10 px-5 py-4 text-sm text-slate-300 font-mono focus:border-white/40 outline-none transition-colors"
                                  placeholder={ann.type === 'image' ? "https://..." : "Example: P9yF599p21I"}
                                />
                                {ann.type === 'youtube' && (
                                  <div className="px-4 py-4 bg-white/5 border border-white/5 text-[10px] items-center flex font-bold opacity-40">
                                    AUTOPLAY + MUTE
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-6 pt-4 border-t border-white/5">
                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-black opacity-30 uppercase tracking-widest block">Duration</label>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                min="0"
                                value={Math.floor(ann.duration / 60000)}
                                onChange={(e) => {
                                  const mins = parseInt(e.target.value) || 0;
                                  const secs = (ann.duration % 60000);
                                  setAnnouncements(announcements.map(a => a.id === ann.id ? { ...a, duration: (mins * 60000) + secs } : a));
                                }}
                                className="bg-slate-950 border border-white/10 px-3 py-2 text-sm text-slate-300 font-mono outline-none w-16"
                              />
                              <span className="text-[10px] font-bold opacity-30 uppercase">min</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                min="0"
                                max="59"
                                value={Math.floor((ann.duration % 60000) / 1000)}
                                onChange={(e) => {
                                  const secs = parseInt(e.target.value) || 0;
                                  const mins = Math.floor(ann.duration / 60000);
                                  setAnnouncements(announcements.map(a => a.id === ann.id ? { ...a, duration: (mins * 60000) + (secs * 1000) } : a));
                                }}
                                className="bg-slate-950 border border-white/10 px-3 py-2 text-sm text-slate-300 font-mono outline-none w-16"
                              />
                              <span className="text-[10px] font-bold opacity-30 uppercase">sec</span>
                            </div>
                          </div>
                          {ann.type === 'youtube' && (
                            <p className="text-[10px] text-amber-500 font-bold uppercase mt-1">Video will play to end regardless of duration</p>
                          )}
                        </div>
                      </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : activeTab === "style" ? (
                <div className="space-y-10">
                  <h3 className="text-2xl font-black uppercase tracking-tight">Environmental Options</h3>
                  {/* ... Style inputs ... */}
                  <div className="bg-white/5 p-10 border border-white/5 space-y-10">
                    <div className="grid grid-cols-2 gap-10">
                      <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4 text-center">
                          Primary Underwater Hue
                        </label>
                        <div className="relative group">
                          <input
                            type="color"
                            value={theme.backgroundColor}
                            onChange={(e) => setTheme({ ...theme, backgroundColor: e.target.value })}
                            className="w-full h-32 rounded-none cursor-pointer border-2 border-white/10 bg-transparent p-2"
                          />
                          <div className="absolute bottom-4 left-4 right-4 text-[10px] font-mono text-center opacity-30 pointer-events-none uppercase">
                            {theme.backgroundColor}
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 text-center">
                          Emerald Growth Accent
                        </label>
                        <div className="relative group">
                          <input
                            type="color"
                            value={theme.accentColor}
                            onChange={(e) => setTheme({ ...theme, accentColor: e.target.value })}
                            className="w-full h-32 rounded-none cursor-pointer border-2 border-white/10 bg-transparent p-2"
                          />
                          <div className="absolute bottom-4 left-4 right-4 text-[10px] font-mono text-center opacity-30 pointer-events-none uppercase">
                            {theme.accentColor}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : activeTab === "brand" ? (
                <div className="space-y-12">
                   <div className="space-y-6">
                    <h3 className="text-2xl font-black uppercase tracking-tight">Branding</h3>
                    <div className="bg-white/5 p-8 border border-white/5 space-y-6">
                      <div>
                        <label className="text-[10px] font-black opacity-30 uppercase tracking-widest mb-3 block">Store Name</label>
                        <input
                          type="text"
                          value={storeName}
                          onChange={(e) => setStoreName(e.target.value)}
                          className="w-full bg-slate-950 border border-white/10 px-5 py-4 text-xl text-white font-black uppercase tracking-tighter focus:border-white/40 outline-none"
                          placeholder="STORE NAME"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black opacity-30 uppercase tracking-widest mb-3 block">Logo URL</label>
                        <input
                          type="text"
                          value={logoUrl}
                          onChange={(e) => setLogoUrl(e.target.value)}
                          className="w-full bg-slate-950 border border-white/10 px-5 py-4 text-sm text-slate-300 font-mono focus:border-white/40 outline-none"
                          placeholder="HTTPS://..."
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black opacity-30 uppercase tracking-widest mb-3 block">Scrolling Ticker Text</label>
                        <textarea
                          value={tickerText}
                          onChange={(e) => setTickerText(e.target.value)}
                          className="w-full bg-slate-950 border border-white/10 px-5 py-4 text-sm text-slate-300 font-medium focus:border-white/40 outline-none min-h-[100px]"
                          placeholder="Messages to scroll at the bottom..."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-12">
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-2xl font-black uppercase tracking-tight">Automated Weather</h3>
                      <button 
                        onClick={() => setWeatherConfig({ ...weatherConfig, enabled: !weatherConfig.enabled })}
                        className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest border transition-all ${
                          weatherConfig.enabled ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400" : "bg-white/5 border-white/10 text-slate-500"
                        }`}
                      >
                        {weatherConfig.enabled ? "Live Weather ON" : "Live Weather OFF"}
                      </button>
                    </div>
                    
                    <div className="bg-white/5 p-8 border border-white/5 grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="text-[10px] font-black opacity-30 uppercase tracking-widest mb-3 block">City Name</label>
                        <input
                          type="text"
                          value={weatherConfig.city}
                          onChange={(e) => setWeatherConfig({ ...weatherConfig, city: e.target.value })}
                          className="w-full bg-slate-950 border border-white/10 px-4 py-3 text-sm text-white font-bold uppercase outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black opacity-30 uppercase tracking-widest mb-3 block">Latitude</label>
                        <input
                          type="number"
                          step="0.0001"
                          value={weatherConfig.lat}
                          onChange={(e) => setWeatherConfig({ ...weatherConfig, lat: parseFloat(e.target.value) })}
                          className="w-full bg-slate-950 border border-white/10 px-4 py-3 text-sm text-white font-mono outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black opacity-30 uppercase tracking-widest mb-3 block">Longitude</label>
                        <input
                          type="number"
                          step="0.0001"
                          value={weatherConfig.lon}
                          onChange={(e) => setWeatherConfig({ ...weatherConfig, lon: parseFloat(e.target.value) })}
                          className="w-full bg-slate-950 border border-white/10 px-4 py-3 text-sm text-white font-mono outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-2xl font-black uppercase tracking-tight">Custom Stats</h3>
                      <button
                        onClick={() => setConditions([...conditions, { id: Math.random().toString(), label: "NEW STAT", value: "0", icon: "Droplets" }])}
                        className="text-xs flex items-center gap-2 hover:opacity-80 font-black uppercase tracking-widest border-b-2 border-white/10"
                        style={{ color: theme.accentColor }}
                      >
                        <Plus className="w-4 h-4" />
                        Add Stat
                      </button>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      {conditions.filter(c => !c.id.startsWith('weather-')).map((cond) => (
                        <div key={cond.id} className="bg-white/5 p-6 border border-white/5 flex gap-6 items-end group">
                          <div className="flex-1 space-y-4">
                            <div className="flex gap-4">
                              <div className="flex-1">
                                <label className="text-[10px] font-black opacity-30 uppercase tracking-widest mb-2 block">Label</label>
                                <input
                                  type="text"
                                  value={cond.label}
                                  onChange={(e) => setConditions(conditions.map(c => c.id === cond.id ? { ...c, label: e.target.value } : c))}
                                  className="w-full bg-slate-950 border border-white/10 px-4 py-2 text-sm text-white font-bold uppercase outline-none"
                                />
                              </div>
                              <div className="flex-1">
                                <label className="text-[10px] font-black opacity-30 uppercase tracking-widest mb-2 block">Value</label>
                                <input
                                  type="text"
                                  value={cond.value}
                                  onChange={(e) => setConditions(conditions.map(c => c.id === cond.id ? { ...c, value: e.target.value } : c))}
                                  className="w-full bg-slate-950 border border-white/10 px-4 py-2 text-sm text-white font-bold uppercase outline-none"
                                />
                              </div>
                            </div>
                          </div>
                          <div>
                            <label className="text-[10px] font-black opacity-30 uppercase tracking-widest mb-2 block text-center">Icon</label>
                            <select
                              value={cond.icon}
                              onChange={(e) => setConditions(conditions.map(c => c.id === cond.id ? { ...c, icon: e.target.value as any } : c))}
                              className="bg-slate-900 border border-white/10 text-[10px] font-black uppercase px-3 py-2 rounded"
                            >
                              <option value="Sun">Sun</option>
                              <option value="Cloud">Cloud</option>
                              <option value="Droplets">Drops</option>
                              <option value="Thermometer">Temp</option>
                              <option value="Wind">Wind</option>
                              <option value="Leaf">Leaf</option>
                            </select>
                          </div>
                          <button
                            onClick={() => setConditions(conditions.filter(c => c.id !== cond.id))}
                            className="p-2.5 text-white/20 hover:text-red-500 bg-white/5"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-10">
              <h3 className="text-2xl font-black uppercase tracking-tight">Signage Status</h3>
              <div className="bg-black/40 border border-white/5 p-8 relative overflow-hidden">
                <div className="relative z-10">
                  <h4 className="font-black uppercase tracking-widest text-xs mb-2">Active Node</h4>
                  <p className="text-[10px] opacity-40 mb-8 font-mono uppercase tracking-widest">Aquatic_Feed :: POND-44</p>
                  
                  <div className="w-full aspect-video bg-black/60 border border-white/10 flex items-center justify-center p-6 mb-6 shadow-2xl relative">
                    <div className="text-[10px] text-center font-bold uppercase tracking-tight line-clamp-3 leading-relaxed" style={{ color: theme.accentColor }}>
                      {announcements[0]?.text || "DISPLAYING MEDIA..."}
                    </div>
                    <div className="absolute top-2 right-2 flex gap-1">
                      <div className="w-1 h-1 rounded-full bg-red-500 animate-pulse"></div>
                      <div className="w-1 h-1 rounded-full bg-white/20"></div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest opacity-40">
                      <span>Loop Length</span>
                      <span>{announcements.length} Slides</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest opacity-40">
                      <span>Total Loop</span>
                      <span>{Math.round(announcements.reduce((acc, a) => acc + a.duration, 0) / 1000)}s</span>
                    </div>
                  </div>
                </div>
                <div 
                  className="absolute -top-12 -right-12 w-64 h-64 opacity-5 rounded-full blur-3xl pointer-events-none"
                  style={{ backgroundColor: theme.accentColor }}
                />
              </div>

              <div className="bg-amber-500/5 border border-amber-500/10 p-6">
                <h5 className="text-[10px] font-black uppercase tracking-widest mb-3 text-amber-500">Audio & Caption Tips</h5>
                <p className="text-xs text-slate-400 leading-relaxed space-y-2">
                  • <b>Sound:</b> Browsers often block autoplay with sound. Click anywhere on the signage screen once to enable audio.<br/>
                  • <b>Captions:</b> Closed captions will show automatically if the video owner provided them.<br/>
                  • <b>Video ID:</b> Only use the ID (e.g., <b>P9yF599p21I</b>).
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
