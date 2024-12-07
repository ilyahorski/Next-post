import Chat from '~/models/chat';
import { connectToDB } from '~/utils/database';
import User from "~/models/user";
import {Schema} from "mongoose";
import Like from "~/models/like";
import Comment from "~/models/comment";
import Post from "~/models/post";
import Message from "~/models/message";

export const GET = async (request, { params }) => {
  try {
    await connectToDB();

    const chat = await Chat.findById(params.id)
      .populate('creatorId')
      .populate('membersList')
      .populate('lastMessage')

    if (!chat) return new Response('Chat Not Found', { status: 404 });

    return new Response(JSON.stringify(chat), { status: 200 });

  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
};

export const PATCH = async (request, { params }) => {
  try {
    await connectToDB();

    const { chatName, chatImage, lastMessage } = await request.json();

    const updatedChat = await Chat.findByIdAndUpdate(
      params.id,
      {
        ...(chatName !== undefined && { chatName }),
        ...(chatImage !== undefined && { chatImage }),
        ...(lastMessage !== undefined && { lastMessage }),
      },
      { new: true }
    );

    if (!updatedChat) {
      return new Response('Chat not found', { status: 404 });
    }

    return new Response(JSON.stringify(updatedChat), { status: 200 });
  } catch (error) {
    console.error('Error updating chat:', error);
    return new Response('Error updating chat', { status: 500 });
  }
};

export const DELETE = async (request, { params }) => {
  try {
    await connectToDB();

    // Find the chat by ID
    const chat = await Chat.findById(params.id);

    if (!chat) {
      return new Response('Chat not found', { status: 404 });
    }
    // Delete all messages made by the user
    await Message.deleteMany({ chatId: params.id });

    // Finally delete the user
    await Chat.findByIdAndRemove(params.id);



    return new Response('Chat deleted successfully', { status: 200 });
  } catch (error) {
    return new Response('Error deleting chat', { status: 500 });
  }
};
