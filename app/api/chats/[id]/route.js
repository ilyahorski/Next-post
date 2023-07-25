import Chat from '~/models/chat';
import { connectToDB } from '~/utils/database';

export const GET = async (request, { params }) => {
  try {
    await connectToDB();

    const chat = await Chat.findById(params.id).populate('creatorId').populate('membersList');
    if (!chat) return new Response('Chat Not Found', { status: 404 });

    return new Response(JSON.stringify(chat), { status: 200 });

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

export const DELETE = async (request, { params }) => {
  try {
    await connectToDB();

    // Find the chat by ID and remove it
    await Chat.findByIdAndRemove(params.id);

    return new Response('Chat deleted successfully', { status: 200 });
  } catch (error) {
    return new Response('Error deleting chat', { status: 500 });
  }
};
