import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import useBookingStore from '../store/bookingStore'
import { getAllSlots, createBooking, payForBooking } from '../services/bookingService'

const generateSlots = (locationId, total) =>
  Array.from({ length: total }, (_, i) => {
    const r = Math.random()
    return {
      id: `${locationId}-${i + 1}`,
      slotNumber: `P${i + 1}`,
      status: r < 0.3 ? 'occupied' : r < 0.5 ? 'booked' : 'available',
    }
  })

const STATUS_UI = {
  available: {
    bg: 'bg-[#0F0F0F]',
    text: 'text-[#FAFAFA]',
    dot: 'bg-green-500',
    border: 'hover:border-[#FF3D00]',
    disabled: false,
  },
  booked: {
    bg: 'bg-[#0F0F0F]',
    text: 'text-[#FAFAFA]',
    dot: 'bg-yellow-400',
    border: '',
    disabled: true,
  },
  occupied: {
    bg: 'bg-[#0F0F0F]',
    text: 'text-[#737373]',
    dot: 'bg-red-500',
    border: '',
    disabled: true,
  },
}

function BookingModal({ slot, location, onClose, onBooked }) {
  const [step, setStep] = useState(1)
  const [bookingId, setBookingId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const today = new Date().toISOString().split('T')[0]

  const [form, setForm] = useState({
    startDate: today,
    startTime: '',
    endDate: today,
    endTime: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
    cardHolder: '',
  })

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }))

  const calcDuration = () => {
    if (!form.startTime || !form.endTime) return 0
    const [sh, sm] = form.startTime.split(':').map(Number)
    const [eh, em] = form.endTime.split(':').map(Number)
    return Math.max(0, (eh * 60 + em - (sh * 60 + sm)) / 60)
  }

  const duration = calcDuration()
  const parking = duration * 40
  const platform = duration > 0 ? 10 : 0
  const gst = +((parking + platform) * 0.18).toFixed(2)
  const total = +(parking + platform + gst).toFixed(2)

  const handlePayment = async () => {
    setLoading(true)
    setError('')

    try {
      const startDateTime = `${form.startDate}T${form.startTime}:00`
      const endDateTime = `${form.endDate}T${form.endTime}:00`

      const bookingRes = await createBooking({
        slot_id: slot.id,
        start_time: startDateTime,
        end_time: endDateTime,
      })

      const newBookingId =
        bookingRes.data?.booking?.booking_id ||
        bookingRes.data?.booking?.id ||
        bookingRes.data?.id

      await payForBooking(newBookingId)

      setBookingId(newBookingId)
      setStep(4)
    } catch (err) {
      setError(err?.response?.data?.error || 'Payment failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="w-full max-w-lg bg-[#0F0F0F] border border-[#262626] p-8">
        <p className="font-['JetBrains_Mono'] uppercase tracking-widest text-xs text-[#FF3D00] mb-6">
          Slot {slot.slotNumber}
        </p>

        {/* STEP 1 */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="font-['Inter_Tight'] text-2xl font-extrabold">
              Booking Details
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => set('startDate', e.target.value)}
                className="bg-[#0A0A0A] border border-[#262626] p-3 text-white [color-scheme:dark]"
              />
              <input
                type="time"
                value={form.startTime}
                onChange={(e) => set('startTime', e.target.value)}
                className="bg-[#0A0A0A] border border-[#262626] p-3 text-white [color-scheme:dark]"
              />
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => set('endDate', e.target.value)}
                className="bg-[#0A0A0A] border border-[#262626] p-3 text-white [color-scheme:dark]"
              />
              <input
                type="time"
                value={form.endTime}
                onChange={(e) => set('endTime', e.target.value)}
                className="bg-[#0A0A0A] border border-[#262626] p-3 text-white [color-scheme:dark]"
              />
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!form.startTime || !form.endTime}
              className="w-full bg-[#FF3D00] py-3 font-bold disabled:opacity-40"
            >
              Continue
            </button>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="font-['Inter_Tight'] text-2xl font-extrabold">
              Payment Details
            </h2>

            <input
              placeholder="Card Number"
              value={form.cardNumber}
              onChange={(e) => set('cardNumber', e.target.value)}
              className="w-full bg-[#0A0A0A] border border-[#262626] p-3"
            />

            <div className="grid grid-cols-2 gap-4">
              <input
                placeholder="MM/YY"
                value={form.expiry}
                onChange={(e) => set('expiry', e.target.value)}
                className="bg-[#0A0A0A] border border-[#262626] p-3"
              />
              <input
                placeholder="CVV"
                value={form.cvv}
                onChange={(e) => set('cvv', e.target.value)}
                className="bg-[#0A0A0A] border border-[#262626] p-3"
              />
            </div>

            <input
              placeholder="Card Holder"
              value={form.cardHolder}
              onChange={(e) => set('cardHolder', e.target.value)}
              className="w-full bg-[#0A0A0A] border border-[#262626] p-3"
            />

            <button
              onClick={() => setStep(3)}
              className="w-full bg-[#FF3D00] py-3 font-bold"
            >
              Continue
            </button>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div>
            <h2 className="font-['Inter_Tight'] text-2xl font-extrabold mb-6">
              Final Bill
            </h2>

            <div className="border border-[#262626] bg-[#0A0A0A] p-6 space-y-3">
              <div className="flex justify-between"><span>Parking</span><span>₹{parking}</span></div>
              <div className="flex justify-between"><span>Platform</span><span>₹{platform}</span></div>
              <div className="flex justify-between"><span>GST</span><span>₹{gst}</span></div>
              <div className="flex justify-between font-bold text-[#FF3D00]">
                <span>Total</span><span>₹{total}</span>
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-sm mt-3">{error}</p>
            )}

            <button
              onClick={handlePayment}
              disabled={loading}
              className="w-full bg-[#FF3D00] py-3 font-bold mt-6 disabled:opacity-40"
            >
              {loading ? 'Processing...' : 'Pay Now'}
            </button>
          </div>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <div>
            <h2 className="font-['Inter_Tight'] text-2xl font-extrabold mb-4">
              Booking Confirmed
            </h2>

            <div className="border border-[#262626] bg-[#0A0A0A] p-6 space-y-3">
              <p>Booking ID: {bookingId}</p>
              <p>Location: {location.name}</p>
              <p>Slot: {slot.slotNumber}</p>
              <p>Total Paid: ₹{total}</p>
            </div>

            <button
              onClick={() =>
                onBooked(slot.id, {
                  startDate: form.startDate,
                  startTime: form.startTime,
                  endTime: form.endTime,
                  bookingId,
                })
              }
              className="w-full bg-[#FF3D00] py-3 font-bold mt-6"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function BookingPage() {
  const navigate = useNavigate()
  const { selectedLocation, addUserBooking } = useBookingStore()

  const [slots, setSlots] = useState([])
  const [selectedSlot, setSelectedSlot] = useState(null)

  useEffect(() => {
    if (!selectedLocation) {
      navigate('/dashboard')
      return
    }

    getAllSlots()
      .then((res) => {
        const data = (res.data?.slots || res.data || []).filter(
          (s) => s.location === selectedLocation.id
        )
        if (data.length) {
          const mapped = data.map((s) => ({
            id: s.slot_id,
            slotNumber: `P${s.slot_id}`,
            status: s.status === 'occupied' ? 'occupied' : s.status === 'booked' ? 'booked' : 'available',
          }))
          setSlots(mapped)
        } else {
          setSlots(generateSlots(selectedLocation.id, selectedLocation.totalSlots))
        }
      })
      .catch(() =>
        setSlots(generateSlots(selectedLocation.id, selectedLocation.totalSlots))
      )
  }, [selectedLocation])

  const handleBooked = (slotId, bookingData) => {
    const bookedSlot = slots.find((s) => s.id === slotId)

    addUserBooking({
      id: bookingData.bookingId || Date.now(),
      slot_number: bookedSlot?.slotNumber || `P${slotId}`,
      location_name: selectedLocation.name,
      date: bookingData.startDate,
      start_time: bookingData.startTime,
      end_time: bookingData.endTime,
      status: 'active',
    })

    setSlots((prev) =>
      prev.map((s) =>
        s.id === slotId ? { ...s, status: 'booked' } : s
      )
    )

    setSelectedSlot(null)
    navigate('/dashboard')
  }

  if (!selectedLocation) return null

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#FAFAFA] p-10">
      <h1 className="font-['Inter_Tight'] text-5xl font-extrabold mb-10">
        {selectedLocation.name} Parking
      </h1>

      {/* Legend */}
      <div className="flex gap-6 mb-8">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-500" />
          <span className="font-['JetBrains_Mono'] text-xs uppercase tracking-wider text-[#737373]">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-yellow-400" />
          <span className="font-['JetBrains_Mono'] text-xs uppercase tracking-wider text-[#737373]">Booked</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500" />
          <span className="font-['JetBrains_Mono'] text-xs uppercase tracking-wider text-[#737373]">Occupied</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {slots.map((slot) => {
          const ui = STATUS_UI[slot.status]

          return (
            <button
              key={slot.id}
              disabled={ui.disabled}
              onClick={() => !ui.disabled && setSelectedSlot(slot)}
              className={`relative border border-[#262626] p-8 text-center transition-all ${ui.bg} ${ui.text} ${ui.border}`}
            >
              <span
                className={`absolute top-2 right-2 w-3 h-3 rounded-full ${ui.dot}`}
              />
              {slot.slotNumber}
            </button>
          )
        })}
      </div>

      <AnimatePresence>
        {selectedSlot && (
          <BookingModal
            slot={selectedSlot}
            location={selectedLocation}
            onClose={() => setSelectedSlot(null)}
            onBooked={handleBooked}
          />
        )}
      </AnimatePresence>
    </div>
  )
}