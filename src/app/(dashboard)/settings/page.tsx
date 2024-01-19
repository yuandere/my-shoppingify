'use client';
import Link from 'next/link';
import { signOut } from 'next-auth/react';

export default function Settings() {
	return (
		<main className='h-screen grid place-items-center'>
			<div className='flex flex-col items-center space-y-3 border-2 px-8 py-4 border-slate-400 rounded-md'>
				<p className='underline text-lg text-gray-600 mb-1'>settings</p>
				<Link href='/dashboard'>
					<button className='hover:underline'>back to dashboard</button>
				</Link>
				<button className='hover:underline cursor-pointer' onClick={() => signOut({ callbackUrl:'/'})}>log out</button>
			</div>
		</main>
	);
}
