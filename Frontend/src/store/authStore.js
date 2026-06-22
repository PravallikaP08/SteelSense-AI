import { create } from 'zustand';
import authService from '../services/authService';

// Get user from localStorage
const user = JSON.parse(localStorage.getItem('user'));

const useAuthStore = create((set) => ({
  user: user ? user : null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',

  register: async (userData) => {
    set({ isLoading: true });
    try {
      const data = await authService.register(userData);
      set({ user: data.user, isSuccess: true, isLoading: false, message: '' });
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      set({ isError: true, message, isLoading: false });
    }
  },

  login: async (userData) => {
    set({ isLoading: true });
    try {
      const data = await authService.login(userData);
      set({ user: data.user, isSuccess: true, isLoading: false, message: '' });
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      set({ isError: true, message, isLoading: false });
    }
  },

  googleLogin: async (googleData) => {
    set({ isLoading: true });
    try {
      const data = await authService.googleLogin(googleData);
      set({ user: data.user, isSuccess: true, isLoading: false, message: '' });
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      set({ isError: true, message, isLoading: false });
    }
  },

  updateProfile: async (profileData) => {
    set({ isLoading: true });
    try {
      const data = await authService.updateProfile(profileData);
      set({ user: data.user, isSuccess: true, isLoading: false, message: '' });
      return data.user;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      set({ isError: true, message, isLoading: false });
      throw new Error(message);
    }
  },

  logout: async () => {
    await authService.logout();
    set({ user: null });
  },

  reset: () => set({ isError: false, isSuccess: false, isLoading: false, message: '' })
}));

export default useAuthStore;
