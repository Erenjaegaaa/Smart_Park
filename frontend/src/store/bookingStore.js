import { create } from 'zustand'

const useBookingStore = create((set) => ({
  selectedLocation: null,
  slots: [],
  userBookings: [],

  setSelectedLocation: (location) => set({ selectedLocation: location }),
  setSlots: (slots) => set({ slots }),
  setUserBookings: (bookings) => set({ userBookings: bookings }),

  addUserBooking: (booking) =>
    set((state) => ({
      userBookings: [booking, ...state.userBookings],
    })),

  removeUserBooking: (bookingId) =>
    set((state) => ({
      userBookings: state.userBookings.filter((b) => b.id !== bookingId),
    })),

  updateSlotStatus: (slotId, status) =>
    set((state) => ({
      slots: state.slots.map((s) =>
        s.id === slotId ? { ...s, status } : s
      ),
    })),

  clearBookingState: () =>
    set({
      selectedLocation: null,
      slots: [],
      userBookings: [],
    }),
}))

export default useBookingStore