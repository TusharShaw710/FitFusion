import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ChevronLeft } from 'lucide-react';
import { useCart } from '../hook/useCart';
import { useNavigate } from 'react-router';
import Button from '../../ui/Button';
import { CartItemSkeleton, CartSummarySkeleton, ListSkeleton } from '../../ui/Skeleton';

const CartItems = () => {
  const { 
    cartItems, 
    fetchCart, 
    incrementCartItemQuantity, 
    decrementCartItemQuantity, 
    removeFromCart 
  } = useCart();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCart = async () => {
      try {
        await fetchCart();
      } catch (error) {
        console.error("Failed to fetch cart:", error);
      } finally {
        setLoading(false);
      }
    };
    loadCart();
  }, []);

  const subtotal = Array.isArray(cartItems) ? cartItems.reduce((acc, item) => acc + (item.price.amount * item.quantity), 0) : 0;
  const totalItems = Array.isArray(cartItems) ? cartItems.reduce((acc, item) => acc + item.quantity, 0) : 0;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12">
        <div className="h-6 w-32 bg-neutral-100 rounded mb-8 animate-pulse" />
        <div className="h-12 w-64 bg-neutral-100 rounded mb-12 animate-pulse" />
        <div className="flex flex-col lg:flex-row gap-16">
          <div className="lg:w-[70%]">
            <ListSkeleton count={3} component={CartItemSkeleton} />
          </div>
          <div className="lg:w-[30%]">
            <CartSummarySkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12 bg-[#fafafa] min-h-screen">
      <div className="flex items-center gap-2 mb-8 group cursor-pointer w-fit" onClick={() => navigate('/products')}>
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium uppercase tracking-wider">Continue Shopping</span>
      </div>

      <h1 className="text-4xl font-light mb-12 tracking-tight text-neutral-900">Your Shopping Bag</h1>

      <div className="flex flex-col lg:flex-row gap-16">
        {/* Left: Cart Items List */}
        <div className="lg:w-[70%] space-y-8">
          <AnimatePresence mode='popLayout'>
            {cartItems.map((item) => (
              <CartItemCard 
                key={`${item.product._id}-${item.variant}`}
                onClick={()=>navigate(`/product/${item.product._id}`)}
                item={item} 
                onIncrement={() => incrementCartItemQuantity(item.product._id, item.variant)}
                onDecrement={() => decrementCartItemQuantity(item.product._id, item.variant)}
                onRemove={() => removeFromCart(item.variant)}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:w-[30%]">
          <div className="sticky top-24 bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-neutral-100">
            <h2 className="text-xl font-medium mb-6 text-neutral-900">Order Summary</h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-neutral-500 font-light">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-neutral-500 font-light">
                <span>Total Items</span>
                <span>{totalItems}</span>
              </div>
              <div className="flex justify-between text-neutral-500 font-light">
                <span>Shipping</span>
                <span className="text-emerald-600 font-medium italic">Calculated at checkout</span>
              </div>
              <div className="pt-4 border-t border-neutral-100">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium text-neutral-900">Estimated Total</span>
                  <span className="text-2xl font-semibold text-neutral-900 font-serif">₹{subtotal.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <Button 
              className="w-full py-4 bg-black text-white rounded-full hover:bg-neutral-800 transition-all duration-300 flex items-center justify-center gap-2 group relative overflow-hidden"
              onClick={() => navigate('/checkout')}
            >
              <span className="relative z-10 font-medium">Proceed to Checkout</span>
              <div className="absolute inset-0 bg-gradient-to-r from-neutral-800 to-black opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Button>

            <p className="text-xs text-center mt-6 text-neutral-400 font-light">
              Secure Checkout • 30 Day Returns • Free Shipping on Orders over ₹10,000
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const CartItemCard = ({ item, onClick , onIncrement, onDecrement, onRemove }) => {
  // Extract variant logic: match item.variant with product.variants._id
  const selectedVariant = item.product.variants.find(v => v._id === item.variant);
  const imageUrl = selectedVariant?.images?.[0]?.url || item.product.images?.[0]?.url;
  const attributes = selectedVariant?.attributes || {};

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -50 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="group bg-white p-4 sm:p-6 rounded-2xl flex flex-col sm:flex-row gap-6 sm:gap-8 items-start sm:items-center border border-neutral-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)] transition-all duration-500"
      onClick={onClick}
    >
      {/* Product Image */}
      <div className="w-full sm:w-40 h-72 sm:h-52 bg-neutral-100 rounded-xl overflow-hidden flex-shrink-0 relative cursor-pointer">
        <img 
          src={imageUrl} 
          alt={item.product.name} 
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Product Info */}
      <div className="flex-grow w-full space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-semibold mb-1 block">
              {item.product.category}
            </span>
            <h3 className="text-xl font-medium text-neutral-900 group-hover:text-black transition-colors">
              {item.product.name}
            </h3>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="p-2 text-neutral-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-300 group/remove"
          >
            <Trash2 size={20} className="group-hover/remove:scale-110 transition-transform" />
          </button>
        </div>

        {/* Attributes (Chips) */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(attributes).map(([key, value]) => (
            <div key={key} className="px-3 py-1 bg-neutral-50 border border-neutral-100 rounded-full text-[11px] font-medium text-neutral-500 uppercase tracking-tight">
              {key}: <span className="text-neutral-900">{value}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center pt-4">
          <div className="text-2xl font-semibold text-neutral-900 font-serif">
            ₹{item.price.amount.toLocaleString()}
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center bg-neutral-50 rounded-full p-1 border border-neutral-100">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onDecrement();
              }}
              disabled={item.quantity <= 1}
              className={`p-2 rounded-full transition-all ${item.quantity <= 1 ? 'text-neutral-200 cursor-not-allowed' : 'text-neutral-600 hover:bg-white hover:shadow-sm'}`}
            >
              <Minus size={16} />
            </button>
            <span className="w-10 text-center font-medium text-neutral-900 tabular-nums">
              {item.quantity}
            </span>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onIncrement();
              }}
              className="p-2 rounded-full text-neutral-600 hover:bg-white hover:shadow-sm transition-all"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const EmptyCart = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center bg-[#fafafa]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mb-8"
      >
        <ShoppingBag size={40} className="text-neutral-300" />
      </motion.div>
      <h2 className="text-3xl font-light text-neutral-900 mb-4 tracking-tight">Your cart is empty</h2>
      <p className="text-neutral-500 mb-10 max-w-xs font-light">
        Looks like you haven't added anything yet. Discover our latest arrivals and find your perfect fit.
      </p>
      <Button 
        onClick={() => navigate('/products')}
        className="px-12 py-4 bg-black text-white rounded-full hover:bg-neutral-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-medium tracking-wide uppercase text-xs w-auto"
      >
        Shop Now
      </Button>
    </div>
  );
};


export default CartItems;