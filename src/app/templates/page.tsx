export default function Templates() {
  const categories = ["All", "Motion Graphics", "Text Animation", "VFX", "Transitions"];
  
  // Empty state since user will design their own features
  const templates: unknown[] = []; 

  return (
    <div className="w-full max-w-screen-2xl mx-auto px-16 py-16 flex flex-col gap-10">
      <section className="flex flex-col gap-6 w-full items-center text-center py-8">
        <h1 className="font-display text-6xl font-extrabold text-on-background tracking-tight">Template Library</h1>
        <p className="font-body text-lg text-on-surface-variant max-w-2xl">
          Discover high-performance motion design templates engineered for precision and fluidity.
        </p>
        
        {/* Search Bar */}
        <div className="w-full max-w-xl relative mt-4">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
          <input 
            type="text" 
            placeholder="Search templates..." 
            className="w-full bg-surface-container-highest/50 border border-outline-variant text-on-surface font-body pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all backdrop-blur-md"
          />
        </div>
      </section>

      {/* Categories */}
      <section className="flex flex-wrap gap-4 justify-center">
        {categories.map((cat, i) => (
          <button 
            key={i} 
            className={`px-6 py-3 rounded-full font-label uppercase tracking-widest text-sm transition-all border ${i === 0 ? 'bg-primary-container/10 border-primary-container text-primary-container font-bold' : 'bg-surface-container-highest/50 border-outline-variant text-on-surface-variant hover:bg-surface-container-highest'}`}
          >
            {cat}
          </button>
        ))}
      </section>

      {/* Grid Placeholder */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-8">
        {[1, 2, 3, 4, 5, 6, 7, 8].map(item => (
          <div key={item} className="liquid-glass-wrapper w-full h-[320px]">
             <div className="liquid-glass-card interactive w-full h-full p-0">
               <div className="glass-specular-shine"></div>
               <div className="w-full h-48 bg-surface-container-highest/30 flex items-center justify-center border-b border-outline-variant/30">
                 <span className="material-symbols-outlined text-4xl text-on-surface-variant opacity-50">movie</span>
               </div>
               <div className="glass-content !items-start text-left p-6">
                 <div className="w-1/2 h-4 bg-on-surface-variant/20 rounded mb-2"></div>
                 <div className="w-3/4 h-3 bg-on-surface-variant/10 rounded"></div>
               </div>
             </div>
          </div>
        ))}
      </section>
    </div>
  );
}
