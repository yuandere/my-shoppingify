import Link from 'next/link';

export default function AppHome() {
	return (
		<main className='flex min-h-screen flex-col items-center p-24'>
			<div className=''>
				<h1 className='text-xl'>dashboard/page.tsx</h1>
				<Link href='/'>
					<button className=''>Back to signin</button>
				</Link>
			</div>
		</main>
	);
}
