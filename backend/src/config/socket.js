import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    io.on("connection", (socket) => {
        console.log(`Socket connected: ${socket.id}`);

        // Join an RFQ room (Common for both Direct RFQ and standard RFQ)
        socket.on("join_rfq_room", (rfqId) => {
            socket.join(`rfq_${rfqId}`);
            console.log(`Socket ${socket.id} joined room: rfq_${rfqId}`);
        });

        // Leave an RFQ room
        socket.on("leave_rfq_room", (rfqId) => {
            socket.leave(`rfq_${rfqId}`);
            console.log(`Socket ${socket.id} left room: rfq_${rfqId}`);
        });

        socket.on("disconnect", () => {
            console.log(`Socket disconnected: ${socket.id}`);
        });
    });

    return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};
