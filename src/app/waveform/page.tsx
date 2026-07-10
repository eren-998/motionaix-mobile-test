"use client";
import { useState } from "react";

export default function WaveformTool() {
  const [uploaded, setUploaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="flex-grow relative z-10 w-full max-w-screen-2xl mx-auto px-8 md:px-16 py-16 flex flex-col gap-8">
      <header className="mb-8">
        <h1 className="font-display text-5xl md:text-6xl font-extrabold text-white mb-4 tracking-tight">Waveform Generator</h1>
        <p className="font-body text-lg text-on-surface-variant max-w-2xl leading-relaxed">
          Transform your audio into reactive, high-fidelity liquid glass visualizers. Upload a track to begin sculpting.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Canvas & Upload */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          
          <div 
            className={`glass-panel rounded-3xl aspect-[16/9] w-full flex flex-col items-center justify-center p-8 relative overflow-hidden group transition-colors duration-300 cursor-pointer ${!uploaded ? 'border-dashed border-2 border-white/20 hover:border-primary-container' : 'border-primary-container/30 shadow-[inset_0_0_20px_rgba(255,209,0,0.05)]'}`}
            onClick={() => setUploaded(true)}
          >
            {!uploaded ? (
              <div className="flex flex-col items-center text-center z-10">
                <div className="w-20 h-20 rounded-full glass-panel border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-xl">
                  <span className="material-symbols-outlined text-4xl text-primary-container">cloud_upload</span>
                </div>
                <h3 className="font-display text-2xl font-bold text-white mb-2 tracking-wide">Drag & Drop Audio</h3>
                <p className="font-body text-on-surface-variant mb-6">MP3, WAV, or AIFF up to 50MB</p>
                <button className="glass-panel hover:bg-white/10 px-8 py-3 rounded-full font-label text-sm uppercase tracking-widest font-semibold transition-colors">
                  Browse Files
                </button>
              </div>
            ) : (
              <div className="absolute inset-0 w-full h-full flex flex-col justify-end p-8 bg-black/40">
                <div className="absolute inset-0 opacity-10 mix-blend-overlay bg-gradient-to-t from-black to-transparent" />
                
                {/* Visualizer output */}
                <div className="w-full h-48 flex items-end justify-center gap-1 z-10 relative px-12">
                  {[...Array(64)].map((_, i) => (
                    <div 
                      key={i} 
                      className="flex-1 rounded-t-sm transition-all duration-75"
                      style={{ 
                        height: isPlaying ? `${Math.random() * 80 + 10}%` : '10px',
                        backgroundColor: '#FFD100',
                        boxShadow: '0 0 10px rgba(255,209,0,0.5)'
                      }} 
                    />
                  ))}
                </div>

                {/* Player Controls */}
                <div className="w-full flex items-center justify-between mt-8 glass-panel p-4 rounded-2xl z-10 border-white/10">
                  <button onClick={(e) => { e.stopPropagation(); setIsPlaying(!isPlaying); }} className="text-white hover:text-primary-container transition-colors">
                    <span className="material-symbols-outlined text-4xl" style={{fontVariationSettings: "'FILL' 1"}}>{isPlaying ? 'pause_circle' : 'play_circle'}</span>
                  </button>
                  <div className="flex-grow mx-6 relative h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="absolute top-0 left-0 h-full bg-primary-container w-1/3 shadow-[0_0_10px_rgba(255,209,0,0.8)]" />
                  </div>
                  <span className="font-label text-sm text-on-surface-variant tracking-widest">01:24 / 03:45</span>
                </div>
              </div>
            )}
          </div>

          {/* Presets Bento */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="glass-panel p-4 rounded-2xl text-left hover:border-primary-container/50 hover:shadow-[inset_0_0_15px_rgba(255,209,0,0.1)] transition-all group border-primary-container/30">
              <div className="w-full h-16 mb-4 rounded-lg bg-black/30 overflow-hidden relative">
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-primary-container/40 to-transparent" />
              </div>
              <h4 className="font-label text-xs font-bold text-white uppercase tracking-widest mb-1">Liquid Glass</h4>
              <p className="font-body text-xs text-on-surface-variant">Default</p>
            </button>
            <button className="glass-panel p-4 rounded-2xl text-left hover:border-primary-container/50 hover:shadow-[inset_0_0_15px_rgba(255,209,0,0.1)] transition-all group">
              <div className="w-full h-16 mb-4 rounded-lg bg-black/30 overflow-hidden flex items-end justify-center gap-1 px-4">
                <div className="w-full h-1/3 bg-white/50 rounded-t-sm" />
                <div className="w-full h-2/3 bg-white/50 rounded-t-sm" />
                <div className="w-full h-full bg-white/50 rounded-t-sm" />
                <div className="w-full h-1/2 bg-white/50 rounded-t-sm" />
              </div>
              <h4 className="font-label text-xs font-bold text-white uppercase tracking-widest mb-1">Minimal Blocks</h4>
              <p className="font-body text-xs text-on-surface-variant">Geometric</p>
            </button>
            <button className="glass-panel p-4 rounded-2xl text-left hover:border-primary-container/50 hover:shadow-[inset_0_0_15px_rgba(255,209,0,0.1)] transition-all group">
              <div className="w-full h-16 mb-4 rounded-lg bg-black/30 overflow-hidden relative flex items-center justify-center">
                <div className="w-10 h-10 rounded-full border-2 border-[#FFEE32] border-dashed animate-spin-slow" />
              </div>
              <h4 className="font-label text-xs font-bold text-white uppercase tracking-widest mb-1">Radial Sweep</h4>
              <p className="font-body text-xs text-on-surface-variant">Circular</p>
            </button>
            <button className="glass-panel p-4 rounded-2xl text-left hover:bg-white/5 hover:border-white/20 transition-all group flex items-center justify-center flex-col">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant group-hover:text-primary-container mb-2 transition-colors">add</span>
              <h4 className="font-label text-xs text-on-surface-variant uppercase tracking-widest font-bold">Custom</h4>
            </button>
          </div>
        </div>

        {/* Right Panel: Controls */}
        <aside className="lg:col-span-4 glass-panel rounded-3xl p-8 flex flex-col gap-8 sticky top-32">
          <div className="flex items-center justify-between border-b border-white/10 pb-6">
            <h2 className="font-display text-2xl font-bold text-white">Parameters</h2>
            <button className="text-on-surface-variant hover:text-primary-container transition-colors">
              <span className="material-symbols-outlined">restart_alt</span>
            </button>
          </div>

          <div className="flex flex-col gap-6">
            <h3 className="font-label text-xs text-on-surface-variant uppercase tracking-widest font-bold">Appearance</h3>
            
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <label className="font-body text-sm text-white">Color Theme</label>
                <span className="font-label text-[10px] text-primary-container px-2 py-1 bg-white/5 border border-white/10 rounded uppercase">Sunflower</span>
              </div>
              <div className="flex gap-3 mt-1">
                <button className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FFEE32] to-[#FFD100] border-2 border-background ring-2 ring-primary-container" />
                <button className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0bebff] to-[#00dbed] border border-white/20 hover:border-white/50 transition-colors" />
                <button className="w-10 h-10 rounded-full bg-gradient-to-br from-error to-[#93000a] border border-white/20 hover:border-white/50 transition-colors" />
              </div>
            </div>

            <div className="flex items-center justify-between bg-black/20 border border-white/5 p-4 rounded-xl mt-2">
              <label className="font-body text-sm text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">blur_on</span>
                Backdrop Blur
              </label>
              <div className="relative inline-block w-12 align-middle select-none transition duration-200 ease-in cursor-pointer">
                <input type="checkbox" name="toggle" id="blur-toggle" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-transform duration-200 ease-in-out translate-x-6 z-10" style={{borderColor: '#FFD100'}} defaultChecked />
                <label htmlFor="blur-toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-primary-container/30 cursor-pointer" />
              </div>
            </div>
          </div>

          <hr className="border-white/10" />

          <div className="flex flex-col gap-6">
            <h3 className="font-label text-xs text-on-surface-variant uppercase tracking-widest font-bold">Geometry</h3>
            
            <div className="flex flex-col gap-3">
              <div className="flex justify-between">
                <label className="font-body text-sm text-white">Bar Count</label>
                <span className="font-label text-xs text-on-surface-variant">64</span>
              </div>
              <input type="range" min="16" max="256" defaultValue="64" className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary-container" />
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex justify-between">
                <label className="font-body text-sm text-white">Smoothing</label>
                <span className="font-label text-xs text-on-surface-variant">0.8</span>
              </div>
              <input type="range" min="0" max="1" step="0.1" defaultValue="0.8" className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary-container" />
            </div>
          </div>

          <div className="mt-4 pt-6 border-t border-white/10">
            <button className="w-full btn-primary font-body text-lg font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,209,0,0.3)] hover:scale-[1.02] active:scale-[0.98]">
              <span className="material-symbols-outlined">download</span>
              Export Visualizer
            </button>
            <p className="text-center font-label text-[10px] uppercase tracking-widest text-on-surface-variant mt-4">
              Renders as WebM with Alpha
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
