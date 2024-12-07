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
    console.error('Failed to fetch user info:', error);
    return new Response(JSON.stringify({ message: 'Failed to fetch user info', error: error.message }), { status: 500 });
  }
};

export const PATCH = async (request, { params }) => {
  const { username, userImage, image } = await request.json();

  try {
    await connectToDB();

    const userData = await User.findById(params.id);

    if (!userData) {
      return new Response(JSON.stringify({ message: 'Data not found' }), { status: 404 });
    }

    userData.username = username || userData.username;
    userData.userImage = userImage || userData.userImage;
    userData.image = image || userData.image;
    userData.status = "offline" || userData.status;
    userData.blockedUsers = userData.blockedUsers;

    await userData.save();

    return new Response(JSON.stringify({ message: 'Successfully updated' }), { status: 200 });
  } catch (error) {
    console.error('Error Updating User:', error);
    return new Response(JSON.stringify({ message: 'Error Updating User', error: error.message }), { status: 500 });
  }
};

export const DELETE = async (request, { params }) => {
  try {
    await connectToDB();

    // Check if the user exists
    const user = await User.findById(params.id);
    if (!user) {
      return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
    }
    // Delete all likes made by the user
    await Like.deleteMany({ user: params.id });

    // Delete all comments created by the user
    await Comment.deleteMany({ commentatorId: params.id });

    // Delete all posts created by the user
    await Post.deleteMany({ creator: params.id });

    // Finally delete the user
    await User.findByIdAndRemove(params.id);

    return new Response(JSON.stringify({ message: 'User deleted successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error deleting user:', error);
    return new Response(JSON.stringify({ message: 'Error deleting user', error: error.message }), { status: 500 });
  }
};
