import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "framer-motion";
import Input from "../../ui/Input.jsx";
import Button from "../../ui/Button.jsx";
import Divider from "../../ui/Divider.jsx";
import { useAuth } from "../hook/useAuth.js";
import { useSelector } from "react-redux";

// ── Stagger config ────────────────────────────────────────────────────────────
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

// ── SVG icons for social buttons ──────────────────────────────────────────────
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


export default function LoginForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ identifier: "", password: ""});
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState({});
  const loading=useSelector((state)=>state.auth.loading);
  const [submitted, setSubmitted] = useState(false);
  const {loginUser} = useAuth();

  const validate = (field, value) => {
    let err = "";
    if (field === "identifier" && value.trim().length < 3)
      err = "Please enter your email or username.";
    if (field === "password" && value.length < 1)
      err = "Password is required.";
    setErrors((e) => ({ ...e, [field]: err }));
    setSuccess((s) => ({ ...s, [field]: !err && value.length > 0 }));
    return err;
  };

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setForm((f) => ({ ...f, [field]: value }));
    if (submitted) validate(field, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    const e1 = validate("identifier", form.identifier);
    const e2 = validate("password", form.password);
    if (e1 || e2) return;

  
    const user=await loginUser(form);
    if(user &&user.role=="seller"){
        navigate("/dashboard");
    }else if(user && user.role=="buyer"){
        navigate("/");
    }
    setSubmitted(false);
    setForm({ identifier: "", password: ""});
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show">
      {/* Header */}
      <motion.div variants={item} className="mb-10">
        <p className="text-[10px] tracking-[0.2em] uppercase text-[#c9a84c] mb-2">
          Welcome Back
        </p>
        <h1 className="text-[#1a1a1a] text-3xl font-light tracking-tight">
          Sign In
        </h1>
        <p className="mt-2 text-sm text-[#9e9890] font-light">
          Access your FitFusion account.
        </p>
      </motion.div>

      {/* Social buttons */}
      <motion.div variants={item} className="flex gap-3 mb-7">
        <button
          type="button"
          onClick={() => {window.location.href="/api/auth/google"}}
          className="flex-1 flex items-center justify-center gap-2.5 px-4 py-3 border border-[#e2ddd5] bg-white
                     text-xs tracking-wide text-[#3d3830] hover:border-[#c9a84c] hover:shadow-sm
                     transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c]"
        >
          <GoogleIcon />
          Google
        </button>
      </motion.div>

      <motion.div variants={item}>
        <Divider className="mb-7" />
      </motion.div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="flex flex-col gap-7">
          <motion.div variants={item}>
            <Input
              id="login-identifier"
              label="Email or Username"
              type="text"
              value={form.identifier}
              onChange={handleChange("identifier")}
              error={errors.identifier}
              success={success.identifier}
            />
          </motion.div>

          <motion.div variants={item}>
            <div className="space-y-1">
              <Input
                id="login-password"
                label="Password"
                type="password"
                value={form.password}
                onChange={handleChange("password")}
                error={errors.password}
                success={success.password}
              />
            </div>
          </motion.div>

          <motion.div variants={item}>
            <Button type="submit" variant="primary" loading={loading}>
              {loading ? "Signing In…" : "Sign In"}
            </Button>
          </motion.div>

          <motion.p
            variants={item}
            className="text-center text-xs text-[#9e9890] tracking-wide"
          >
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-[#1a1a1a] font-medium hover:text-[#c9a84c] transition-colors underline underline-offset-4"
            >
              Create one
            </Link>
          </motion.p>
        </div>
      </form>
    </motion.div>
  );
}
