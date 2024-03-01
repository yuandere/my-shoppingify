'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import wordartpng from '@/assets/wordart-min.png';
import wordartwebp from '@/assets/wordart-min.webp';

export default function Home() {
	const [imgSrc, setImgSrc] = useState(wordartwebp);
	const handleDemoSignIn = async () => {
		await signIn('credentials', { email: 'demo@example.com', callbackUrl:'/dashboard' });
	};
	return (
		<main className='grid min-h-screen place-items-center'>
			<div className='flex flex-col items-center'>
				<Image
					src={imgSrc}
					height={150}
					width={500}
					alt='my-shoppingify but in cool wordart'
					onError={() => setImgSrc(wordartpng)}
				></Image>
				<div className='xs:w-[200px] xs:mx-0 xs:mb-8'>
					<Link href='/signIn'>
						<button className='border border-gray-400 rounded-xl w-full px-3 py-4 mb-4 transition-all duration-100 ease-in-out hover:bg-gray-200'>
							sign in/sign up
						</button>
					</Link>
					<button
						className='rounded-xl w-full px-3 py-4 mb-8 transition-all duration-100 ease-in-out text-[#fff] bg-green-500 hover:bg-green-600'
						onClick={handleDemoSignIn}
					>
						Demo the features
					</button>
				</div>
			</div>
		</main>
	);
}
