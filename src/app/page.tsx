import Link from 'next/link';

export default function Home() {
	return (
		<main className='flex min-h-screen flex-col items-center p-24'>
			<div className=''>
				<h1 className='text-xl'>my-shoppingify</h1>
			</div>
			<div className='rounded-xl border border-zinc-500'>
				<Link href='/dashboard'>
					<button className=''>Continue to dashboard</button>
				</Link>
			</div>
			<div className='rounded-xl border border-zinc-500'>
				<Link href='/signIn'>
					<button className=''>Sign in page</button>
				</Link>
			</div>
		</main>
	);
}
