import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      state.items.push(action.payload);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(
        (item) =>
          item.id !== action.payload.id ||
          JSON.stringify(item.selectedAttributes) !== JSON.stringify(action.payload.selectedAttributes)
      );
    },
    updateQuantity: (state, action) => {
      const { id, selectedAttributes, quantity } = action.payload;
      state.items = state.items.map((item) =>
        item.id === id &&
        JSON.stringify(item.selectedAttributes) === JSON.stringify(selectedAttributes)
          ? { ...item, quantity }
          : item
      );
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity , clearCart } = cartSlice.actions;
export default cartSlice.reducer;
