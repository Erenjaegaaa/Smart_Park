import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import useAuthStore from '../store/authStore'

export default function LoginPage() {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [errors, setErrors] = useState({ email: '', password: '', api: '' })

  // ── Validation ─────────────────────────────────────────────────────────────
  const validateForm = () => {
    const newErrors = { email: '', password: '', api: '' }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!email) {
      newErrors.email = 'Email is required'
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Enter a valid email'
    }

    if (!password) {
      newErrors.password = 'Password is required'
    }

    setErrors(newErrors)
    return !newErrors.email && !newErrors.password
  }

  // ── Email Login ────────────────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    setErrors({ email: '', password: '', api: '' })

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()

      if (!res.ok) {
        setErrors(prev => ({ ...prev, api: data.error || 'Invalid credentials. Try again.' }))
        return
      }

      setAuth(data.user, data.access_token)
      navigate('/dashboard')
    } catch (err) {
      setErrors(prev => ({ ...prev, api: 'Something went wrong. Try again.' }))
    } finally {
      setIsLoading(false)
    }
  }

  // ── Google Login ───────────────────────────────────────────────────────────
  const handleGoogleLogin = async () => {
    setGoogleLoading(true)
    setErrors({ email: '', password: '', api: '' })

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
         redirectTo: 'http://localhost:5173/auth/callback'
        }
      })
      if (error) setErrors(prev => ({ ...prev, api: error.message }))
    } catch (err) {
      setErrors(prev => ({ ...prev, api: 'Google login failed. Try again.' }))
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-[#0A0A0A]">

      {/* ── Left Panel — Decorative ─────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[55%] relative bg-[#0F0F0F] border-r border-[#262626] overflow-hidden">
        {/* Large background text */}
        <div
          className="absolute left-0 top-1/2 font-black text-[20vw] text-[#1A1A1A] select-none"
          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg) translateY(50%)' }}
        >
          PARK
        </div>

        {/* Centered content */}
        <motion.div
          className="relative z-10 flex flex-col justify-center px-16 xl:px-24"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-jetbrains uppercase tracking-widest text-xs text-[#FF3D00]"
          >
            Smart Parking
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="font-inter-tight font-extrabold text-5xl text-[#FAFAFA] tracking-tight mt-4"
          >
            Welcome Back.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="font-inter text-lg text-[#737373] mt-3"
          >
            Your slot is waiting.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-10 space-y-3"
          >
            {['Real-time availability', 'Instant confirmation', 'Secure payment'].map((feature, index) => (
              <motion.p
                key={feature}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                className="font-jetbrains text-sm text-[#737373]"
              >
                <span className="text-[#FF3D00]">—</span> {feature}
              </motion.p>
            ))}
          </motion.div>
        </motion.div>

        {/* Bottom wordmark */}
        <div className="absolute bottom-8 left-8 flex items-center gap-2">
          <div className="w-3 h-3 bg-[#FF3D00]" />
          <span className="font-inter-tight font-bold text-sm text-[#FAFAFA]">SmartPark</span>
        </div>
      </div>

      {/* ── Right Panel — Form ──────────────────────────────────────────── */}
      <motion.div
        className="w-full lg:w-[45%] flex flex-col justify-center px-6 md:px-12 py-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Back link */}
        <Link
          to="/"
          className="font-jetbrains text-sm text-[#737373] hover:text-[#FAFAFA] transition-colors mb-12 inline-flex items-center gap-1 self-start"
        >
          ← SmartPark
        </Link>

        <div className="max-w-md w-full mx-auto lg:mx-0">
          {/* Header */}
          <div className="mb-8">
            <span className="font-jetbrains uppercase tracking-widest text-xs text-[#FF3D00]">
              Account Access
            </span>
            <h2 className="font-inter-tight font-extrabold text-4xl text-[#FAFAFA] tracking-tight mt-2">
              Sign In.
            </h2>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">

            {/* Email */}
            <div>
              <label className="font-jetbrains uppercase tracking-wider text-xs text-[#737373] mb-2 block">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: '' })) }}
                placeholder="you@example.com"
                className="w-full h-12 bg-[#1A1A1A] border border-[#262626] px-4 text-base text-[#FAFAFA] placeholder-[#737373] focus:border-[#FF3D00] outline-none transition-colors duration-150"
              />
              {errors.email && (
                <p className="font-jetbrains text-xs text-[#FF3D00] mt-2">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="font-jetbrains uppercase tracking-wider text-xs text-[#737373] mb-2 block">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrors(prev => ({ ...prev, password: '' })) }}
                  placeholder="••••••••"
                  className="w-full h-12 bg-[#1A1A1A] border border-[#262626] px-4 pr-12 text-base text-[#FAFAFA] placeholder-[#737373] focus:border-[#FF3D00] outline-none transition-colors duration-150"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#737373] hover:text-[#FAFAFA] transition-colors"
                >
                  {showPassword ? <EyeOff size={16} strokeWidth={1.5} /> : <Eye size={16} strokeWidth={1.5} />}
                </button>
              </div>
              {errors.password && (
                <p className="font-jetbrains text-xs text-[#FF3D00] mt-2">{errors.password}</p>
              )}
            </div>

            {/* API Error */}
            {errors.api && (
              <p className="font-jetbrains text-sm text-[#FF3D00]">{errors.api}</p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-[#FF3D00] text-[#0A0A0A] font-inter-tight font-bold uppercase tracking-wider text-sm hover:bg-[#e63600] active:translate-y-px transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? <Loader2 size={20} className="animate-spin" /> : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <hr className="border-[#262626]" />
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0A0A0A] px-4 font-jetbrains text-xs text-[#737373]">
              OR
            </span>
          </div>

          {/* Google Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full h-12 border border-[#262626] bg-transparent text-[#737373] font-inter text-sm hover:border-[#3d3d3d] hover:text-[#FAFAFA] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {googleLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908C16.658 14.013 17.64 11.706 17.64 9.2z" fill="#4285F4"/>
                  <path d="M9.003 18c2.43 0 4.467-.806 5.956-2.18l-2.909-2.26c-.806.54-1.836.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9.003 18z" fill="#34A853"/>
                  <path d="M3.964 10.712A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.33z" fill="#FBBC05"/>
                  <path d="M9.003 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.464.891 11.428 0 9.002 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29c.708-2.127 2.692-3.71 5.036-3.71z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </>
            )}
          </button>

          {/* Register link */}
          <p className="mt-8 text-center font-inter text-sm text-[#737373]">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#FF3D00] hover:underline">
              Register →
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}