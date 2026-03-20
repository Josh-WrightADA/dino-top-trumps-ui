import axiosClient from './axiosClient';

export function register(username, email, password) {
  return axiosClient.post('/api/v1/auth/register', { username, email, password });
}

export function login(username, password) {
  return axiosClient.post('/api/v1/auth/login', { username, password });
}

export function getProfile() {
  return axiosClient.get('/api/v1/auth/me');
}

export function updateProfile(data) {
  return axiosClient.put('/api/v1/auth/me', data);
}

export function changePassword(currentPassword, newPassword) {
  return axiosClient.put('/api/v1/auth/change-password', { currentPassword, newPassword });
}

export function deleteAccount() {
  return axiosClient.delete('/api/v1/auth/me');
}

export function getPublicProfile(userId) {
  return axiosClient.get(`/api/v1/players/${userId}`);
}

export function forgotPassword(email) {
  return axiosClient.post('/api/v1/auth/forgot-password', { email });
}

export function resetPassword(token, newPassword) {
  return axiosClient.post('/api/v1/auth/reset-password', { token, newPassword });
}

export function uploadAvatar(file) {
  const formData = new FormData();
  formData.append('file', file);
  return axiosClient.post('/api/v1/auth/me/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

export function setDinoAvatar(imageUrl) {
  return axiosClient.post('/api/v1/auth/me/avatar/dino', { imageUrl });
}
