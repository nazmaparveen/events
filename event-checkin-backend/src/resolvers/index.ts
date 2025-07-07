import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export const resolvers = {
  Query: {
    events: () => prisma.event.findMany({ include: { attendees: true } }),
    me: async (_: any, __: any, context: any) =>
      context.userId
        ? prisma.user.findUnique({ where: { id: context.userId } })
        : null,
  },

  Mutation: {
   login: async (_: unknown, { email, password }: { email: string; password: string }, context: any) => {
  let user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      name: true,
      password: true,
    },
  });

  if (!user) {
    const hashedPassword = await bcrypt.hash(password, 10);
    user = await prisma.user.create({
      data: {
        email,
        name: email.split("@")[0],
        password: hashedPassword,
      },
    });
  } else {
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new Error("Invalid email or password");
    }
  }

  return context.createToken(user);
},


    joinEvent: async (_: any, { eventId }: any, context: any) => {
      if (!context.userId) throw new Error("Unauthorized");
      const user = await prisma.user.findUnique({
        where: { id: context.userId },
      });
      const event = await prisma.event.update({
        where: { id: eventId },
        data: { attendees: { connect: { id: user?.id } } },
        include: { attendees: true },
      });
      context.io.to(eventId).emit("eventUpdate", event);
      return event;
    },
  },
};

// ✅ This should be the last line of your file
export default resolvers;
