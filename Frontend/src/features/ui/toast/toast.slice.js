import { createSlice } from '@reduxjs/toolkit';

const toastSlice = createSlice({
  name: 'toast',
  initialState: {
    toasts: [],
  },
  reducers: {
    addToast: (state, action) => {
      state.toasts.push(action.payload);
    },
    removeToast: (state, action) => {
      state.toasts = state.toasts.filter((toast) => toast.id !== action.payload);
    },
  },
});

export const { addToast, removeToast } = toastSlice.actions;

// Thunk to handle auto-removal
export const showToastAction = (toast) => (dispatch) => {
  const id = Math.random().toString(36).substr(2, 9);
  const duration = toast.duration || 3000;

  dispatch(addToast({ ...toast, id }));

  if (duration !== Infinity) {
    setTimeout(() => {
      dispatch(removeToast(id));
    }, duration);
  }
};

export default toastSlice.reducer;
