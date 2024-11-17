export const createNewConversation = async () => {
  const response = await fetch("/api/create-new-conversation", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
  });

  const conversation = await response.json();
  console.log(conversation);
  return conversation;
};