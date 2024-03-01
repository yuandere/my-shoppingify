import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { Providers } from './providers';

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await getServerSession(authOptions);
	return <Providers session={session}>{children}</Providers>;
}
