'use client';

import { signIn, signOut } from 'next-auth/react';

// export const SignInEmail = ({ email }: { email: string }) => {
// 	return (
// 		<button id='submitButton' type='submit' onClick={() => signIn('email', { email })}>
// 			Sign in with email
// 		</button>
// 	);
// };

export const SignOut = () => {
	return (
		<button onClick={() => signOut({ callbackUrl: '/' })}>Sign Out</button>
	);
};
