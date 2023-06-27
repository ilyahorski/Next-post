import Like from '~/models/like';
import { connectToDB } from '~/utils/database';

export const GET = async (request, { params }) => {
  const { userId, postId } = params;

  try {
    await connectToDB();

    // Проверка на существующий "лайк"
    const existingLike = await Like.findOne({ user: userId, post: postId });

    if (existingLike) {
      // Если "лайк" уже существует
      return new Response('Like exists', { status: 200 });
    }

    // Если "лайка" нет
    return new Response('Like does not exist', { status: 200 });

  } catch (error) {
    return new Response('Failed to check like', { status: 500 });
  }
};


export const POST = async (request) => {
  const { userId, postId } = await request.json();

  try {
    await connectToDB();

    // Проверка на существующий "лайк"
    const existingLike = await Like.findOne({ user: userId, post: postId });
    if (existingLike) {
      // Если "лайк" уже существует, удалить его
      await Like.findByIdAndRemove(existingLike._id);
      return new Response('Like removed', { status: 200 });
    }

    // Если "лайка" нет, создать его
    const newLike = new Like({ user: userId, post: postId });
    await newLike.save();

    return new Response(JSON.stringify(newLike), { status: 201 });
  } catch (error) {
    return new Response('Failed to toggle like', { status: 500 });
  }
};
