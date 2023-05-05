// import { getServerSession } from 'next-auth/next';
// import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Dashboard from './dashboard';

export default async function DashboardPage() {
	// const session = await getServerSession(authOptions);
	// console.log(session);
	return (
		<main className='flex min-h-screen bg-light'>
			{/* <Dashboard session={session || undefined}></Dashboard> */}
			<Dashboard></Dashboard>
		</main>
	);
}
