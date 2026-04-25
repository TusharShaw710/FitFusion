import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

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

// Hooks & UI
import { useProduct } from '../hooks/useProduct';
import { useCart } from '../../cart/hook/useCart';
import Button from '../../ui/Button.jsx';
import NavBar from '../../ui/NavBar.jsx';
import InlineLoader from '../../ui/InlineLoader.jsx';

/**
 * STITCH PRIMITIVES
 */
const Container = ({ children, className = "" }) => (
  <div className={`max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 ${className}`}>
    {children}
  </div>
);

const Grid = ({ children, className = "" }) => (
  <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16 ${className}`}>
    {children}
  </div>
);

/**
 * REUSABLE PRODUCT CARD
 */
const ProductCard = ({ product }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const handleQuickAdd = async (e) => {
    e.stopPropagation();
    if (!product.variants || product.variants.length === 0) return;
    const defaultVariant = product.variants.find(v => v._id === product.defaultVariantId) || product.variants[0];

    setIsAdding(true);
    try {
      await addToCart(product._id, defaultVariant._id, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (error) {
      console.error("Failed to quick add", error);
    } finally {
      setIsAdding(false);
    }
  };

  const currency = product.variants?.[0]?.price?.currency || "INR";
  const amount = product.variants?.[0]?.price?.amount || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex flex-col w-full group cursor-pointer"
      onClick={() => navigate(`/product/${product._id}`)}
    >
      {/* 1. Image Section */}
      <div className="relative w-full h-[200px] sm:h-[280px] overflow-hidden rounded-xl bg-[#f7f7f7] mb-4">
        <motion.img
          src={product.variants?.[0]?.images?.[0]?.url || product.images?.[0]?.url || "https://images.unsplash.com/photo-1539106609512-725e3652e361?q=80&w=1000&auto=format&fit=crop"}
          alt={product.name}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
          className="w-full h-full object-cover"
        />
        
        {/* Heart Icon Overlay */}
        <button 
          onClick={(e) => { e.stopPropagation(); }} 
          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-md rounded-full text-black hover:bg-black hover:text-white transition-all shadow-sm"
        >
          <Heart size={14} />
        </button>
      </div>

      {/* 2. Content Section */}
      <div className="flex flex-col gap-1 mb-4 flex-grow">
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-[13px] font-bold tracking-tight text-[#1a1a1a] uppercase leading-snug line-clamp-2">
            {product.name}
          </h3>
        </div>
        <p className="text-[11px] text-[#888] font-light tracking-widest uppercase truncate">
          {product.category || "New Arrival"}
        </p>
      </div>

      {/* 3. Action Section (Price + Button) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2 border-t border-black/5">
        <div className="flex items-baseline gap-1">
          <span className="text-[10px] text-[#888] font-medium uppercase tracking-tighter">{currency}</span>
          <span className="text-[15px] font-bold text-black tracking-tight">{amount.toLocaleString()}</span>
        </div>
        
        <Button
          id={`quickAdd-${product._id}`}
          onClick={handleQuickAdd}
          disabled={isAdding || added}
          className={`w-full sm:w-auto px-6 py-2.5 rounded-lg text-[10px] tracking-widest font-bold uppercase transition-all flex items-center justify-center gap-2 ${
            added 
              ? "bg-green-500 text-white border-none" 
              : "bg-black text-white hover:bg-black/90"
          }`}
        >
          {isAdding ? (
            <InlineLoader color="white" />
          ) : added ? (
            "Added"
          ) : (
            <>
              <Plus size={12} strokeWidth={3} />
              Quick Add
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
};

const SkeletonCard = () => (
  <div className="animate-pulse">
    <div className="aspect-[4/5] bg-[#f0f0f0] mb-6" />
    <div className="space-y-3">
      <div className="flex justify-between">
        <div className="h-4 w-2/3 bg-[#f0f0f0]" />
        <div className="h-4 w-12 bg-[#f0f0f0]" />
      </div>
      <div className="h-3 w-1/3 bg-[#f0f0f0]" />
    </div>
  </div>
);

const HERO_SLIDES = [
  {
    image: "/fitfusion_hero.png",
    title: "THE\nREDESIGN.",
    subtitle: "Explore the intersection of pure performance and timeless aesthetic. Our new collection defines the modern wardrobe with uncompromised quality."
  },
  {
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "LUXURY\nFASHION.",
    subtitle: "Experience the pinnacle of elegance and sophistication. Our premium luxury line is designed for those who demand the best."
  },
  {
    image: "https://plus.unsplash.com/premium_photo-1661775820832-f971657b13f6?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "MODERN\nCLASSICS.",
    subtitle: "Timeless pieces reimagined for the modern era. Discover the perfect balance of tradition and innovation."
  }
];

const BENTO_CATEGORIES = [
  { name: "Jeans", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=800&auto=format&fit=crop", spanClass: "md:col-span-2 md:row-span-2" },
  { name: "Shoes", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop", spanClass: "md:col-span-2 md:row-span-1" },
  { name: "T-Shirts", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop", spanClass: "md:col-span-1 md:row-span-1" },
  { name: "Shorts", image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=800&auto=format&fit=crop", spanClass: "md:col-span-1 md:row-span-1" },
  { name: "Tracksuit", image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1200&auto=format&fit=crop", spanClass: "md:col-span-4 md:row-span-1" }
];

/**
 * HOME PAGE VIEW
 */
const Home = () => {
  const allProducts = useSelector((state) => state.product.allProducts);
  const { handleFetchAllProducts, loading } = useProduct();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [currencyFilter, setCurrencyFilter] = useState("ALL");
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    handleFetchAllProducts();

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-slide effect for Hero Carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000); // 5-second interval as requested
    return () => clearInterval(timer);
  }, []);

  const filteredProducts = useMemo(() => {
    if (!allProducts) return [];
    return allProducts.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase());

      const productPrice = p.variants?.[0]?.price;
      const matchesCurrency = currencyFilter === "ALL" || productPrice?.currency === currencyFilter;

      return matchesSearch && matchesCurrency;
    });
  }, [allProducts, search, currencyFilter]);

  return (
    <div className="min-h-screen bg-white">

      {/* PREMIUM SPLIT HERO SECTION WITH CAROUSEL */}
      <section className="relative h-[100vh] w-full bg-white flex flex-col md:flex-row mt-16 md:mt-0 overflow-hidden">
        
        <AnimatePresence mode="wait">
          {/* Left Side: Content */}
          <motion.div 
            key={`content-${currentSlide}`}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
            className="w-full md:w-1/2 h-[50vh] md:h-full flex items-center justify-center p-8 md:p-20 relative z-10 bg-white"
          >
            <div className="max-w-md w-full">
              <span className="inline-block text-[10px] font-bold tracking-[0.4em] uppercase text-black/40 mb-6">
                Spring / Summer 2026
              </span>
              <h1 className="text-6xl md:text-8xl font-serif leading-[0.9] tracking-tighter text-black mb-8 whitespace-pre-line">
                {HERO_SLIDES[currentSlide].title}
              </h1>
              <p className="text-sm md:text-base text-black/60 font-light mb-12 leading-relaxed tracking-wide">
                {HERO_SLIDES[currentSlide].subtitle}
              </p>
              <Button
                onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-black text-white px-14 py-5 rounded-none text-[10px] tracking-[0.25em] font-bold uppercase transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:bg-black/90 w-full sm:w-auto"
              >
                Shop Now
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {/* Right Side: Image */}
          <motion.div 
            key={`image-${currentSlide}`}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
            className="w-full md:w-1/2 h-[50vh] md:h-full relative overflow-hidden group"
          >
            <motion.img 
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              src={HERO_SLIDES[currentSlide].image} 
              alt="Fashion Model"
              className="w-full h-full object-cover object-center"
            />
            {/* Subtle gradient overlay (right to left fade) */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10 mix-blend-multiply pointer-events-none" />
          </motion.div>
        </AnimatePresence>

        {/* Carousel Indicators */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-3">
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-2 h-2 rounded-full transition-all duration-500 ${currentSlide === idx ? 'bg-black w-8' : 'bg-black/20 hover:bg-black/40'}`}
            />
          ))}
        </div>
      </section>

      {/* BENTO CATEGORY SECTION */}
      <section className="py-24 bg-[#fafafa]">
        <Container>
          <div className="mb-16 text-center md:text-left">
            <h2 className="text-3xl md:text-5xl font-serif text-black mb-4">The Collections</h2>
            <p className="text-xs text-[#888] font-light uppercase tracking-widest">Curated essentials for your wardrobe</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[250px] gap-4 md:gap-6">
            {BENTO_CATEGORIES.map((cat, idx) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                onClick={() => navigate(`/category/${cat.name.toLowerCase()}`)}
                className={`group relative rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500 bg-neutral-100 ${cat.spanClass}`}
              >
                <motion.img 
                  src={cat.image} 
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-1000 ease-[0.25,1,0.5,1] group-hover:scale-105"
                />
                
                {/* Subtle Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />
                
                <div className="absolute bottom-0 left-0 p-8 w-full">
                  <h3 className="text-white text-2xl font-serif tracking-wide transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 opacity-90 group-hover:opacity-100">
                    {cat.name}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* PRODUCT GRID SECTION */}
      <section id="products" className="py-32 bg-white">
        <Container>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-20">
            <div>
              <h2 className="text-4xl md:text-5xl font-serif text-black mb-4">Latest Pieces</h2>
              <p className="text-sm text-[#888] font-light uppercase tracking-widest">Selected Curations for You</p>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row items-center gap-6 w-full md:w-auto">
              <div className="relative w-full sm:w-64">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 text-[#aaa]">
                  <Search size={14} />
                </div>
                <input
                  type="text"
                  placeholder="SEARCH COLLECTION..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-6 pr-4 py-2 bg-transparent border-b border-black/10 focus:border-black/40 focus:outline-none text-[10px] tracking-widest transition-all placeholder:text-[#ccc]"
                />
              </div>
              <div className="flex items-center gap-4 bg-[#f9f9f9] px-6 py-3 rounded-full border border-black/5">
                <Filter size={12} className="text-[#888]" />
                <select
                  value={currencyFilter}
                  onChange={(e) => setCurrencyFilter(e.target.value)}
                  className="bg-transparent text-[10px] tracking-[0.15em] font-bold uppercase focus:outline-none cursor-pointer"
                >
                  <option value="ALL">All Currencies</option>
                  <option value="INR">INR</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
            </div>
          </div>

          {/* Grid Display */}
          <AnimatePresence mode="wait">
            {loading ? (
              <Grid key="loading">
                {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
              </Grid>
            ) : filteredProducts.length > 0 ? (
              <Grid key="products">
                {filteredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </Grid>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-40 text-center"
              >
                <div className="w-20 h-20 bg-[#fafafa] rounded-full flex items-center justify-center mx-auto mb-8 border border-black/5">
                  <Package className="w-8 h-8 text-black/10" />
                </div>
                <h3 className="text-xl font-serif mb-2">No items found</h3>
                <p className="text-xs text-[#aaa] uppercase tracking-widest">Try adjusting your search or filters</p>
                <button
                  onClick={() => { setSearch(""); setCurrencyFilter("ALL"); }}
                  className="mt-10 text-[10px] font-bold tracking-[0.2em] uppercase border-b border-black pb-1 hover:text-[#888] hover:border-black/20 transition-all"
                >
                  Clear all filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </Container>
      </section>

      {/* FOOTER MINI */}
      <footer className="py-20 border-t border-black/5">
        <Container className="flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="text-center md:text-left">
            <span className="text-xl font-serif tracking-tighter">FitFusion</span>
            <p className="text-[10px] text-[#aaa] tracking-widest mt-2 uppercase underline decoration-black/10">© 2026 All Rights Reserved</p>
          </div>
          <div className="flex gap-12 text-[10px] font-bold tracking-[0.2em] uppercase text-black/40">
            <a href="#" className="hover:text-black">Instagram</a>
            <a href="#" className="hover:text-black">Terms</a>
            <a href="#" className="hover:text-black">Privacy</a>
          </div>
        </Container>
      </footer>
    </div>
  );
};

export default Home;
