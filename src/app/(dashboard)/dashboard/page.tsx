import Link from 'next/link';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export default async function DashboardPage() {
	const data = await getServerSession(authOptions);
	console.log(data);
	return (
		<main className='flex min-h-screen flex-col items-center p-24'>
			<div className=''>
				<h1 className='text-xl'>dashboard/page.tsx</h1>
				<Link href='/'>
					<button className=''>Back to home</button>
				</Link>
			</div>
		</main>
	);
}
