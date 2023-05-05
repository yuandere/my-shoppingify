import type {
	GetServerSidePropsContext,
	InferGetServerSidePropsType,
} from 'next';
import { getProviders, signIn, getCsrfToken } from 'next-auth/react';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export default function SignIn({
	providers,
	csrfToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	return (
		<>
			{Object.values(providers)
				.slice(0, -1)
				.map((provider) => (
					<div key={provider.name}>
						<button onClick={() => signIn(provider.id)}>
							Sign in with {provider.name}
						</button>
					</div>
				))}
			<form method='post' action='/api/auth/signin/nodemailer'>
				<input name='csrfToken' type='hidden' defaultValue={csrfToken} />
				<label>
					Email address
					<input type='email' id='email' name='email' />
				</label>
				<button type='submit'>Sign in with Email</button>
			</form>
		</>
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
