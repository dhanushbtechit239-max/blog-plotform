import { io } from 'socket.io-client';

const URL = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace('/api', '')
  : (import.meta.env.MODE === 'production'
    ? window.location.origin
    : 'http://localhost:5000');

export const socket = io(URL, {
  autoConnect: false,
  transports: ['websocket', 'polling'],
});
