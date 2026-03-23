import axiosClient from './axiosClient';

export function getUsers() {
  return axiosClient.get('/api/v1/admin/users');
}

export function banUser(userId) {
  return axiosClient.put(`/api/v1/admin/users/${userId}/ban`);
}

export function unbanUser(userId) {
  return axiosClient.put(`/api/v1/admin/users/${userId}/unban`);
}

export function getAdminGames() {
  return axiosClient.get('/api/v1/admin/games');
}

export function deleteGame(gameId) {
  return axiosClient.delete(`/api/v1/admin/games/${gameId}`);
}

export function getReports() {
  return axiosClient.get('/api/v1/admin/reports');
}

export function dismissReport(reportId) {
  return axiosClient.put(`/api/v1/admin/reports/${reportId}/dismiss`);
}
