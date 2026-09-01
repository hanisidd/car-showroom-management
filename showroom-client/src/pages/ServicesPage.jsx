import { motion } from 'framer-motion';
import { Car, ShieldCheck, Wrench, Banknote, Clock, Award, PhoneCall } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ServicesPage() {
  const services = [
    {
      icon: Car,
      title: 'Vehicle Sales & Import',
      description: 'Explore high-grade imported vehicles, custom order options directly from auction houses, and verified local inventory.',
    },
    {
      icon: ShieldCheck,
      title: 'Inspection & Certification',
      description: 'Every vehicle undergoes a comprehensive 200-point physical and mechanical check with a complete auction/history sheet.',
    },
    {
      icon: Banknote,
      title: 'Flexible Financing',
      description: 'Customized payment plans and partnership with top banking networks to make your dream car accessible.',
    },
    {
      icon: Wrench,
      title: 'Post-Sale Maintenance',
      description: 'Dedicated workshop support, genuine spare parts sourcing, and routine diagnostic services for peace of mind.',
    },
    {
      icon: Clock,
      title: 'Car Trade-In / Buy-Back',
      description: 'Get your current vehicle evaluated instantly and upgrade seamlessly with our fair market value guarantee.',
    },
    {
      icon: Award,
      title: 'Registration & Transfers',
      description: 'Hassle-free documentation handling, excise tax clearance, and transfer of ownership directly to your name.',
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider">
          <span>What We Offer</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight">Premium Automotive Solutions</h1>
        <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
          From vehicle sourcing to post-purchase maintenance, we provide end-to-end dealership services tailored to your standard.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, index) => {
          const Icon = service.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-6 rounded-3xl border border-white/10 hover:border-blue-500/40 transition-all group flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">{service.title}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">{service.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* CTA Box */}
      <div className="glass-card p-8 rounded-3xl border border-white/10 text-center space-y-4 bg-gradient-to-r from-blue-900/20 via-black to-blue-900/20">
        <h2 className="text-2xl font-extrabold text-white">Need a Custom Vehicle Sourcing Order?</h2>
        <p className="text-xs text-zinc-400 max-w-lg mx-auto">
          Contact our specialized automotive team to import or reserve your preferred make, model, and package directly.
        </p>
        <div className="pt-2">
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-blue-500/20 transition-all"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Get in Touch with Us</span>
          </Link>
        </div>
      </div>
    </div>
  );
}