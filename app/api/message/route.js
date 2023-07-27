import {connectToDB} from "~/utils/database";
import Message from "~/models/message";

export const GET = async (request, { params }) => {
  const { searchParams } = new URL(request.url)
  const page = searchParams.get('page') || 1
  const limit = searchParams.get('limit') || 20
  try {
    await connectToDB();

    const chatId = request.headers.get('chatId');
    const totalMessages = await Message.countDocuments({chatId});

    const usersMessages = await Message.find({ chatId })
      .sort({createdAt: -1})
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('writerId')
      .populate('chatId')
      .populate('deletedBy');

    if (!usersMessages) return new Response('Chats Not Found', { status: 404 });

    return new Response(JSON.stringify({ totalMessages, usersMessages }), { status: 200 });

  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
};