import { motion } from "framer-motion";

/**
 * Toggle — pill switch with gold active state.
 * Knob uses spring physics for a premium feel.
 */
export default function Toggle({ id, label, checked, onChange, className = "" }) {
  return (
    <div className={`flex items-center justify-between gap-4 ${className}`}>
      <label
        htmlFor={id}
        className="text-[13px] text-[#3d3830] font-light tracking-wide cursor-pointer select-none"
      >
        {label}
      </label>

      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={`
          relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer items-center
          rounded-full transition-colors duration-300 ease-in-out
          focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c] focus-visible:ring-offset-2
          ${checked ? "bg-[#c9a84c]" : "bg-[#ddd9d3]"}
        `}
      >
        <motion.span
          layout
          transition={{ type: "spring", stiffness: 600, damping: 38 }}
          className={`
            h-[18px] w-[18px] rounded-full shadow
            ${checked ? "bg-white" : "bg-[#f5f0e8]"}
          `}
          style={{
            translateX: checked ? "calc(44px - 18px - 3px)" : "3px",
          }}
        />
      </button>
    </div>
  );
}
