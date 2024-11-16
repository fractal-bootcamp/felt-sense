import { NextResponse } from "next/server";
import { prisma } from "../../../lib/db/prisma";
import { getSession } from "@workos-inc/authkit-nextjs";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    const userId = session?.user?.id;
    if (!userId) {
      console.error("No user ID found in session");
      return new NextResponse("Unauthorized", { status: 401 });
    }
    console.log("Creating new conversation for user:", userId);
    const conversation = await prisma.conversation.create({
      data: {
        userId: userId,
      },
    });
    console.log("New conversation created:", conversation);

    return NextResponse.json(conversation);
  } catch (error) {
    console.error("Error creating conversation:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
