import { motion, AnimatePresence } from "framer-motion";

/**
 * AuthLayout — Split screen: left fashion image, right form panel.
 * On mobile, image is hidden and form takes full screen.
 */
export default function AuthLayout({ children, imageCaption = "The New Collection" }) {
  return (
    <div className="flex min-h-screen bg-[#f5f0e8]">

      {/* ── LEFT: Fashion image panel ── */}
      <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden bg-[#1a1a1a]">
        <img
          src="/luxury-fashion.jpg"
          alt="Snitch luxury fashion"
          className="w-full h-full object-cover object-center opacity-90"
          onError={(e) => {
            /* Fallback gradient if image not found */
            e.target.style.display = "none";
          }}
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]/80 via-transparent to-[#1a1a1a]/20" />

        {/* Brand wordmark */}
        <div className="absolute top-10 left-10">
          <span className="text-[#f5f0e8] text-2xl font-semibold tracking-[0.3em] uppercase">
            FitFusion
          </span>
        </div>

        {/* Bottom caption */}
        <div className="absolute bottom-12 left-10 right-10">
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#c9a84c] mb-2">
            Luxury. Redefined.
          </p>
          <h2 className="text-[#f5f0e8] text-3xl font-light leading-snug">
            {imageCaption}
          </h2>
          <div className="mt-4 w-10 h-px bg-[#c9a84c]" />
        </div>
      </div>

      {/* ── RIGHT: Form panel ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-14 lg:py-10 bg-[#faf8f4]">

        {/* Mobile logo */}
        <div className="lg:hidden mb-10 text-center">
          <span className="text-[#1a1a1a] text-2xl font-semibold tracking-[0.3em] uppercase">
            Snitch
          </span>
        </div>

        {/* Form card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={children?.type?.name ?? "form"}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="w-full max-w-[400px]"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
