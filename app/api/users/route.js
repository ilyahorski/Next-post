import User from '~/models/user';
import { connectToDB } from '~/utils/database';

export const GET = async (request, { params }) => {
  const { searchParams } = new URL(request.url)
  // const page = searchParams.get('page') || 1
  // const limit =  50

  try {
    await connectToDB();

    const allUser = await User.find({});

    if (!allUser) return new Response('Users Not Found', { status: 404 });

    return new Response(JSON.stringify(allUser), { status: 200 });
  } catch (error) {
    return new Response('Failed to fetch users', { status: 500 });
  }
};
