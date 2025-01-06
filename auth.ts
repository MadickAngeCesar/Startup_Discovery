/*import NextAuth, { NextAuthOptions } from "next-auth"

import GithubProvider from "next-auth/providers/github"
import { client } from "./sanity/lib/client"
import { AUTHOR_BY_GITHUB_ID_QUERY } from "./sanity/lib/queries"
import { writeClient } from "./sanity/lib/write-client"

interface GitHubProfile {
  id: string
  login: string
  bio?: string | null
}

interface SessionUser {
  name?: string | null
  email?: string | null
  image?: string | null
}

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID ?? "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    async signIn({ 
      user, 
      profile 
    }: { 
      user: SessionUser
      profile?: GitHubProfile 
    }) {
      if (!user?.name || !profile?.id) return false

      const existingUser = await client.fetch(AUTHOR_BY_GITHUB_ID_QUERY, {
        id: profile.id,
      })

      if (!existingUser) {
        await writeClient.create({
          _type: "author",
          id: profile.id,
          name: user.name,
          username: profile.login,
          email: user.email || "",
          image: user.image || "",
          bio: profile.bio || "",
        })
      }

      return true
    },
    async jwt({ 
      token, 
      account, 
      profile 
    }: { 
      token: any
      account: any
      profile?: GitHubProfile 
    }) {
      if (account && profile) {
        const user = await client.fetch(AUTHOR_BY_GITHUB_ID_QUERY, {
          id: profile.id,
        })

        token.id = user?._id
      }
      return token
    },
    async session({ 
      session, 
      token 
    }: { 
      session: any
      token: any 
    }) {
      return {
        ...session,
        id: token.id,
      }
    },
  },
}

export const getAuthSession = () => getServerSession(authOptions)
export const handler = NextAuth(authOptions)*/

import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { getServerSession } from "next-auth/next";
import { signIn as authSignIn, signOut as authSignOut } from "next-auth/react";
import { AUTHOR_BY_GITHUB_ID_QUERY } from "@/sanity/lib/queries";
import { client } from "@/sanity/lib/client";
import { writeClient } from "@/sanity/lib/write-client";

const options = {
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, profile }) {
      const { id, login, bio } = profile;
      const { name, email, image } = user;

      const existingUser = await client
        .withConfig({ useCdn: false })
        .fetch(AUTHOR_BY_GITHUB_ID_QUERY, { id });

      if (!existingUser) {
        await writeClient.create({
          _type: "author",
          id,
          name,
          username: login,
          email,
          image,
          bio: bio || "",
        });
      }

      return true;
    },
    async jwt({ token, account, profile }) {
      if (account && profile) {
        const user = await client
          .withConfig({ useCdn: false })
          .fetch(AUTHOR_BY_GITHUB_ID_QUERY, { id: profile?.id });

        token.id = user?._id;
      }
      return token;
    },
    async session({ session, token }) {
      session.id = token.id;
      return session;
    },
  },
};

const authHandler = NextAuth(options);

// Export handlers for API route
export { authHandler as GET, authHandler as POST };

// Export `auth`, `signIn`, and `signOut` utilities for client usage
export const auth = async () => await getServerSession(options);
export const signIn = authSignIn;
export const signOut = authSignOut;
