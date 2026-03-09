import axiosClient from './axiosClient';

export function createGame() {
  return axiosClient.post('/api/v1/games');
}

export function getAvailableGames() {
  return axiosClient.get('/api/v1/games/available');
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

export function getTurnHistory(gameId) {
  return axiosClient.get(`/api/v1/games/${gameId}/turns`);
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
