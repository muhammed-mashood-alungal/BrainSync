import { Server, Socket } from "socket.io";
import { WhiteboardRepository } from "../repositories/implementation/whiteboard.repository";

interface CustomSocket extends Socket {
  roomId?: string;
  userId?: string;
  email?: string
}


interface Rooms {
  [roomId: string]: Set<string>;
}

const whiteBoardRepo = new WhiteboardRepository()


export default function setupSocket(io: Server) {
  const rooms: Rooms = {};

  io.on('connection', (socket: CustomSocket) => {

    socket.on("join-room", (roomId: string, userId: string) => {
      if (!roomId || !userId) {
        console.error("Invalid roomId or userId:", roomId, userId)
        return
      }


      socket.roomId = roomId
      socket.userId = userId

      // Initialize room if needed
      if (!rooms[roomId]) {
        rooms[roomId] = new Set<string>()
      }

     
      rooms[roomId].add(socket.id);

      console.log(`User with socket ${socket.id} joining room ${roomId}`)
      console.log(`Room ${roomId} now has ${rooms[roomId].size} users`)

      socket.join(roomId);

      // Get all other users in the room
      const otherUsers: string[] = [...rooms[roomId]].filter(id => id !== socket.id)

      
      socket.emit("all-users", otherUsers)

      
      socket.to(roomId).emit("user-joined", socket.id)
    });

    // Handle signaling for WebRTC with simple-peer
    socket.on("signal", ({ to, from, signal }: {
      to: string;
      from: string;
      signal: any
    }) => {
      io.to(to).emit("signal", { from, signal })
    })

    socket.on('user-speaking', ({ peerId, roomId }) => {
      socket.to(roomId).emit('user-speaking', peerId);
    })

    socket.on('user-stopped-speaking', ({ peerId, roomId }) => {
      socket.to(roomId).emit('user-stopped-speaking', peerId);
    })

    socket.on('toggle-mute', ({ peerId, roomId, isMuted }) => {
      socket.to(roomId).emit('user-toggled-audio', peerId, isMuted)
    })

    socket.on('toggle-video', ({ peerId, roomId, videoOff }) => {
      socket.to(roomId).emit('user-toggled-video', peerId, videoOff)
    })

    socket.on('whiteboard-joins', async ({ roomId }) => {
      if (!roomId) {
        console.error('No roomId provided')
        return socket.emit('error', { message: 'Room ID is required' })
      }

      if (!socket.roomId || socket.roomId !== roomId) {
        console.error(`Socket ${socket.id} not in room ${roomId}`)
        return socket.emit('error', { message: 'You must join the room first' })
      }

      const initialData = await whiteBoardRepo.getWhiteboard(roomId)
      if (initialData) {
        socket.emit('canvas-data', { canvasData: initialData })
      }
    })

    socket.on('canvas-data', ({ roomId, slideIndex, canvasData }) => {
      if (!roomId) {
        console.error('No roomId provided in canvas-data');
        return socket.emit('error', { message: 'Room ID is required' })
      }

      const data = { slideIndex: slideIndex || 0, canvasData: canvasData }
      console.log(`Saving data for room ${roomId}, slide ${slideIndex}`)
      whiteBoardRepo.saveWhiteboard(roomId, data)
        .then(() => {
          console.log(`Saved data for room ${roomId}`)
          socket.to(roomId).emit('canvas-data', data)
        })
        .catch(err => {
          console.error('Error saving whiteboard:', err)
          socket.emit('error', { message: 'Failed to save whiteboard data' })
        })
    });
    socket.on('new-slide',({roomId , id , content})=>{
      if (!roomId) {
        console.error('No roomId provided in canvas-data')
        return socket.emit('error', { message: 'Room ID is required' })
      }
      const data = { id: id ,content: content };
      socket.to(roomId).emit('new-slide' , data )
    })
    // socket.on('slide-change',({roomId , slideIndex , initiator} )=>{
    //   if (!roomId) {
    //     console.error('No roomId provided in canvas-data');
    //     return socket.emit('error', { message: 'Room ID is required' });
    //   }
    //   const data = { slideIndex: slideIndex ,initiator: initiator };
    //   socket.to(roomId).emit('slide-change' , data )
    // })


    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id)

      // Remove from room tracking
      if (socket.roomId && rooms[socket.roomId]) {
        rooms[socket.roomId].delete(socket.id)
        console.log(`User with socket ${socket.id} left room ${socket.roomId}`)


        socket.to(socket.roomId).emit('user-disconnected', socket.id)

        console.log(`Room ${socket.roomId} now has ${rooms[socket.roomId].size} users`)

        if (rooms[socket.roomId].size === 0) {
          delete rooms[socket.roomId]
          console.log(`Room ${socket.roomId} was deleted (empty)`)
        }
      }

    })
  })
}