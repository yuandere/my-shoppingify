import NextAuth, { type NextAuthOptions } from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import EmailProvider from 'next-auth/providers/email';
// import nodemailer from 'nodemailer';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from '@/app/lib/prisma';

export const authOptions: NextAuthOptions = {
	session: {
		strategy: 'jwt'
	},
	adapter: PrismaAdapter(prisma),
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
			authorization: {
				params: {
					prompt: 'consent',
					access_type: 'offline',
					response_type: 'code',
				},
			},
		}),
		GitHubProvider({
			clientId: process.env.GITHUB_ID as string,
			clientSecret: process.env.GITHUB_SECRET as string,
		}),
		EmailProvider({
			id: 'nodemailer',
			name: 'email',
			type: 'email',
			server: process.env.EMAIL_SERVER,
			from: process.env.EMAIL_FROM,
		}),
	],
	// callbacks: {
	// 	async jwt({ token, user }) {
  //     const dbUser = await prisma.user.findFirst({
  //       where: {
  //         email: token.email as string,
  //       },
  //     })

  //     if (!dbUser) {
  //       if (user) {
  //         token.id = user?.id
  //       }
  //       return token
  //     }

  //     return {
  //       id: dbUser.id,
  //       name: dbUser.name,
  //       email: dbUser.email,
  //       picture: dbUser.image,
  //     }
  //   },
	// 	async session({ token, session }) {
  //     if (token) {
  //       session.user.id = token.id
  //       session.user.name = token.name
  //       session.user.email = token.email
  //       session.user.image = token.picture
  //     }

  //     return session
  //   },
	// }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
