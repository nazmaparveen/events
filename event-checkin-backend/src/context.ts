import { Request } from "express";
import { verifyToken, createToken } from "./utils/auth";
import { Server } from "socket.io";

export const createContext = (req: Request, io: Server) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  let userId = null;
  try {
    if (token) {
      const decoded = verifyToken(token) as any;
      userId = decoded.userId;
    }
  } catch {}
  return { userId, createToken, io };
};
