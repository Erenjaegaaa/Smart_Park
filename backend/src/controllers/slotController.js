import * as slotService from '../services/slotService.js'

export const updateSlot = async (req, res) => {
  try {
    const { slot_id, status } = req.body
    if (slot_id === undefined || status === undefined) {
      return res.status(400).json({ error: 'slot_id and status are required' })
    }
    const isOccupied = status === true || status === 'occupied'
    const data = await slotService.updateSlot(slot_id, isOccupied)
    res.status(200).json({ message: 'Slot updated successfully', slot: data })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

export const getAllSlots = async (req, res) => {
  try {
    const data = await slotService.getAllSlots()
    res.status(200).json({ slots: data })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}