import api from './api';

// Register user
const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  if (response.data && response.data.success) {
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  return response.data;
};

// Login user
const login = async (userData) => {
  const response = await api.post('/auth/login', userData);
  if (response.data && response.data.success) {
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  return response.data;
};

// Google Login/Signup user
const googleLogin = async (googleUserData) => {
  const response = await api.post('/auth/google-login', googleUserData);
  if (response.data && response.data.success) {
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  return response.data;
};

// Update user profile
const updateProfile = async (profileData) => {
  const response = await api.put('/auth/profile', profileData);
  if (response.data && response.data.success) {
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  return response.data;
};

// Logout user
const logout = async () => {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    console.error('Backend logout call failed, clearing local storage anyway', error);
  }
  localStorage.removeItem('user');
};

const authService = {
  register,
  login,
  googleLogin,
  updateProfile,
  logout
};

export default authService;
