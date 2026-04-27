import React, { useState } from "react";
import { Plus, Trash2, Save, Monitor, Settings2, Palette, XCircle, ExternalLink, Store, Thermometer, Wind, Sun, Cloud, Droplets, Leaf, Music, Volume2, Layout, Image as ImageIcon, Video, Type, GripVertical } from "lucide-react";
import { Reorder } from "motion/react";
import { SignageData, Announcement, GardenCondition } from "../types";
import { VISUAL_TEMPLATES } from "../lib/templates";
import ImageUpload from "./ImageUpload";

interface AdminPanelProps {
  data: SignageData;
  onUpdate: (newData: Partial<SignageData>) => void;
  onClose: () => void;
}

export default function AdminPanel({ data, onUpdate, onClose }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<"control" | "style" | "brand" | "weather" | "music" | "library">("control");
  const [announcements, setAnnouncements] = useState<Announcement[]>(data.announcements);
  const [theme, setTheme] = useState(data.theme);
  const [storeName, setStoreName] = useState(data.storeName);
  const [logoUrl, setLogoUrl] = useState(data.logoUrl || "");
  const [tickerText, setTickerText] = useState(data.tickerText || "");
  const [conditions, setConditions] = useState<GardenCondition[]>(data.conditions || []);
  const [weatherConfig, setWeatherConfig] = useState(data.weatherConfig);
  const [musicConfig, setMusicConfig] = useState(data.musicConfig);

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

  const handleAddTemplate = (templateId: string) => {
    let newAnn: Announcement;
    
    switch(templateId) {
      case 'spotlight':
        newAnn = {
          id: Math.random().toString(36).substr(2, 9),
          type: 'template',
          templateId: 'spotlight',
          text: 'NEW ARRIVALS',
          subtitle: 'PREMIUM JAPANESE KOI',
          mediaUrl: 'https://images.unsplash.com/photo-1524147043834-0852e90f2b3b?q=80&w=2070&auto=format&fit=crop',
          price: 'FROM $49.99',
          cta: 'IN-STORE ONLY',
          duration: 8000
        };
        break;
      case 'modern-text':
        newAnn = {
          id: Math.random().toString(36).substr(2, 9),
          type: 'template',
          templateId: 'modern-text',
          text: 'POND CLEANING SPECIAL',
          subtitle: 'SCHEDULE NOW & SAVE 15%',
          cta: 'BOOK AT FRONT DESK',
          duration: 6000
        };
        break;
      case 'split-banner':
        newAnn = {
          id: Math.random().toString(36).substr(2, 9),
          type: 'template',
          templateId: 'split-banner',
          text: 'WATER QUALITY EXPERTS',
          subtitle: 'Free water testing every weekend. Bring a sample in-store for a professional analysis.',
          mediaUrl: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?q=80&w=2074&auto=format&fit=crop',
          cta: 'LEARN MORE',
          duration: 10000
        };
        break;
      case 'minimal-alert':
        newAnn = {
          id: Math.random().toString(36).substr(2, 9),
          type: 'template',
          templateId: 'minimal-alert',
          text: 'WINTER HOURS',
          subtitle: 'Starting Nov 1st: 9AM - 5PM',
          duration: 5000
        };
        break;
      default:
        newAnn = {
          id: Math.random().toString(36).substr(2, 9),
          type: 'text',
          text: 'NEW ANNOUNCEMENT',
          duration: 5000
        };
    }
    
    setAnnouncements([...announcements, newAnn]);
    setActiveTab("control");
  };

  const handleSave = async () => {
    setIsSaving(true);
    await onUpdate({ announcements, theme, storeName, logoUrl, conditions, weatherConfig, tickerText, musicConfig });
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
            Weather & Stats
          </button>
          
          <button 
            onClick={() => setActiveTab("music")}
            className={`flex items-center gap-3 px-5 py-4 rounded-none border-l-4 font-bold uppercase text-xs tracking-widest transition-all ${
              activeTab === "music" 
                ? "bg-white/5" 
                : "text-slate-500 hover:bg-white/5 border-transparent"
            }`}
            style={activeTab === "music" ? { borderColor: theme.accentColor, color: theme.accentColor } : {}}
          >
            <Music className="w-4 h-4" />
            Background Music
          </button>

          <button 
            onClick={() => setActiveTab("library")}
            className={`flex items-center gap-3 px-5 py-4 rounded-none border-l-4 font-bold uppercase text-xs tracking-widest transition-all ${
              activeTab === "library" 
                ? "bg-white/5" 
                : "text-slate-500 hover:bg-white/5 border-transparent"
            }`}
            style={activeTab === "library" ? { borderColor: theme.accentColor, color: theme.accentColor } : {}}
          >
            <Layout className="w-4 h-4" />
            Template Library
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
                 activeTab === "music" ? "Background Music" :
                 activeTab === "library" ? "Template Library" :
                 "Weather & Stats"}
              </h1>
              <p className="text-slate-400 font-medium text-lg">
                {activeTab === "control" 
                  ? "Manage the sequence of videos, images, and promos." 
                  : activeTab === "style"
                  ? "Customize the aquatic environment and colors."
                  : activeTab === "brand"
                  ? "Set your store identity and logo."
                  : activeTab === "music"
                  ? "Configure the environmental soundscape."
                  : activeTab === "library"
                  ? "Select high-impact visual templates for your signage."
                  : "Configure automated high-accuracy weather and manual stats."}
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
                    <div className="flex gap-6">
                      <button
                        onClick={handleAddAnnouncement}
                        className="text-xs flex items-center gap-2 hover:opacity-80 font-black uppercase tracking-widest border-b-2 border-white/10 transition-all hover:border-white/30"
                        style={{ color: theme.accentColor }}
                      >
                        <Type className="w-3 h-3" />
                        Add Text Slide
                      </button>
                      <button
                        onClick={() => {
                          const newAnn = {
                            id: Math.random().toString(36).substr(2, 9),
                            type: 'weather' as const,
                            text: 'WEEKLY FORECAST',
                            duration: 10000,
                            forecastDays: 7 as const
                          };
                          setAnnouncements([...announcements, newAnn]);
                        }}
                        className="text-xs flex items-center gap-2 hover:opacity-80 font-black uppercase tracking-widest border-b-2 border-white/10 transition-all hover:border-white/30"
                        style={{ color: theme.accentColor }}
                      >
                        <Thermometer className="w-3 h-3" />
                        Add Weather Slide
                      </button>
                      <button
                        onClick={() => setActiveTab("library")}
                        className="text-xs flex items-center gap-2 hover:opacity-80 font-black uppercase tracking-widest border-b-2 border-white/10 transition-all hover:border-white/30 text-slate-400"
                      >
                        <Layout className="w-3 h-3" />
                        Browse Templates
                      </button>
                    </div>
                  </div>

                  <Reorder.Group axis="y" values={announcements} onReorder={setAnnouncements} className="space-y-6">
                    {announcements.map((ann, idx) => (
                      <Reorder.Item 
                        key={ann.id} 
                        value={ann}
                        className="bg-white/5 p-8 border border-white/5 flex flex-col gap-6 group hover:border-white/10 transition-colors relative cursor-default"
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-4">
                            <div className="p-2 cursor-grab active:cursor-grabbing text-white/20 hover:text-white/40 transition-colors">
                              <GripVertical className="w-5 h-5" />
                            </div>
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
                              <option value="template">Visual Template</option>
                              <option value="weather">Weather Forecast</option>
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
                          {ann.type === 'template' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <label className="text-[10px] font-black opacity-30 uppercase tracking-widest mb-3 block">Template Design</label>
                                <select 
                                  value={ann.templateId}
                                  onChange={(e) => setAnnouncements(announcements.map(a => a.id === ann.id ? { ...a, templateId: e.target.value } : a))}
                                  className="w-full bg-slate-950 border border-white/10 px-5 py-4 text-sm text-white font-bold uppercase tracking-widest outline-none"
                                >
                                  {VISUAL_TEMPLATES.map(t => (
                                    <option key={t.id} value={t.id}>{t.name}</option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <label className="text-[10px] font-black opacity-30 uppercase tracking-widest mb-3 block">Main Headline</label>
                                <input
                                  type="text"
                                  value={ann.text || ""}
                                  onChange={(e) => setAnnouncements(announcements.map(a => a.id === ann.id ? { ...a, text: e.target.value.toUpperCase() } : a))}
                                  className="w-full bg-slate-950 border border-white/10 px-5 py-4 text-sm text-white font-bold uppercase outline-none"
                                  placeholder="HEADLINE"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-black opacity-30 uppercase tracking-widest mb-3 block">Subtitle</label>
                                <input
                                  type="text"
                                  value={ann.subtitle || ""}
                                  onChange={(e) => setAnnouncements(announcements.map(a => a.id === ann.id ? { ...a, subtitle: e.target.value } : a))}
                                  className="w-full bg-slate-950 border border-white/10 px-5 py-4 text-sm text-white outline-none"
                                  placeholder="Sub-text content..."
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-black opacity-30 uppercase tracking-widest mb-3 block">Background Media (Image or Video ID)</label>
                                <div className="space-y-4">
                                  <input
                                    type="text"
                                    value={ann.mediaUrl || ""}
                                    onChange={(e) => setAnnouncements(announcements.map(a => a.id === ann.id ? { ...a, mediaUrl: e.target.value } : a))}
                                    className="w-full bg-slate-950 border border-white/10 px-5 py-4 text-sm text-white font-mono outline-none"
                                    placeholder="https://... or YT_ID"
                                  />
                                  <ImageUpload 
                                    currentUrl={ann.mediaUrl}
                                    onUpload={(url) => setAnnouncements(announcements.map(a => a.id === ann.id ? { ...a, mediaUrl: url } : a))}
                                    accentColor={theme.accentColor}
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="text-[10px] font-black opacity-30 uppercase tracking-widest mb-3 block">Price Tag (Optional)</label>
                                <input
                                  type="text"
                                  value={ann.price || ""}
                                  onChange={(e) => setAnnouncements(announcements.map(a => a.id === ann.id ? { ...a, price: e.target.value } : a))}
                                  className="w-full bg-slate-950 border border-white/10 px-5 py-4 text-sm text-emerald-400 font-black outline-none"
                                  placeholder="$00.00"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-black opacity-30 uppercase tracking-widest mb-3 block">Call to Action</label>
                                <input
                                  type="text"
                                  value={ann.cta || ""}
                                  onChange={(e) => setAnnouncements(announcements.map(a => a.id === ann.id ? { ...a, cta: e.target.value.toUpperCase() } : a))}
                                  className="w-full bg-slate-950 border border-white/10 px-5 py-4 text-sm text-white font-bold outline-none"
                                  placeholder="SHOP NOW"
                                />
                              </div>
                            </div>
                          )}

                          {(ann.type === 'text' || ann.type === 'image' || ann.type === 'weather') && (
                            <div className="space-y-6">
                              <div>
                                <label className="text-[10px] font-black opacity-30 uppercase tracking-widest mb-3 block">Display Text Content</label>
                                <textarea
                                  value={ann.text || ""}
                                  onChange={(e) => handleAnnouncementChange(ann.id, e.target.value)}
                                  className="w-full text-2xl font-bold text-white border-none focus:ring-0 p-0 resize-none h-auto min-h-[40px] bg-transparent uppercase tracking-tight"
                                  placeholder="TYPE MESSAGE HERE..."
                                />
                              </div>
                              
                              {ann.type === 'weather' && (
                                <div className="pt-4 border-t border-white/5">
                                  <label className="text-[10px] font-black opacity-30 uppercase tracking-widest mb-3 block">Forecast Range</label>
                                  <div className="flex gap-2">
                                    {[3, 7].map(days => (
                                      <button
                                        key={days}
                                        onClick={() => setAnnouncements(announcements.map(a => a.id === ann.id ? { ...a, forecastDays: days as 3|7 } : a))}
                                        className={`flex-1 px-4 py-3 text-[10px] font-black uppercase tracking-widest border transition-all ${
                                          (ann.forecastDays || 7) === days 
                                            ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400" 
                                            : "bg-white/5 border-white/10 text-slate-400"
                                        }`}
                                      >
                                        {days} Day Forecast
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {(ann.type === 'image' || ann.type === 'youtube') && (
                            <div>
                              <label className="text-[10px] font-black opacity-30 uppercase tracking-widest mb-3 block">
                                {ann.type === 'image' ? 'Image Media' : 'YouTube Video ID'}
                              </label>
                              {ann.type === 'image' ? (
                                <ImageUpload
                                  currentUrl={ann.mediaUrl}
                                  onUpload={(url) => setAnnouncements(announcements.map(a => a.id === ann.id ? { ...a, mediaUrl: url } : a))}
                                  accentColor={theme.accentColor}
                                />
                              ) : (
                                <div className="flex gap-4">
                                  <input
                                    type="text"
                                    value={ann.mediaUrl || ""}
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      const cleanValue = extractYoutubeId(value);
                                      setAnnouncements(announcements.map(a => a.id === ann.id ? { ...a, mediaUrl: cleanValue } : a));
                                    }}
                                    className="flex-1 bg-slate-950 border border-white/10 px-5 py-4 text-sm text-slate-300 font-mono focus:border-white/40 outline-none transition-colors"
                                    placeholder="Example: P9yF599p21I"
                                  />
                                  <div className="px-4 py-4 bg-white/5 border border-white/5 text-[10px] items-center flex font-bold opacity-40">
                                    AUTOPLAY + MUTE
                                  </div>
                                </div>
                              )}
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
                      </Reorder.Item>
                    ))}
                  </Reorder.Group>
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

                    <div className="pt-6 border-t border-white/5">
                      <label className="text-[10px] font-black opacity-30 uppercase tracking-widest mb-3 block">TV Safe Area Padding (Overscan Compensation)</label>
                      <div className="flex items-center gap-4">
                        <input
                          type="text"
                          value={theme.safeAreaPadding || ""}
                          onChange={(e) => setTheme({ ...theme, safeAreaPadding: e.target.value })}
                          className="flex-1 bg-slate-950 border border-white/10 px-5 py-4 text-sm text-white font-mono outline-none focus:border-white/40"
                          placeholder="e.g. 3% or 40px"
                        />
                        <div className="flex gap-2">
                           {["0%", "2%", "4%", "6%"].map(p => (
                             <button
                               key={p}
                               onClick={() => setTheme({ ...theme, safeAreaPadding: p })}
                               className={`px-3 py-2 text-[10px] font-black uppercase tracking-widest border ${theme.safeAreaPadding === p ? "bg-white/10 border-white/20" : "bg-black/20 border-white/5 hover:border-white/10"}`}
                             >
                               {p}
                             </button>
                           ))}
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase mt-3">
                        Use this if the edges of the signage are cut off on your TV screen.
                      </p>
                    </div>
                    <div>
                      <label className="text-[10px] font-black opacity-30 uppercase tracking-widest mb-3 block">Display Mode</label>
                      <button
                        onClick={() => setWeatherConfig({ ...weatherConfig, showAsSlide: !weatherConfig.showAsSlide })}
                        className={`w-full px-5 py-4 text-[10px] font-black uppercase tracking-widest border transition-all ${
                          weatherConfig.showAsSlide 
                            ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400" 
                            : "bg-white/5 border-white/10 text-slate-400"
                        }`}
                      >
                        {weatherConfig.showAsSlide ? "Showing as Main Slide" : "Show in Sidebar Only"}
                      </button>
                    </div>
                    <div>
                      <label className="text-[10px] font-black opacity-30 uppercase tracking-widest mb-3 block">Weather Units</label>
                      <div className="flex gap-2">
                        {['metric', 'imperial'].map(u => (
                          <button
                            key={u}
                            onClick={() => setWeatherConfig({ ...weatherConfig, units: u as 'metric' | 'imperial' })}
                            className={`flex-1 px-4 py-3 text-[10px] font-black uppercase tracking-widest border transition-all ${
                              weatherConfig.units === u 
                                ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.1)]" 
                                : "bg-white/5 border-white/5 text-slate-400 hover:border-white/10"
                            }`}
                          >
                            {u === 'metric' ? 'Metric (°C, km/h)' : 'Imperial (°F, mph)'}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-black opacity-30 uppercase tracking-widest mb-3 block">Forecast Mode</label>
                      <div className="flex gap-2">
                        {[1, 3, 7].map(days => (
                          <button
                            key={days}
                            onClick={() => setWeatherConfig({ ...weatherConfig, forecastDays: days as 1|3|7 })}
                            className={`flex-1 px-4 py-3 text-[10px] font-black uppercase tracking-widest border transition-all ${
                              weatherConfig.forecastDays === days 
                                ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.1)]" 
                                : "bg-white/5 border-white/5 text-slate-400 hover:border-white/10"
                            }`}
                          >
                            {days === 1 ? 'Current Only' : `${days} Day Forecast`}
                          </button>
                        ))}
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
                        <ImageUpload 
                          label="Logo Image" 
                          currentUrl={logoUrl} 
                          onUpload={setLogoUrl}
                          accentColor={theme.accentColor}
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
              ) : activeTab === "music" ? (
                <div className="space-y-12">
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-2xl font-black uppercase tracking-tight">Audio Settings</h3>
                      <button 
                        onClick={() => setMusicConfig({ ...musicConfig, enabled: !musicConfig.enabled })}
                        className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest border transition-all ${
                          musicConfig.enabled ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400" : "bg-white/5 border-white/10 text-slate-500"
                        }`}
                      >
                        {musicConfig.enabled ? "Music Is ON" : "Music Is OFF"}
                      </button>
                    </div>
                    
                    <div className="bg-white/5 p-8 border border-white/5 space-y-8">
                      <div>
                        <label className="text-[10px] font-black opacity-30 uppercase tracking-widest mb-3 block">MP3/Audio Stream URL</label>
                        <input
                          type="text"
                          value={musicConfig.url}
                          onChange={(e) => setMusicConfig({ ...musicConfig, url: e.target.value })}
                          className="w-full bg-slate-950 border border-white/10 px-5 py-4 text-sm text-slate-300 font-mono focus:border-white/40 outline-none transition-colors"
                          placeholder="https://example.com/audio.mp3"
                        />
                        <p className="text-[10px] text-slate-500 font-bold uppercase mt-2">Requires direct link to audio file (mp3, wav, etc.)</p>
                      </div>

                      <div>
                        <div className="flex justify-between mb-3">
                          <label className="text-[10px] font-black opacity-30 uppercase tracking-widest block">Master Volume</label>
                          <span className="text-[10px] font-mono text-slate-500">{Math.round(musicConfig.volume * 100)}%</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <Volume2 className="w-4 h-4 opacity-30" />
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={musicConfig.volume}
                            onChange={(e) => setMusicConfig({ ...musicConfig, volume: parseFloat(e.target.value) })}
                            className="flex-1 accent-emerald-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-emerald-500/5 border border-emerald-500/10 p-8 space-y-4">
                      <h4 className="text-xs font-black uppercase tracking-widest text-emerald-500">How Background Music Works</h4>
                      <p className="text-sm text-slate-400 leading-relaxed">
                        The audio will loop continuously in the background of the signage. Note that most modern browsers require a user interaction (like a mouse click) on the page before they will allow audio to play.
                      </p>
                    </div>
                  </div>
                </div>
              ) : activeTab === "library" ? (
                <div className="space-y-12">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {VISUAL_TEMPLATES.map(template => (
                      <div key={template.id} className="bg-white/5 border border-white/5 overflow-hidden flex flex-col group hover:border-white/20 transition-all">
                        <div className="aspect-video bg-slate-900 relative overflow-hidden">
                           {template.previewUrl ? (
                             <img 
                               src={template.previewUrl} 
                               alt={template.name}
                               className="w-full h-full object-cover opacity-60 group-hover:scale-105 group-hover:opacity-100 transition-all duration-500"
                               referrerPolicy="no-referrer"
                             />
                           ) : (
                             <div className="absolute inset-0 flex items-center justify-center p-8">
                               <div className="text-center space-y-2 z-10">
                                 <div className="w-12 h-1 bg-white/10 mx-auto mb-4" />
                                 <h4 className="text-lg font-black uppercase tracking-tighter leading-none">{template.name}</h4>
                                 <p className="text-[8px] opacity-30 uppercase tracking-widest font-bold">Template_Structure_{template.id.toUpperCase()}</p>
                               </div>
                             </div>
                           )}
                           <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex justify-between items-end">
                             <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Preset_ID_{template.id.toUpperCase()}</p>
                             <Layout className="w-6 h-6 opacity-20" />
                           </div>
                        </div>
                        <div className="p-8 flex-1 flex flex-col justify-between gap-6">
                          <div>
                            <h3 className="text-xl font-bold mb-2">{template.name}</h3>
                            <p className="text-sm text-slate-400 leading-relaxed">{template.description}</p>
                          </div>
                          <button
                            onClick={() => handleAddTemplate(template.id)}
                            className="w-full py-4 text-slate-950 font-black uppercase text-xs tracking-widest hover:opacity-90 active:scale-95 transition-all"
                            style={{ backgroundColor: theme.accentColor }}
                          >
                            Add to Signage Loop
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-12">
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-2xl font-black uppercase tracking-tight">Weather Configuration</h3>
                      <div className="flex gap-4">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest self-center">High-Accuracy Canadian Weather Feed</span>
                        <button 
                          onClick={() => setWeatherConfig({ ...weatherConfig, enabled: !weatherConfig.enabled })}
                          className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest border transition-all ${
                            weatherConfig.enabled ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400" : "bg-white/5 border-white/10 text-slate-500"
                          }`}
                        >
                          {weatherConfig.enabled ? "Weather Feed ON" : "Weather Feed OFF"}
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <label className="text-[10px] font-black opacity-30 uppercase tracking-widest block">City Search</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            id="city-search-input"
                            placeholder="Enter city name..."
                            className="flex-1 bg-slate-950 border border-white/10 px-5 py-4 text-sm text-white font-mono outline-none focus:border-white/40"
                          />
                          <button
                            onClick={async () => {
                              const input = document.getElementById('city-search-input') as HTMLInputElement;
                              if (!input.value) return;
                              try {
                                const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(input.value)}&count=1&language=en&format=json`);
                                const data = await res.json();
                                if (data.results && data.results[0]) {
                                  const result = data.results[0];
                                  setWeatherConfig({
                                    ...weatherConfig,
                                    city: result.name,
                                    lat: result.latitude,
                                    lon: result.longitude
                                  });
                                }
                              } catch (e) {
                                console.error("City search failed", e);
                              }
                            }}
                            className="px-6 bg-white/10 border border-white/10 hover:bg-white/20 text-[10px] font-black uppercase tracking-widest transition-all"
                          >
                            Set Location
                          </button>
                        </div>
                      </div>

                      <div className="bg-white/5 p-8 border border-white/5 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <label className="text-[10px] font-black opacity-30 uppercase tracking-widest mb-3 block">City Display Name</label>
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
