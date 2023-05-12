'use client';
import { useContext, useState } from 'react';
import Link from 'next/link';
import type { Session } from 'next-auth';
import { CurrentUserContext } from '../providers';
import SideBar from '@/app/(dashboard)/dashboard/sideBar';
import Cart from '@/app/(dashboard)/dashboard/cart';
import ItemCard from '@/components/ui/itemCard';
import { dashboardSorter } from '@/lib/utils.js';
import { IItemsData, IItemsArray } from '@/@types/dashboard';

export default function Dashboard({ session }: { session?: Session }) {
	// console.log(session)
	const [activeTab, setActiveTab] = useState<string>('items');
	const [searchTerm, setSearchTerm] = useState<string>('');
	const currentUser = useContext(CurrentUserContext)?.currentUser;

	// TODO: refactor using hashmap(?)
	const itemsArray: IItemsArray[] = [];
	const uncategorizedItems: IItemsData[] = [];

	if (currentUser != undefined) {
		dashboardSorter(currentUser.itemsData, itemsArray, uncategorizedItems);
	}

	return (
		<>
			<SideBar activeTab={activeTab} setActiveTab={setActiveTab}></SideBar>
			<div className='flex flex-col items-center md:min-w-[640px]'>
				<Link href='/'>
					<button className='border border-black p-2 rounded-full hover:bg-orange-400'>
						Back to home
					</button>
				</Link>
				<div className='bg-white p-2 rounded-xl text-sm flex items-center drop-shadow-[0_2px_6px_rgba(0,0,0,0.1)] focus-within:drop-shadow-[0_2px_9px_rgba(0,0,0,0.14)]'>
					<span className='material-icons'>search</span>
					<input
						className='outline-none'
						type='search'
						placeholder='search items'
						onChange={(e) => {
							setSearchTerm(e.target.value);
						}}
					></input>
				</div>
				{currentUser !== (null || undefined) ? (
					searchTerm != '' ? (
						<div className='flex'>
							{currentUser.itemsData.map((item, i) => {
								if (
									item.name.toLowerCase().includes(searchTerm.toLowerCase())
								) {
									return (
										<ItemCard
											itemData={item}
											key={`${item.categoryName}-${i}`}
										></ItemCard>
									);
								}
							})}
						</div>
					) : (
						itemsArray.map((item, i) => {
							return (
								<div className='' key={`items-category-${i}`}>
									<h1 className='text-lg'>{item.categoryName}</h1>
									<div className='flex'>
										{item.items.map((item, i) => {
											return (
												<ItemCard
													itemData={item}
													key={`${item.categoryName}-${i}`}
												></ItemCard>
											);
										})}
									</div>
								</div>
							);
						})
					)
				) : (
					<div>something went wrong</div>
				)}
			</div>
			<Cart></Cart>
		</>
	);
}
