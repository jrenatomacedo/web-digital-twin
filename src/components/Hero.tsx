"use client";

import { motion } from "framer-motion";
import { ArrowRight, Terminal } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-brand-cyan/20 rounded-full mix-blend-screen filter blur-[128px] opacity-50 animate-pulse" />
      <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-brand-cyan/10 rounded-full mix-blend-screen filter blur-[128px] opacity-30" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            <div className="inline-flex items-center space-x-2 glass-cyan px-4 py-2 rounded-full border border-brand-cyan/30">
              <Terminal size={16} className="text-brand-cyan" />
              <span className="text-sm font-mono text-brand-cyan">Executive Tech Lead & Architect</span>
            </div>
            
            <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight tracking-tight">
              Building <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-blue-500">Robust</span><br/>
              Architectures & <br/>
              High-Performance <br/>
              Teams.
            </h1>
            
            <p className="text-lg md:text-xl text-brand-gray max-w-2xl font-light leading-relaxed">
              I'm José Renato Oliveira, a Development Executive with 17+ years of experience transforming business requirements into scalable, innovative technology solutions.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a href="#experience" className="inline-flex justify-center items-center space-x-2 bg-brand-cyan text-background hover:bg-white transition-colors px-8 py-4 rounded-lg font-semibold cursor-pointer">
                <span>Explore My Journey</span>
                <ArrowRight size={20} />
              </a>
              <a href="https://www.linkedin.com/in/jrenato-oliveira" target="_blank" rel="noreferrer" className="inline-flex justify-center items-center space-x-2 glass hover:bg-white/5 transition-colors px-8 py-4 rounded-lg font-semibold border border-white/10 text-white cursor-pointer">
                <span>LinkedIn Profile</span>
              </a>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="hidden lg:flex relative justify-center"
          >
            {/* Abstract Tech Graphic or Image Placeholder */}
            <div className="relative w-full aspect-square max-w-md">
              <div className="absolute inset-0 border border-brand-cyan/30 rounded-2xl transform rotate-3 glass-cyan" />
              <div className="absolute inset-0 border border-brand-cyan/10 rounded-2xl transform -rotate-3 overflow-hidden bg-brand-slate/50 backdrop-blur-sm flex items-center justify-center">
                 <div className="text-center space-y-4">
                   <div className="w-24 h-24 rounded-full bg-brand-cyan/10 border border-brand-cyan/20 mx-auto flex items-center justify-center">
                     <Terminal size={40} className="text-brand-cyan" />
                   </div>
                   <div className="font-mono text-xs text-brand-cyan">JRO_SYSTEM_READY</div>
                 </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
