import Like from '@/models/like';
import { connectToDB } from '@/utils/database';

export const GET = async (request, { params }) => {
  try {
    await connectToDB();

    const likesCount = await Like.countDocuments({ post: params.postId });

    return new Response(JSON.stringify({ likesCount }), { status: 200 });
  } catch (error) {
    return new Response('Failed to fetch likes count', { status: 500 });
  }
};