import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  X, 
  Trash2, 
  Edit3, 
  Package, 
  Tag, 
  Layout, 
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Image as ImageIcon,
  DollarSign
} from 'lucide-react';
import { useProduct } from '../hooks/useProduct';
import ImageUploadArea from '../components/ImageUploadArea.jsx';

// UI Components
import Button from '../../ui/Button.jsx';
import Input from '../../ui/Input.jsx';
import Divider from '../../ui/Divider.jsx';
import Select from '../../ui/Select.jsx';

/**
 * STITCH PRIMITIVES
 */
const Container = ({ children, className = "" }) => (
  <div className={`max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16 ${className}`}>
    {children}
  </div>
);

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-3xl border border-[#e2ddd5]/40 shadow-[0_10px_40px_rgba(0,0,0,0.03)] ${className}`}>
    {children}
  </div>
);

/**
 * IMAGE GALLERY COMPONENT
 */
const ImageGallery = ({ images }) => {
  const [activeImage, setActiveImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setMousePos({ x, y });
  };

  const nextImage = () => setActiveImage((prev) => (prev + 1) % images.length);
  const prevImage = () => setActiveImage((prev) => (prev - 1 + images.length) % images.length);

  if (!images || images.length === 0) return (
    <div className="aspect-[4/5] bg-[#f5f0e8] flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-[#e2ddd5]">
        <ImageIcon size={48} className="text-[#a09890] mb-4 opacity-20" />
        <p className="text-[10px] uppercase tracking-widest font-bold text-[#a09890]">No visuals available</p>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Main Image Viewport */}
      <div 
        className="relative aspect-[4/5] bg-[#f5f0e8] overflow-hidden rounded-[2.5rem] cursor-crosshair group"
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
        onClick={(e) => {
          handleMouseMove(e);
          setIsZoomed(!isZoomed);
        }}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={activeImage}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: 1,
              scale: isZoomed ? 1.8 : 1
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              opacity: { duration: 0.4 },
              scale: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
            }}
            src={images[activeImage]?.url}
            alt="Product"
            className="w-full h-full object-cover"
            style={{
              transformOrigin: `${mousePos.x}% ${mousePos.y}%`
            }}
          />
        </AnimatePresence>

        {/* Carousel Overlay Buttons */}
        {images.length > 1 && !isZoomed && (
            <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }} 
                  className="p-3 bg-white/90 backdrop-blur-md rounded-full shadow-xl hover:bg-white text-black transition-all"
                >
                    <ChevronLeft size={20} />
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }} 
                  className="p-3 bg-white/90 backdrop-blur-md rounded-full shadow-xl hover:bg-white text-black transition-all"
                >
                    <ChevronRight size={20} />
                </button>
            </div>
        )}

        {/* Floating Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full flex gap-2 border border-white/30">
            {images.map((_, idx) => (
                <div key={idx} className={`h-1.5 transition-all duration-300 rounded-full ${activeImage === idx ? 'w-6 bg-white' : 'w-1.5 bg-white/40'}`} />
            ))}
        </div>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setActiveImage(idx)}
            className={`relative flex-shrink-0 w-20 h-24 rounded-2xl overflow-hidden transition-all duration-300 border-2 ${
              activeImage === idx ? 'border-[#c9a84c] scale-110 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'
            }`}
          >
            <img src={img.url} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
};

/**
 * VARIANT ATTRIBUTE TAG
 */
const AttributeTag = ({ label, value }) => (
  <div className="flex items-center gap-2 px-3 py-1.5 bg-[#f5f0e8] rounded-full border border-[#e2ddd5]/60">
    <span className="text-[9px] font-bold uppercase tracking-widest text-[#a09890]">{label}:</span>
    <span className="text-[10px] font-bold text-black uppercase tracking-wider">{value}</span>
  </div>
);

/**
 * ADD VARIANT MODAL
 */
const AddVariantModal = ({ isOpen, onClose, onAdd, productId, currency, initialData = null }) => {
  const [formData, setFormData] = useState({
    price: { amount: "", currency: currency || "INR" },
    stock: "",
    attributes: [{ key: "", value: "" }],
    images: [] // Array of File objects
  });

  useEffect(() => {
    if (initialData) {
        // Map attribute object back to array
        const attrs = Object.entries(initialData.attributes || {}).map(([key, value]) => ({ key, value }));
        setFormData({
            price: { ...initialData.price },
            stock: initialData.stock,
            attributes: attrs.length > 0 ? attrs : [{ key: "", value: "" }],
            images: initialData._tempFiles || [] // Support previously uploaded local files if any
        });
    } else {
        setFormData({
            price: { amount: "", currency: currency || "INR" },
            stock: "",
            attributes: [{ key: "", value: "" }],
            images: []
        });
    }
  }, [initialData, isOpen]);

  const addAttribute = () => {
    setFormData(prev => ({
      ...prev,
      attributes: [...prev.attributes, { key: "", value: "" }]
    }));
  };

  const updateAttribute = (index, field, val) => {
    const updated = [...formData.attributes];
    updated[index][field] = val;
    setFormData(prev => ({ ...prev, attributes: updated }));
  };

  const removeAttribute = (index) => {
    setFormData(prev => ({
      ...prev,
      attributes: prev.attributes.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
      e.preventDefault();
      
      const attributeMap = {};
      formData.attributes.forEach(attr => {
          if (attr.key && attr.value) {
              const normalizedKey = attr.key.trim().charAt(0).toUpperCase() + attr.key.trim().slice(1).toLowerCase();
              attributeMap[normalizedKey] = attr.value;
          }
      });

      const data = new FormData();
      data.append("stock", formData.stock);
      data.append("amount", formData.price.amount);
      data.append("currency", formData.price.currency);
      data.append("attributes", JSON.stringify(attributeMap));
      
      formData.images.forEach(image => {
          data.append("images", image);
      });

      // Instead of direct API, return to parent
      // Store formData for later sync, and a preview object for UI
      onAdd({
          _formData: data,
          _tempFiles: formData.images, // store original files for re-edit
          price: { ...formData.price, amount: Number(formData.price.amount) },
          stock: Number(formData.stock),
          attributes: attributeMap,
          // For local preview
          images: formData.images.map(f => ({ url: URL.createObjectURL(f) }))
      }, initialData?._tempId);
      onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#1a1a1a]/60 backdrop-blur-xl"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
          >
            <div className="p-8 border-b border-[#f5f0e8] flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-2xl font-light tracking-tight text-black">Integrate Variant</h2>
                <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#c9a84c] mt-1">Expanding your collection</p>
              </div>
              <button onClick={onClose} className="p-3 bg-[#f5f0e8] text-black rounded-full hover:bg-black hover:text-white transition-all">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-10 overflow-y-auto custom-scrollbar">
              {/* Image Input */}
              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#a09890]">Variant Visuals</label>
                <div className="bg-[#f5f0e8]/50 p-6 rounded-3xl border border-[#e2ddd5]/40 backdrop-blur-sm">
                    <ImageUploadArea 
                        images={formData.images}
                        onImagesChange={(updater) => {
                            const updated = typeof updater === 'function' ? updater(formData.images) : updater;
                            setFormData(prev => ({ ...prev, images: updated }));
                        }}
                        maxLimit={4}
                    />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <Input 
                    label="Variant Price" 
                    type="number"
                    value={formData.price.amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: { ...prev.price, amount: e.target.value }}))}
                    required
                />
                <Input 
                    label="Stock Level" 
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                    required
                />
              </div>

              {/* Attributes Section */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#a09890]">Dynamic Attributes</label>
                    <button 
                        type="button" 
                        onClick={addAttribute}
                        className="text-[10px] font-bold uppercase tracking-widest text-[#c9a84c] flex items-center gap-1.5 hover:opacity-70"
                    >
                        <Plus size={14} /> Add Property
                    </button>
                </div>
                <div className="space-y-4">
                    {formData.attributes.map((attr, idx) => (
                        <motion.div 
                            layout
                            key={idx} 
                            initial={{ opacity: 0, x: -10 }} 
                            animate={{ opacity: 1, x: 0 }} 
                            className="flex gap-4 items-end"
                        >
                            <div className="flex-1">
                                <Input 
                                    label="Key (e.g. Size)" 
                                    value={attr.key}
                                    onChange={(e) => updateAttribute(idx, 'key', e.target.value)}
                                />
                            </div>
                            <div className="flex-1">
                                <Input 
                                    label="Value (e.g. XL)" 
                                    value={attr.value}
                                    onChange={(e) => updateAttribute(idx, 'value', e.target.value)}
                                />
                            </div>
                            <button 
                                type="button"
                                onClick={() => removeAttribute(idx)}
                                className="p-3 text-red-400 hover:bg-red-50 rounded-full transition-colors"
                            >
                                <Trash2 size={16} />
                            </button>
                        </motion.div>
                    ))}
                </div>
              </div>

              <div className="pt-6">
                <Button type="submit" className="w-full py-6 rounded-[1.5rem] bg-black text-white hover:shadow-2xl hover:scale-[1.02]">
                    Register Variant
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

/**
 * MAIN COMPONENT
 */
const SellerProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { selectedProduct, loading, error, handleGetProductById, handleAddProductVariety, handleDeleteProduct } = useProduct();
    
    // UI State
    const [isAddVariantOpen, setIsAddVariantOpen] = useState(false);
    const [editingVariant, setEditingVariant] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    
    // Sync / Draft State
    const [variantsDraft, setVariantsDraft] = useState([]);
    const [isGlobalSyncing, setIsGlobalSyncing] = useState(false);
    const [syncingIndex, setSyncingIndex] = useState(null);

    // Initialize/Sync Draft with Redux state
    useEffect(() => {
        if (id) handleGetProductById(id);
        window.scrollTo(0, 0);
    }, [id]);

    useEffect(() => {
        if (selectedProduct?.variants) {
            // Map existing variants to include a sync status
            const initialDraft = selectedProduct.variants.map(v => ({
                ...v,
                _syncStatus: 'synced',
                _tempId: v._id || Math.random().toString(36).substr(2, 9)
            }));
            setVariantsDraft(initialDraft);
        }
    }, [selectedProduct]);

    const defaultVariant = useMemo(() => {
        if (!selectedProduct?.variants) return null;
        return selectedProduct.variants.find(v => v._id === selectedProduct.defaultVariantId) || selectedProduct.variants[0];
    }, [selectedProduct]);

    // Local CRUD Operations
    const addLocalVariant = (newData, existingTempId = null) => {
        if (existingTempId) {
            // Edit mode
            setVariantsDraft(prev => prev.map(v => 
                v._tempId === existingTempId ? { ...v, ...newData, _syncStatus: v._syncStatus === 'synced' ? 'synced' : 'idle' } : v
            ));
        } else {
            // Add mode
            const newLocalVariant = {
                ...newData,
                _syncStatus: 'idle',
                _tempId: Math.random().toString(36).substr(2, 9),
                // Mock object for preview if it's FormData
                _isPreview: true 
            };
            setVariantsDraft(prev => [...prev, newLocalVariant]);
        }
    };

    const handleEditClick = (variant) => {
        setEditingVariant(variant);
        setIsAddVariantOpen(true);
    };

    const deleteLocalVariant = (tempId) => {
        setVariantsDraft(prev => prev.filter(v => v._tempId !== tempId));
    };

    const updateLocalVariantSyncStatus = (tempId, status) => {
        setVariantsDraft(prev => prev.map(v => 
            v._tempId === tempId ? { ...v, _syncStatus: status } : v
        ));
    };

    // Sequential Sync Logic
    const handleSyncVariants = async () => {
        if (isGlobalSyncing) return;
        setIsGlobalSyncing(true);

        const itemsToSync = variantsDraft.filter(v => v._syncStatus === 'idle' || v._syncStatus === 'error');
        
        for (const item of itemsToSync) {
            const index = variantsDraft.findIndex(v => v._tempId === item._tempId);
            setSyncingIndex(index);
            updateLocalVariantSyncStatus(item._tempId, 'syncing');

            try {
                // handleAddProductVariety updates Redux, which triggers our initialization useEffect
                // but we want to maintain our draft status during the loop.
                await handleAddProductVariety(id, item._formData);
                updateLocalVariantSyncStatus(item._tempId, 'synced');
            } catch (err) {
                console.error("Sync failed for variant:", item);
                updateLocalVariantSyncStatus(item._tempId, 'error');
            }
        }

        setSyncingIndex(null);
        setIsGlobalSyncing(false);
    };

    if (loading && !selectedProduct) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <motion.div 
                    animate={{ scale: [1, 1.1, 1] }} 
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="flex flex-col items-center gap-4"
                >
                    <Package size={40} className="text-[#c9a84c] opacity-40" />
                    <span className="text-[10px] font-bold tracking-[0.3em] uppercase animate-pulse">Syncing Inventory...</span>
                </motion.div>
            </div>
        );
    }

    if (!selectedProduct) return null;

    return (
        <div className="min-h-screen bg-[#faf9f6]">
            {/* Header / Breadcrumbs */}
            <header className="pt-32 pb-12 bg-white">
                <Container className="flex items-center justify-between">
                    <button 
                        onClick={() => navigate(-1)}
                        className="group flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.25em] text-[#a09890] hover:text-black transition-all"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Inventory
                    </button>
                    <div className="flex items-center gap-4">
                        <span className="px-4 py-1.5 bg-green-50 text-green-600 text-[9px] font-bold uppercase tracking-widest rounded-full border border-green-100">
                            Published & Private
                        </span>
                    </div>
                </Container>
            </header>

            <Container className="py-20 lg:py-32">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 xl:gap-32 items-start">
                    
                    {/* LEFT: VISUALS */}
                    <div className="w-full">
                        <ImageGallery images={selectedProduct.images?.length > 0 ? selectedProduct.images : (defaultVariant?.images || [])} />
                    </div>

                    {/* RIGHT: CONTENT (Sticky) */}
                    <div className="lg:sticky lg:top-32 space-y-12">
                        {/* Title Section */}
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <span className="text-[10px] font-extrabold tracking-[0.4em] uppercase text-[#c9a84c]">
                                    Fitting Fusion Premium
                                </span>
                                <h1 className="text-5xl xl:text-6xl font-light tracking-tight text-black flex items-center gap-4">
                                    {selectedProduct.name}
                                    <Edit3 size={20} className="text-[#a09890] hover:text-black cursor-pointer opacity-30 hover:opacity-100 transition-all" />
                                </h1>
                            </div>
                            <div className="flex items-center gap-8">
                                <div>
                                    <p className="text-[9px] uppercase tracking-widest font-bold text-[#a09890] mb-1">Base Price</p>
                                    <p className="text-3xl font-light">
                                        {defaultVariant?.price?.currency || "INR"} {defaultVariant?.price?.amount || 0}
                                    </p>
                                </div>
                                <div className="h-10 w-px bg-[#e2ddd5]" />
                                <div>
                                    <p className="text-[9px] uppercase tracking-widest font-bold text-[#a09890] mb-1">Stock Status</p>
                                    <p className="text-sm font-bold text-green-600 uppercase tracking-widest flex items-center gap-2">
                                        <CheckCircle2 size={14} /> Global Distribution
                                    </p>
                                </div>
                            </div>
                            <p className="text-[#7a746c] font-light leading-relaxed text-sm max-w-xl">
                                {selectedProduct.description}
                            </p>
                        </div>

                        <Divider className="opacity-40" />

                        {/* VARIANTS SECTION */}
                        <div className="space-y-8 relative">
                            {/* Sync Status Header */}
                            <AnimatePresence>
                                {variantsDraft.some(v => v._syncStatus !== 'synced') && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="sticky top-0 z-20 flex items-center justify-between p-4 bg-white/80 backdrop-blur-xl border border-[#c9a84c]/20 rounded-2xl shadow-lg"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-[#f5f0e8] rounded-lg">
                                                <Package size={16} className="text-[#c9a84c]" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-black">
                                                    {isGlobalSyncing ? `Syncing Local Drafts...` : 'Unsaved Local Drafts'}
                                                </p>
                                                <p className="text-[9px] text-[#a09890] mt-0.5 uppercase tracking-widest">
                                                    {variantsDraft.filter(v => v._syncStatus === 'idle').length} pending • 
                                                    {variantsDraft.filter(v => v._syncStatus === 'synced').length} saved
                                                </p>
                                            </div>
                                        </div>
                                        <Button 
                                            onClick={handleSyncVariants}
                                            disabled={isGlobalSyncing}
                                            className="px-6 py-2 bg-black text-white text-[9px] font-bold uppercase tracking-[0.2em] rounded-full"
                                        >
                                            {isGlobalSyncing ? (
                                                <span className="flex items-center gap-2">
                                                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}><Package size={12} /></motion.div>
                                                    Syncing...
                                                </span>
                                            ) : 'Save Variants'}
                                        </Button>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="flex items-end justify-between">
                                <div className="space-y-1">
                                    <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-black">Product Variants</h3>
                                    <p className="text-xs font-light text-[#a09890]">Configure multiple sizes, colors, or materials.</p>
                                </div>
                                <button 
                                    onClick={() => setIsAddVariantOpen(true)}
                                    className="px-6 py-3 bg-[#f5f0e8] text-black text-[9px] font-bold uppercase tracking-[0.2em] rounded-full hover:bg-black hover:text-white transition-all flex items-center gap-2"
                                >
                                    <Plus size={14} strokeWidth={3} /> Add Locally
                                </button>
                            </div>

                            <div className="space-y-6">
                                {variantsDraft && variantsDraft.length > 0 ? (
                                    <div className="grid grid-cols-1 gap-6">
                                        {variantsDraft.map((variant, idx) => (
                                            <Card 
                                                key={variant._tempId || idx} 
                                                className={`p-6 group transition-all duration-500 border-l-4 ${
                                                    variant._syncStatus === 'synced' ? 'border-l-green-500' :
                                                    variant._syncStatus === 'syncing' ? 'border-l-[#c9a84c]' :
                                                    variant._syncStatus === 'error' ? 'border-l-red-500' : 'border-l-transparent'
                                                }`}
                                            >
                                                <div className="flex items-center gap-8">
                                                    {/* Variant Image */}
                                                    <div className="relative w-20 h-24 bg-[#f5f0e8] rounded-2xl overflow-hidden shadow-sm flex-shrink-0">
                                                        <img 
                                                            src={variant.images?.[0]?.url || defaultVariant?.images?.[0]?.url || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop"} 
                                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                                                        />
                                                        {variant._syncStatus === 'syncing' && (
                                                            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                                                                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5 }}>
                                                                    <Package size={16} className="text-white" />
                                                                </motion.div>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Variant Info */}
                                                    <div className="flex-1 space-y-4">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-4">
                                                                <div className="flex flex-wrap gap-2">
                                                                    {Object.entries(variant.attributes || {}).map(([key, val]) => (
                                                                        <AttributeTag key={key} label={key} value={val} />
                                                                    ))}
                                                                </div>
                                                                {/* Status Badge */}
                                                                <div className="flex items-center gap-1.5">
                                                                    {variant._syncStatus === 'synced' && <CheckCircle2 size={12} className="text-green-500" />}
                                                                    {variant._syncStatus === 'error' && <AlertCircle size={12} className="text-red-500" />}
                                                                    <span className={`text-[8px] font-bold uppercase tracking-widest ${
                                                                        variant._syncStatus === 'synced' ? 'text-green-600' :
                                                                        variant._syncStatus === 'error' ? 'text-red-500' :
                                                                        variant._syncStatus === 'syncing' ? 'text-[#c9a84c]' : 'text-[#a09890]'
                                                                    }`}>
                                                                        {variant._syncStatus}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-4">
                                                                {variant._syncStatus === 'error' && (
                                                                     <button 
                                                                        onClick={() => updateLocalVariantSyncStatus(variant._tempId, 'idle')}
                                                                        className="text-[9px] font-bold uppercase text-[#c9a84c] hover:underline"
                                                                     >
                                                                        Retry
                                                                     </button>
                                                                )}
                                                                <button 
                                                                    onClick={() => handleEditClick(variant)}
                                                                    className="p-2 text-[#a09890] hover:text-black rounded-full hover:bg-[#f5f0e8] transition-all"
                                                                >
                                                                    <Edit3 size={14} />
                                                                </button>
                                                                <button 
                                                                    onClick={() => deleteLocalVariant(variant._tempId)}
                                                                    className="p-2 text-[#a09890] hover:text-red-500 rounded-full hover:bg-red-50 transition-all"
                                                                >
                                                                    <Trash2 size={14} />
                                                                </button>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center justify-between">
                                                            <div className="flex gap-10">
                                                                <div className="space-y-0.5">
                                                                    <p className="text-[9px] uppercase tracking-widest font-bold text-[#a09890]">Variant Price</p>
                                                                    <p className="text-sm font-semibold">{(variant.price?.currency) || "INR"} {(variant.price?.amount) || 0}</p>
                                                                </div>
                                                                <div className="space-y-0.5">
                                                                    <p className="text-[9px] uppercase tracking-widest font-bold text-[#a09890]">Stock Available</p>
                                                                    <p className="text-sm font-semibold text-[#111]">{variant.stock} Units</p>
                                                                </div>
                                                            </div>
                                                            <div className="text-[8px] font-bold uppercase tracking-widest text-[#c9a84c]">
                                                                {variant._id ? `SKU-V-${idx + 1}` : 'PROVISIONAL SKU'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-20 bg-white/40 border-2 border-dashed border-[#e2ddd5] rounded-[2.5rem] flex flex-col items-center justify-center text-center px-10">
                                        <div className="w-16 h-16 bg-[#f5f0e8] rounded-full flex items-center justify-center mb-6">
                                            <Tag size={24} className="text-[#c9a84c] opacity-30" />
                                        </div>
                                        <h4 className="text-sm font-light text-black mb-2">No variants created yet</h4>
                                        <p className="text-xs text-[#a09890] font-light max-w-xs leading-relaxed">
                                            Individualize your product by adding size, color or material variations to improve conversion.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* PRODUCT ACTIONS */}
                        <div className="pt-12 border-t border-[#f5f0e8]">
                            <button 
                                onClick={() => setIsDeleteModalOpen(true)}
                                className="w-full flex items-center justify-center gap-3 py-5 bg-red-50/30 text-red-400 border border-red-100 rounded-[1.25rem] hover:bg-red-500 hover:text-white transition-all group"
                                title="Delete Product from Inventory"
                            >
                                <Trash2 size={20} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" />
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Delete Product from Inventory</span>
                            </button>
                        </div>
                    </div>
                </div>
            </Container>

            {/* MODALS */}
            <AddVariantModal 
                isOpen={isAddVariantOpen} 
                onClose={() => {
                    setIsAddVariantOpen(false);
                    setEditingVariant(null);
                }}
                onAdd={addLocalVariant}
                productId={id}
                currency={defaultVariant?.price?.currency || "INR"}
                initialData={editingVariant}
            />

            {/* Delete Confirmation Modal Overlay */}
            <AnimatePresence>
                {isDeleteModalOpen && (
                    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-6">
                         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDeleteModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
                         <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-md bg-white p-10 rounded-[3rem] text-center shadow-2xl">
                            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-8">
                                <AlertCircle size={32} />
                            </div>
                            <h2 className="text-3xl font-light text-black mb-4">Dissolve Product?</h2>
                            <p className="text-sm text-[#a09890] font-light mb-10 leading-relaxed">
                                You are about to remove <span className="font-bold text-black">"{selectedProduct.name}"</span> and all its variations from the FitFusion database. This action is irreversible.
                            </p>
                            <div className="flex flex-col gap-3">
                                <Button 
                                    onClick={async () => {
                                        await handleDeleteProduct(id);
                                        navigate('/dashboard');
                                    }}
                                    className="bg-red-500 hover:bg-red-600 text-white rounded-2xl py-4"
                                >
                                    Confirm Dissolution
                                </Button>
                                <button onClick={() => setIsDeleteModalOpen(false)} className="py-4 text-[10px] font-bold uppercase tracking-widest text-[#a09890] hover:text-black">
                                    Cancel & Safeguard
                                </button>
                            </div>
                         </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SellerProductDetails;