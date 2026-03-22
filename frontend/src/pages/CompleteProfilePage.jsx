import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import useAuthStore from '../store/authStore'

export default function CompleteProfilePage() {
  const navigate = useNavigate()
  const { token } = useAuthStore()

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    phone_number: '',
    vehicle_number: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Pre-fill first_name and last_name from Google session
  useEffect(() => {
    const prefill = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        navigate('/login')
        return
      }

      const fullName = user.user_metadata?.full_name || ''
      const parts = fullName.trim().split(' ')
      const firstName = parts[0] || ''
      const lastName = parts.slice(1).join(' ') || ''

      setForm(prev => ({
        ...prev,
        first_name: firstName,
        last_name: lastName
      }))
    }

    prefill()
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/complete-profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(form)
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to save profile')
        return
      }

      navigate('/dashboard')
    } catch (err) {
      setError('Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex items-center gap-2 mb-10">
          <span className="w-2 h-2 bg-[#FF3D00]" />
          <span className="font-inter-tight font-bold text-[#FAFAFA] text-lg">SmartPark</span>
        </div>

        {/* Header */}
        <span className="font-jetbrains uppercase tracking-widest text-xs text-[#FF3D00]">
          Complete Profile
        </span>
        <h1 className="font-inter-tight font-extrabold text-4xl text-[#FAFAFA] tracking-tight mt-2 mb-2">
          Almost there.
        </h1>
        <p className="font-inter text-[#737373] mb-8">
          Just a few more details to get you started.
        </p>

        {/* Error */}
        {error && (
          <div className="border border-[#FF3D00] text-[#FF3D00] font-jetbrains text-xs px-4 py-3 mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* First + Last Name */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-jetbrains uppercase tracking-wider text-xs text-[#737373] mb-2 block">
                First Name
              </label>
              <input
                type="text"
                name="first_name"
                value={form.first_name}
                onChange={handleChange}
                required
                className="w-full h-12 bg-[#1A1A1A] border border-[#FF3D00] px-4 text-base text-[#FAFAFA] focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="font-jetbrains uppercase tracking-wider text-xs text-[#737373] mb-2 block">
                Last Name
              </label>
              <input
                type="text"
                name="last_name"
                value={form.last_name}
                onChange={handleChange}
                required
                className="w-full h-12 bg-[#1A1A1A] border border-[#FF3D00] px-4 text-base text-[#FAFAFA] focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Pre-filled note */}
          <p className="font-jetbrains text-xs text-[#FF3D00] -mt-2">
            ✦ Pre-filled from Google — edit if needed
          </p>

          {/* Phone */}
          <div>
            <label className="font-jetbrains uppercase tracking-wider text-xs text-[#737373] mb-2 block">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone_number"
              value={form.phone_number}
              onChange={handleChange}
              required
              placeholder="+91 98765 43210"
              className="w-full h-12 bg-[#1A1A1A] border border-[#262626] px-4 text-base text-[#FAFAFA] placeholder-[#737373] focus:border-[#FF3D00] outline-none transition-colors"
            />
          </div>

          {/* Vehicle Number */}
          <div>
            <label className="font-jetbrains uppercase tracking-wider text-xs text-[#737373] mb-2 block">
              Vehicle Number
            </label>
            <input
              type="text"
              name="vehicle_number"
              value={form.vehicle_number}
              onChange={handleChange}
              required
              placeholder="KL-01-AB-1234"
              className="w-full h-12 bg-[#1A1A1A] border border-[#262626] px-4 text-base text-[#FAFAFA] placeholder-[#737373] focus:border-[#FF3D00] outline-none transition-colors"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-[#FF3D00] text-[#0A0A0A] font-inter-tight font-bold uppercase tracking-wider text-sm hover:bg-[#e63600] active:translate-y-px transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center mt-2"
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : 'Save & Continue →'}
          </button>

        </form>
      </motion.div>
    </div>
  )
}