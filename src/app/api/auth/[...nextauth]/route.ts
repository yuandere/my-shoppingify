import NextAuth, { type NextAuthOptions } from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import EmailProvider from 'next-auth/providers/email';
// import nodemailer from 'nodemailer';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from '@/lib/prisma';

export const authOptions: NextAuthOptions = {
	// debug: true,
	session: {
		strategy: 'jwt',
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
			// id: 'nodemailer',
			// name: 'email',
			type: 'email',
			server: process.env.EMAIL_SERVER,
			from: process.env.EMAIL_FROM,
		}),
	],
	pages: {
		signIn: '/signIn',
	},
	callbacks: {
		async jwt({ token, account, profile}) {
			if (account) {
				console.log(token, account, profile);
				token.accessToken = account.access_token;
				// token.id = profile.id;
			}
			return token
		},
		async session({ session, token, user }) {
			console.log(session, token, user);
			return session
		}
	},
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
