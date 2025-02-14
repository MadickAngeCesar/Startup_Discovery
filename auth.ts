import NextAuth, { getServerSession } from "next-auth";
import GitHub from "next-auth/providers/github";
import { client } from "@/sanity/lib/client";
import { writeClient } from "@/sanity/lib/write-client";
import { AUTHOR_BY_GITHUB_ID_QUERY } from "@/sanity/lib/queries";

const authOptions = {
  providers: [GitHub],
  callbacks: {
    async signIn({ user, profile }) {
      if (!profile?.id) return false;

      const existingUser = await client.fetch(AUTHOR_BY_GITHUB_ID_QUERY, {
        id: profile.id,
      });

      if (!existingUser) {
        await writeClient.create({
          _type: "author",
          id: profile.id,
          name: user.name || "",
          username: profile.login || "",
          email: user.email || "",
          image: user.image || "",
          bio: profile.bio || "",
        });
      }

      return true;
    },
    async session({ session, token }) {
      return {
        ...session,
        id: token.id,
      };
    },
    async jwt({ token, profile }) {
      if (profile) {
        const user = await client.fetch(AUTHOR_BY_GITHUB_ID_QUERY, {
          id: profile.id,
        });
        token.id = user?._id;
      }
      return token;
    },
  },
};

const nextAuthHandler = NextAuth(authOptions);

export async function auth() {
  return getServerSession(authOptions);
}

export { nextAuthHandler as GET, nextAuthHandler as POST };
