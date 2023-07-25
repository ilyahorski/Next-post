import {connectToDB} from "~/utils/database";
import Chat from "~/models/chat";

export const GET = async (request, { params }) => {
  try {
    await connectToDB();

    const chats = await Chat.find({})
      .populate('creatorId')
      .populate('membersList');

    if (!chats) return new Response('Chats Not Found', { status: 404 });

    return new Response(JSON.stringify(chats), { status: 200 });

  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
};