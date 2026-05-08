import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import useAuthStore from '../store/authStore'
import useBookingStore from '../store/bookingStore'
import { getUserBookings, cancelBooking } from '../services/bookingService'

const LOCATIONS = [
  { id: 'College', name: 'College', address: 'Campus Road', totalSlots: 16 },
  { id: 'Mall', name: 'Mall', address: 'City Center', totalSlots: 30 },
  { id: 'Railway Station', name: 'Railway Station', address: 'Station Road', totalSlots: 20 },
]

function ProfileDropdown({ user, onLogout, onClose }) {
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose])

  const name = user?.name || user?.user_metadata?.full_name || 'User'
  const email = user?.email || ''
  const avatar = user?.user_metadata?.avatar_url || null

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="absolute right-0 top-14 w-72 bg-[#0F0F0F] border border-[#262626] shadow-2xl z-50"
    >
      <div className="p-5 border-b border-[#262626]">
        <div className="flex items-center gap-3">
          {avatar ? (
            <img src={avatar} className="w-10 h-10 object-cover" alt="" />
          ) : (
            <div className="w-10 h-10 bg-[#FF3D00]/20 flex items-center justify-center text-[#FF3D00] font-bold">
              {name[0].toUpperCase()}
            </div>
          )}
          <div>
            <p className="font-['Inter_Tight'] font-extrabold text-[#FAFAFA]">
              {name}
            </p>
            <p className="text-[#737373] text-sm">{email}</p>
          </div>
        </div>
      </div>

      <button
        onClick={onLogout}
        className="w-full text-left px-5 py-4 text-[#FF3D00] hover:bg-[#FF3D00]/10 transition-all"
      >
        Logout
      </button>
    </motion.div>
  )
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const { user, clearAuth } = useAuthStore()

  const {
    setSelectedLocation,
    userBookings,
    setUserBookings,
    removeUserBooking,
  } = useBookingStore()

  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [cancellingId, setCancellingId] = useState(null)

  const displayName =
    user?.name ||
    user?.user_metadata?.full_name ||
    user?.email?.split('@')[0] ||
    'User'

  const avatar = user?.user_metadata?.avatar_url || null

  useEffect(() => {
    getUserBookings()
      .then((res) => {
        const bookings = (res.data?.bookings || res.data || []).map(b => ({
          ...b,
          id: b.booking_id || b.id,
          slot_number: `P${b.slot_id}`,
          location_name: b.location || 'Unknown',
          date: b.start_time?.split('T')[0],
          start_time: b.start_time?.split('T')[1]?.slice(0, 5),
          end_time: b.end_time?.split('T')[1]?.slice(0, 5),
        }))
        if (bookings.length) {
          setUserBookings(bookings)
        }
      })
      .catch(() => {})
  }, [])

  const handleSelectLocation = (loc) => {
    setSelectedLocation(loc)
    navigate('/booking')
  }

  const handleCancel = async (id) => {
    setCancellingId(id)

    try {
      await cancelBooking(id)
      removeUserBooking(id)
    } catch {
      alert('Failed to cancel booking. Please try again.')
    } finally {
      setCancellingId(null)
    }
  }

  const handleLogout = () => {
    clearAuth()
    navigate('/login')
  }

  const activeBookings = userBookings.filter((b) =>
    ['active', 'booked', 'pending'].includes(b.status)
  )

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#FAFAFA] font-['Inter'] overflow-hidden">
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Inter+Tight:wght@700;800&family=JetBrains+Mono:wght@400;500&display=swap');`}
      </style>

      {/* Navbar */}
      <header className="border-b border-[#262626]">
        <div className="max-w-7xl mx-auto px-10 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-[#FF3D00]" />
            <span className="font-['Inter_Tight'] font-extrabold text-xl">
              SmartPark
            </span>
          </div>

          <div className="relative">
            <button
              onClick={() => setDropdownOpen((v) => !v)}
              className="flex items-center gap-3 border border-[#262626] px-4 py-2 hover:border-[#FF3D00]/40 transition-all"
            >
              {avatar ? (
                <img src={avatar} className="w-8 h-8 object-cover" alt="" />
              ) : (
                <div className="w-8 h-8 bg-[#FF3D00]/20 flex items-center justify-center text-[#FF3D00] font-bold">
                  {displayName[0].toUpperCase()}
                </div>
              )}
              <span>{displayName}</span>
            </button>

            <AnimatePresence>
              {dropdownOpen && (
                <ProfileDropdown
                  user={user}
                  onLogout={handleLogout}
                  onClose={() => setDropdownOpen(false)}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-10 py-16">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left Hero */}
          <div>
            <p className="font-['JetBrains_Mono'] uppercase tracking-widest text-xs text-[#FF3D00] mb-6">
              Smart Parking Dashboard
            </p>

            <h1 className="font-['Inter_Tight'] text-6xl md:text-7xl font-extrabold leading-[0.95]">
              Welcome Back.
              <br />
              <span className="text-[#FF3D00]">{displayName}.</span>
            </h1>

            <p className="mt-8 text-lg text-[#737373] max-w-lg leading-relaxed">
              Real-time AI powered parking slot availability across multiple
              locations. Choose your preferred location and reserve instantly.
            </p>
          </div>

          {/* Right Location Cards */}
          <div className="space-y-6">
            <h2 className="font-['Inter_Tight'] text-xl font-extrabold">
              Choose Location
            </h2>

            {LOCATIONS.map((loc) => (
              <button
                key={loc.id}
                onClick={() => handleSelectLocation(loc)}
                className="w-full border border-[#262626] bg-[#0F0F0F] hover:border-[#FF3D00]/40 transition-all p-6 text-left"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-['Inter_Tight'] text-2xl font-extrabold">
                      {loc.name}
                    </p>
                    <p className="text-[#737373] text-sm mt-1">
                      {loc.address}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-['Inter_Tight'] font-extrabold text-2xl text-[#FF3D00]">
                      {loc.totalSlots}
                    </p>
                    <p className="font-['JetBrains_Mono'] uppercase tracking-wider text-xs text-[#737373]">
                      total slots
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Active Bookings */}
        <section className="mt-20">
          <h2 className="font-['Inter_Tight'] text-2xl font-extrabold mb-6">
            My Active Bookings
          </h2>

          {activeBookings.length === 0 ? (
            <div className="border border-[#262626] bg-[#0F0F0F] p-8">
              <p className="text-[#737373]">No active bookings yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeBookings.map((b) => (
                <div
                  key={b.id}
                  className="border border-[#262626] bg-[#0F0F0F] p-5 flex justify-between items-center"
                >
                  <div>
                    <p className="font-['Inter_Tight'] font-extrabold text-lg">
                      {b.slot_number} • {b.location_name}
                    </p>
                    <p className="text-[#737373] text-sm">
                      {b.date} {b.start_time} - {b.end_time}
                    </p>
                  </div>

                  <button
                    onClick={() => handleCancel(b.id)}
                    disabled={cancellingId === b.id}
                    className="border border-[#262626] text-[#FF3D00] px-4 py-2 hover:border-[#FF3D00]/40 disabled:opacity-40"
                  >
                    {cancellingId === b.id ? '...' : 'Cancel'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}