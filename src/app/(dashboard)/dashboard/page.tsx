import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from '@tanstack/react-query';
import { getServerSession } from 'next-auth';
import Dashboard from './dashboard';
import { authOptions } from '@/lib/authOptions';
import { getItems, getLists } from '@/lib/fetchers';

export default async function DashboardPage() {
	const queryClient = new QueryClient();
	const session = await getServerSession(authOptions);
	// TODO: look at query prefetching
	// if (session?.user.id) {
	// 	const id = session.user.id;
	// 	await queryClient.prefetchQuery({
	// 		queryKey: ['itemCards'],
	// 		queryFn: () => getItems(id),
	// 	});
	// 	await queryClient.prefetchQuery({
	// 		queryKey: ['lists'],
	// 		queryFn: () => getLists(id),
	// 	});
	// }

	return (
		<main className='flex min-h-screen bg-light overflow-x-hidden'>
			<HydrationBoundary state={dehydrate(queryClient)}>
				<Dashboard></Dashboard>
			</HydrationBoundary>
		</main>
	);
}
