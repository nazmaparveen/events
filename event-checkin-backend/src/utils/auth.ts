import jwt from "jsonwebtoken";

const SECRET = "mock-secret"; // change later

export const createToken = (user: any) => jwt.sign({ userId: user.id }, SECRET);
export const verifyToken = (token: string) => jwt.verify(token, SECRET);
