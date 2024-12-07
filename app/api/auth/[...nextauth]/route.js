import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import User from '~/models/user';
import { connectToDB } from '~/utils/database';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session }) {
      try {
        await connectToDB();
        const sessionUser = await User.findOne({ email: session.user.email });
        if (sessionUser) {
          session.user.id = sessionUser._id.toString();
        } else {
          console.log(`User not found: ${session.user.email}`);
        }
      } catch (error) {
        console.log('Error getting session user: ', error.message);
      }
      return session;
    },
    async signIn({ account, profile, user, credentials }) {
      try {
        await connectToDB();
        const userExists = await User.findOne({ email: profile.email });
        if (!userExists) {
          await User.create({
            email: profile.email,
            username: profile.name,
            image: profile.picture,
            userImage: '',
          });
        }
        return true;
      } catch (error) {
        console.log('Error checking if user exists: ', error.message);
        return false;
      }
    },
  },
  // debug: process.env.NODE_ENV !== "production"  // Enable debug logs
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };