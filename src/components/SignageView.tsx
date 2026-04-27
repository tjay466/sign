import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Clock, Sun, Cloud, Droplets, Waves, Leaf, Settings, Volume2, VolumeX, Thermometer, Wind, Music } from "lucide-react";
import YouTube from "react-youtube";
import { SignageData } from "../types";

interface SignageViewProps {
  data: SignageData;
  onOpenSettings: () => void;
}

export default function SignageView({ data, onOpenSettings }: SignageViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [time, setTime] = useState(new Date());
  const [isMuted, setIsMuted] = useState(true);
  const [audioError, setAudioError] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Sync background music
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = data.musicConfig.volume;
      audioRef.current.muted = isMuted;
      
      if (data.musicConfig.enabled) {
        audioRef.current.play().catch(err => {
          console.warn("Autoplay blocked or audio error:", err);
          setAudioError(true);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [data.musicConfig.enabled, data.musicConfig.url, data.musicConfig.volume, isMuted]);

  // Handle manual interaction to clear audio error/unblock
  const handleUnblockAudio = () => {
    if (audioRef.current && data.musicConfig.enabled) {
      audioRef.current.play().then(() => setAudioError(false));
    }
  };

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Reset index if it gets out of bounds (e.g. after removing items)
    if (currentIndex >= data.announcements.length) {
      setCurrentIndex(0);
    }
  }, [data.announcements, currentIndex]);

  useEffect(() => {
    if (!data.announcements.length || currentIndex >= data.announcements.length) return;

    const currentAnnouncement = data.announcements[currentIndex];
    
    // For YouTube, we still use a long fallback timer (e.g. 10 mins) 
    // just in case onEnd never fires, but generally we wait for the video.
    const timeoutDuration = currentAnnouncement?.type === 'youtube' 
      ? Math.max(currentAnnouncement.duration || 0, 600000) 
      : currentAnnouncement?.duration || 5000;

    const timer = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % data.announcements.length);
    }, timeoutDuration);

    return () => clearTimeout(timer);
    // Only re-run the timer if the index changes or the actual number of announcements changes.
    // If the content of announcements changes but the length is same, we let the current timer finish.
  }, [currentIndex, data.announcements.length]);

  const currentAnnouncement = data.announcements[currentIndex];

  return (
    <>
      <div
        className="fixed inset-0 overflow-hidden flex flex-col font-sans transition-colors duration-1000"
        style={{ backgroundColor: data.theme.backgroundColor, color: data.theme.textColor }}
      >
      {/* Header Section: Brand & Time */}
      <header className="h-24 px-12 flex items-center justify-between border-b border-white/10 z-20">
        <div className="flex items-center gap-4">
          {data.logoUrl ? (
            <img src={data.logoUrl} alt={data.storeName} className="h-16 w-auto object-contain" referrerPolicy="no-referrer" />
          ) : (
            <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-teal-500/20 backdrop-blur-sm border border-teal-500/30">
              <Waves className="w-8 h-8 text-teal-400" />
            </div>
          )}
          <span className="text-4xl font-black tracking-tighter uppercase ml-4">
            {data.storeName.split(" ").map((word, i) => (
              <span key={i} className={i === data.storeName.split(" ").length - 1 ? "" : "mr-2"} style={i === data.storeName.split(" ").length - 1 ? { color: data.theme.accentColor } : {}}>
                {word}
              </span>
            ))}
          </span>
        </div>
        <div className="text-right flex items-center gap-6">
          <div>
            <div className="text-3xl font-light opacity-60 uppercase tracking-[0.2em]">
              {time.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}
            </div>
            <div className="text-xl font-mono opacity-80" style={{ color: data.theme.accentColor }}>
              {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
          </div>
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-colors border border-white/5"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? (
              <VolumeX className="w-6 h-6 opacity-40 hover:opacity-100 transition-opacity" />
            ) : (
              <Volume2 className="w-6 h-6 text-sky-400 opacity-100 transition-opacity" />
            )}
          </button>
          <button 
            onClick={onOpenSettings}
            className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-colors border border-white/5"
          >
            <Settings className="w-6 h-6 opacity-40 hover:opacity-100 transition-opacity" />
          </button>
        </div>
      </header>

      {/* Main Content: Split Grid Layout */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Column: Content Display */}
        <section className="w-[65%] p-16 flex flex-col justify-center relative border-r border-white/5 overflow-hidden">
          {/* Subtle Water Ripple Background (only for text/media with transparent bg) */}
          {currentAnnouncement?.type === 'text' && (
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
                <filter id="liquid">
                  <feTurbulence type="fractalNoise" baseFrequency="0.01 0.01" numOctaves="3" result="warp" />
                  <feDisplacementMap in="SourceGraphic" in2="warp" scale="30" />
                </filter>
                <circle cx="500" cy="500" r="400" fill="none" stroke="currentColor" strokeWidth="2" filter="url(#liquid)" />
              </svg>
            </div>
          )}
          
          <div className="relative z-10 h-full flex flex-col justify-center">
            <AnimatePresence mode="wait">
              {currentAnnouncement && (
                <motion.div
                  key={currentAnnouncement.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full flex flex-col justify-center"
                >
                  {currentAnnouncement.type === 'text' && (
                    <div className="flex flex-col justify-center">
                      <span 
                        className="inline-block px-4 py-1 text-slate-950 font-bold text-sm uppercase mb-8 tracking-widest rounded-sm w-fit"
                        style={{ backgroundColor: data.theme.accentColor }}
                      >
                        Featured Today
                      </span>
                      <h1 className="text-[100px] leading-[0.85] font-black uppercase mb-10 tracking-tighter drop-shadow-2xl">
                        {currentAnnouncement.text?.split(' ').map((word, i) => (
                          <React.Fragment key={i}>
                            {word}<br/>
                          </React.Fragment>
                        ))}
                      </h1>
                    </div>
                  )}

                  {currentAnnouncement.type === 'image' && (
                    <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
                      <img 
                        src={currentAnnouncement.mediaUrl} 
                        alt={currentAnnouncement.text || ""} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      {currentAnnouncement.text && (
                        <div className="absolute bottom-0 left-0 right-0 p-12 bg-gradient-to-t from-black/80 to-transparent">
                          <h2 className="text-6xl font-black uppercase tracking-tighter">
                            {currentAnnouncement.text}
                          </h2>
                        </div>
                      )}
                    </div>
                  )}

                  {currentAnnouncement.type === 'youtube' && (
                    <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black">
                      <YouTube
                        videoId={currentAnnouncement.mediaUrl}
                        opts={{
                          height: '100%',
                          width: '100%',
                          playerVars: {
                            autoplay: 1,
                            mute: isMuted ? 1 : 0, 
                            controls: 0,
                            modestbranding: 1,
                            rel: 0,
                            iv_load_policy: 3,
                            cc_load_policy: 1,
                          },
                        }}
                        onReady={(event) => {
                          if (isMuted) {
                            event.target.mute();
                          } else {
                            event.target.unMute();
                          }
                          event.target.playVideo();
                        }}
                        onEnd={() => {
                          setCurrentIndex((prev) => (prev + 1) % data.announcements.length);
                        }}
                        className="absolute inset-0 w-full h-full"
                        containerClassName="w-full h-full"
                      />
                    </div>
                  )}

                  {currentAnnouncement.type === 'template' && (
                    <div className="relative w-full h-full overflow-hidden flex flex-col justify-center">
                      {currentAnnouncement.templateId === 'spotlight' && (
                        <div className="relative h-full flex flex-col justify-end p-20 overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
                          <img 
                            src={currentAnnouncement.mediaUrl} 
                            className="absolute inset-0 w-full h-full object-cover z-0" 
                            style={{ filter: "brightness(0.6) contrast(1.2)" }}
                            referrerPolicy="no-referrer"
                          />
                          <div className="relative z-10 space-y-6">
                            <span 
                              className="inline-block px-4 py-1 text-slate-950 font-black text-sm uppercase tracking-widest"
                              style={{ backgroundColor: data.theme.accentColor }}
                            >
                              SPOTLIGHT
                            </span>
                            <h1 className="text-[120px] leading-[0.8] font-black uppercase tracking-tighter">
                              {currentAnnouncement.text}
                            </h1>
                            <p className="text-3xl font-bold uppercase tracking-widest text-white/80">
                              {currentAnnouncement.subtitle}
                            </p>
                            <div className="flex gap-8 items-center pt-8">
                              {currentAnnouncement.price && (
                                <div className="text-6xl font-black font-mono" style={{ color: data.theme.accentColor }}>
                                  {currentAnnouncement.price}
                                </div>
                              )}
                              {currentAnnouncement.cta && (
                                <div className="px-8 py-4 border-2 border-white/20 text-white font-black uppercase tracking-widest">
                                  {currentAnnouncement.cta}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {currentAnnouncement.templateId === 'modern-text' && (
                        <div 
                          className="h-full flex flex-col items-center justify-center p-20 text-center rounded-3xl overflow-hidden"
                          style={{ background: `linear-gradient(135deg, ${data.theme.backgroundColor}, #000)` }}
                        >
                          <div className="max-w-4xl space-y-12">
                             <div className="w-32 h-1 mx-auto" style={{ backgroundColor: data.theme.accentColor }} />
                             <h1 className="text-8xl font-black uppercase tracking-tighter leading-none italic">
                               {currentAnnouncement.text}
                             </h1>
                             <p className="text-4xl font-light tracking-[0.3em] uppercase opacity-60">
                               {currentAnnouncement.subtitle}
                             </p>
                             {currentAnnouncement.cta && (
                               <div className="pt-10">
                                  <span 
                                    className="px-12 py-5 text-slate-950 font-black uppercase tracking-[0.5em] text-sm"
                                    style={{ backgroundColor: data.theme.accentColor }}
                                  >
                                    {currentAnnouncement.cta}
                                  </span>
                               </div>
                             )}
                          </div>
                        </div>
                      )}

                      {currentAnnouncement.templateId === 'split-banner' && (
                        <div className="h-full grid grid-cols-2 rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                           <div className="relative">
                              <img 
                                src={currentAnnouncement.mediaUrl} 
                                className="absolute inset-0 w-full h-full object-cover" 
                                referrerPolicy="no-referrer"
                              />
                           </div>
                           <div className="bg-white/5 backdrop-blur-xl p-20 flex flex-col justify-center gap-8">
                              <h2 className="text-6xl font-black uppercase tracking-tighter leading-tight">
                                {currentAnnouncement.text}
                              </h2>
                              <p className="text-xl text-slate-400 leading-relaxed font-medium">
                                {currentAnnouncement.subtitle}
                              </p>
                              {currentAnnouncement.cta && (
                                <div className="pt-6">
                                  <button 
                                    className="px-10 py-5 text-slate-950 font-black uppercase tracking-widest text-sm"
                                    style={{ backgroundColor: data.theme.accentColor }}
                                  >
                                    {currentAnnouncement.cta}
                                  </button>
                                </div>
                              )}
                           </div>
                        </div>
                      )}

                      {currentAnnouncement.templateId === 'minimal-alert' && (
                        <div 
                          className="h-full flex flex-col items-center justify-center border-[20px] rounded-3xl"
                          style={{ borderColor: data.theme.accentColor }}
                        >
                           <div className="text-center space-y-8 animate-pulse p-20">
                             <h1 className="text-[120px] font-black uppercase tracking-widest leading-none" style={{ color: data.theme.accentColor }}>
                                {currentAnnouncement.text}
                             </h1>
                             <div className="h-0.5 w-full bg-white/20" />
                             <p className="text-4xl font-bold uppercase tracking-tighter">
                                {currentAnnouncement.subtitle}
                             </p>
                           </div>
                        </div>
                      )}

                      {currentAnnouncement.templateId === 'video-background' && (
                        <div className="relative h-full w-full rounded-3xl overflow-hidden">
                           <div className="absolute inset-0 z-0">
                               <YouTube
                                videoId={currentAnnouncement.mediaUrl}
                                opts={{
                                  height: '100%',
                                  width: '100%',
                                  playerVars: {
                                    autoplay: 1,
                                    mute: 1, 
                                    controls: 0,
                                    modestbranding: 1,
                                    rel: 0,
                                    loop: 1,
                                    playlist: currentAnnouncement.mediaUrl, // Required for loop
                                  },
                                }}
                                className="absolute inset-0 w-full h-full scale-125" // Scale up to hide edges
                                containerClassName="w-full h-full"
                              />
                           </div>
                           <div className="absolute inset-0 bg-black/40 z-10 flex flex-col items-center justify-center p-20 text-center">
                              <h1 className="text-8xl font-black uppercase tracking-tighter mb-4 drop-shadow-2xl">
                                {currentAnnouncement.text}
                              </h1>
                              <p className="text-2xl font-bold uppercase tracking-widest opacity-80" style={{ color: data.theme.accentColor }}>
                                {currentAnnouncement.subtitle}
                              </p>
                           </div>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Right Column: Information/Secondary section */}
        <section className="w-[35%] flex flex-col bg-white/5 backdrop-blur-sm">
          <div 
            className="flex-1 p-12 cursor-pointer hover:bg-white/[0.02] transition-colors group"
            onClick={onOpenSettings}
          >
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-xs font-bold opacity-40 uppercase tracking-[0.3em]">Garden Conditions</h2>
              <Settings className="w-4 h-4 opacity-0 group-hover:opacity-40 transition-opacity" />
            </div>
            <div className="space-y-8">
              {data.conditions.map((condition) => {
                const IconComponent = {
                  Sun,
                  Cloud,
                  Droplets,
                  Thermometer,
                  Wind,
                  Leaf // Fallback
                }[condition.icon] || Droplets;

                return (
                  <div key={condition.id} className="flex items-center gap-6 opacity-80 group/cond">
                    <IconComponent className="w-6 h-6 transition-transform group-hover/cond:scale-110" style={{ color: data.theme.accentColor }} />
                    <span className="text-xl font-medium tracking-tight truncate">{condition.label}: {condition.value}</span>
                  </div>
                );
              })}
              <div className="flex items-center gap-4 opacity-80 pt-4">
                <div 
                  className="w-2 h-2 rounded-full animate-pulse" 
                  style={{ backgroundColor: data.theme.accentColor }}
                />
                <span className="text-sm font-mono uppercase tracking-widest opacity-50">Systems Operational</span>
              </div>
            </div>
          </div>

        </section>
      </main>

      {/* Footer Bar: Displaying Active Announcement Ticker */}
      <footer 
        className="h-16 text-slate-950 flex items-center px-12 z-20"
        style={{ backgroundColor: data.theme.accentColor }}
      >
        <div className="text-sm font-bold uppercase tracking-[0.2em] flex-1 truncate overflow-hidden">
          <motion.div
            animate={{ x: [1000, -1000] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="whitespace-nowrap"
          >
            {data.tickerText || data.announcements.map(a => a.text).join(" • ")}
          </motion.div>
        </div>
        <div className="flex gap-6 items-center ml-8">
          <span className="opacity-60 font-mono text-xs border-l border-slate-950/20 pl-6 uppercase">STORE_ID: POND-44</span>
        </div>
      </footer>
    </div>
    <audio 
      ref={audioRef} 
      src={data.musicConfig.url} 
      loop 
      autoPlay={data.musicConfig.enabled}
    />
    
    {/* Optional Interaction Overlay for Autoplay bypass */}
    {data.musicConfig.enabled && audioError && (
      <div 
        className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center cursor-pointer backdrop-blur-sm"
        onClick={handleUnblockAudio}
      >
        <div className="bg-slate-900 p-8 border border-white/10 flex flex-col items-center gap-6 shadow-2xl">
          <Music className="w-16 h-16 text-emerald-400 animate-bounce" />
          <div className="text-center">
            <h2 className="text-2xl font-black uppercase tracking-tight mb-2">Enable Audio</h2>
            <p className="text-sm text-slate-400 uppercase tracking-widest font-bold">Click anywhere to start the soundscape</p>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
