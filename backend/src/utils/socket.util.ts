import { Server, Socket } from "socket.io";

// Extend Socket interface to include custom properties
interface CustomSocket extends Socket {
  roomId?: string;
  userId?: string;
}

// Define User interface
interface User {
  id: string;
  room: string;
}

// Define Room interface
interface Room {
  [userId: string]: User;
}

// Define Rooms collection interface
interface Rooms {
  [roomId: string]: Set<string>;
}

export default function setupSocket(io: Server) {
  const rooms: Rooms = {};

  io.on('connection', (socket: CustomSocket) => { 
    console.log('New client connected:', socket.id);

    socket.on("join-room", (roomId: string, userId: string) => {
      if (!roomId || !userId) {
        console.error("Invalid roomId or userId:", roomId, userId);
        return;
      }
      

      // Keep track of which room this socket is in
      socket.roomId = roomId;
      socket.userId = userId;

      // Initialize room if needed
      if (!rooms[roomId]) {
        rooms[roomId] = new Set<string>();
      }

      // Add user to room
      rooms[roomId].add(socket.id);

      console.log(`User with socket ${socket.id} joining room ${roomId}`);
      console.log(`Room ${roomId} now has ${rooms[roomId].size} users`);

      socket.join(roomId);

      // Get all other users in the room
      const otherUsers: string[] = [...rooms[roomId]].filter(id => id !== socket.id);

      // Send list of all other users in the room to the new user
      socket.emit("all-users", otherUsers);

      // Notify all other users about the new user
      socket.to(roomId).emit("user-joined", socket.id);
    });

    // Handle signaling for WebRTC with simple-peer
    socket.on("signal", ({ to, from, signal }: { 
      to: string; 
      from: string; 
      signal: any 
    }) => {
      io.to(to).emit("signal", { from, signal });
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);

      // Remove from room tracking
      if (socket.roomId && rooms[socket.roomId]) {
        rooms[socket.roomId].delete(socket.id);
        console.log(`User with socket ${socket.id} left room ${socket.roomId}`);

        // Notify others in the room that user has left
        socket.to(socket.roomId).emit('user-disconnected', socket.id);

        console.log(`Room ${socket.roomId} now has ${rooms[socket.roomId].size} users`);

        // Clean up empty rooms
        if (rooms[socket.roomId].size === 0) {
          delete rooms[socket.roomId];
          console.log(`Room ${socket.roomId} was deleted (empty)`);
        }
      }
    });
  });
}