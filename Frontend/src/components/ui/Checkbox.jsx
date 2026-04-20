import { motion } from "framer-motion";

/**
 * Checkbox — square luxury style.
 * Gold fill + animated hairline checkmark on check.
 */
export default function Checkbox({ id, label, checked, onChange, className = "" }) {
  return (
    <label
      htmlFor={id}
      className={`inline-flex items-center gap-3 cursor-pointer group select-none ${className}`}
    >
      {/* Hidden native input (accessible) */}
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />

      {/* Visual box */}
      <span
        className={`
          relative w-[15px] h-[15px] flex-shrink-0
          border transition-all duration-200 ease-out
          ${checked
            ? "bg-[#1a1a1a] border-[#1a1a1a]"
            : "bg-transparent border-[#c0bab2] group-hover:border-[#c9a84c]"
          }
        `}
      >
        {/* SVG checkmark — draws in on check */}
        <svg
          viewBox="0 0 12 10"
          fill="none"
          className="absolute inset-0 w-full h-full p-[3px]"
          aria-hidden
        >
          <motion.path
            d="M1 5 L4 8.5 L11 1"
            stroke="#f5f0e8"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={checked
              ? { pathLength: 1, opacity: 1 }
              : { pathLength: 0, opacity: 0 }
            }
            transition={{ duration: 0.22, ease: "easeOut" }}
          />
        </svg>
      </span>

      {/* Label text */}
      <span className="text-[12px] text-[#6b6560] tracking-wide font-light leading-none">
        {label}
      </span>
    </label>
  );
}
