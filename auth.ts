import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { client } from "./sanity/lib/client";
import { writeClient } from "./sanity/lib/write-client";
import { AUTHOR_BY_GITHUB_ID_QUERY } from "./sanity/lib/queries";
import type { Session } from "next-auth";
import type { JWT } from "next-auth/jwt";

interface CustomUser {
  id: number;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface CustomProfile {
  id: number;
  login: string;
  bio?: string | null;
}

if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
  throw new Error("Missing GitHub OAuth environment variables.");
}

const options = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({
      user,
      profile,
    }: {
      user: CustomUser;
      profile?: CustomProfile;
    }) {
      if (!profile || !user) return false;

      const existingUser = await client.fetch(AUTHOR_BY_GITHUB_ID_QUERY, { id: profile.id });
      if (!existingUser) {
        await writeClient.createOrReplace({
          _type: "author",
          _id: `author.${profile.id}`,
          id: profile.id,
          name: user.name || "Anonymous",
          username: profile.login,
          email: user.email || "",
          image: user.image || "",
          bio: profile.bio || "",
        });
      }

      return true;
    },
    async session({
      session,
      token,
    }: {
      session: Session;
      token: JWT;
    }) {
      if (token?.sub) {
        return {
          ...session,
          id: token.sub,
        };
      }
      return session;
    },
    async jwt({
      token,
      profile,
    }: {
      token: JWT;
      profile?: CustomProfile;
    }) {
      if (profile?.id) {
        token.id = profile.id;
      }
      return token;
    },
  },
};

export default NextAuth(options);
