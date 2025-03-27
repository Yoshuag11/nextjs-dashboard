import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  callbacks: {
    authorized(props) {
      const { auth, request } = props;
      const { nextUrl } = request;
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");

      if (isOnDashboard) {
        // Redirect unauthenticated users to login page
        return isLoggedIn;
      } else if (isLoggedIn) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }
      return true;
    },
  },
  pages: {
    signIn: "/login",
  },
  providers: [],
} satisfies NextAuthConfig;
