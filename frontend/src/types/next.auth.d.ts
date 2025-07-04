import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user?: User;
  }
  interface User {
    id: number;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }
}
