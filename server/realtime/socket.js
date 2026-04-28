import { Server } from 'socket.io';
import { store } from '../data/store.js';

let ioInstance = null;

export const initSocket = (httpServer) => {
  ioInstance = new Server(httpServer, {
    cors: {
      origin: ['http://localhost:5173', 'http://127.0.0.1:5173']
    }
  });

  ioInstance.on('connection', (socket) => {
    socket.on('join_project', ({ projectId }) => {
      if (!projectId) return;
      socket.join(`project:${projectId}`);
    });

    socket.on('leave_project', ({ projectId }) => {
      if (!projectId) return;
      socket.leave(`project:${projectId}`);
    });

    socket.on('send_project_message', ({ projectId, sender, role, text }) => {
      if (!projectId || !sender?.trim() || !role?.trim() || !text?.trim()) return;

      const result = store.addChatMessage({ projectId, sender, role, text });
      if (result.error) return;

      ioInstance.to(`project:${projectId}`).emit('project_chat_updated', {
        projectId,
        messages: result.messages
      });
    });
  });

  return ioInstance;
};

export const emitProjectChatUpdate = (projectId, messages) => {
  if (!ioInstance) return;
  ioInstance.to(`project:${projectId}`).emit('project_chat_updated', {
    projectId,
    messages
  });
};

