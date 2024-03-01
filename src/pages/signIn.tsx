import type {
	GetServerSidePropsContext,
	InferGetServerSidePropsType,
} from 'next';
import Image from 'next/image';
import { Poppins } from 'next/font/google';
import { getProviders, signIn, getCsrfToken } from 'next-auth/react';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import '@/styles/globals.css';

const poppins = Poppins({
	weight: ['400', '500'],
	subsets: ['latin'],
	variable: '--font-poppins',
	display: 'swap',
});

const btnClasses =
	'relative flex items-center justify-center w-full min-h-[62px] rounded-lg mb-4 px-4 py-3 font-medium transition-all duration-100 ease-in-out';

export default function SignIn({
	providers,
	csrfToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	return (
		<main className={poppins.className}>
			<div className='grid place-items-center w-screen min-h-screen h-max bg-[#ececec]'>
				<div className='SIcontainer block text-center px-5 py-8 rounded-2xl bg-[#fff] xs:w-[368px] xs:mx-0 xs:mb-8'>
					{Object.values(providers)
						.slice(0, -2)
						.map((provider) => (
							<div key={provider.name} className=''>
								<button
									className={`${btnClasses} ${
										provider.id === 'google'
											? 'border-2 border-l-slate-100 border-t-slate-100 border-r-slate-200 border-b-slate-200 bg-[#fff] hover:bg-[#f6f6f6]'
											: 'text-[#fff] bg-[#24292f] hover:bg-[#3c3c3c]'
									}`}
									onClick={() => signIn(provider.id)}
								>
									<Image
										className='block w-[25px]'
										src={`https://authjs.dev/img/providers/${provider.id}.svg`}
										height={24}
										width={24}
										alt='provider logo'
										loading='lazy'
									></Image>
									<p className='grow'>Sign in with {provider.name}</p>
								</button>
							</div>
						))}
					<hr className='block border-t border-[#888] mx-auto mt-8 mb-4 overflow-visible before:bg-[#fff] before:content-["or"] before:py-0 before:px-[0.4rem] before:relative before:-top-[.7rem] before:text-[#888]'></hr>
					<form method='POST' action='/api/auth/signin/email'>
						<input name='csrfToken' type='hidden' defaultValue={csrfToken} />
						<label className='block mb-1 text-left'>
							Email
							<input
								className='bg-[#fff] border border-[#888] rounded-lg text-sm py-2 px-4 mb-2 w-full'
								type='email'
								id='email'
								name='email'
								placeholder='email@example.com'
							/>
						</label>
						<button
							className={`${btnClasses} text-[#fff] bg-blue-500 hover:bg-blue-600`}
							type='submit'
						>
							Sign in with Email
						</button>
					</form>
				</div>
			</div>
		</main>
	);
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
	const csrfToken = await getCsrfToken(context);
	const session = await getServerSession(context.req, context.res, authOptions);
	// If the user is already logged in, redirect.
	// Note: Make sure not to redirect to the same page
	// To avoid an infinite loop!
	if (session) {
		return { redirect: { destination: '/dashboard' } };
	}

	const providers = await getProviders();

	return {
		props: { csrfToken, providers: providers ?? [] },
	};
}
