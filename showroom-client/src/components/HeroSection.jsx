import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen pt-32 pb-16 px-4 sm:px-8 flex items-center justify-center overflow-hidden">
      {/* Background Glowing Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-purple-600/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left Column: Copy */}
        <motion.div 
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-6 text-left"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel border-blue-500/30 text-blue-400 text-xs font-semibold tracking-wide uppercase">
            <Sparkles className="w-4 h-4" />
            <span>Next Generation Auto Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Drive the Future of <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-500 bg-clip-text text-transparent">
              Automotive Luxury
            </span>
          </h1>

          <p className="text-zinc-400 text-lg max-w-lg">
            Discover pre-owned classics, electric supercars, and premium daily drivers—all inspected and delivered to your doorstep.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            {/* Explore Fleet -> /inventory */}
            <Link 
              to="/inventory" 
              className="flex items-center gap-2 px-6 py-3.5 font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span>Explore Fleet</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            {/* Book Test Drive -> /contact?type=test-ride */}
            <Link 
              to="/contact?type=test-ride" 
              className="px-6 py-3.5 font-semibold text-zinc-300 glass-panel hover:bg-white/5 rounded-xl transition-all"
            >
              Book Test Drive
            </Link>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-4 pt-8 border-t border-zinc-800">
            <div>
              <p className="text-2xl font-bold text-white">500+</p>
              <p className="text-xs text-zinc-500">Cars Available</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">99.8%</p>
              <p className="text-xs text-zinc-500">Verified Quality</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">24/7</p>
              <p className="text-xs text-zinc-500">Support Line</p>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Hero Visual Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="glass-card rounded-3xl p-4 border-white/10 shadow-2xl relative overflow-hidden group">
            <img 
              src="https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=1000" 
              alt="Luxury Sports Car" 
              className="w-full h-[380px] object-cover rounded-2xl group-hover:scale-105 transition-transform duration-700"
            />
            
            {/* Floating Glass Badges */}
            <div className="absolute top-8 left-8 glass-panel px-4 py-2 rounded-xl backdrop-blur-xl flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-semibold text-white">Electric Hypercar</span>
            </div>

            <div className="absolute bottom-8 right-8 glass-panel px-4 py-2 rounded-xl backdrop-blur-xl flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-semibold text-white">Certified Guarantee</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}