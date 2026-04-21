import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";
import { 
  Plus, 
  Search, 
  Filter, 
  Trash2, 
  Edit3, 
  Eye, 
  Package, 
  ArrowRight,
  TrendingUp,
  AlertCircle
} from "lucide-react";

// Hooks & UI
import { useProduct } from "../hooks/useProduct";
import Button from "../../ui/Button.jsx";
import Divider from "../../ui/Divider.jsx";

/**
 * STITCH PRIMITIVES
 * These internal components follow the Stitch design system for consistency.
 */

const Container = ({ children, className = "" }) => (
  <div className={`max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16 ${className}`}>
    {children}
  </div>
);

const Grid = ({ children, className = "" }) => (
  <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 ${className}`}>
    {children}
  </div>
);

const SectionHeader = ({ title, subtitle, actions }) => (
  <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
    <div>
      <motion.p 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-[10px] tracking-[0.3em] uppercase text-[#c9a84c] font-bold mb-3"
      >
        Seller Portal
      </motion.p>
      <motion.h1 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl md:text-5xl font-light tracking-tight text-[#1a1a1a]"
      >
        {title}
      </motion.h1>
      {subtitle && <p className="mt-4 text-[#9e9890] font-light max-w-md">{subtitle}</p>}
    </div>
    <div className="flex items-center gap-4">
      {actions}
    </div>
  </div>
);

/**
 * PRODUCT CARD COMPONENT
 */
const ProductCard = ({ product, onEdit, onDelete, onView }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      layout
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-white rounded-2xl overflow-hidden border border-[#e2ddd5]/40 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:-translate-y-2"
    >
      {/* Image Section */}
      <div className="aspect-[4/5] overflow-hidden relative bg-[#f5f0e8]">
        <img
          src={product.images?.[0]?.url || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop"}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Quick Action Overlay */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/10 backdrop-blur-[2px] flex items-center justify-center gap-3 z-10"
            >
              <button 
                type="button"
                onClick={() => onView?.(product)}
                className="p-3 bg-white text-black rounded-full shadow-xl hover:bg-black hover:text-white transition-colors cursor-pointer"
                title="Quick View"
              >
                <Eye size={18} />
              </button>
              <button 
                type="button"
                onClick={() => onEdit?.(product)}
                className="p-3 bg-white text-black rounded-full shadow-xl hover:bg-black hover:text-white transition-colors cursor-pointer"
                title="Edit Product"
              >
                <Edit3 size={18} />
              </button>
              <button 
                type="button"
                onClick={() => onDelete?.(product)}
                className="p-3 bg-white text-red-500 rounded-full shadow-xl hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
                title="Delete Product"
              >
                <Trash2 size={18} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Status Badge */}
        <div className="absolute top-4 left-4 pt-0.5">
           <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-[9px] font-bold uppercase tracking-widest text-black rounded-full shadow-sm">
             Active
           </span>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-6">
        <div className="flex items-start justify-between gap-4 mb-2">
          <h3 className="text-lg font-light tracking-tight text-[#1a1a1a] truncate flex-1">
            {product.name}
          </h3>
          <span className="text-sm font-semibold text-[#1a1a1a]">
            {product.price.currency} {product.price.amount}
          </span>
        </div>
        <p className="text-xs text-[#9e9890] font-light line-clamp-2 leading-relaxed mb-4">
          {product.description}
        </p>
        
        <Divider className="opacity-40" />
        
        <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[10px] text-[#c9a84c] font-bold uppercase tracking-widest">
                <TrendingUp size={12} />
                High Demand
            </div>
            <div className="text-[10px] text-[#9e9890] uppercase tracking-widest truncate max-w-[80px]">
                SKU: FF-{product._id?.slice(-4).toUpperCase()}
            </div>
        </div>
      </div>
    </motion.div>
  );
};

/**
 * LOADING SKELETON
 */
const SkeletonCard = () => (
  <div className="bg-white rounded-2xl overflow-hidden border border-[#e2ddd5]/40 animate-pulse">
    <div className="aspect-[4/5] bg-[#f5f0e8]" />
    <div className="p-6 space-y-4">
      <div className="flex justify-between">
        <div className="h-5 w-2/3 bg-[#f5f0e8] rounded" />
        <div className="h-5 w-1/4 bg-[#f5f0e8] rounded" />
      </div>
      <div className="space-y-2">
        <div className="h-3 w-full bg-[#f5f0e8] rounded" />
        <div className="h-3 w-4/5 bg-[#f5f0e8] rounded" />
      </div>
      <div className="h-px w-full bg-[#f5f0e8]" />
      <div className="h-3 w-1/2 bg-[#f5f0e8] rounded" />
    </div>
  </div>
);

/**
 * DELETE MODAL
 */
const DeleteModal = ({ isOpen, onClose, onConfirm, productName }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6">
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           exit={{ opacity: 0 }}
           onClick={onClose}
           className="absolute inset-0 bg-[#1a1a1a]/40 backdrop-blur-md"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-light text-[#1a1a1a] mb-3">Delete Product?</h2>
            <p className="text-[#9e9890] font-light text-sm mb-8">
              Are you sure you want to remove <span className="font-semibold text-[#1a1a1a]">"{productName}"</span>? This action cannot be undone and will remove all associated assets.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                variant="outline" 
                className="flex-1 py-4 border-[#e2ddd5]" 
                onClick={onClose}
              >
                Keep Product
              </Button>
              <Button 
                className="flex-1 py-4 bg-red-600 hover:bg-red-700 text-white" 
                onClick={onConfirm}
              >
                Delete Forever
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

/**
 * MAIN DASHBOARD COMPONENT
 */
export default function SellerDashboard() {
  const navigate = useNavigate();
  const { products, loading, handleFetchSellerProducts, handleDeleteProduct } = useProduct();
  
  const [search, setSearch] = useState("");
  const [currencyFilter, setCurrencyFilter] = useState("ALL");
  const [productToDelete, setProductToDelete] = useState(null);

  useEffect(() => {
    handleFetchSellerProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchesCurrency = currencyFilter === "ALL" || p.price.currency === currencyFilter;
      return matchesSearch && matchesCurrency;
    });
  }, [products, search, currencyFilter]);

  const confirmDelete = async () => {
    if (productToDelete) {
      await handleDeleteProduct(productToDelete._id);
      setProductToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f6f2] pt-12 pb-24">
      <DeleteModal 
        isOpen={!!productToDelete} 
        onClose={() => setProductToDelete(null)}
        onConfirm={confirmDelete}
        productName={productToDelete?.name}
      />

      <Container>
        {/* Header Section */}
        <SectionHeader 
          title="My Inventory"
          subtitle="Manage your luxury product listings and monitor performance metrics."
          actions={
            <Button 
              className="px-8 py-6 group bg-black hover:bg-black/90 text-white rounded-full transition-all shadow-xl hover:shadow-2xl"
              onClick={() => navigate("/create-product")}
            >
              <span className="flex items-center gap-2 tracking-widest uppercase text-[10px] font-bold">
                <Plus size={16} strokeWidth={3} />
                Create New Piece
              </span>
            </Button>
          }
        />

        {/* Search & Filter Bar */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-12 bg-white/50 backdrop-blur-sm p-6 rounded-3xl border border-white scroll-mt-24">
          <div className="relative w-full lg:max-w-md">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a09890]">
              <Search size={18} />
            </div>
            <input 
              type="text"
              placeholder="Search by product name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-white rounded-2xl border border-[#e2ddd5]/60 focus:outline-none focus:border-[#c9a84c] transition-colors text-sm font-light text-[#1a1a1a]"
            />
          </div>

          <div className="flex items-center gap-4 w-full lg:w-auto">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/80 rounded-xl border border-[#e2ddd5]/40">
              <Filter size={14} className="text-[#c9a84c]" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#a09890]">Filter by Rates</span>
            </div>
            <select 
              value={currencyFilter}
              onChange={(e) => setCurrencyFilter(e.target.value)}
              className="px-6 py-4 bg-white rounded-2xl border border-[#e2ddd5]/60 focus:outline-none focus:border-[#c9a84c] transition-colors text-sm font-light text-[#1a1a1a] min-w-[140px] appearance-none cursor-pointer"
            >
              <option value="ALL">All Currencies</option>
              <option value="INR">INR</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBR">GBP</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        <AnimatePresence mode="popLayout">
          {loading ? (
            <Grid key="loading">
              {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
            </Grid>
          ) : filteredProducts.length > 0 ? (
            <Grid key="products">
              {filteredProducts.map((product) => (
                <ProductCard 
                  key={product._id} 
                  product={product} 
                  onDelete={(p) => setProductToDelete(p)}
                  onEdit={(p) => navigate(`/products/edit/${p._id}`)}
                />
              ))}
            </Grid>
          ) : (
            <motion.div 
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-32 text-center"
            >
              <div className="w-24 h-24 bg-[#f5f0e8] rounded-full flex items-center justify-center mb-8">
                <Package className="w-10 h-10 text-[#c9a84c] opacity-40" />
              </div>
              <h2 className="text-3xl font-light text-[#1a1a1a] mb-4">No products found</h2>
              <p className="text-[#9e9890] font-light max-w-sm mx-auto mb-10 leading-relaxed">
                {search || currencyFilter !== "ALL" 
                  ? "We couldn't find any products matching your current filters. Try resetting them."
                  : "Every legacy starts somewhere. Add your first piece to begin your collection."
                }
              </p>
              
              <Button 
                onClick={() => navigate("/products/create")}
                className="group px-10 py-6 bg-[#1a1a1a] hover:bg-black text-white rounded-full transition-all"
              >
                <span className="flex items-center gap-3 tracking-[0.2em] font-bold uppercase text-[10px]">
                  Add Product <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Footer */}
        {!loading && products?.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-24 p-10 bg-white rounded-[40px] border border-[#e2ddd5]/40 flex flex-col md:flex-row items-center justify-between gap-10"
          >
            <div className="flex items-center gap-10">
              <div className="text-center md:text-left">
                <p className="text-[10px] tracking-[0.2em] uppercase text-[#9e9890] font-bold mb-1">Active Items</p>
                <p className="text-3xl font-light text-[#1a1a1a]">{products?.length || 0}</p>
              </div>
              <div className="h-10 w-px bg-[#e2ddd5]/60 hidden md:block" />
              <div className="text-center md:text-left">
                <p className="text-[10px] tracking-[0.2em] uppercase text-[#9e9890] font-bold mb-1">Portfolio Value</p>
                <p className="text-3xl font-light text-[#1a1a1a]">
                  {products?.[0]?.price.currency || "USD"} {products?.reduce((acc, curr) => acc + Number(curr.price.amount || 0), 0).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-light text-[#9e9890] tracking-wider italic">
              Built with FitFusion Stitch System
            </div>
          </motion.div>
        )}
      </Container>
    </div>
  );
}