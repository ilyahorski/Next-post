import { NextResponse } from 'next/server';
import { connectToDB } from '~/utils/database';
import Subscription from '~/models/subscription';

export async function POST(request) {
  const { subscription, userId } = await request.json();

  try {
    await connectToDB();
    
    if (!userId) {
      console.log('User ID is required');
      return NextResponse.json({ success: false, error: 'User ID is required' });
    }

    await Subscription.deleteMany({ userId });

    const existingSubscription = await Subscription.findOne({ 
      userId, 
      endpoint: subscription.endpoint 
    });

    if (existingSubscription) {
      existingSubscription.keys = subscription.keys;
      await existingSubscription.save();
    } else {
      const newSubscription = new Subscription({
        userId,
        endpoint: subscription.endpoint,
        keys: subscription.keys
      });
      await newSubscription.save();
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving subscription:', error);
    return NextResponse.json({ success: false, error: error.message });
  }
}

export async function DELETE(request) {
  const { userId, endpoint } = await request.json();

  try {
    await connectToDB();
    
    if (!userId || !endpoint) {
      console.log('User ID and endpoint are required');
      return NextResponse.json({ success: false, error: 'User ID and endpoint are required' });
    }

    await Subscription.deleteOne({ userId, endpoint });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting subscription:', error);
    return NextResponse.json({ success: false, error: error.message });
  }
}