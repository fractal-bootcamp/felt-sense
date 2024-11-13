// // lib/db/queries.ts
// import prisma from "../prisma";
// import { User, Conversation, Message, UsageMetrics } from "@prisma/client";

// // Example usage
// // await userQueries.getUserWithLatestConversation('clerk_123')
// // await userQueries.createUser('clerk_123', 'test@example.com')
// // await conversationQueries.createConversation(
// //   userId,
// //   `{message}`
// // )

// // Types for return values including relations
// // type UserWithConversation = User & {
// //   conversations: (Conversation & {
// //     messages: Message[]
// //   })[]
// // }

// type ConversationWithMessages = Conversation & {
//   messages: Message[];
// };

// // User Queries
// export const userQueries = {
//   createUser: async function (clerkUserId: string): Promise<User> {
//     return await prisma.user.create({
//       data: {
//         clerkUserId,
//       },
//     });
//   },
//   getUserByUserId: async function (clerkUserId: string): Promise<User | null> {
//     return await prisma.user.findUnique({ where: { clerkUserId } });
//   },

//   // getUserWithLatestConversation: async function(clerkUserId: string): Promise<UserWithConversation | null> {
//   //   return await prisma.user.findUnique({
//   //     where: { clerkUserId },
//   //     include: {
//   //       conversations: {
//   //         orderBy: { createdAt: 'desc' },
//   //         take: 1,
//   //         include: {
//   //           messages: {
//   //             orderBy: { createdAt: 'desc' },
//   //             take: 1,
//   //           },
//   //         },
//   //       },
//   //     },
//   //   })
//   // },
// };

// // Conversation Queries
// export const conversationQueries = {
//   getConversation: async function (
//     conversationId: string
//   ): Promise<ConversationWithMessages | null> {
//     return await prisma.conversation.findUnique({
//       where: { id: conversationId },
//       include: {
//         messages: {
//           orderBy: { createdAt: "asc" },
//         },
//       },
//     });
//   },

//   createConversation: async function (
//     userId: string,
//     initialMessage: string
//   ): Promise<ConversationWithMessages> {
//     return await prisma.conversation.create({
//       data: {
//         userId,
//         messages: {
//           create: {
//             content: initialMessage,
//             role: "USER",
//           },
//         },
//       },
//       include: {
//         messages: true,
//       },
//     });
//   },
// };

// // Message Queries
// export const messageQueries = {
//   addMessage: async function (
//     conversationId: string,
//     content: string,
//     role: "USER" | "ASSISTANT",
//     sentiment?: string,
//     emotions?: string[]
//   ): Promise<Message> {
//     const [message] = await prisma.$transaction([
//       prisma.message.create({
//         data: {
//           conversationId,
//           content,
//           role,
//           sentiment,
//           emotions,
//         },
//       }),
//       prisma.conversation.update({
//         where: { id: conversationId },
//         data: { updatedAt: new Date() },
//       }),
//     ]);

//     return message;
//   },

//   getLatestMessages: async function (
//     conversationId: string,
//     take: number = 10
//   ): Promise<Message[]> {
//     return await prisma.message.findMany({
//       where: { conversationId },
//       orderBy: { createdAt: "desc" },
//       take,
//     });
//   },
// };

// // Analytics Queries
// export const analyticsQueries = {
//   trackMessage: async function (userId: string): Promise<UsageMetrics> {
//     const startOfMonth = new Date();
//     startOfMonth.setDate(1);
//     startOfMonth.setHours(0, 0, 0, 0);

//     return await prisma.usageMetrics.upsert({
//       where: {
//         userId_month: {
//           userId,
//           month: startOfMonth,
//         },
//       },
//       create: {
//         userId,
//         month: startOfMonth,
//         messageCount: 1,
//       },
//       update: {
//         messageCount: { increment: 1 },
//       },
//     });
//   },
// };

// // Search/Filter Queries
// export const searchQueries = {
//   searchConversations: async function (
//     userId: string,
//     searchTerm: string
//   ): Promise<ConversationWithMessages[]> {
//     return await prisma.conversation.findMany({
//       where: {
//         userId,
//         OR: [
//           {
//             messages: {
//               some: {
//                 content: {
//                   contains: searchTerm,
//                   mode: "insensitive",
//                 },
//               },
//             },
//           },
//           {
//             title: {
//               contains: searchTerm,
//               mode: "insensitive",
//             },
//           },
//         ],
//       },
//       include: {
//         messages: {
//           where: {
//             content: {
//               contains: searchTerm,
//               mode: "insensitive",
//             },
//           },
//           orderBy: { createdAt: "asc" },
//         },
//       },
//     });
//   },

//   getConversationsByEmotion: async function (
//     userId: string,
//     emotion: string
//   ): Promise<ConversationWithMessages[]> {
//     return await prisma.conversation.findMany({
//       where: {
//         userId,
//         messages: {
//           some: {
//             emotions: {
//               has: emotion,
//             },
//           },
//         },
//       },
//       include: {
//         messages: {
//           where: {
//             emotions: {
//               has: emotion,
//             },
//           },
//         },
//       },
//     });
//   },
// };
