import supabase from '../config/supabaseClient.js'

export const updateSlot = async (slotId, isOccupied) => {
  // Get current status to prevet overwriting 'booked' state
  const { data: currentSlot } = await supabase
    .from('parking_slots')
    .select('status')
    .eq('slot_id', slotId)
    .single()

  let newStatus = isOccupied ? 'occupied' : 'available'

  // If slot was booked and sensor says free, keep it booked
  if (!isOccupied && currentSlot?.status === 'booked') {
    newStatus = 'booked'
  }

  const { data, error } = await supabase
    .from('parking_slots')
    .update({
      status: newStatus,
      updated_at: new Date().toISOString()
    })
    .eq('slot_id', slotId)
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