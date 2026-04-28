import app from './app.js';
import http from 'http';
import { initSocket } from './realtime/socket.js';

const PORT = process.env.PORT || 5001;

const server = http.createServer(app);
initSocket(server);

server.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
