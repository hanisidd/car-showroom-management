import { motion } from 'framer-motion';
import { Building2, Users, Shield, Trophy, CheckCircle2 } from 'lucide-react';

export default function AboutPage() {
  const stats = [
    { label: 'Vehicles Sold', value: '1,500+' },
    { label: 'Happy Customers', value: '98%' },
    { label: 'Years Experience', value: '12+' },
    { label: 'Certified Inspections', value: '100%' },
  ];

  const coreValues = [
    { title: 'Transparency', desc: 'No hidden fees or misleading vehicle histories. Every detail is documented.' },
    { title: 'Quality Assurance', desc: 'Strict multi-point inspections on all vehicles prior to showroom listing.' },
    { title: 'Customer Priority', desc: 'Tailored guidance from consultation to delivery and registration.' },
  ];

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16 text-left">
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5" />
            <span>About Our Dealership</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight">
            Redefining the Luxury Automotive Experience.
          </h1>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Founded with a commitment to trust and excellence, our showroom offers carefully curated premium and imported vehicles. We bridge the gap between verified quality and seamless car buying.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card p-6 rounded-3xl border border-white/10 text-center"
            >
              <h3 className="text-3xl font-black text-blue-400 mb-1">{stat.value}</h3>
              <p className="text-xs text-zinc-400 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Values Section */}
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-white">Why Choose Us</h2>
          <p className="text-xs text-zinc-400">Our operational standards guarantee satisfaction on every sale.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {coreValues.map((value, idx) => (
            <div key={idx} className="glass-card p-6 rounded-2xl border border-white/10 space-y-3">
              <CheckCircle2 className="w-6 h-6 text-blue-400" />
              <h3 className="text-base font-bold text-white">{value.title}</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">{value.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}