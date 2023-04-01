import { configureStore } from '@reduxjs/toolkit'
import orderReducer from './orders'

export const store = configureStore({
  reducer: {
    orderCollection: orderReducer
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
