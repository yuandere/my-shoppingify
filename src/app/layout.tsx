import { Poppins } from 'next/font/google';
import '@/styles/globals.css';

const poppins = Poppins({
	weight: ['300', '400', '500', '600', '700'],
	subsets: ['latin'],
	variable: '--font-poppins',
	display: 'swap',
});

export const metadata = {
	title: 'Create Next App',
	description: 'Generated by create next app',
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang='en' className={`${poppins.variable}`}>
			<body>
				{children}
			</body>
		</html>
	);
}
