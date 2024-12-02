import NextAuth from "next-auth";
import GitHub, { GithubProfile } from "next-auth/providers/github";
import { client } from "./sanity/lib/client";
import { AUTHOR_BY_GITHUB_ID_QUERY } from "./sanity/lib/queries";
import { writeClient } from "./sanity/lib/write-client";
import { JWT } from "next-auth/jwt";
import type { Session } from "next-auth";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub],
  callbacks: {
    async signIn({
      user: { name, email, image },
      profile: { id, login, bio },
    }: {
      user: { name: string | null, email: string | null, image: string | null },
      profile: { id: number, login: string, bio?: string | null }
    }) {
      const existingUser = await client
        .fetch(AUTHOR_BY_GITHUB_ID_QUERY, {
          id,
        });

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
    async session({ session, token }: { session: Session; token: JWT }) {
      return {
        ...session,
        id: token.sub,
      };
    },
    async jwt({ token, profile }: { token: JWT; profile: GithubProfile }) {
      if (profile) {
        token.id = profile.id;
      }
      return token;
    },
  },
});
