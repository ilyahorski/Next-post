import {connectToDB} from "~/utils/database";
import Chat from "~/models/chat";

export const GET = async (request, { params }) => {
  try {
    await connectToDB();

    const userId = request.headers.get('userId');

    const chats = await Chat.find({ "membersList": userId })
      .populate('creatorId')
      .populate('membersList')

    if (!chats) return new Response('Chats Not Found', { status: 404 });

    return new Response(JSON.stringify(chats), { status: 200 });

  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
};

export const POST = async (request, { params }) => {
  const { creatorId, membersList, chatName, lastMessage, secretToken } = await request.json();

  try {
    await connectToDB();

    const newChat = await Chat.create({
      creatorId,
      membersList,
      chatName,
      lastMessage,
      secretToken,
    });

    return new Response(JSON.stringify(newChat), { status: 201 });
  } catch (error) {
    return new Response('Error Creating Chat', { status: 500 });
  }
};