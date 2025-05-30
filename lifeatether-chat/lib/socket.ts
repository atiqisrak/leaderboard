import { io, Socket } from 'socket.io-client';

let socket: Socket;

export const initializeSocket = (userId: string) => {
  if (!socket) {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!token || !user.id) {
      throw new Error('User not authenticated');
    }

    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3096', {
      auth: {
        token,
        userId: user.id,
        username: user.username
      },
      withCredentials: true
    });

    socket.on('connect', () => {
      console.log('Connected to Socket.IO server');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server');
    });

    socket.on('error', (error) => {
      console.error('Socket.IO error:', error);
    });
  }
  return socket;
};

export const getSocket = () => {
  if (!socket) {
    throw new Error('Socket not initialized. Call initializeSocket first.');
  }
  return socket;
};

// Chat room functions
export const joinRoom = (roomId: string) => {
  const socket = getSocket();
  socket.emit('join_room', roomId);
};

export const sendMessage = (roomId: string, message: string, userId: string) => {
  const socket = getSocket();
  socket.emit('send_message', { roomId, message, userId });
};

export const setTypingStatus = (roomId: string, userId: string, isTyping: boolean) => {
  const socket = getSocket();
  socket.emit('typing', { roomId, userId, isTyping });
};

// Message event listeners
export const onMessage = (callback: (message: any) => void) => {
  const socket = getSocket();
  socket.on('receive_message', callback);
};

export const onTyping = (callback: (data: { userId: string; isTyping: boolean }) => void) => {
  const socket = getSocket();
  socket.on('user_typing', callback);
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
  }
};