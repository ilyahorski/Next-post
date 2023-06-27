import User from '~/models/user';
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