import { Poppins } from 'next/font/google';
import '@/styles/globals.css';

const poppins = Poppins({
	weight: ['300', '400', '500', '600', '700'],
	subsets: ['latin'],
	variable: '--font-poppins',
	display: 'swap',
});

export const metadata = {
	title: 'My-Shoppingify',
	description: 'Make and edit shopping lists, utility for the whole family',
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
