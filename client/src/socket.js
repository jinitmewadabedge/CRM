import { io } from "socket.io-client"
import.meta.env.VITE_BACKEND_URL

export const socket = io("http://localhost:5000", {
    transports: ["websocket"],
    reconnection: true,
    reconnectionAttempts: 10
});

window.socket = socket;