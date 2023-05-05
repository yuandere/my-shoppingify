'use client';
import { useContext } from 'react';
import Link from 'next/link';
import type { Session } from 'next-auth';
import { CurrentUserContext } from '../providers';
import SideBar from '@/app/(dashboard)/dashboard/sideBar';
import Cart from '@/app/(dashboard)/dashboard/cart';
import ItemCard from '@/components/ui/itemCard';

export default function Dashboard({ session }: { session?: Session }) {
	// console.log(session)
	const currentUser = useContext(CurrentUserContext)?.currentUser;
	return (
		<>
			<SideBar></SideBar>
			<div className='flex flex-col items-center'>
				<Link href='/'>
					<button className='border border-black p-2 rounded-full hover:bg-orange-400'>Back to home</button>
				</Link>
				{currentUser !== (null || undefined) ? (
					currentUser.itemsData.map((item, i) => {
						return <ItemCard itemData={item} key={`itemCard-${i}`}></ItemCard>;
					})
				) : (
					<div>something went wrong</div>
				)}
			</div>
			<Cart></Cart>
		</>
	);
}
