import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Image as ImageIcon, AlertCircle } from "lucide-react";

function ImagePreview({ file, onRemove }) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    // Cleanup generated URL to avoid memory leaks
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="relative aspect-square rounded-md overflow-hidden bg-[#f5f0e8] border border-[#e2ddd5]"
    >
      <img
        src={url}
        alt="Preview"
        className="w-full h-full object-cover"
      />
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="absolute top-1 right-1 p-1 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm transition-colors"
      >
        <X className="w-3 h-3" />
      </button>
    </motion.div>
  );
}

/**
 * ImageUploadArea — Premium drag-and-drop zone with multi-image previews.
 * Handles up to 7 images.
 */
export default function ImageUploadArea({
  images = [],
  onImagesChange,
  maxLimit = 7,
  className = ""
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");

  const handleFiles = useCallback((files) => {
    setError("");
    
    // Filter out non-images
    const validFiles = Array.from(files).filter(file => {
      if (!file.type.startsWith("image/")) {
        setError("Only image files are allowed.");
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      onImagesChange((prev) => {
        const combined = [...prev, ...validFiles];
        if (combined.length > maxLimit) {
            setError(`Maximum ${maxLimit} images allowed.`);
            return combined.slice(0, maxLimit);
        }
        return combined;
      });
    }
  }, [maxLimit, onImagesChange]);

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const removeImage = (index) => {
    onImagesChange((prev) => prev.filter((_, i) => i !== index));
    setError("");
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <label className="text-[10px] tracking-[0.14em] font-semibold uppercase text-[#a09890]">
        Product Images ({images.length}/{maxLimit})
      </label>

      {/* Drag & Drop Zone */}
      <motion.div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        animate={{
          borderColor: isDragging ? "#c9a84c" : "#e2ddd5",
          backgroundColor: isDragging ? "#faf8f4" : "transparent"
        }}
        className={`
          relative border-2 border-dashed rounded-lg p-8
          flex flex-col items-center justify-center gap-3
          transition-colors duration-300 cursor-pointer
        `}
        onClick={() => document.getElementById("image-input").click()}
      >
        <input
          id="image-input"
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        <div className="p-3 bg-[#f5f0e8] rounded-full">
          <Upload className="w-5 h-5 text-[#c9a84c]" />
        </div>
        
        <div className="text-center">
          <p className="text-sm font-medium text-[#1a1a1a]">
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-[#9e9890] mt-1 font-light">
            PNG, JPG or WebP (Max {maxLimit} images)
          </p>
        </div>
      </motion.div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 text-xs text-red-500 bg-red-50 p-3 rounded-md"
          >
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Previews Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
        <AnimatePresence>
          {images.map((file, idx) => (
            <ImagePreview 
              key={idx} 
              file={file} 
              onRemove={() => removeImage(idx)} 
            />
          ))}
          
          {/* Placeholders if empty */}
          {images.length === 0 && (
            <div className="col-span-full py-4 text-center border border-dashed border-[#e2ddd5] rounded-md bg-[#faf8f4]">
                <div className="flex flex-col items-center gap-2 text-[#a09890]">
                    <ImageIcon className="w-6 h-6 opacity-40 " />
                    <span className="text-[10px] tracking-widest uppercase">No images selected</span>
                </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
