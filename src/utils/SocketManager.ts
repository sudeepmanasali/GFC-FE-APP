import { io } from "socket.io-client";

let socket = io("https://gfc-be-app.onrender.com");

export default socket;
