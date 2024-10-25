export const GET = async (request, { params }) => {
  try {
    await connectToDB();

    const allUser = await User.find({});
    console.log('allUser', allUser);

    if (!allUser) return new Response('Users Not Found', { status: 404 });

    return new Response(JSON.stringify(allUser), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
  } catch (error) {
    return new Response('Failed to fetch users', { status: 500 });
  }
};

