import { Server } from "socket.io";

let io;
const connectedUsers = {};

const initializeSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: ["https://log2.axleshift.com", "https://backend-log2.axleshift.com"],
            methods: ["GET", "POST"],
            credentials: true,
        },
    });

    io.on("connection", (socket) => {
        console.log("A user connected:", socket.id);

        // Register user
        socket.on("registerUser", (userId) => {
            connectedUsers[userId] = socket.id;
            console.log("User registered:", userId, "Socket ID:", socket.id);
        });

        // Handle disconnect
        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
            for (const [userId, socketId] of Object.entries(connectedUsers)) {
                if (socketId === socket.id) {
                    delete connectedUsers[userId];
                }
            }
        });
    });

    return io;
};

const getIo = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};

export { initializeSocket, getIo, connectedUsers };
