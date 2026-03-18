import axiosClient from './axiosClient';

export function createGame() {
  return axiosClient.post('/api/v1/games');
}

export function getAvailableGames() {
  return axiosClient.get('/api/v1/games/available');
}

export function getActiveGames() {
  return axiosClient.get('/api/v1/games/active');
}

export function joinGame(gameId) {
  return axiosClient.post(`/api/v1/games/${gameId}/join`);
}

export function getGameState(gameId) {
  return axiosClient.get(`/api/v1/games/${gameId}`);
}

export function playTurn(gameId, stat) {
  return axiosClient.post(`/api/v1/games/${gameId}/turns`, { stat });
}

export function forfeitGame(gameId) {
  return axiosClient.post(`/api/v1/games/${gameId}/forfeit`);
}

export function getMatchHistory() {
  return axiosClient.get('/api/v1/games/history');
}

export function getCards() {
  return axiosClient.get('/api/v1/cards');
}

export function getLeaderboard() {
  return axiosClient.get('/api/v1/leaderboard');
}
