import { io } from "socket.io-client";

// initializing the socket connection
let socket = io("http://localhost:9000");

export default socket;
