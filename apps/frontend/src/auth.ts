import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const apiUrl = "https://vedaaiv1-anirudhs.vercel.app";

async function syncUserWithBackend(profile: {
  email?: string | null;
  name?: string | null;
  picture?: string | null;
}): Promise<string | undefined> {
  if (!profile.email) return undefined;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (process.env.AUTH_SYNC_SECRET) {
    headers["X-Auth-Sync-Secret"] = process.env.AUTH_SYNC_SECRET;
  }

  const response = await fetch(`${apiUrl}/api/users/sync`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      email: profile.email,
      name: profile.name ?? "Teacher",
      image: profile.picture ?? "",
      provider: "google",
    }),
  });

  if (!response.ok) {
    console.error("User sync failed", await response.text());
    return undefined;
  }

  const json = (await response.json()) as {
    success: boolean;
    data: { userId: string };
  };

  return json.data.userId;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, profile, account }) {
      if (!token.userId && account?.provider === "google" && profile) {
        const userId = await syncUserWithBackend({
          email: profile.email,
          name: profile.name,
          picture: profile.picture,
        });
        if (userId) {
          token.userId = userId;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.userId) {
        session.user.id = token.userId as string;
      }
      return session;
    },
  },
  trustHost: true,
});
