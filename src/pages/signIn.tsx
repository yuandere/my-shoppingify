import type {
	GetServerSidePropsContext,
	InferGetServerSidePropsType,
} from 'next';
import { Inter } from 'next/font/google';
import { getProviders, signIn, getCsrfToken } from 'next-auth/react';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import '@/styles/signIn.css';

const inter = Inter({ subsets: ['latin'] });

export default function SignIn({
	providers,
	csrfToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const handleDemoSignIn = async() => {
		await signIn('credentials', { email: 'demo@example.com' });
	}
	return (
		<main className={inter.className}>
			<div className='SIpage grid place-items-center w-screen h-screen'>
				<div className='SIcontainer flex flex-col items-center w-80 px-4 py-8 bg-slate-300 md:w-[520px]'>
					{Object.values(providers)
						.slice(0, -2)
						.map((provider) => (
							<div key={provider.name} className=''>
								<button className='h-12' onClick={() => signIn(provider.id)}>
									<p className=''>Sign in with {provider.name}</p>
								</button>
							</div>
						))}
					<p className='font-bold'>test</p>
					<form method='post' action='/api/auth/signin/email'>
						<input name='csrfToken' type='hidden' defaultValue={csrfToken} />
						<label>
							Email address
							<input type='email' id='email' name='email' />
						</label>
						<button type='submit'>Sign in with Email</button>
					</form>
					<button className='SIdemo-btn' onClick={handleDemoSignIn}>Demo sign in</button>
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
