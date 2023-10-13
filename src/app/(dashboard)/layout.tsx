import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { Providers } from './providers';
import { preload } from '@/lib/getItems';
import 'server-only'

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await getServerSession(authOptions);
	if (session?.user.id) {
		preload(session.user.id);
	}
	return <Providers session={session}>{children}</Providers>;
}
