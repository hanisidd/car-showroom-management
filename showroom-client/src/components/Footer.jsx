import { Link } from 'react-router-dom';
import { Car, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#08080c] border-t border-white/10 pt-16 pb-8 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Car className="w-4 h-4" />
              </div>
              <span className="text-lg font-black text-white tracking-wide">VELOCITY</span>
            </Link>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Premium automotive marketplace offering certified pre-owned classics, electric supercars, and daily luxury drivers.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/inventory" className="hover:text-white transition-colors">Inventory</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors">Services</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Customer Services */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Services</h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li><Link to="/contact?type=test-ride" className="hover:text-white transition-colors">Book a Test Ride</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors">Vehicle Sourcing</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors">Inspection & History</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors">Trade-In Evaluation</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3 text-xs">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Contact Showroom</h4>
            <div className="space-y-2.5 text-zinc-400">
              <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-blue-400 shrink-0" /> Blue Area, Sector G-7, Islamabad</p>
              <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-blue-400 shrink-0" /> +92 (51) 111-222-333</p>
              <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-blue-400 shrink-0" /> support@velocityauto.com</p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-500 gap-4">
          <p>© {new Date().getFullYear()} VELOCITY Automotive Platform. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="hover:text-zinc-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-zinc-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-zinc-400 cursor-pointer">Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
}