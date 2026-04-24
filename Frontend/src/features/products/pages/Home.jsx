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
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const handleQuickAdd = async (e) => {
    e.stopPropagation();
    if (!product.variants || product.variants.length === 0) return;

    // Fallback to first variant if default is not available
    const defaultVariant = product.variants.find(v => v._id === product.defaultVariantId) || product.variants[0];

    setIsAdding(true);
    try {
      await addToCart(product._id, defaultVariant._id, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000); // Reset after 2s
    } catch (error) {
      console.error("Failed to quick add", error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group cursor-pointer"
      onClick={() => navigate(`/product/${product._id}`)}
    >
      <div className="relative aspect-[4/5] bg-[#f7f7f7] overflow-hidden mb-6">
        <motion.img
          src={product.variants?.[0]?.images?.[0]?.url || product.images?.[0]?.url || "https://images.unsplash.com/photo-1539106609512-725e3652e361?q=80&w=1000&auto=format&fit=crop"}
          alt={product.name}
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
          className="w-full h-full object-cover"
        />

        {/* Heart Icon */}
        <button className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black hover:text-white">
          <Heart size={16} />
        </button>

        {/* Quick Add Button */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 10, opacity: 0 }}
              className="absolute bottom-0 left-0 right-0 p-4"
            >
              <Button
                id="quickAddX"
                onClick={handleQuickAdd}
                disabled={isAdding}
                className="w-full bg-black text-white py-4 rounded-none text-[10px] tracking-[0.2em] font-bold uppercase transition-all hover:bg-black/90 flex items-center justify-center gap-2 disabled:bg-black/70"
              >
                {isAdding ? <InlineLoader color="white" /> : added ? "Added" : "Quick Add"}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between items-start">
          <h3 className="text-[13px] font-medium tracking-tight text-[#1a1a1a] uppercase leading-tight">
            {product.name}
          </h3>
          <span className="text-[13px] text-[#1a1a1a] font-normal">
            {(product.variants?.[0]?.price?.currency) || "INR"} {(product.variants?.[0]?.price?.amount) || 0}
          </span>
        </div>
        <p className="text-[11px] text-[#888] font-light tracking-wide uppercase">
          New Arrival
        </p>
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

  useEffect(() => {
    handleFetchAllProducts();

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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


      {/* HERO SECTION */}
      <section className="relative h-[70vh] md:h-screen w-full overflow-hidden bg-white mt-16 md:mt-0 flex items-center">
        {/* Background Image Layer */}
        <div
          className="absolute inset-0 z-0 transition-all duration-1000"
          style={{
            backgroundImage: "url('/fitfusion_hero.png')",
            backgroundPosition: "center right",
            backgroundRepeat: "no-repeat",
            backgroundSize: "contain",
          }}
        />

        {/* Responsive Overlay for Mobile (optional cover) */}
        <div className="absolute inset-0 z-0 md:hidden"
          style={{
            backgroundImage: "url('/fitfusion_hero.png')",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover", // Mobile gets cover with center positioning as per prompt requirement
            opacity: 0.15
          }}
        />

        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-white via-white/80 to-transparent md:via-white/40" />

        <Container className="relative z-20 w-full">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="max-w-xl text-center md:text-left mx-auto md:mx-0"
          >
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-black/40 mb-4 block">
              Spring / Summer 2026
            </span>
            <h1 className="text-6xl md:text-8xl font-serif leading-none tracking-tighter text-black mb-6">
              THE<br />REDESIGN.
            </h1>
            <p className="text-sm md:text-base text-black/70 font-light max-w-md mb-10 leading-relaxed tracking-wide mx-auto md:mx-0">
              Explore the intersection of pure performance and timeless aesthetic.
              Our new collection defines the modern wardrobe with uncompromised quality.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-6">
              <Button
                onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-black text-white px-12 py-5 rounded-none text-[10px] tracking-[0.2em] font-bold uppercase hover:bg-black/80 transition-all w-full sm:w-auto"
              >
                Shop Now
              </Button>
              <button className="group flex items-center gap-3 text-[10px] tracking-[0.2em] font-bold uppercase py-2">
                Lookbook <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        </Container>

        {/* Scroll Indicator (Hidden on mobile for space) */}
        <div className="absolute bottom-10 left-10 z-20 hidden md:flex flex-col items-center gap-4">
          <div className="w-px h-16 bg-black/10 relative overflow-hidden">
            <motion.div
              animate={{ y: [0, 64] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute top-0 left-0 w-full h-1/2 bg-black/40"
            />
          </div>
          <span className="text-[8px] font-bold tracking-widest uppercase vertical-text text-black/20">Scroll</span>
        </div>
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
