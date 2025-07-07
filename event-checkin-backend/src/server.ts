import express from "express";
import http from "http";
import { ApolloServer } from "apollo-server-express";
import cors from "cors";
import { typeDefs } from "./schema/typeDefs";
import { resolvers } from "./resolvers";
import { createContext } from "./context";
import { Server } from "socket.io";
import { setupSocket } from "./socket";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 4000;

const start = async () => {
  const app = express();
  app.use(cors());

  const httpServer = http.createServer(app);
  const io = new Server(httpServer, {
    cors: { origin: "*" },
  });

  setupSocket(io);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => createContext(req as any, io),
  });

  await server.start();
  server.applyMiddleware({ app, path: "/graphql" });

  httpServer.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
  });
};

start();
