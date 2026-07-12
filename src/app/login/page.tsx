"use client";

import { motion } from "motion/react";
import { ArrowRight, GoogleLogo, GithubLogo } from "@phosphor-icons/react";

export default function Login() {
  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-container/5 rounded-full blur-[120px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md z-10"
      >
        <div className="liquid-glass-wrapper w-full">
          <div className="liquid-glass-card w-full p-10 md:p-12 !items-stretch text-center cursor-default">
            <div className="glass-specular-shine"></div>
            
            <div className="glass-content !items-stretch">
              <div className="mb-10 text-center flex flex-col items-center">
                <span className="font-display text-3xl font-extrabold text-on-background tracking-tight mb-2">MotionAIx</span>
                <p className="font-body text-on-surface-variant text-sm">Sign in to access the engine.</p>
              </div>

              <div className="flex flex-col gap-4 mb-8">
                <button className="glass-panel hover:bg-white/5 transition-colors h-12 rounded-xl flex items-center justify-center gap-3 font-body font-medium border border-outline-variant">
                  <GoogleLogo weight="bold" className="w-5 h-5 text-on-surface" />
                  <span>Continue with Google</span>
                </button>
                <button className="glass-panel hover:bg-white/5 transition-colors h-12 rounded-xl flex items-center justify-center gap-3 font-body font-medium border border-outline-variant">
                  <GithubLogo weight="bold" className="w-5 h-5 text-on-surface" />
                  <span>Continue with GitHub</span>
                </button>
              </div>

              <div className="flex items-center gap-4 mb-8 w-full">
                <div className="h-px bg-outline-variant flex-1" />
                <span className="font-label text-xs uppercase tracking-widest text-on-surface-variant">or</span>
                <div className="h-px bg-outline-variant flex-1" />
              </div>

              <form className="flex flex-col gap-5 text-left w-full" onSubmit={(e) => e.preventDefault()}>
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="font-label text-xs uppercase tracking-widest text-on-surface font-semibold">Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    className="h-12 bg-surface-container-low border border-outline-variant rounded-xl px-4 font-body text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all"
                    placeholder="creator@motionaix.com"
                  />
                </div>
                
                <div className="flex flex-col gap-2">
                  <label htmlFor="password" className="font-label text-xs uppercase tracking-widest text-on-surface font-semibold">Password</label>
                  <input 
                    type="password" 
                    id="password" 
                    className="h-12 bg-surface-container-low border border-outline-variant rounded-xl px-4 font-body text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all"
                    placeholder="••••••••"
                  />
                </div>

                <button className="liquid-glass-btn group h-12 rounded-xl mt-4 flex items-center justify-center gap-2">
                  <div className="glass-specular-shine"></div>
                  <div className="glass-content flex-row justify-center">
                    <span className="font-label uppercase tracking-widest text-sm font-bold text-on-primary-container">Sign In</span>
                    <ArrowRight weight="bold" className="w-4 h-4 text-on-primary-container group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              </form>

              <div className="mt-8 text-center">
                <a href="#" className="font-body text-sm text-on-surface-variant hover:text-primary-container transition-colors">
                  Don&apos;t have an account? Request access.
                </a>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
