import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "framer-motion";
import Input from "../../ui/Input.jsx";
import Button from "../../ui/Button.jsx";
import Toggle from "../../ui/Toggle.jsx";
import Divider from "../../ui/Divider.jsx";
import {useAuth} from "../hook/useAuth.js"

// ── Validation helpers ────────────────────────────────────────────────────────
const validateEmail = (v) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "" : "Please enter a valid email address.";
const validateName = (v) =>
  v.trim().length >= 2 ? "" : "Full name must be at least 2 characters.";
const validatePhone = (v) =>
  /^\+?[0-9]{7,15}$/.test(v.replace(/\s/g, "")) ? "" : "Enter a valid contact number.";
const validatePassword = (v) =>
  v.length >= 8 ? "" : "Password must be at least 8 characters.";

// ── Stagger config ────────────────────────────────────────────────────────────
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

// ── Google icon ───────────────────────────────────────────────────────────────
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

export default function RegisterForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullname: "",
    email: "",
    contact: "",
    password: "",
    isSeller: false,
  });
  const {registerUser} = useAuth();
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setForm((f) => ({ ...f, [field]: value }));

    // Live validation after first submit attempt
    if (submitted) validate(field, value);
  };

  const validate = (field, value) => {
    const validators = {
      fullname: validateName,
      email: validateEmail,
      contact: validatePhone,
      password: validatePassword,
    };
    const err = validators[field]?.(value) ?? "";
    setErrors((e) => ({ ...e, [field]: err }));
    setSuccess((s) => ({ ...s, [field]: !err && value.length > 0 }));
    return err;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    const fields = ["fullname", "email", "contact", "password"];
    const newErrors = {};
    fields.forEach((f) => (newErrors[f] = validate(f, form[f])));
    if (Object.values(newErrors).some(Boolean)) return;

    setLoading(true);
    // Simulate API call
    const user=await registerUser(form);
    console.log(user);
    setLoading(false);
    if(user.role=="seller"){
        navigate("/dashboard");
    }else if(user.role=="buyer"){
        navigate("/");
    }else{
        navigate("/login");
    }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show">
      {/* Header */}
      <motion.div variants={item} className="mb-10">
        <p className="text-[10px] tracking-[0.2em] uppercase text-[#c9a84c] mb-2">
          Welcome
        </p>
        <h1 className="text-[#1a1a1a] text-3xl font-light tracking-tight">
          Create Account
        </h1>
        <p className="mt-2 text-sm text-[#9e9890] font-light">
          Join the Snitch community of tastemakers.
        </p>
      </motion.div>

      {/* Google sign-up */}
      <motion.div variants={item} className="flex gap-3 mb-7">
        <button
          type="button"
          onClick={() => window.location.href = "/api/auth/google"}
          className="flex-1 flex items-center justify-center gap-2.5 px-4 py-3 border border-[#e2ddd5] bg-white
                     text-xs tracking-wide text-[#3d3830] hover:border-[#c9a84c] hover:shadow-sm
                     transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c]"
        >
          <GoogleIcon />
          Sign up with Google
        </button>
      </motion.div>

      <motion.div variants={item}>
        <Divider className="mb-7" />
      </motion.div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="flex flex-col gap-7">
          <motion.div variants={item}>
            <Input
              id="register-fullname"
              label="Full Name"
              type="text"
              value={form.fullname}
              onChange={handleChange("fullname")}
              error={errors.fullname}
              success={success.fullname}
            />
          </motion.div>

          <motion.div variants={item}>
            <Input
              id="register-email"
              label="Email Address"
              type="email"
              value={form.email}
              onChange={handleChange("email")}
              error={errors.email}
              success={success.email}
            />
          </motion.div>

          <motion.div variants={item}>
            <Input
              id="register-contact"
              label="Contact Number"
              type="tel"
              value={form.contact}
              onChange={handleChange("contact")}
              error={errors.contact}
              success={success.contact}
            />
          </motion.div>

          <motion.div variants={item}>
            <Input
              id="register-password"
              label="Password"
              type="password"
              value={form.password}
              onChange={handleChange("password")}
              error={errors.password}
              success={success.password}
            />
          </motion.div>

          {/* Seller toggle */}
          <motion.div
            variants={item}
            className="py-4 px-5 border border-[#e2ddd5] bg-white"
          >
            <Toggle
              id="register-seller"
              label="Are you a seller?"
              checked={form.isSeller}
              onChange={() =>
                setForm((f) => ({ ...f, isSeller: !f.isSeller }))
              }
            />
            {form.isSeller && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 text-xs text-[#9e9890] leading-relaxed"
              >
                You'll be able to list and sell items on Snitch after verification.
              </motion.p>
            )}
          </motion.div>

          {/* Submit */}
          <motion.div variants={item}>
            <Button type="submit" variant="primary" loading={loading}>
              {loading ? "Creating Account…" : "Create Account"}
            </Button>
          </motion.div>

          {/* Login link */}
          <motion.p
            variants={item}
            className="text-center text-xs text-[#9e9890] tracking-wide"
          >
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#1a1a1a] font-medium hover:text-[#c9a84c] transition-colors underline underline-offset-4"
            >
              Sign In
            </Link>
          </motion.p>
        </div>
      </form>
    </motion.div>
  );
}
