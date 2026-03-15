import express from 'express'
import * as bookingController from '../controllers/bookingController.js'
import { authenticate } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/slots', bookingController.getAllSlots)
router.post('/', authenticate, bookingController.createBooking)
router.get('/', authenticate, bookingController.getUserBookings)
router.delete('/:id', authenticate, bookingController.cancelBooking)
router.post('/:id/pay', authenticate, bookingController.processPayment)

export default router