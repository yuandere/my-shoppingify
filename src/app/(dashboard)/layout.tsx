import { Providers } from './providers';

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <Providers>{children}</Providers>;
}
