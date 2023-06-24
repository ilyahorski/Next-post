import Post from '@/models/post';
import { connectToDB } from '@/utils/database';

export const GET = async (request) => {

  const id = request.query.id[0];
  const page = Number(request.query.page) || 1;
  const limit = Number(request.query.limit) || 4;

  try {
    await connectToDB();

    let posts;

    if (id) {
      posts = await Post.findById(id).populate('creator');
    } else {
      posts = await Post.find({})
        .sort({createdAt: -1})
        .skip((page - 1))
        .limit(limit)
        .populate('creator');
    }

    if (!posts) return new Response('Post Not Found', { status: 404 });
    return new Response(JSON.stringify(posts), { status: 200 });
  } catch (error) {
    console.log(error)
    return new Response('Failed to fetch all posts', { status: 500 });
  }
};

export const PATCH = async (request, { params }) => {
  const { post, tag, image } = await request.json();

  try {
    await connectToDB();

    // Find the existing post by ID
    const existingPost = await Post.findById(params.id);

    if (!existingPost) {
      return new Response('Post not found', { status: 404 });
    }

    // Update the post with new data
    existingPost.post = post;
    existingPost.tag = tag;
    existingPost.image = image;

    await existingPost.save();

    return new Response('Successfully updated the Posts', { status: 200 });
  } catch (error) {
    return new Response('Error Updating Post', { status: 500 });
  }
};

export const DELETE = async (request, { params }) => {
  try {
    await connectToDB();

    // Find the post by ID and remove it
    await Post.findByIdAndRemove(params.id);

    return new Response('Post deleted successfully', { status: 200 });
  } catch (error) {
    return new Response('Error deleting post', { status: 500 });
  }
};
