import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import { MongoClient } from "mongodb";
import { validateEnvironment } from "./env-validation";

// Google profile type
interface GoogleProfile {
  email: string;
  email_verified: boolean;
  name: string;
  picture: string;
}

// Validate environment variables
if (process.env.NODE_ENV === "production") {
  validateEnvironment();
}

const client = new MongoClient(process.env.MONGODB_URI!);
const clientPromise = client.connect();

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile",
        },
      },
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user?.email) {
        session.user.id = user.id;
        session.user.isAdmin = session.user.email === process.env.ADMIN_EMAIL;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Handle production domain redirects
      const prodUrl = process.env.NEXTAUTH_URL || baseUrl;

      // If url is relative, use the base URL (production or localhost)
      if (url.startsWith("/")) {
        return `${prodUrl}${url}`;
      }

      // If url has same origin as base URL, allow it
      try {
        if (new URL(url).origin === new URL(prodUrl).origin) {
          return url;
        }
      } catch (error) {
        console.error("Invalid URL in redirect:", error);
      }

      return prodUrl;
    },
    async signIn({ account, profile }) {
      // Additional validation for Google sign-in
      if (account?.provider === "google") {
        const googleProfile = profile as GoogleProfile;
        return !!(googleProfile?.email && googleProfile.email_verified);
      }
      return true;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/signin", // Redirect to signin page on error
  },
  session: {
    strategy: "database",
  },
  debug: process.env.NODE_ENV === "development",
};
