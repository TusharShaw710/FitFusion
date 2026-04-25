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
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../cart/hook/useCart';

const Container = ({ children, className = "" }) => (
  <div className={`max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 ${className}`}>
    {children}
  </div>
);

const NavBar = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const { cartItems, fetchCart } = useCart();

  useEffect(() => {
    fetchCart().catch(console.error);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cartCount = Array.isArray(cartItems)
    ? cartItems.reduce((acc, item) => acc + item.quantity, 0)
    : 0;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${isScrolled ? 'bg-white/80 backdrop-blur-xl border-b border-black/5 py-4' : 'bg-transparent py-8'}`}>
      <Container className="flex items-center justify-between">
        <div className="flex items-center gap-12">
          <span
            className="text-2xl font-serif tracking-tighter cursor-pointer"
            onClick={() => navigate("/")}
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
          <motion.button
            onClick={() => navigate("/cart")}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 text-black/60 hover:text-black transition-colors relative"
          >
            <ShoppingBag size={18} strokeWidth={1.5} />
            <AnimatePresence>
              {cartCount > 0 && (
                <motion.span
                  key={cartCount}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className="absolute -top-1.5 -right-2 w-4 h-4 bg-red-600 text-white text-[9px] font-bold flex items-center justify-center rounded-full shadow-sm"
                >
                  {cartCount}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
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