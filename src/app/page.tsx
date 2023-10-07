import Link from 'next/link';

export default function Home() {
	return (
		<main className='flex min-h-screen flex-col items-center p-24'>
			<div className='rounded-xl border border-zinc-500'>
				<h1>this is the home page</h1>
			</div>
			<div className='rounded-xl border border-zinc-500'>
				<Link href='/dashboard'>
					<button className=''>Continue to dashboard</button>
				</Link>
			</div>
			<div className='rounded-xl border border-zinc-500'>
				<Link href='/api/auth/signin'>
					<button className=''>Sign in page</button>
				</Link>
			</div>
		</main>
	);
}
