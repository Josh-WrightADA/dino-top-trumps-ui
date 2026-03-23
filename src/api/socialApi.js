import axiosClient from './axiosClient';

export function sendFriendRequest(userId) {
  return axiosClient.post(`/api/v1/friends/request/${userId}`);
}

export function acceptFriendRequest(friendshipId) {
  return axiosClient.put(`/api/v1/friends/${friendshipId}/accept`);
}

export function declineFriendRequest(friendshipId) {
  return axiosClient.put(`/api/v1/friends/${friendshipId}/decline`);
}

export function removeFriend(friendshipId) {
  return axiosClient.delete(`/api/v1/friends/${friendshipId}`);
}

export function getFriends() {
  return axiosClient.get('/api/v1/friends/');
}

export function getPendingRequests() {
  return axiosClient.get('/api/v1/friends/requests');
}

export function sendGameInvite(gameId, userId) {
  return axiosClient.post(`/api/v1/games/${gameId}/invite/${userId}`);
}

export function getPendingInvites() {
  return axiosClient.get('/api/v1/games/invites');
}

export function acceptGameInvite(inviteId) {
  return axiosClient.put(`/api/v1/games/invites/${inviteId}/accept`);
}

export function declineGameInvite(inviteId) {
  return axiosClient.put(`/api/v1/games/invites/${inviteId}/decline`);
}

export function reportUser(userId, reason) {
  return axiosClient.post(`/api/v1/auth/players/${userId}/report`, { reason });
}
