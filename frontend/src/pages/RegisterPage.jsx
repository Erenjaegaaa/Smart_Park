import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'

export default function RegisterPage() {
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    vehicleNumber: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  // ── Step 1 Validation ──────────────────────────────────────────────────────
  const validateStep1 = () => {
    const newErrors = {}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // ── Step 2 Validation ──────────────────────────────────────────────────────
  const validateStep2 = () => {
    const newErrors = {}
    if (!formData.firstName) newErrors.firstName = 'First name is required'
    if (!formData.lastName) newErrors.lastName = 'Last name is required'
    if (!formData.phone) newErrors.phone = 'Phone number is required'
    if (!formData.vehicleNumber) newErrors.vehicleNumber = 'Vehicle number is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep1()) setStep(2)
  }

  const handleBack = () => {
    setStep(1)
    setErrors({})
  }

  // ── Email Register ─────────────────────────────────────────────────────────
  const handleRegister = async () => {
    if (!validateStep2()) return

    setIsLoading(true)
    setErrors({})

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone_number: formData.phone,
          vehicle_number: formData.vehicleNumber
        })
      })

      const data = await res.json()

      if (!res.ok) {
        setErrors({ api: data.error || 'Registration failed. Try again.' })
        return
      }

      // Registration successful → go to login
      navigate('/login')
    } catch (err) {
      setErrors({ api: 'Something went wrong. Try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  // ── Google Signup ──────────────────────────────────────────────────────────
  const handleGoogleSignup = async () => {
    setGoogleLoading(true)
    setErrors({})

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'http://localhost:5173/auth/callback'
        }
      })
      if (error) setErrors({ api: error.message })
    } catch (err) {
      setErrors({ api: 'Google signup failed. Try again.' })
    } finally {
      setGoogleLoading(false)
    }
  }

  const inputStyles = 'w-full h-12 bg-[#1A1A1A] border border-[#262626] px-4 text-base text-[#FAFAFA] placeholder-[#737373] focus:border-[#FF3D00] outline-none rounded-none transition-colors'
  const labelStyles = 'block font-jetbrains text-xs uppercase tracking-widest text-[#737373] mb-2'
  const errorStyles = 'font-jetbrains text-xs text-[#FF3D00] mt-1'

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex">

      {/* ── Left Panel ─────────────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[55%] bg-[#0F0F0F] border-r border-[#262626] relative overflow-hidden">
        <div
          className="absolute left-0 top-1/2 font-inter-tight font-black text-[20vw] text-[#1A1A1A] select-none"
          style={{ transform: 'rotate(-90deg) translateX(-50%)', transformOrigin: 'left center' }}
        >
          PARK
        </div>

        <div className="relative z-10 flex flex-col justify-center px-16 w-full">
          <span className="font-jetbrains text-xs uppercase tracking-widest text-[#FF3D00] mb-4">
            SMART PARKING
          </span>
          <h1 className="font-inter-tight font-extrabold text-5xl text-[#FAFAFA] tracking-tight mb-4">
            Join SmartPark.
          </h1>
          <p className="font-inter text-lg text-[#737373] mb-8">
            Your spot is one step away.
          </p>
          <div className="space-y-3">
            {['Real-time availability', 'Instant confirmation', 'Secure payment'].map((f) => (
              <p key={f} className="font-jetbrains text-sm text-[#737373]">
                <span className="text-[#FF3D00]">—</span> {f}
              </p>
            ))}
          </div>
        </div>

        <div className="absolute bottom-8 left-16 flex items-center gap-2">
          <div className="w-3 h-3 bg-[#FF3D00]" />
          <span className="font-inter-tight font-bold text-[#FAFAFA] text-sm">SmartPark</span>
        </div>
      </div>

      {/* ── Right Panel ─────────────────────────────────────────────────── */}
      <div className="w-full lg:w-[45%] flex flex-col justify-center px-6 lg:px-12 py-12">

        {/* Back link */}
        <Link
          to="/"
          className="font-jetbrains text-sm text-[#737373] hover:text-[#FAFAFA] transition-colors mb-8 inline-block"
        >
          ← SmartPark
        </Link>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex gap-2 mb-2">
            <div className={`flex-1 h-0.5 ${step >= 1 ? 'bg-[#FF3D00]' : 'bg-[#262626]'}`} />
            <div className={`flex-1 h-0.5 ${step >= 2 ? 'bg-[#FF3D00]' : 'bg-[#262626]'}`} />
          </div>
          <span className="font-jetbrains text-xs text-[#737373]">
            STEP {step} OF 2
          </span>
        </div>

        {/* API error */}
        {errors.api && (
          <div className="border border-[#FF3D00] text-[#FF3D00] font-jetbrains text-xs px-4 py-3 mb-6">
            {errors.api}
          </div>
        )}

        <AnimatePresence mode="wait">

          {/* ── Step 1 ───────────────────────────────────────────────────── */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <span className="font-jetbrains text-xs uppercase tracking-widest text-[#FF3D00]">
                CREATE ACCOUNT
              </span>
              <h2 className="font-inter-tight font-extrabold text-4xl text-[#FAFAFA] tracking-tight mt-2 mb-8">
                Get Started.
              </h2>

              <div className="space-y-5">
                {/* Email */}
                <div>
                  <label className={labelStyles}>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className={inputStyles}
                  />
                  {errors.email && <p className={errorStyles}>{errors.email}</p>}
                </div>

                {/* Password */}
                <div>
                  <label className={labelStyles}>Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className={inputStyles}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#737373] hover:text-[#FAFAFA] transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} strokeWidth={1.5} /> : <Eye size={16} strokeWidth={1.5} />}
                    </button>
                  </div>
                  {errors.password && <p className={errorStyles}>{errors.password}</p>}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className={labelStyles}>Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className={inputStyles}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#737373] hover:text-[#FAFAFA] transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff size={16} strokeWidth={1.5} /> : <Eye size={16} strokeWidth={1.5} />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className={errorStyles}>{errors.confirmPassword}</p>}
                </div>

                {/* Next Button */}
                <button
                  onClick={handleNext}
                  className="w-full h-12 bg-[#FF3D00] text-[#0A0A0A] font-inter-tight font-bold uppercase tracking-wider text-sm hover:bg-[#e63600] transition-colors"
                >
                  Next →
                </button>

                {/* Divider */}
                <div className="relative">
                  <hr className="border-[#262626]" />
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0A0A0A] px-4 font-jetbrains text-xs text-[#737373]">
                    OR
                  </span>
                </div>

                {/* Google Button */}
                <button
                  onClick={handleGoogleSignup}
                  disabled={googleLoading}
                  className="w-full h-12 border border-[#262626] bg-transparent flex items-center justify-center gap-3 hover:border-[#3d3d3d] hover:text-[#FAFAFA] transition-colors group disabled:opacity-70"
                >
                  {googleLoading ? (
                    <Loader2 size={18} className="animate-spin text-[#737373]" />
                  ) : (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      <span className="font-inter text-sm text-[#737373] group-hover:text-[#FAFAFA] transition-colors">
                        Continue with Google
                      </span>
                    </>
                  )}
                </button>

                {/* Login link */}
                <p className="text-center font-inter text-sm text-[#737373]">
                  Already have an account?{' '}
                  <Link to="/login" className="text-[#FF3D00] hover:underline">
                    Sign In →
                  </Link>
                </p>
              </div>
            </motion.div>
          )}

          {/* ── Step 2 ───────────────────────────────────────────────────── */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <span className="font-jetbrains text-xs uppercase tracking-widest text-[#FF3D00]">
                YOUR DETAILS
              </span>
              <h2 className="font-inter-tight font-extrabold text-4xl text-[#FAFAFA] tracking-tight mt-2 mb-8">
                Almost There.
              </h2>

              <div className="space-y-5">
                {/* First + Last Name */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelStyles}>First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="John"
                      className={inputStyles}
                    />
                    {errors.firstName && <p className={errorStyles}>{errors.firstName}</p>}
                  </div>
                  <div>
                    <label className={labelStyles}>Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Doe"
                      className={inputStyles}
                    />
                    {errors.lastName && <p className={errorStyles}>{errors.lastName}</p>}
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className={labelStyles}>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className={inputStyles}
                  />
                  {errors.phone && <p className={errorStyles}>{errors.phone}</p>}
                </div>

                {/* Vehicle Number */}
                <div>
                  <label className={labelStyles}>Vehicle Number</label>
                  <input
                    type="text"
                    name="vehicleNumber"
                    value={formData.vehicleNumber}
                    onChange={handleChange}
                    placeholder="KL-01-AB-1234"
                    className={inputStyles}
                  />
                  {errors.vehicleNumber && <p className={errorStyles}>{errors.vehicleNumber}</p>}
                </div>

                {/* Back + Submit */}
                <div className="flex gap-4">
                  <button
                    onClick={handleBack}
                    className="flex-1 h-12 border border-[#262626] text-[#FAFAFA] font-inter-tight font-bold uppercase tracking-wider text-sm hover:border-[#3d3d3d] transition-colors"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handleRegister}
                    disabled={isLoading}
                    className="flex-1 h-12 bg-[#FF3D00] text-[#0A0A0A] font-inter-tight font-bold uppercase tracking-wider text-sm hover:bg-[#e63600] transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {isLoading ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      'Create Account'
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}