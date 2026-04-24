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
import { useCart } from '../../cart/hook/useCart';
import InlineLoader from '../../ui/InlineLoader.jsx';

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
  
  // Variant State
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [errorMsg, setErrorMsg] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const { addToCart } = useCart();
  
  const normalizeKey = (key) => key.trim().charAt(0).toUpperCase() + key.trim().slice(1).toLowerCase();

  // Extract unique attributes from variants
  const availableAttributes = useMemo(() => {
    if (!selectedProduct?.variants) return {};
    const attrs = {};
    selectedProduct.variants.forEach(v => {
      Object.entries(v.attributes || {}).forEach(([key, val]) => {
        const normalizedKey = normalizeKey(key);
        if (!attrs[normalizedKey]) attrs[normalizedKey] = new Set();
        attrs[normalizedKey].add(val);
      });
    });
    return Object.fromEntries(Object.entries(attrs).map(([k, v]) => [k, Array.from(v)]));
  }, [selectedProduct]);

  // Find a representative variant based on partial or full selection
  // This is used for updating images and price as soon as a user starts selecting
  const representativeVariant = useMemo(() => {
    if (!selectedProduct?.variants || Object.keys(selectedAttributes).length === 0) return null;
    
    return selectedProduct.variants.find(v => {
      // Create a normalized map of variant attributes for comparison
      const normalizedVariantAttrs = Object.fromEntries(
        Object.entries(v.attributes || {}).map(([k, val]) => [normalizeKey(k), val])
      );
      
      return Object.entries(selectedAttributes).every(([key, val]) => 
        normalizedVariantAttrs[key] === val
      );
    });
  }, [selectedAttributes, selectedProduct]);

  // Exact match required for 'Add to Cart' and stock status
  const currentVariant = useMemo(() => {
    const requiredKeys = Object.keys(availableAttributes);
    if (requiredKeys.length === 0 || Object.keys(selectedAttributes).length < requiredKeys.length) return null;
    return representativeVariant;
  }, [selectedAttributes, availableAttributes, representativeVariant]);

  // REMOVED: Auto-select first available variant on load
  // We want to show the main product initially

  const defaultVariant = useMemo(() => {
    if (!selectedProduct?.variants) return null;
    return selectedProduct.variants.find(v => v._id === selectedProduct.defaultVariantId) || selectedProduct.variants[0];
  }, [selectedProduct]);

  // Determine active images (variant images vs base product images)
  const activeImages = useMemo(() => {
    if (representativeVariant?.images?.length > 0) return representativeVariant.images;
    if (defaultVariant?.images?.length > 0) return defaultVariant.images;
    return selectedProduct?.images || [];
  }, [representativeVariant, defaultVariant, selectedProduct]);

  // Determine active price
  const activePrice = representativeVariant?.price || defaultVariant?.price || { amount: 0, currency: "INR" };

  // Helper to find a representative image for a specific attribute value (e.g. Color)
  const getAttributeImage = (attrName, value) => {
    const variant = selectedProduct?.variants?.find(v => {
        const normalizedVariantAttrs = Object.fromEntries(
            Object.entries(v.attributes || {}).map(([k, val]) => [normalizeKey(k), val])
        );
        return normalizedVariantAttrs[attrName] === value && v.images?.[0];
    });
    return variant?.images?.[0]?.url;
  };

  // Helper to check if an option is available given current other selections
  const isOptionValid = (attrName, value) => {
    if (!selectedProduct?.variants) return false;
    
    // Create a hypothetical selection set
    const hypoSelection = { ...selectedAttributes, [attrName]: value };
    
    // Check if any variant matches this hypothetical selection
    // Note: We only check against *other* selected attributes, not the one we are testing
    return selectedProduct.variants.some(v => {
        const normalizedVariantAttrs = Object.fromEntries(
            Object.entries(v.attributes || {}).map(([k, val]) => [normalizeKey(k), val])
        );

        return Object.entries(selectedAttributes).every(([key, val]) => {
            if (key === attrName) return true; // ignore the current attribute being tested
            return normalizedVariantAttrs[key] === val;
        }) && normalizedVariantAttrs[attrName] === value;
    });
  };

  // Stock status
  const isOutOfStock = currentVariant ? currentVariant.stock === 0 : false;
  const isLowStock = currentVariant ? currentVariant.stock > 0 && currentVariant.stock < 5 : false;

  const handleAddToCart = async () => {
    // Validate all attributes selected
    const requiredKeys = Object.keys(availableAttributes);
    const selectedKeys = Object.keys(selectedAttributes);
    
    if (selectedKeys.length < requiredKeys.length) {
      setErrorMsg("Please select all options");
      return;
    }

    if (isOutOfStock) {
      setErrorMsg("This combination is currently out of stock");
      return;
    }

    setErrorMsg("");
    setIsAdding(true);
    try {
      await addToCart(selectedProduct._id, currentVariant._id, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000); // Reset after 2s
    } catch (error) {
      setErrorMsg("Failed to add to cart");
    } finally {
      setIsAdding(false);
    }
  };

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
            <ImageGallery key={currentVariant?._id || 'base'} images={activeImages} />
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
              <p className="text-sm font-light text-black/80 leading-relaxed tracking-wide">
                {selectedProduct.description}
              </p>
              <div className="flex items-center gap-4">
                <AnimatePresence mode="wait">
                  <motion.span 
                    key={activePrice.amount}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-xl font-light text-black/80"
                  >
                    {activePrice.currency} {activePrice.amount}
                  </motion.span>
                </AnimatePresence>
                
                <span className={`text-[10px] font-bold tracking-widest uppercase ${isOutOfStock ? 'text-red-500' : isLowStock ? 'text-orange-500' : 'text-green-600'}`}>
                  {isOutOfStock ? 'Out of Stock' : isLowStock ? 'Low Stock' : 'In Stock'}
                </span>
              </div>
            </div>

            {/* VARIANT SELECTORS */}
            <div className="space-y-10 py-4">
              <div className="flex items-center justify-between border-b border-black/5 pb-4">
                <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase text-black">Selection</h3>
                {Object.keys(selectedAttributes).length > 0 && (
                  <button 
                    onClick={() => setSelectedAttributes({})}
                    className="text-[9px] font-bold uppercase tracking-widest text-[#c9a84c] hover:text-black transition-colors"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {Object.entries(availableAttributes).map(([attrName, options]) => (
                <div key={attrName} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-black/40">{attrName}</span>
                    <span className="text-[10px] font-bold tracking-[0.1em] text-black uppercase">
                      {selectedAttributes[attrName] || 'Select'}
                    </span>
                  </div>

                  {attrName.toLowerCase() === 'color' ? (
                    <div className="flex flex-wrap gap-4">
                      {options
                        .filter(val => isOptionValid(attrName, val))
                        .map((val) => {
                          const variantImg = getAttributeImage(attrName, val);
                          return (
                            <button
                              key={val}
                              onClick={() => setSelectedAttributes(prev => {
                                if (prev[attrName] === val) {
                                  const next = { ...prev };
                                  delete next[attrName];
                                  return next;
                                }
                                return { ...prev, [attrName]: val };
                              })}
                              className={`relative w-12 h-12 rounded-full transition-all duration-300 p-1 border ${
                                selectedAttributes[attrName] === val ? 'border-black' : 'border-transparent hover:border-black/20'
                              }`}
                            >
                              <div className="w-full h-full rounded-full overflow-hidden shadow-inner bg-[#f7f7f7]">
                                  {variantImg ? (
                                      <img src={variantImg} alt={val} className="w-full h-full object-cover" title={val} />
                                  ) : (
                                      <div className="w-full h-full" style={{ backgroundColor: val.toLowerCase() }} title={val} />
                                  )}
                              </div>
                              {selectedAttributes[attrName] === val && (
                                <motion.div 
                                  layoutId="colorSelect"
                                  className="absolute inset-0 rounded-full border border-black -m-[2px]"
                                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                              )}
                            </button>
                          );
                        })}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-3">
                      {options
                        .filter(val => isOptionValid(attrName, val))
                        .map((val) => (
                        <button
                          key={val}
                          onClick={() => setSelectedAttributes(prev => {
                            if (prev[attrName] === val) {
                              const next = { ...prev };
                              delete next[attrName];
                              return next;
                            }
                            return { ...prev, [attrName]: val };
                          })}
                          className={`min-w-[50px] h-11 px-4 flex items-center justify-center border text-[11px] font-bold transition-all duration-300 ${
                            selectedAttributes[attrName] === val 
                              ? 'bg-black text-white border-black' 
                              : 'bg-white text-black border-black/10 hover:border-black'
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>




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

              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <Button 
                    disabled={isOutOfStock || isAdding}
                    onClick={handleAddToCart}
                    className={`flex-1 ${isOutOfStock ? 'bg-gray-200 cursor-not-allowed' : 'bg-black'} text-white py-6 rounded-none text-[10px] tracking-[0.3em] font-bold uppercase transition-all hover:bg-black/80 flex items-center justify-center gap-2`}
                  >
                    {isAdding ? <InlineLoader color="white" /> : added ? "Added" : isOutOfStock ? 'Sold Out' : 'Add to Shopping Bag'}
                  </Button>
                  <button className="p-5 border border-black/10 hover:bg-black hover:text-white transition-all duration-300">
                    <Heart size={18} strokeWidth={1.5} />
                  </button>
                </div>
                {errorMsg && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="text-[10px] font-bold uppercase tracking-widest text-red-500"
                  >
                    {errorMsg}
                  </motion.p>
                )}
              </div>
            </div>

            {/* Information Accordion */}
            <div className="pt-10 border-t border-black/5">

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
                      src={product.variants?.[0]?.images?.[0]?.url || product.images?.[0]?.url} 
                      alt={product.name}
                      className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                    />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-[11px] font-bold tracking-[0.1em] uppercase">{product.name}</h3>
                    <p className="text-[10px] text-black/60">
                      {(product.variants?.[0]?.price?.currency) || "INR"} {(product.variants?.[0]?.price?.amount) || 0}
                    </p>
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