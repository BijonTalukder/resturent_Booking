import { createSlice } from "@reduxjs/toolkit";
import { startOfDay, addDays } from "date-fns";

const initialState = {
  selectedRooms: [],
  checkInDate: startOfDay(new Date()),
  checkOutDate: addDays(startOfDay(new Date()), 1),
  totalPrice: 0,
  currentHotel: null,
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    // Set the current hotel being viewed
    setCurrentHotel: (state, action) => {
      state.currentHotel = action.payload;
    },

    // Update booking dates
    updateBookingDates: (state, action) => {
      const { checkInDate, checkOutDate } = action.payload;
      if (checkInDate) state.checkInDate = checkInDate;
      if (checkOutDate) state.checkOutDate = checkOutDate;
      state.totalPrice = calculateTotalPrice(state.selectedRooms, state.checkInDate, state.checkOutDate);
    },

    // Toggle room selection (add/remove)
    toggleRoomSelection: (state, action) => {
      const room = action.payload;
      const existingIndex = state.selectedRooms.findIndex(r => r.id === room.id);
      
      if (existingIndex >= 0) {
        // Remove room if already selected
        state.selectedRooms.splice(existingIndex, 1);
      } else {
        // Add room if not selected
        state.selectedRooms.push(room);
      }
      
      state.totalPrice = calculateTotalPrice(state.selectedRooms, state.checkInDate, state.checkOutDate);
    },

    // Clear all selected rooms
    clearSelectedRooms: (state) => {
      state.selectedRooms = [];
      state.totalPrice = 0;
    },

    // Reset entire booking state
    resetBooking: () => initialState,
  },
});

// Helper function to calculate total price
const calculateTotalPrice = (selectedRooms, checkInDate, checkOutDate) => {
  if (!selectedRooms.length || !checkInDate || !checkOutDate) return 0;
  
  const nights = Math.max(
    1,
    Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24))
  );
  
  return selectedRooms.reduce(
    (sum, room) => sum + room.price * nights,
    0
  );
};

export const { 
  setCurrentHotel,
  updateBookingDates,
  toggleRoomSelection,
  clearSelectedRooms,
  resetBooking
} = bookingSlice.actions;

export default bookingSlice.reducer;