import NextAuth from "next-auth";
import GitHub, { GitHubProfile } from "next-auth/providers/github";
import { client } from "./sanity/lib/client";
import { AUTHOR_BY_GITHUB_ID_QUERY } from "./sanity/lib/queries";
import { writeClient } from "./sanity/lib/write-client";
import { JWT } from "next-auth/jwt";
import type { Session } from "next-auth";

const options = {
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, profile }: { user: { name: string | null, email: string | null, image: string | null }, profile: { id: number, login: string, bio?: string | null } }) {
      const existingUser = await client.fetch(AUTHOR_BY_GITHUB_ID_QUERY, { id: profile.id });

      if (!existingUser) {
        await writeClient.create({
          _type: "author",
          id: profile.id,
          name: user.name,
          username: profile.login,
          email: user.email,
          image: user.image,
          bio: profile.bio || "",
        });
      }

      return true;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      return {
        ...session,
        id: token.sub,
      };
    },
    async jwt({ token, profile }: { token: JWT; profile: GitHubProfile }) {
      if (profile) {
        token.id = profile.id;
      }
      return token;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(options);