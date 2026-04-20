/**
 * Divider — editorial luxury separator.
 * A diamond accent flanked by hairlines, with spaced uppercase text.
 */
export default function Divider({ text = "or continue with", className = "" }) {
  return (
    <div className={`flex items-center gap-3 ${className}`} role="separator" aria-label={text}>
      {/* Left line */}
      <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#ddd9d3]" />

      {/* Diamond + text */}
      <div className="flex items-center gap-2">
        {/* Left diamond */}
        <span
          aria-hidden
          className="block w-[5px] h-[5px] rotate-45 bg-[#c9a84c]/50 flex-shrink-0"
        />
        <span className="text-[9.5px] tracking-[0.18em] uppercase font-medium text-[#a09890] whitespace-nowrap">
          {text}
        </span>
        {/* Right diamond */}
        <span
          aria-hidden
          className="block w-[5px] h-[5px] rotate-45 bg-[#c9a84c]/50 flex-shrink-0"
        />
      </div>

      {/* Right line */}
      <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#ddd9d3]" />
    </div>
  );
}
