import { io } from "socket.io-client";

let socket = io("http://localhost:9000");

export default socket;
