import { io } from "socket.io-client";

// initializing the socket connection
let socket = io("https://gfc-be-app.onrender.com");

export default socket;
