require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const { startScheduler } = require('./utils/scheduler');
const Message = require('./models/Message');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// Connect DB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/services', require('./routes/services'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/group-bookings', require('./routes/group-bookings'));
app.use('/api/subscriptions', require('./routes/subscriptions'));
app.use('/api/voting', require('./routes/voting'));
app.use('/api/equity', require('./routes/equity'));
app.use('/api/referral', require('./routes/referral'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/admin', require('./routes/admin'));

// Socket.io — Real-time Chat
io.on('connection', (socket) => {
  console.log(`🔌 User connected: ${socket.id}`);

  socket.on('join_room', (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  socket.on('send_message', async (data) => {
    try {
      const { room, senderId, content, type } = data;
      const message = await Message.create({ room, sender: senderId, content, type: type || 'text' });
      const populated = await message.populate('sender', 'name avatar');
      io.to(room).emit('receive_message', populated);
    } catch (err) {
      console.error('Chat error:', err.message);
    }
  });

  socket.on('typing', (data) => socket.to(data.room).emit('user_typing', data));
  socket.on('stop_typing', (data) => socket.to(data.room).emit('user_stop_typing', data));

  socket.on('disconnect', () => console.log(`🔌 User disconnected: ${socket.id}`));
});

// Catch-all: serve frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

// Start subscription scheduler
startScheduler();

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
