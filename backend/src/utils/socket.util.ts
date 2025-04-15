import { Server, Socket } from 'socket.io';
import { WhiteboardRepository } from '../repositories/implementation/whiteboard.repository';
import { UserServices } from '../services/implementation/user.services';
import { UserRepository } from '../repositories/implementation/user.repository';
import { SessionActivityRepository } from '../repositories/implementation/sesssionActivity.respository';


interface CustomSocket extends Socket {
  roomId?: string;
  userId?: string;
  email?: string;
}

interface Rooms {
  [roomId: string]: { userId: string; email: string }[];
}

interface Users {
  [userId: string]: string;
}

let ioInstance: Server | null = null;

export function stopRoomSession(roomId: string) {
  if (!ioInstance) return;

  ioInstance.to(roomId).emit('session-stopped', {
    reason: 'Session was stopped by an admin',
  });

  ioInstance.in(roomId).socketsLeave(roomId);
}

const whiteBoardRepo = new WhiteboardRepository();
const userReport = new UserRepository()
const sesssionActivityRepo = new SessionActivityRepository()
const userServervices = new UserServices(userReport,sesssionActivityRepo)

export default function setupSocket(io: Server) {
  ioInstance = io;

  const rooms: Rooms = {};
  const users: Users = {};

  io.on('connection', (socket: CustomSocket) => {
    socket.on('join-room', (roomId: string, userId: string, email: string) => {
      if (!roomId || !userId) {
        console.error('Invalid roomId or userId:', roomId, userId);
        return;
      }

      socket.roomId = roomId;
      socket.userId = userId;
      //socket.email = email
      users[userId] = email;

      // Initialize room if needed
      if (!rooms[roomId]) {
        rooms[roomId] = [];
      }

      rooms[roomId].push({ userId: socket.id, email: email });

      console.log(`User with socket ${socket.id} joining room ${roomId}`);
      console.log(`Room ${roomId} now has ${rooms[roomId].length} users`);

      socket.join(roomId);

      const otherUsers = rooms[roomId].filter(usr => usr.userId !== socket.id);

      socket.emit('all-users', otherUsers);

      socket.to(roomId).emit('user-joined', socket.id, email);
      
    });

    // Handle signaling for WebRTC with simple-peer
    socket.on(
      'signal',
      ({ to, from, signal }: { to: string; from: string; signal: any }) => {
        io.to(to).emit('signal', { from, signal });
      }
    );

    socket.on('user-speaking', ({ peerId, roomId }) => {
      socket.to(roomId).emit('user-speaking', peerId);
    });

    socket.on('user-stopped-speaking', ({ peerId, roomId }) => {
      socket.to(roomId).emit('user-stopped-speaking', peerId);
    });

    socket.on('toggle-mute', ({ peerId, roomId, isMuted }) => {
      socket.to(roomId).emit('user-toggled-audio', peerId, isMuted);
    });

    socket.on('toggle-video', ({ peerId, roomId, videoOff }) => {
      socket.to(roomId).emit('user-toggled-video', peerId, videoOff);
    });

    socket.on('whiteboard-joins', async ({ roomId }) => {
      if (!roomId) {
        console.error('No roomId provided');
        return socket.emit('error', { message: 'Room ID is required' });
      }

      if (!socket.roomId || socket.roomId !== roomId) {
        console.error(`Socket ${socket.id} not in room ${roomId}`);
        return socket.emit('error', {
          message: 'You must join the room first',
        });
      }

      const initialData = await whiteBoardRepo.getWhiteboard(roomId);
      if (initialData) {
        socket.emit('canvas-data', { canvasData: initialData });
      }
    });

    socket.on('canvas-data', ({ roomId, slideIndex, canvasData }) => {
      if (!roomId) {
        console.error('No roomId provided in canvas-data');
        return socket.emit('error', { message: 'Room ID is required' });
      }

      const data = { slideIndex: slideIndex || 0, canvasData: canvasData };
      console.log(`Saving data for room ${roomId}, slide ${slideIndex}`);
      whiteBoardRepo
        .saveWhiteboard(roomId, data)
        .then(() => {
          console.log(`Saved data for room ${roomId}`);
          socket.to(roomId).emit('canvas-data', data);
        })
        .catch(err => {
          console.error('Error saving whiteboard:', err);
          socket.emit('error', { message: 'Failed to save whiteboard data' });
        });
    });
    socket.on('new-slide', ({ roomId, id, content }) => {
      if (!roomId) {
        console.error('No roomId provided in canvas-data');
        return socket.emit('error', { message: 'Room ID is required' });
      }
      const data = { id: id, content: content };
      socket.to(roomId).emit('new-slide', data);
    });

    socket.on('board-locked', ({ roomId, lockedBy }) => {
      console.log('board locking', roomId, lockedBy);
      socket.to(roomId).emit('board-locked', lockedBy);
    });

    socket.on('board-unlocked', ({ roomId }) => {
      socket.to(roomId).emit('board-unlocked');
    });
    // socket.on('slide-change',({roomId , slideIndex , initiator} )=>{
    //   if (!roomId) {
    //     console.error('No roomId provided in canvas-data');
    //     return socket.emit('error', { message: 'Room ID is required' });
    //   }
    //   const data = { slideIndex: slideIndex ,initiator: initiator };
    //   socket.to(roomId).emit('slide-change' , data )
    // })

    socket.on('send-message', message => {
      socket.to(socket.roomId as string).emit('message', message);
    });

    socket.on('delete-message' , ({id})=>{
      socket.to(socket.roomId as string).emit('delete-message' ,id) 
    })

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);

      // Remove from room tracking
      if (socket.roomId && rooms[socket.roomId]) {
        console.log('before delting');
        console.log(rooms[socket.roomId]);
        rooms[socket.roomId] = rooms[socket.roomId].filter(usr => {
          return usr.userId != socket.id;
        });
        console.log('After deleting');
        console.log(rooms[socket.roomId]);
        console.log(`User with socket ${socket.id} left room ${socket.roomId}`);

        socket.to(socket.roomId).emit('user-disconnected', socket.id);

        console.log(
          `Room ${socket.roomId} now has ${rooms[socket.roomId]?.length} users`
        );

        if (rooms[socket.roomId]?.length === 0) {
          delete rooms[socket.roomId];
          console.log(`Room ${socket.roomId} was deleted (empty)`);
        }
      }
    });
  });
}
