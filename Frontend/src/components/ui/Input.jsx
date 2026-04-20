import { useState, forwardRef, useId } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react";

/**
 * Input — floating label, animated underline, validation states.
 * The underline grows from center on focus (rather than just changing color).
 */
const Input = forwardRef(function Input(
  { label, type = "text", error = "", success = false, id: propId, className = "", ...props },
  ref
) {
  const autoId = useId();
  const id = propId ?? autoId;

  const [focused, setFocused] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const isPassword = type === "password";
  const resolvedType = isPassword && showPw ? "text" : type;
  const hasValue = String(props.value ?? "").length > 0;
  const floated = focused || hasValue;

  /* border colour logic */
  const lineColor = error
    ? "#f87171"          /* red-400  */
    : success
    ? "#34d399"          /* emerald  */
    : focused
    ? "#c9a84c"          /* gold     */
    : "#d4cfc8";         /* idle     */

  return (
    <div className={`relative ${className}`}>
      {/* Invisible spacer so the floated label doesn't overlap */}
      <label
        htmlFor={id}
        className={`
          absolute left-0 pointer-events-none select-none
          transition-all duration-300 ease-out
          ${floated
            ? "top-0 text-[9.5px] tracking-[0.14em] font-semibold uppercase"
            : "top-[18px] text-sm font-light"
          }
          ${error ? "text-red-400" : success ? "text-emerald-400" : floated ? "text-[#c9a84c]" : "text-[#a09890]"}
        `}
      >
        {label}
      </label>

      <input
        ref={ref}
        id={id}
        type={resolvedType}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder=""
        className={`
          w-full bg-transparent pt-6 pb-2 text-sm text-[#1a1a1a] caret-[#c9a84c]
          border-b border-[#d4cfc8] outline-none
          transition-colors duration-200
          placeholder-transparent
          ${isPassword ? "pr-9" : success ? "pr-9" : ""}
        `}
        style={{ borderBottomColor: lineColor }}
        {...props}
      />

      {/* Animated underline that grows from center */}
      <motion.span
        aria-hidden
        className="absolute bottom-0 left-0 h-[1.5px] bg-current pointer-events-none"
        style={{ color: lineColor }}
        animate={{ width: focused || error || success ? "100%" : "0%" }}
        initial={{ width: "0%" }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      />

      {/* Password toggle */}
      {isPassword && (
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setShowPw((v) => !v)}
          className="absolute right-0 bottom-2 text-[#a09890] hover:text-[#1a1a1a] transition-colors"
          aria-label={showPw ? "Hide password" : "Show password"}
        >
          {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      )}

      {/* Status icon — success only (not password) */}
      {success && !isPassword && (
        <CheckCircle2 className="absolute right-0 bottom-2.5 w-3.5 h-3.5 text-emerald-400" />
      )}

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.p
            key="err"
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 6 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-1 text-[11px] text-red-400 leading-none"
          >
            <AlertCircle className="w-3 h-3 flex-shrink-0" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
});

export default Input;
