import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Get backend API URL from environment or use default
const apiUrl = process.env.NEXT_PUBLIC_FASTAPI_URL || "http://127.0.0.1:8000";

// NextAuth configuration options
export const authOptions = {
  // Configure authentication providers
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      // Authorize user with backend API
      async authorize(credentials) {
        console.log("NextAuth login to:", `${apiUrl}/login`);
        const res = await fetch(`${apiUrl}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials?.email ?? "",
            password: credentials?.password ?? "",
          }),
        });

        // If login successful, return user object
        if (res.ok) {
          const user = await res.json();
          return {
            id: user.user_id || user.id,
            email: user.email,
            token: user.access_token,
          };
        }
        // Return null if authentication fails
        return null;
      },
    }),
  ],
  // Use JWT for session strategy
  session: { strategy: "jwt" as const },
  // Callbacks to handle JWT and session
  callbacks: {
    // Attach access token to JWT
    async jwt({ token, user }: { token: any; user?: any }) {
      if (user?.token) {
        token.accessToken = user.token;
      }
      return token;
    },
    // Attach access token to session object
    async session({ session, token }: { session: any; token: any }) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
  // Secret for NextAuth encryption
  secret: process.env.NEXTAUTH_SECRET,
};

// Export NextAuth handler for GET and POST requests
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
