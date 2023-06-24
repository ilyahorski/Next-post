import Post from '@/models/post';
import { connectToDB } from '@/utils/database';

export const GET = async (request) => {
  const { searchParams } = new URL(request.url)
  const page = searchParams.get('page') || 1
  const limit = searchParams.get('limit') || 4
  try {
    await connectToDB();

    const posts = await Post.find({})
      .sort({createdAt: -1})
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('creator');

    return new Response(JSON.stringify(posts), { status: 200 });
  } catch (error) {
    return new Response('Failed to fetch all posts', { status: 500 });
  }
};