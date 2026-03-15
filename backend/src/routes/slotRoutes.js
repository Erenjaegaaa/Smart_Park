import express from 'express'
import * as slotController from '../controllers/slotController.js'

const router = express.Router()

router.post('/internal/slot-update', slotController.updateSlot)
router.get('/', slotController.getAllSlots)

export default router