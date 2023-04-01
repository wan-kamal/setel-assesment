import { IOrder, OrderStatus } from '@data-access';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: IOrder[] = [];

export const orderSlice = createSlice({
  name: 'orderCollection',
  initialState,
  reducers: {
    getOrderSuccess: (state, action: PayloadAction<IOrder[]>) => [...action.payload],
    createOrderSuccess:  (state, action: PayloadAction<IOrder>) => [...state, action.payload],
    cancelOrderSuccess:  (state, action: PayloadAction<IOrder>) => {
      const order = state.find(s => s.orderId === action.payload.orderId);
      if (order) {
        order.status = OrderStatus.CANCELLED;
      }
      return state
    },
  },
})

export const { getOrderSuccess, createOrderSuccess, cancelOrderSuccess } = orderSlice.actions;
export default orderSlice.reducer;
