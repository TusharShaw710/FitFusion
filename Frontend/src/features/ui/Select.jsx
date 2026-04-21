import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, AlertCircle } from "lucide-react";

/**
 * Premium Select — Minimal, floating label, custom dropdown animation.
 */
export default function Select({
  label,
  options = [],
  value,
  onChange,
  error = "",
  id = "select",
  className = "",
  ...props
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const hasValue = value !== undefined && value !== "";
  const floated = isOpen || hasValue;

  const lineColor = error
    ? "#f87171" // red-400
    : isOpen
    ? "#c9a84c" // gold
    : "#d4cfc8"; // idle

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (val) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* Floating Label */}
      <label
        className={`
          absolute left-0 pointer-events-none select-none
          transition-all duration-300 ease-out
          ${floated
            ? "top-0 text-[10px] tracking-[0.14em] font-semibold uppercase"
            : "top-[18px] text-sm font-light text-[#a09890]"
          }
          ${error ? "text-red-400" : isOpen ? "text-[#c9a84c]" : "text-[#a09890]"}
        `}
      >
        {label}
      </label>

      {/* Select Trigger */}
      <button
        type="button"
        id={id}
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full bg-transparent pt-6 pb-2 text-left text-sm text-[#1a1a1a]
          border-b border-[#d4cfc8] outline-none flex items-center justify-between
          transition-colors duration-200
        `}
        style={{ borderBottomColor: lineColor }}
        {...props}
      >
        <span>{value || " "}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className={`w-4 h-4 ${isOpen ? "text-[#c9a84c]" : "text-[#a09890]"}`} />
        </motion.div>
      </button>

      {/* Animated underline */}
      <motion.span
        aria-hidden
        className="absolute bottom-0 left-0 h-[1.5px] bg-current pointer-events-none"
        style={{ color: lineColor }}
        animate={{ width: isOpen || error ? "100%" : "0%" }}
        initial={{ width: "0%" }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      />

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 4, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute z-50 w-full bg-white border border-[#e2ddd5] shadow-xl rounded-sm overflow-hidden py-1"
          >
            {options.map((option) => (
              <li
                key={option.value || option}
                onClick={() => handleSelect(option.value || option)}
                className={`
                  px-4 py-2.5 text-xs tracking-wide cursor-pointer
                  hover:bg-[#f5f0e8] hover:text-[#c9a84c] transition-colors
                  ${(option.value || option) === value ? "bg-[#f5f0e8] text-[#c9a84c] font-medium" : "text-[#3d3830]"}
                `}
              >
                {option.label || option}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.p
            key="err"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 6 }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-1 text-[11px] text-red-400 leading-none"
          >
            <AlertCircle className="w-3 h-3 flex-shrink-0" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
