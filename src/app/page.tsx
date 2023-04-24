import Link from 'next/link';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
	return (
		<main className='flex min-h-screen flex-col items-center p-24'>
			<div className='rounded-xl border border-zinc-500'>
				<h1>this is the signin page</h1>
				<Link href='/dashboard'>
					<button className=''>Continue to dashboard</button>
				</Link>
			</div>
			<div className='mt-8 px-4 py-2'>
				<form>
					<label htmlFor='input-email-signin'>Email</label>
					<input
						id='input-email-signin'
						type='email'
						name='email'
						placeholder='email@example.com'
						autoFocus
						required
					></input>
					<button id='submitButton' type='submit' className=''>
						Sign in with email
					</button>
				</form>
			</div>
		</main>
	);
}
