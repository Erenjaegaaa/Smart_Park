import supabase from '../config/supabaseClient.js'

export const createBooking = async (userId, slotId, startTime, endTime) => {
  const { data, error } = await supabase
    .rpc('create_booking_safe', {
      p_user_id: userId,
      p_slot_id: slotId,
      p_start_time: startTime,
      p_end_time: endTime
    })

  if (error) throw new Error(error.message)
  return data
}

export const getUserBookings = async (userId) => {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      parking_slots (slot_id, status)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export const cancelBooking = async (bookingId, userId) => {
  const { data: booking, error: findError } = await supabase
    .from('bookings')
    .select('*')
    .eq('booking_id', bookingId)
    .eq('user_id', userId)
    .single()

  if (findError) throw new Error('Booking not found')
  if (booking.status === 'cancelled') throw new Error('Booking already cancelled')

  const { data, error } = await supabase
    .from('bookings')
    .update({ status: 'cancelled' })
    .eq('booking_id', bookingId)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}

export const getAllSlots = async () => {
  const { data, error } = await supabase
    .from('parking_slots')
    .select('*')
    .order('slot_id', { ascending: true })

  if (error) throw error
  return data
}

export const processPayment = async (bookingId, userId) => {
  const { data: booking, error: findError } = await supabase
    .from('bookings')
    .select('*')
    .eq('booking_id', bookingId)
    .eq('user_id', userId)
    .single()

  if (findError) throw new Error('Booking not found')
  if (booking.payment_status === 'paid') throw new Error('Already paid')
  if (booking.status === 'cancelled') throw new Error('Booking is cancelled')

  const { data, error } = await supabase
    .from('bookings')
    .update({
      payment_status: 'paid',
      status: 'active'
    })
    .eq('booking_id', bookingId)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}
