export default function Editor() {
  return (
    <div className="flex-grow flex flex-col md:flex-row gap-8 p-10 max-w-screen-2xl mx-auto w-full">
      {/* Center-Left: Preview Canvas */}
      <section className="flex-grow flex flex-col gap-6 w-full lg:w-2/3">
        <div className="glass-panel rounded-3xl p-6 flex flex-col h-full min-h-[600px] relative overflow-hidden group border-white/10">
          
          {/* Top Canvas Bar */}
          <div className="flex justify-between items-center mb-6 text-on-surface-variant font-label text-xs uppercase tracking-widest font-semibold">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-lg text-primary-container">video_camera_front</span>
              <span className="text-white">Kinetic Typography V1</span>
            </div>
            <div className="flex items-center gap-6">
              <span>1920x1080</span>
              <span className="text-white bg-white/10 px-3 py-1 rounded-full border border-white/10">00:15:00</span>
            </div>
          </div>

          {/* Video Area */}
          <div className="flex-grow bg-black/60 rounded-2xl flex items-center justify-center relative border border-white/5 overflow-hidden shadow-2xl">
            <div 
              className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-screen bg-cover bg-center" 
              style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuClHLhED7V4BUBlVegYKwhB039scdL-ECMuwNLKS8pMVH4P7a1GQMziaSeogjNFTE8x_1QFgRL4gTMk9_CLiZnUNGp5ODwKLO6N0skKcE5k1B_IgHvt8-Io5_EX9vIdvlcZ37Dhmewyc80OF0EX4oDLIyd_L1EHdoRPB-Y23GG2IuxAag8aL-ppUpRod16bZLftggXEQrgsU2LfAD5cN1V4Tq8NmE2WgtcLZMagg3m1M6iX8n2l91xazmY3A7gcpnqjvS8s4Y0TG7s')" }} 
            />
            
            {/* Overlay Text Graphic */}
            <div className="z-10 text-center pointer-events-none drop-shadow-2xl">
              <h1 className="font-display text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-container to-white tracking-tighter leading-none">
                PRECISION<br />MOTION
              </h1>
            </div>

            {/* Play Controls Overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-[2px]">
              <button className="w-24 h-24 rounded-full bg-primary-container text-black flex items-center justify-center shadow-[0_0_30px_rgba(255,209,0,0.4)] hover:scale-110 hover:bg-[#FFEE32] transition-all">
                <span className="material-symbols-outlined text-5xl ml-2" style={{fontVariationSettings: "'FILL' 1"}}>play_arrow</span>
              </button>
            </div>
          </div>

          {/* Timeline */}
          <div className="mt-6 h-24 bg-black/40 rounded-xl border border-white/5 p-2 flex items-end gap-[2px] relative overflow-hidden">
            <div className="absolute top-0 bottom-0 left-1/3 w-0.5 bg-primary-container shadow-[0_0_10px_#ffd100] z-20" />
            
            <div className="w-full h-full flex items-end justify-between gap-[2px] px-2 pb-2">
              {[...Array(100)].map((_, i) => (
                <div 
                  key={i}
                  className={`w-full rounded-t-[1px] ${i < 33 ? 'bg-primary-container opacity-80' : 'bg-white/20'}`}
                  style={{ height: `${Math.abs(Math.sin(i)) * 80 + 10}%` }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Right Panel: Tools */}
      <aside className="w-full lg:w-1/3 flex flex-col gap-6">
        <div className="glass-panel border-primary-container/30 shadow-[inset_0_0_15px_rgba(255,209,0,0.05)] rounded-3xl p-8 h-full flex flex-col gap-8">
          
          <div className="border-b border-white/10 pb-6">
            <h2 className="font-display text-2xl font-bold text-primary-container tracking-tight">Properties</h2>
            <p className="font-body text-sm text-on-surface-variant mt-2">Adjust layer parameters</p>
          </div>

          <div className="flex flex-col gap-3">
            <label className="font-label text-xs text-white uppercase tracking-widest font-bold">Main Text</label>
            <input 
              type="text" 
              defaultValue="PRECISION MOTION" 
              className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-white font-body text-lg focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all shadow-inner"
            />
          </div>

          <div className="flex flex-col gap-3">
            <label className="font-label text-xs text-white uppercase tracking-widest font-bold">Accent Color</label>
            <div className="flex gap-4">
              <button className="w-12 h-12 rounded-full bg-primary-container ring-2 ring-white ring-offset-2 ring-offset-background shadow-lg" />
              <button className="w-12 h-12 rounded-full bg-[#FFEE32] opacity-70 hover:opacity-100 hover:scale-110 transition-all border border-white/20" />
              <button className="w-12 h-12 rounded-full bg-white opacity-70 hover:opacity-100 hover:scale-110 transition-all border border-white/20" />
              <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors border-dashed">
                <span className="material-symbols-outlined text-on-surface-variant">add</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <label className="font-label text-xs text-white uppercase tracking-widest font-bold">Animation Speed</label>
              <span className="font-label text-xs text-primary-container bg-white/5 px-2 py-1 rounded">1.2x</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="2" 
              step="0.1" 
              defaultValue="1.2" 
              className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary-container" 
            />
          </div>

          <div className="flex flex-col gap-3">
            <label className="font-label text-xs text-white uppercase tracking-widest font-bold">Easing Style</label>
            <div className="relative">
              <select className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-white font-body appearance-none focus:outline-none focus:border-primary-container transition-all cursor-pointer">
                <option value="spring">Spring (Bouncy)</option>
                <option value="ease-in-out">Smooth Easing</option>
                <option value="linear">Linear (Constant)</option>
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-on-surface-variant">expand_more</span>
              </div>
            </div>
          </div>

          <div className="mt-auto pt-8 border-t border-white/10">
            <button className="w-full py-4 rounded-xl bg-white/5 border border-white/10 text-white font-display text-lg font-bold hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-3">
              <span className="material-symbols-outlined">layers</span>
              Open Layer Tree
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
