import axiosClient from './axiosClient';

export function register(username, email, password) {
  return axiosClient.post('/api/v1/auth/register', { username, email, password });
}

export function login(username, password) {
  return axiosClient.post('/api/v1/auth/login', { username, password });
}

export function getProfile() {
  return axiosClient.get('/api/v1/auth/profile');
}

export function updateProfile(data) {
  return axiosClient.put('/api/v1/auth/profile', data);
}

export function forgotPassword(email) {
  return axiosClient.post('/api/v1/auth/forgot-password', { email });
}

export function resetPassword(token, newPassword) {
  return axiosClient.post('/api/v1/auth/reset-password', { token, newPassword });
}
