import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server);

const __dirname = dirname(fileURLToPath(import.meta.url));

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});


io.on('connection', (socket) => {
  socket.on('join', (userName) => {
      socket.userName = userName;
      io.emit('user joined', userName);
  });

  socket.on('leave', (userName) => {
      io.emit('user left', userName);
      socket.disconnect();
  });

  socket.on('disconnect', () => {
      if (socket.userName) {
          io.emit('user left', socket.userName);
      }
  });

  socket.on('chat message', (msg) => {
      io.emit('chat message', msg);
  });
});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});

