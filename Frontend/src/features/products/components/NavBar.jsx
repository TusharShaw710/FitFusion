import React from 'react'
import { 
  Search, 
  ShoppingBag, 
  User, 
  ChevronRight, 
  ArrowRight, 
  Filter, 
  Package,
  Heart,
  Plus
} from 'lucide-react';
import { useState, useEffect } from 'react';

const Container = ({ children, className = "" }) => (
  <div className={`max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 ${className}`}>
    {children}
  </div>
);

const NavBar = () => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${isScrolled ? 'bg-white/80 backdrop-blur-xl border-b border-black/5 py-4' : 'bg-transparent py-8'}`}>
        <Container className="flex items-center justify-between">
          <div className="flex items-center gap-12">
            <span 
              className="text-2xl font-serif tracking-tighter cursor-pointer"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              FitFusion
            </span>
            <div className="hidden md:flex items-center gap-8 text-[11px] font-bold tracking-[0.2em] uppercase text-black/60">
              <a href="/" className="hover:text-black transition-colors">Home</a>
              <a href="#" className="hover:text-black transition-colors">Shop</a>
              <a href="#" className="hover:text-black transition-colors">Categories</a>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <button className="flex items-center gap-2 text-black/60 hover:text-black transition-colors">
              <Search size={18} strokeWidth={1.5} />
            </button>
            <button className="flex items-center gap-2 text-black/60 hover:text-black transition-colors relative">
              <ShoppingBag size={18} strokeWidth={1.5} />
              <span className="absolute -top-1 -right-1.5 w-3.5 h-3.5 bg-black text-white text-[8px] flex items-center justify-center rounded-full">0</span>
            </button>
            <button 
              onClick={() => navigate("/login")}
              className="flex items-center gap-2 text-black/60 hover:text-black transition-colors"
            >
              <User size={18} strokeWidth={1.5} />
            </button>
          </div>
        </Container>
      </nav>
  )
}

export default NavBar