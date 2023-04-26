'use client';

import { SessionProvider } from 'next-auth/react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// https://next-auth.js.org/configuration/nextjs
async function SessionGetter() {
	const session = await getServerSession(authOptions);
	return <pre>{JSON.stringify(session, null, 2)}</pre>;
}

export default function NextAuthProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	return <SessionProvider>{children}</SessionProvider>;
}
