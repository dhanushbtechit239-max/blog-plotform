const socketHandler = (io) => {
  io.on('connection', (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    // Join a post's room for real-time comments
    socket.on('joinPost', (postId) => {
      socket.join(`post:${postId}`);
      console.log(`📝 Socket ${socket.id} joined post:${postId}`);
    });

    // Leave a post's room
    socket.on('leavePost', (postId) => {
      socket.leave(`post:${postId}`);
      console.log(`👋 Socket ${socket.id} left post:${postId}`);
    });

    socket.on('disconnect', () => {
      console.log(`❌ Socket disconnected: ${socket.id}`);
    });
  });
};

module.exports = socketHandler;
