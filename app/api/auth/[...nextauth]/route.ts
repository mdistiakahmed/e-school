import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { saveUser, getUserByEmail } from "@/lib/userStore";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }: any) {
      if (account?.provider === "google") {
        const existingUser = await getUserByEmail(user.email!);
        
        const userData = {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          provider: "google",
          createdAt: existingUser?.createdAt || new Date().toISOString(),
          lastLogin: new Date().toISOString(),
        };

        await saveUser(userData);
      }
      return true;
    },
  },
  pages: {
    signIn: "/",
  },
});

export { handler as GET, handler as POST };