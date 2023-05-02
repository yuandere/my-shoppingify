'use client';
import type { Session } from 'next-auth';
import Link from 'next/link';
import SideBar from '@/components/sideBar';
import Cart from '@/components/cart';
import ItemCard from '@/components/ui/itemCard';

const itemsData = [
	{
		name: 'Avocado',
		ref: 1,
		category: 1,
		note: 'avocado r cool 247',
		img: '',
	},
	{
		name: 'Banana',
		ref: 2,
		category: 1,
		note: 'ooh ooh ah ah HOOOOOO',
	},
	{
		name: 'Fry chicken',
		ref: 3,
		category: 2,
		note: 'KFC baybeee',
		img: '',
	},
	{
		name: 'This item is long and takes up all the space and then some so here is a cutoff',
		ref: 3,
		category: 2,
		note: 'KFC baybeee',
		img: '',
	},
	{
		name: 'aaaaaaaaaaaaaaaaaaaaaa',
		ref: 3,
		category: 2,
		note: 'KFC baybeee',
		img: '',
	},	{
		name: 'this is a test string with 5pc vitriol',
		ref: 3,
		category: 2,
		note: 'KFC baybeee',
		img: '',
	},
];

export default function Dashboard({ session }: { session?: Session }) {
	// console.log(session)
	return (
		<>
			<SideBar></SideBar>
			<div className='flex flex-col items-center'>
				<h1 className='text-xl'>dashboard/page.tsx</h1>
				<Link href='/'>
					<button>Back to home</button>
				</Link>
				{itemsData.map((item, i) => {
					return <ItemCard itemData={item} key={`itemCard-${i}`}></ItemCard>;
				})}
			</div>
			<Cart></Cart>
		</>
	);
}
