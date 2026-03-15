import supabase from '../config/supabaseClient.js'

export const updateSlot = async (slotId, isOccupied) => {
  const { data, error } = await supabase
    .from('parking_slots')
    .update({
      status: isOccupied,
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