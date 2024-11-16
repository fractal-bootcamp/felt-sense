import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { conversationQueries, messageQueries } from "../../../lib/db/queries";
import { getSession } from "@workos-inc/authkit-nextjs";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});
console.log("anthropic api key", process.env.ANTHROPIC_API_KEY);
export async function POST(request: Request) {
  // TODO: Have this take a conversation ID, obtain the conversation history, and then pass it to the LLM
  // add new messsage to database
  console.log("anthropic api key", process.env.ANTHROPIC_API_KEY);

  try {
    const session = await getSession();
    const userId = session?.user?.id;
    if (!userId) {
      console.error("User ID not found");
      return NextResponse.json({ error: "User ID not found" }, { status: 401 });
    }
    const { conversationId } = await request.json();
    const conversation = await conversationQueries.getConversation(
      userId,
      conversationId
    );

    if (!conversation) {
      console.error("Conversation not found");
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }
    const messages = conversation.messages;
    const filteredMessages = messages.map((message) => ({
      role: message.role,
      content: message.content,
    }));
    if (!filteredMessages) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }
    const IFS_PROMPT = `
    You are a compassionate IFS coach. Guide the user through the IFS process. Navigate through the following steps sequentially:
    1. Check in with the user's parts. Give the user space to say what parts are alive. Do this until the user feels complete.
    2. Once the user feels complete, ask them what they would like to work on.
    3. Once the user has chosen a part to work on, invite them to make gentle contact with the part.
    4. Once the user feels complete, instruct the user to ask the part how it is trying to protect them.
    5. Once the part feels complete, instruct the user to ask the part what it needs to be safe.
    6.  Once the part feels complete, instruct the user to ask the part what appreciation would you like to express to this part?
    
    `;
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1000,
      system: IFS_PROMPT,
      messages: filteredMessages,
    });

    const newMessage = await messageQueries.addMessage(
      userId,
      conversationId,
      response.content[0].text,
      "assistant"
    );
    console.log("newMessage", newMessage);

    return NextResponse.json({
      response: response.content[0].text,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
