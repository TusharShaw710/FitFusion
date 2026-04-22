import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  Heart, 
  ChevronRight, 
  ChevronLeft,
  Plus, 
  Minus, 
  ArrowLeft,
  X,
  ShieldCheck,
  Truck,
  RotateCcw
} from 'lucide-react';
import { useProduct } from '../hooks/useProduct';
import NavBar from '../components/NavBar.jsx';

// Stitch UI Primitives
import Button from '../../ui/Button.jsx';

/**
 * STITCH PRIMITIVES
 */
const Container = ({ children, className = "" }) => (
  <div className={`max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 ${className}`}>
    {children}
  </div>
);

/**
 * REUSABLE COMPONENTS
 */
const Breadcrumbs = ({ product }) => {
  const navigate = useNavigate();
  return (
    <nav className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-black/40 mb-12">
      <button onClick={() => navigate('/')} className="hover:text-black transition-colors">Home</button>
      <ChevronRight size={10} />
      <button className="hover:text-black transition-colors">Shop</button>
      <ChevronRight size={10} />
      <span className="text-black font-bold">{product?.name}</span>
    </nav>
  );
};

const ImageGallery = ({ images }) => {
  const [activeImage, setActiveImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setMousePos({ x, y });
  };

  const nextImage = (e) => {
    e.stopPropagation();
    setActiveImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setActiveImage((prev) => (prev - 1 + images.length) % images.length);
  };

  if (!images || images.length === 0) return null;

  return (
    
    <div className="flex flex-col-reverse lg:flex-row gap-6">
      <NavBar/>
      {/* Thumbnails */}
      <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-visible no-scrollbar pb-4 lg:pb-0">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setActiveImage(idx)}
            className={`relative flex-shrink-0 w-20 h-24 bg-[#f7f7f7] overflow-hidden transition-all duration-300 border ${
              activeImage === idx ? 'border-black' : 'border-transparent'
            }`}
          >
            <img src={img.url} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all" />
          </button>
        ))}
      </div>

      {/* Main Image Container */}
      <div 
        className="relative flex-1 aspect-[4/5] bg-[#f7f7f7] overflow-hidden group cursor-crosshair"
        onMouseEnter={() => {
          setIsHovered(true);
          // Only zoom on desktop or if specifically intended, but here we can keep it
          // setIsZoomed(true); 
        }}
        onMouseLeave={() => {
          setIsHovered(false);
          setIsZoomed(false);
        }}
        onMouseMove={handleMouseMove}
        onClick={(e) => {
          handleMouseMove(e);
          setIsZoomed(!isZoomed);
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.img
            key={activeImage}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: 1,
              scale: isZoomed ? 1.8 : 1,
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              opacity: { duration: 0.4 },
              scale: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
            }}
            src={images[activeImage]?.url}
            alt="Product Main"
            className="w-full h-full object-cover"
            style={{
              transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
            }}
          />
        </AnimatePresence>

        {/* Hover Slider Controls */}
        <AnimatePresence>
          {isHovered && !isZoomed && (
            <>
              <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/80 backdrop-blur-sm rounded-full text-black shadow-lg hover:bg-white transition-all z-10"
              >
                <ChevronLeft size={20} strokeWidth={1.5} />
              </motion.button>
              
              <motion.button
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/80 backdrop-blur-sm rounded-full text-black shadow-lg hover:bg-white transition-all z-10"
              >
                <ChevronRight size={20} strokeWidth={1.5} />
              </motion.button>

              {/* Progress Indicators */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                {images.map((_, idx) => (
                  <div 
                    key={idx}
                    className={`h-0.5 transition-all duration-300 ${
                      activeImage === idx ? 'w-6 bg-black' : 'w-2 bg-black/20'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </AnimatePresence>

        {/* Zoom Hint */}
        {!isZoomed && isHovered && (
          <div className="absolute top-4 right-4 text-[8px] font-bold tracking-[0.2em] uppercase bg-black/10 backdrop-blur-md px-2 py-1 rounded">
            Click to Zoom
          </div>
        )}
      </div>
    </div>
  );
};

const AccordionItem = ({ title, content, isOpen, onClick }) => (
  <div className="border-b border-black/5">
    <button 
      onClick={onClick}
      className="flex items-center justify-between w-full py-6 text-left group"
    >
      <span className="text-[11px] font-bold tracking-[0.2em] uppercase transition-colors group-hover:text-black/60">
        {title}
      </span>
      <motion.div
        animate={{ rotate: isOpen ? 45 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <Plus size={16} strokeWidth={1.5} />
      </motion.div>
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
          className="overflow-hidden"
        >
          <div className="pb-8 text-sm text-black/60 font-light leading-relaxed tracking-wide">
            {content}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

/**
 * MAIN PRODUCT DETAILS VIEW
 */
const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedProduct, loading, handleGetProductById, allProducts, handleFetchAllProducts } = useProduct();
  
  const [quantity, setQuantity] = useState(1);
  const [openSection, setOpenSection] = useState(0); // 0 for Description

  useEffect(() => {
    handleGetProductById(id);
    if (!allProducts || allProducts.length === 0) {
      handleFetchAllProducts();
    }
    window.scrollTo(0, 0);
  }, [id]);

  const relatedProducts = useMemo(() => {
    if (!allProducts || !selectedProduct) return [];
    return allProducts
      .filter(p => p._id !== selectedProduct._id)
      .slice(0, 4);
  }, [allProducts, selectedProduct]);

  if (loading && !selectedProduct) {
    return (
      <Container className="pt-40 pb-20 text-center">
        <span className="text-[10px] font-bold tracking-[0.3em] uppercase animate-pulse">Loading Collection Item...</span>
      </Container>
    );
  }

  if (!selectedProduct) return null;

  return (
    <div className="min-h-screen bg-white">
      {/* Product Detail Layout */}
      <Container className="pt-32 pb-40">
        <Breadcrumbs product={selectedProduct} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          {/* Left: Gallery */}
          <div className="w-full">
            <ImageGallery images={selectedProduct.images} />
          </div>

          {/* Right: Info (Sticky) */}
          <div className="lg:sticky lg:top-32 space-y-10">
            <div className="space-y-4">
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-black/40">
                New Arrival 2026
              </span>
              <h1 className="text-4xl md:text-5xl font-serif tracking-tight text-black leading-tight">
                {selectedProduct.name}
              </h1>
              <div className="flex items-center gap-4">
                <span className="text-xl font-light text-black/80">
                  {selectedProduct.price.currency} {selectedProduct.price.amount}
                </span>
                
                <span className="text-[10px] font-bold text-green-600 tracking-widest uppercase">
                  In Stock
                </span>
              </div>
            </div>

            <p className="text-sm font-light text-black/60 leading-relaxed tracking-wide">
              {selectedProduct.description}
            </p>


            {/* Actions */}
            <div className="space-y-6">
              <div className="flex items-center gap-8">
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Quantity</span>
                <div className="flex items-center gap-6 border border-black/10 px-4 py-2">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="text-black/40 hover:text-black transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="text-xs font-bold w-4 text-center">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="text-black/40 hover:text-black transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Button className="flex-1 bg-black text-white py-6 rounded-none text-[10px] tracking-[0.3em] font-bold uppercase transition-all hover:bg-black/80">
                  Add to Shopping Bag
                </Button>
                <button className="p-5 border border-black/10 hover:bg-black hover:text-white transition-all duration-300">
                  <Heart size={18} strokeWidth={1.5} />
                </button>
              </div>
            </div>

            {/* Information Accordion */}
            <div className="pt-10 border-t border-black/5">
              <AccordionItem 
                title="Product Description"
                isOpen={openSection === 0}
                onClick={() => setOpenSection(openSection === 0 ? -1 : 0)}
                content={selectedProduct.description}
              />
              <AccordionItem 
                title="Materials & Care"
                isOpen={openSection === 1}
                onClick={() => setOpenSection(openSection === 1 ? -1 : 1)}
                content="Crafted from premium ethically sourced fabrics. Dry clean recommended to maintain texture and silhouette. Handle with care to preserve the high-end finish."
              />
              <AccordionItem 
                title="Shipping & Returns"
                isOpen={openSection === 2}
                onClick={() => setOpenSection(openSection === 2 ? -1 : 2)}
                content="Complimentary worldwide delivery on orders over $500. Standard returns are accepted within 14 days of delivery. All items must be in original condition with tags attached."
              />
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-10">
              <div className="flex flex-col items-center gap-3 text-center">
                <ShieldCheck size={20} strokeWidth={1} className="text-black/40" />
                <span className="text-[8px] font-bold tracking-[0.1em] uppercase text-black/60">Secure<br/>Checkout</span>
              </div>
              <div className="flex flex-col items-center gap-3 text-center">
                <Truck size={20} strokeWidth={1} className="text-black/40" />
                <span className="text-[8px] font-bold tracking-[0.1em] uppercase text-black/60">Express<br/>Shipping</span>
              </div>
              <div className="flex flex-col items-center gap-3 text-center">
                <RotateCcw size={20} strokeWidth={1} className="text-black/40" />
                <span className="text-[8px] font-bold tracking-[0.1em] uppercase text-black/60">14 Day<br/>Returns</span>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <section className="py-32 border-t border-black/5 bg-[#fafafa]">
          <Container>
            <div className="flex items-end justify-between mb-20">
              <div className="space-y-4">
                <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-black/40">Discover</span>
                <h2 className="text-4xl font-serif text-black">Others Also Viewed</h2>
              </div>
              <Button 
                onClick={() => navigate('/')}
                className="text-[10px] tracking-[0.2em] font-bold uppercase border-b border-black pb-1 px-0 bg-transparent hover:text-black/40 transition-all"
              >
                View Collection
              </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((product) => (
                <div 
                  key={product._id}
                  onClick={() => {
                    navigate(`/product/${product._id}`);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-[3/4] bg-[#f0f0f0] overflow-hidden mb-6">
                    <img 
                      src={product.images?.[0]?.url} 
                      alt={product.name}
                      className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                    />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-[11px] font-bold tracking-[0.1em] uppercase">{product.name}</h3>
                    <p className="text-[10px] text-black/60">{product.price.currency} {product.price.amount}</p>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}
    </div>
  );
};

export default ProductDetails;