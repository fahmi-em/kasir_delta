import NextAuth from "next-auth"
import { prisma } from "@/lib/prisma"
import Credentials from "next-auth/providers/credentials"
import { LoginSchema } from "./lib/zod"
import { toast } from "react-toastify"

export const { handlers, signIn, signOut, auth } = NextAuth({
  // adapter: PrismaAdapter(prisma),
  trustHost: true,
  session: { strategy: 'jwt' },
  pages:{
    signIn: '/login',
  },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const validatedFields = LoginSchema.safeParse(credentials)

        if (!validatedFields.success) {
          return null
        }

        const { email, password } = validatedFields.data;

        const user = await prisma.user.findUnique({
          where: {
            email: email,  
          },
        });

        if (!user || user.password !== password) {
          toast.error("Invalid email or password")
          throw new Error("Invalid email or password")
        }

        const passwordMatch = user.password === password

        if (!passwordMatch) return null

        return user;
      }
    })
  ],
  callbacks: {
    authorized({auth, request: {nextUrl}}) {
      const isLoggedIn = !!auth?.user;
      const ProtectedRoutes = ['/add-order', '/add-customers', '/view-order', '/',]

      if (!isLoggedIn && ProtectedRoutes.includes(nextUrl.pathname)) {
        return Response.redirect(new URL("/login", nextUrl));
      } 

      if (isLoggedIn && nextUrl.pathname.startsWith("/login")) {
        return Response.redirect(new URL('/', nextUrl));
      }
      return true;
    },
    jwt({token, user}) {
      if (user) token.role = user.role;
        return token;
    },
    session({session, token} ) {
      session.user.id = token.sub;
      session.user.role = token.role;
      return session;
    }
  }
})
