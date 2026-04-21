import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";
import { ArrowLeft, Sparkles, CheckCircle2 } from "lucide-react";

// UI Components
import Input from "../../ui/Input.jsx";
import Button from "../../ui/Button.jsx";
import Select from "../../ui/Select.jsx";
import ImageUploadArea from "../components/ImageUploadArea.jsx";

// Hooks
import { useProduct } from "../hooks/useProduct";

/**
 * CreateProduct — High-end, minimal product creation dashboard.
 * Features: Multi-image drag-and-drop, character count, schema-based validation.
 */
export default function CreateProduct() {
  const navigate = useNavigate();
  const { handleCreateProduct, loading } = useProduct();

  // Form State
  const [form, setForm] = useState({
    name: "",
    description: "",
    amount: "",
    currency: "INR",
    images: [], // Array of File objects
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // ── Validation ──────────────────────────────────────────────────────────────
  const validateField = useCallback((field, value) => {
    let error = "";
    if (field === "name" && (!value || value.trim().length < 3)) {
      error = "Product name must be at least 3 characters.";
    }
    if (field === "description" && (!value || value.trim().length < 10)) {
      error = "Description must be at least 10 characters.";
    }
    if (field === "amount" && (!value || isNaN(value) || Number(value) <= 0)) {
      error = "Please enter a valid amount.";
    }
    if (field === "images" && value.length === 0) {
      error = "At least one product image is required.";
    }

    setErrors((prev) => ({ ...prev, [field]: error }));
    return error;
  }, []);

  const handleChange = (field) => (e) => {
    const value = e.target ? e.target.value : e; // Handle both event and direct value (Select)
    setForm((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) validateField(field, value);
  };

  const handleBlur = (field) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field, form[field]);
  };

  const isValid = useMemo(() => {
    return (
      form.name.trim().length >= 3 &&
      form.description.trim().length >= 10 &&
      !isNaN(form.amount) &&
      Number(form.amount) > 0 &&
      form.images.length > 0 &&
      Object.values(errors).every((err) => !err)
    );
  }, [form, errors]);

  // ── Actions ──────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Final validation check
    const e1 = validateField("name", form.name);
    const e2 = validateField("description", form.description);
    const e3 = validateField("amount", form.amount);
    const e4 = validateField("images", form.images);

    if (e1 || e2 || e3 || e4) return;

    // Prepare data for backend
    // Backend (Multer) expects multipart/form-data containing files and other fields
    const formdata=new FormData();
    formdata.append("name",form.name);
    formdata.append("description",form.description);
    formdata.append("amount",form.amount);
    formdata.append("currency",form.currency);
    form.images.forEach((img) => {
      formdata.append("images", img); 
    });

    console.log(formdata);

    try {
      await handleCreateProduct(formdata);
      navigate("/"); // Or wherever the list is
    } catch (err) {
      console.error("Failed to create product:", err);
    }
  };

  // ── Animations ──────────────────────────────────────────────────────────────
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <div className="min-h-screen bg-[#f5f0e8] py-12 px-4 md:px-8 flex items-center justify-center">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-[1200px] bg-[#faf8f4]/80 backdrop-blur-2xl rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.06)] border border-white/60 overflow-hidden"
      >
        <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row min-h-[750px] relative">
          
          {/* LEFT SIDE - Product Info */}
          <div className="flex-[1.1] p-8 md:p-14 lg:pr-16 border-b lg:border-b-0 lg:border-r border-[#e2ddd5]/60 flex flex-col transition-colors duration-700 focus-within:bg-white/40">
            {/* Header */}
            <div className="relative mb-12">
              <button 
                type="button"
                onClick={() => navigate(-1)}
                className="absolute -top-2 -left-2 md:-left-6 lg:-left-8 p-3 hover:bg-[#e2ddd5]/40 rounded-full transition-colors hidden md:block"
              >
                <ArrowLeft className="w-5 h-5 text-[#1a1a1a]" />
              </button>
              <div className="md:pl-10">
                <motion.div variants={itemVariants} className="flex items-center gap-2 mb-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#c9a84c]/10 text-[#c9a84c] text-[9px] tracking-[0.2em] font-bold uppercase rounded-full">
                    <Sparkles className="w-3 h-3" /> New Collection
                  </span>
                </motion.div>
                <motion.h1 variants={itemVariants} className="text-3xl md:text-5xl font-light tracking-tight text-[#1a1a1a]">
                  Listing Creation
                </motion.h1>
                <motion.p variants={itemVariants} className="mt-3 text-sm text-[#9e9890] font-light max-w-sm">
                  Add a new luxury piece to your inventory. 
                  Provide elegant details to captivate your audience.
                </motion.p>
              </div>
            </div>

            {/* Form Fields Space */}
            <div className="space-y-12 flex-1 flex flex-col md:pl-10">
              
              {/* Basic Details */}
              <motion.section variants={itemVariants} className="space-y-8">
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-[10px] tracking-[0.2em] uppercase text-[#c9a84c] font-bold whitespace-nowrap">Basic Details</span>
                  <div className="h-px flex-1 bg-gradient-to-r from-[#e2ddd5] to-transparent" />
                </div>

                <Input
                  label="Product Name"
                  value={form.name}
                  onChange={handleChange("name")}
                  onBlur={handleBlur("name")}
                  error={errors.name}
                  success={touched.name && !errors.name}
                />

                <div className="relative group">
                  <Input
                    label="Description"
                    value={form.description}
                    onChange={handleChange("description")}
                    onBlur={handleBlur("description")}
                    error={errors.description}
                    success={touched.description && !errors.description}
                    className="mb-1"
                  />
                  <div className="flex justify-end pr-1 pt-1">
                    <span className={`text-[10px] tracking-wider uppercase font-medium transition-colors ${form.description.length > 500 ? "text-red-400" : "text-[#a09890]"}`}>
                       {form.description.length}/500
                    </span>
                  </div>
                </div>
              </motion.section>

              {/* Pricing */}
              <motion.section variants={itemVariants} className="space-y-8">
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-[10px] tracking-[0.2em] uppercase text-[#c9a84c] font-bold whitespace-nowrap">Pricing Strategy</span>
                  <div className="h-px flex-1 bg-gradient-to-r from-[#e2ddd5] to-transparent" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Input
                    label="Amount"
                    type="text"
                    value={form.amount}
                    onChange={handleChange("amount")}
                    onBlur={handleBlur("amount")}
                    error={errors.amount}
                    success={touched.amount && !errors.amount}
                  />
                  <Select
                    label="Currency"
                    value={form.currency}
                    options={["INR", "USD", "EUR", "GBR", "JPY"]}
                    onChange={(val) => handleChange("currency")(val)}
                  />
                </div>
              </motion.section>

              {/* Submit Button */}
              <motion.div variants={itemVariants} className="pt-8 mt-auto">
                <Button 
                  type="submit" 
                  variant="primary" 
                  loading={loading}
                  disabled={!isValid}
                  className="py-5 shadow-[0_10px_30px_rgba(201,168,76,0.15)] hover:shadow-[0_15px_40px_rgba(201,168,76,0.25)] transition-all w-full"
                >
                  <div className="flex items-center gap-2 justify-center">
                    {isValid && !loading && <CheckCircle2 className="w-4 h-4" />}
                    <span className="tracking-widest uppercase text-xs font-semibold">Publish Listing</span>
                  </div>
                </Button>
                <p className="text-center text-[9px] text-[#a09890] tracking-[0.15em] uppercase mt-5">
                  All listings are subject to fitfusion quality guidelines
                </p>
              </motion.div>
            </div>
          </div>

          {/* RIGHT SIDE - Media Upload */}
          <div className="flex-1 relative bg-gradient-to-br from-white/30 to-transparent transition-colors duration-700 focus-within:bg-white/50 z-0">
            {/* Sticky Container */}
            <div className="lg:sticky top-0 p-8 md:p-14 lg:h-screen lg:max-h-[850px] flex flex-col justify-center">
              
              <motion.section variants={itemVariants} className="space-y-6 w-full relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="h-px w-10 bg-gradient-to-r from-transparent to-[#e2ddd5]" />
                  <span className="text-[10px] tracking-[0.2em] uppercase text-[#c9a84c] font-bold whitespace-nowrap">Asset Gallery</span>
                  <div className="h-px flex-1 bg-gradient-to-r from-[#e2ddd5] to-transparent" />
                </div>

                <div className="bg-white/40 p-3 rounded-2xl border border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.02)] backdrop-blur-sm">
                  <ImageUploadArea
                    images={form.images}
                    onImagesChange={(updater) => {
                      const updated = typeof updater === "function" ? updater(form.images) : updater;
                      setForm(prev => ({ ...prev, images: updated }));
                      validateField("images", updated);
                    }}
                  />
                </div>

                <AnimatePresence>
                  {errors.images && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-[11px] text-red-500 font-medium px-4 flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-3 h-3 rotate-180" /> {errors.images}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.section>
                
              {/* Visual Decorative Elements */}
              <div className="absolute top-1/4 -right-20 w-64 h-64 bg-[#c9a84c]/5 rounded-full blur-[80px] pointer-events-none z-[-1]" />
              <div className="absolute bottom-1/4 -left-20 w-64 h-64 bg-[#9e9890]/5 rounded-full blur-[80px] pointer-events-none z-[-1]" />

            </div>
          </div>

        </form>
      </motion.div>
    </div>
  );
}