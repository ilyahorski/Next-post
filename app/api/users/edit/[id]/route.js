import User from '~/models/user';
import Post from '~/models/post';
import Like from '~/models/like';
import Comment from '~/models/comment';
import { connectToDB } from '~/utils/database';

export const GET = async (request, { params }) => {
  try {
    await connectToDB();

    const userInfo = await User.findById(params.id);

    return new Response(JSON.stringify(userInfo), { status: 200 });
  } catch (error) {
    return new Response('Failed to fetch user info', { status: 500 });
  }
};

export const PATCH = async (request, { params }) => {
  const { username, userImage, image } = await request.json();

  try {
    await connectToDB();

    const userData = await User.findById(params.id);

    if (!userData) {
      return new Response('Data not found', { status: 404 });
    }

    // Update the post with new data
    userData.username = username;
    userData.userImage = userImage;
    userData.image = image;

    await userData.save();

    return new Response('Successfully updated', { status: 200 });
  } catch (error) {
    return new Response('Error Updating User', { status: 500 });
  }
};

export const DELETE = async (request, { params }) => {
  try {
    await connectToDB();

    // Check if the user exists
    const user = await User.findById(params.id);
    if (!user) {
      return new Response('User not found', { status: 404 });
    }
    // Delete all likes made by the user
    await Like.deleteMany({ user: params.id });

    // Delete all comments created by the user
    await Comment.deleteMany({ commentatorId: params.id });

    // Delete all posts created by the user
    await Post.deleteMany({ creator: params.id });

    // Finally delete the user
    await User.findByIdAndRemove(params.id);

    return new Response('User deleted successfully', { status: 200 });
  } catch (error) {
    return new Response('Error deleting user', { status: 500 });
  }
};

