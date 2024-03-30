import { type NextAuthOptions } from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import EmailProvider from 'next-auth/providers/email';
import CredentialsProvider from 'next-auth/providers/credentials';
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
			server: process.env.EMAIL_SERVER,
			from: process.env.EMAIL_FROM,
		}),
		CredentialsProvider({
			name: 'Credentials',
			credentials: {
				email: {
					label: 'Email',
					type: 'email',
					placeholder: 'demo@example.com',
				},
			},
			async authorize(credentials, req) {
				const user = {
					id: '018e7eb3-0743-7156-8185-80be0e408647',
					name: 'John Doe',
					email: 'demo@example.com',
				};
				if (user) {
					return user;
				} else {
					return null;
				}
			},
		}),
	],
	pages: {
		signIn: '/signIn',
	},
	callbacks: {
		async jwt({ token, account, profile }) {
			if (account) {
				// console.log('JWT CALLBACK:', token, account, profile);
				token.accessToken = account.access_token;
				// token.id = profile.id;
			}
			return token;
		},
		async session({ session, token, user }) {
			// console.log('SESSION CALLBACK', session, token, user);
			session.user.id = token.sub;
			return session;
		},
		async signIn({ user, account, profile, email, credentials }) {
			if (user.email === 'demo@example.com') {
				return true;
			}
			return true;
		},
	},
};