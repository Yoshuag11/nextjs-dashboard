import bcrypt from "bcrypt";
import postgres from "postgres";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import type { User } from "@/app/lib/definitions";
import { authConfig } from "./auth.config";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

async function getUser(email: string): Promise<User | undefined> {
  try {
    const userResponse = await sql<(User | undefined)[]>`
      SELECT * FROM users
      WHERE email = ${email}
    `;
    const user = userResponse[0];
    return user;
  } catch (err) {
    throw new Error("Failed to fetch user.");
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials): Promise<User | null> {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);
        const { data, success } = parsedCredentials;

        if (success) {
          const { email, password } = data;
          const user = await getUser(email);

          if (user === undefined) {
            return null;
          }
          if (await bcrypt.compare(password, user.password)) {
            return user;
          }
        }
        return null;
      },
    }),
  ],
});
