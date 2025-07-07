import { io } from "socket.io-client";
import { SOCKET_IO_URL } from "../constants";

export const socket = io(SOCKET_IO_URL, {
  auth: {
    token: "mock-user-token",
  },
});
