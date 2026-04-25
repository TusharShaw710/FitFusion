import React from 'react';

/**
 * Base Skeleton component with shimmer effect.
 */
export const Skeleton = ({ className = '', ...props }) => {
  return (
    <div
      className={`relative overflow-hidden bg-neutral-200 rounded-md ${className}`}
      {...props}
    >
      {/* Shimmer Effect */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      
      {/* Inline style for the custom animation if not defined in global CSS */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}} />
    </div>
  );
};

/**
 * 1. CartItemSkeleton: Matches the layout of a cart item card.
 */
export const CartItemSkeleton = () => (
  <div className="bg-white p-4 sm:p-6 rounded-2xl flex flex-col sm:flex-row gap-6 sm:gap-8 items-start sm:items-center border border-neutral-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
    {/* Image Placeholder */}
    <Skeleton className="w-full sm:w-40 h-72 sm:h-52 rounded-xl flex-shrink-0" />
    
    {/* Content Placeholder */}
    <div className="flex-grow w-full space-y-6">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <Skeleton className="h-3 w-16" /> {/* Category */}
          <Skeleton className="h-7 w-48" /> {/* Product Name */}
        </div>
        <Skeleton className="w-10 h-10 rounded-full" /> {/* Remove Button */}
      </div>

      <div className="flex gap-2">
        <Skeleton className="h-6 w-20 rounded-full" /> {/* Attribute 1 */}
        <Skeleton className="h-6 w-20 rounded-full" /> {/* Attribute 2 */}
      </div>

      <div className="flex justify-between items-center pt-4">
        <Skeleton className="h-8 w-24" /> {/* Price */}
        <Skeleton className="h-10 w-28 rounded-full" /> {/* Quantity Control */}
      </div>
    </div>
  </div>
);

/**
 * 2. CartSummarySkeleton: Matches the order summary panel.
 */
export const CartSummarySkeleton = () => (
  <div className="bg-white p-8 rounded-2xl border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
    <Skeleton className="h-7 w-32 mb-8" /> {/* Title */}
    
    <div className="space-y-6 mb-10">
      <div className="flex justify-between">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-16" />
      </div>
      <div className="flex justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-12" />
      </div>
      <div className="flex justify-between">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="pt-6 border-t border-neutral-100 flex justify-between items-center">
        <Skeleton className="h-6 w-28" />
        <Skeleton className="h-9 w-24" />
      </div>
    </div>

    <Skeleton className="w-full h-14 rounded-full" /> {/* Checkout Button */}
    <Skeleton className="h-3 w-48 mx-auto mt-6" /> {/* Badge/Text */}
  </div>
);

/**
 * 3. ProductCardSkeleton: Matches product grid item.
 */
export const ProductCardSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="aspect-[3/4] w-full rounded-2xl" />
    <div className="space-y-2">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-1/4" />
    </div>
  </div>
);

/**
 * 4. ProductDetailsSkeleton: Matches full product page.
 */
export const ProductDetailsSkeleton = () => (
  <div className="flex flex-col lg:flex-row gap-16">
    <Skeleton className="lg:w-1/2 aspect-[4/5] rounded-3xl" />
    <div className="lg:w-1/2 space-y-8 py-4">
      <div className="space-y-4">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-8 w-32" />
      </div>
      <div className="space-y-4 pt-8">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <div className="pt-8 space-y-4">
        <Skeleton className="h-6 w-24" />
        <div className="flex gap-3">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-12 w-12 rounded-full" />)}
        </div>
      </div>
      <div className="pt-12">
        <Skeleton className="w-full h-16 rounded-full" />
      </div>
    </div>
  </div>
);

/**
 * 5. ListSkeleton: Wrapper to render multiple items.
 */
export const ListSkeleton = ({ count = 3, component: Component, className = "space-y-8" }) => {
  return (
    <div className={className}>
      {Array.from({ length: count }).map((_, i) => (
        <Component key={i} />
      ))}
    </div>
  );
};

export default Skeleton;
