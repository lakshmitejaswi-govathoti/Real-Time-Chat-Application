const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require("textarea")(server);
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

mongoose.connect('mongodb://localhost/chatapp', { useNewUrlParser: true });

const User = mongoose.model('User', {
  username: String,
  password: String
});

const Message = mongoose.model('Message', {
  text: String,
  userId: String,
  groupId: String
});

io.on('connection', (socket) => {
  console.log('User connected');

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

  socket.on('login', (credentials) => {
    const { username, password } = credentials;
    User.findOne({ username }, (err, user) => {
      if (err || !user) {
        socket.emit('loginError', 'Invalid username or password');
        return;
      }
      const validPassword = bcrypt.compareSync(password, user.password);
      if (!validPassword) {
        socket.emit('loginError', 'Invalid username or password');
        return;
      }
      socket.userId = user._id;
      socket.emit('loginSuccess', `Welcome, ${username}!`);
    });
  });

  socket.on('message', (message) => {
    if (!socket.userId) {
      socket.emit('error', 'You must be logged in to send messages');
      return;
    }
    const msg = new Message({
      text: message.text,
      userId: socket.userId,
      groupId: message.groupId
    });
    msg.save();
    io.emit('message', msg);
  });
});
