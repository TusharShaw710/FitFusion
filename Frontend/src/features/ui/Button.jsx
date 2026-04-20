import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

/**
 * Luxury Button — three variants:
 *  primary  → solid obsidian, sweeping gold shimmer on hover
 *  ghost    → transparent with hair-line border, fills dark on hover
 *  social   → white card, subtle gold border on hover
 */

const base = `
  relative overflow-hidden
  flex items-center justify-center gap-2.5
  w-full px-6 py-[14px]
  text-[11px] font-semibold tracking-[0.14em] uppercase
  transition-colors duration-300
  focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#c9a84c]
  disabled:opacity-40 disabled:cursor-not-allowed
`;

const variants = {
  primary: {
    wrap: `${base} bg-[#111] text-[#f5f0e8] border border-[#111]`,
    shimmer: true,
    hover: {},
  },
  ghost: {
    wrap: `${base} bg-transparent text-[#111] border border-[#c0bab2] hover:bg-[#111] hover:text-[#f5f0e8] hover:border-[#111]`,
    shimmer: false,
    hover: {},
  },
  social: {
    wrap: `${base} bg-white text-[#3d3830] border border-[#e2ddd5]`,
    shimmer: false,
    hover: {},
  },
};

export default function Button({
  children,
  variant = "primary",
  loading = false,
  disabled = false,
  type = "button",
  className = "",
  onClick,
  ...props
}) {
  const cfg = variants[variant];

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
      whileTap={{ scale: loading || disabled ? 1 : 0.975 }}
      className={`${cfg.wrap} ${className}`}
      {...props}
    >
      {/* Gold shimmer sweep — primary only */}
      {cfg.shimmer && (
        <motion.span
          aria-hidden
          className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#c9a84c]/20 to-transparent"
          whileHover={{ translateX: "200%" }}
          transition={{ duration: 0.55, ease: "easeInOut" }}
        />
      )}

      {/* Social hover glow border */}
      {variant === "social" && (
        <motion.span
          aria-hidden
          className="absolute inset-0 border border-[#c9a84c]/0 transition-all duration-300"
          whileHover={{ borderColor: "rgba(201,168,76,0.6)" }}
        />
      )}

      {loading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : null}

      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}
