import * as bookingService from '../services/bookingService.js'

export const createBooking = async (req, res) => {
  try {
    const { slot_id, start_time, end_time } = req.body
    if (!slot_id || !start_time || !end_time) {
      return res.status(400).json({
        error: 'slot_id, start_time and end_time are required'
      })
    }

    const slotIdInt = parseInt(slot_id)
    if (isNaN(slotIdInt)) {
      return res.status(400).json({ error: 'slot_id must be a number' })
    }

    const start = new Date(start_time)
    const end = new Date(end_time)

    if (isNaN(start) || isNaN(end)) {
      return res.status(400).json({ error: 'Invalid date format' })
    }
    if (start >= end) {
      return res.status(400).json({ error: 'end_time must be after start_time' })
    }
    if (start < new Date()) {
      return res.status(400).json({ error: 'start_time cannot be in the past' })
    }

    const data = await bookingService.createBooking(
      req.user.id, slotIdInt, start.toISOString(), end.toISOString()
    )
    res.status(201).json({
      message: 'Booking created successfully',
      booking: data
    })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

export const getUserBookings = async (req, res) => {
  try {
    const data = await bookingService.getUserBookings(req.user.id)
    res.status(200).json({
      bookings: data
    })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params
    if (!id) {
      return res.status(400).json({ error: 'Booking ID is required' })
    }
    const data = await bookingService.cancelBooking(id, req.user.id)
    res.status(200).json({
      message: 'Booking cancelled successfully',
      booking: data
    })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

export const getAllSlots = async (req, res) => {
  try {
    const data = await bookingService.getAllSlots()
    res.status(200).json({
      slots: data
    })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

export const processPayment = async (req, res) => {
  try {
    const { id } = req.params
    if (!id) {
      return res.status(400).json({ error: 'Booking ID is required' })
    }
    await new Promise(resolve => setTimeout(resolve, 1500))
    const data = await bookingService.processPayment(id, req.user.id)
    res.status(200).json({
      message: 'Payment successful',
      booking: data
    })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}