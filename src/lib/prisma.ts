//old

// // lib/db.ts
// import { Prisma } from "@prisma/client";
// import { PrismaClient } from "@prisma/client";
// // A note on global
// // you can add ANY properties you want to global!
// // It's like a big shared object that you can add stuff to:

// // global is a built-in Node object that exists across the entire application and reloads
// // we create a typescript type reference for the global object
// // TypeScript's type definition for the global object doesn't include our prisma property by default,
// // so we need to tell TypeScript "trust us, this will exist".
// const globalForPrisma = globalThis as unknown as {
//   prisma: PrismaClient | undefined;
// };
// // start with the global object, and make a new variable that points to it
// // with particular type information
// // step 1: remove all type information with unknown
// // step 2: Add new type 'as { prisma: PrismaClient | undefined }'
// // This means the global object has a key CALLED 'prisma' that contains a PrismaClient

// // the first time this file runs, globalForPrisma is null,
// // so a new PrismaClient will be created and assigned to prisma;
// // the next time it runs, it will find the existing global object and utilise that
// const prisma =
//   globalForPrisma.prisma ??
//   new PrismaClient({
//     log:
//       process.env.NODE_ENV === "development"
//         ? ["query", "error", "warn"] // Log everything in development
//         : ["error"], // Only log errors in production
//   });
// // this is the same as global.prisma
// // go into the object globalForPrisma, and look for the prisma key
// // assign the value of the key (i.e. the PrismaClient) as a variable prisma OR
// // assign a new PrismaClient to the variable prisma

// // we assign the prisma client to the global object above
// // no hot reloading in prod, so we dont have to worry about it
// if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// // Optional: Handle cleanup on app termination
// process.on("beforeExit", async () => {
//   await prisma.$disconnect();
// });

// export { prisma };

//new
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

// Learn more about instantiating PrismaClient in Next.js here: https://www.prisma.io/docs/data-platform/accelerate/getting-started

const prismaClientSingleton = () => {
  return new PrismaClient().$extends(withAccelerate());
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
