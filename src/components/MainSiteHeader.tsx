'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Facebook, Twitter, Instagram, Linkedin, Phone, LineChart, FileText, Newspaper, Wrench, Mail, MapPin } from 'lucide-react';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setShowProfilePopup(true);
  };

  const socialLinks = [
    { name: 'Facebook', url: 'https://www.facebook.com/ankit.kachhawa.7', icon: <Facebook size={18} /> },
    { name: 'Instagram', url: 'https://instagram.com/Ankitkachhawa', icon: <Instagram size={18} /> },
    { name: 'Twitter', url: 'https://twitter.com/iAnkitKachhawa', icon: <Twitter size={18} /> },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/ankit-kachhawa-9964421a2', icon: <Linkedin size={18} /> },
    { name: 'WhatsApp', url: 'https://wa.me/919510074375', icon: <Phone size={18} /> },
  ];

  const isActiveLink = (path: string) => {
      if (path === '/') return pathname === '/' || pathname === '/tool'; // Match root or old tool path
      if (path.startsWith('http')) return false; // External links are never 'active' in Next.js sense usually, or handle differently
      return pathname.startsWith(path);
  };

  return (
    <>
      <header 
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-md py-2' 
            : 'bg-white py-3 sm:py-4 border-b border-gray-100'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            
            {/* Logo & Profile Section - Interactive Trigger */}
            <div 
              className="relative z-50"
              onMouseEnter={handleMouseEnter}
              onClick={() => setShowProfilePopup(!showProfilePopup)}
            >
              <a href="https://ankitkachhawa.in" className="flex items-center gap-3 sm:gap-4 group cursor-pointer">
                <div className="relative">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-blue-600/20 group-hover:border-blue-600 group-hover:shadow-lg transition-all duration-300 transform group-hover:scale-105 bg-gray-100">
                    <img src="https://ankitkachhawa.in/profile.jpg" alt="Ankit Kachhawa" className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                     <img src="https://ankitkachhawa.in/verified-badge.png" alt="Verified" className="w-4 h-4 sm:w-5 sm:h-5 object-contain" />
                  </div>
                </div>
                
                <div className="flex flex-col justify-center">
                  <h1 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 leading-tight uppercase tracking-wide group-hover:text-blue-600 transition-colors">
                    Ankit Kachhawa
                  </h1>
                  <span className="text-[10px] sm:text-xs text-gray-500 font-semibold tracking-wider uppercase mt-0.5">
                    Financial Services
                  </span>
                </div>
              </a>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-2 lg:space-x-6">
              {[
                { to: "https://ankitkachhawa.in/", icon: LineChart, label: "Mutual Fund" },
                { to: "https://ankitkachhawa.in/gst", icon: FileText, label: "GST" },
                { to: "https://ankitkachhawa.in/updates", icon: Newspaper, label: "Updates" },
              ].map((item) => (
                <a 
                  key={item.to}
                  href={item.to} 
                  className={`
                    flex items-center px-3 py-2 rounded-lg text-xs lg:text-sm font-bold uppercase tracking-wider transition-all duration-300
                    text-gray-600 hover:text-blue-600 hover:bg-gray-50 hover:translate-y-[-1px]
                  `}
                >
                  <item.icon size={16} className="mr-2" />
                  <span>{item.label}</span>
                </a>
              ))}
              
              <Link 
                href="/" 
                className={`
                  flex items-center px-3 py-2 rounded-lg text-xs lg:text-sm font-bold uppercase tracking-wider transition-all duration-300 hover:translate-y-[-1px]
                  text-blue-600 bg-blue-600/10 shadow-sm translate-y-[-1px]
                `}
              >
                <Wrench size={16} className="mr-2" />
                <span>Tools</span>
              </Link>
            </nav>
  
            {/* Social Icons - Optimized for Mobile */}
            <div className="flex items-center gap-1 sm:gap-2">
              {socialLinks.map((social, index) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`
                    p-1.5 sm:p-2 text-gray-400 hover:text-white hover:bg-gradient-to-br hover:from-blue-600 hover:to-blue-700 rounded-full transition-all duration-300 hover:shadow-md transform hover:-translate-y-0.5
                    ${index > 2 ? 'hidden sm:block' : ''}
                  `}
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>

          </div>
        </div>
      </header>

      {/* Profile Popup Overlay */}
      {showProfilePopup && (
        <div 
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm animate-fade-in"
          onClick={() => setShowProfilePopup(false)}
        >
          <div 
            className="bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] w-full max-w-xs sm:max-w-sm transform transition-all animate-slide-up relative overflow-hidden ring-1 ring-black/5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Decorative Background Header */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-blue-600 via-blue-500 to-blue-800 opacity-100" />
            
            {/* Glass Overlay Pattern */}
            <div className="absolute top-0 left-0 w-full h-32 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />

            {/* Profile Info */}
            <div className="relative flex flex-col items-center text-center mt-12 px-6 pb-8">
              <div className="w-28 h-28 rounded-full border-4 border-white shadow-xl overflow-hidden mb-5 bg-white z-10 group">
                <img src="https://ankitkachhawa.in/profile.jpg" alt="Ankit Kachhawa" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              </div>
              
              <h2 className="text-2xl font-extrabold text-gray-900 uppercase tracking-tight mb-1">Ankit Kachhawa</h2>
              <p className="text-blue-600 font-bold text-xs uppercase tracking-widest mb-6">Financial Consultant</p>
              
              <div className="w-full space-y-3 text-left bg-gray-50/80 rounded-2xl p-5 border border-gray-100 shadow-inner">
                <div className="flex items-center gap-4 text-gray-600 group cursor-pointer hover:bg-white p-2 rounded-lg transition-colors">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                    <Mail size={16} />
                  </div>
                  <a href="mailto:ankitkachchhawa@gmail.com" className="text-sm font-semibold truncate hover:text-blue-600 transition-colors">ankitkachchhawa@gmail.com</a>
                </div>
                
                <div className="flex items-center gap-4 text-gray-600 group cursor-pointer hover:bg-white p-2 rounded-lg transition-colors">
                  <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
                     <Phone size={16} />
                  </div>
                  <a href="tel:+919510074375" className="text-sm font-semibold hover:text-green-600 transition-colors">+91 95100 74375</a>
                </div>
                
                <div className="flex items-center gap-4 text-gray-600 group cursor-pointer hover:bg-white p-2 rounded-lg transition-colors">
                  <div className="w-8 h-8 rounded-full bg-red-100 text-red-500 flex items-center justify-center flex-shrink-0">
                     <MapPin size={16} />
                  </div>
                  <span className="text-sm font-semibold">Deesa, Gujarat, India</span>
                </div>
              </div>

              <div className="mt-8 w-full">
                <a 
                  href="https://wa.me/919510074375" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 uppercase text-sm tracking-wider"
                >
                  <Phone size={18} />
                  Book Consultation
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(10px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out forwards;
        }
        .animate-slide-up {
          animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </>
  );
};

export default Header;
