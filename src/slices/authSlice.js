import { createSlice } from '@reduxjs/toolkit'

const stored = JSON.parse(localStorage.getItem('gastos_user') || 'null')

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: stored,         // { nombre, email, moneda }
    isLoggedIn: !!stored,
  },
  reducers: {
    login: (state, action) => {
      state.user      = action.payload
      state.isLoggedIn = true
      localStorage.setItem('gastos_user', JSON.stringify(action.payload))
    },
    logout: (state) => {
      state.user      = null
      state.isLoggedIn = false
      localStorage.removeItem('gastos_user')
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload }
      localStorage.setItem('gastos_user', JSON.stringify(state.user))
    },
  },
})

export const { login, logout, updateUser } = authSlice.actions
export default authSlice.reducer
