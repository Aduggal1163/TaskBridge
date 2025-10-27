import { io } from 'socket.io-client';

let socket = null;

export function connectRealtime() {
  if (socket) return socket;
  const url = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
  socket = io(url, { withCredentials: true });
  return socket;
}

export function onActivity(handler) {
  if (!socket) connectRealtime();
  socket.on('activity', handler);
}

export function disconnectRealtime() {
  if (socket) {
    socket.off('activity');
    socket.disconnect();
    socket = null;
  }
}
