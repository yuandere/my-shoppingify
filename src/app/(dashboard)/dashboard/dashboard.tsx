'use client';
import { createContext, useContext, useState } from 'react';
import Link from 'next/link';
import type { Session } from 'next-auth';
import { CurrentUserContext } from '../providers';
import SideBar from '@/app/(dashboard)/dashboard/sideBar';
import Cart from '@/app/(dashboard)/dashboard/cart';
import ItemCard from '@/components/ui/itemCard';
import { IItemsData } from '@/@types/dashboard';

interface IItemsArray {
	categoryName: string;
	items: Array<IItemsData>;
}

export default function Dashboard({ session }: { session?: Session }) {
	// console.log(session)
	const [activeTab, setActiveTab] = useState<string>('items');
	const [searchTerm, setSearchTerm] = useState<string>('');
	const [userItems, setUserItems] = useState<Array<IItemsData>>([]);
	const currentUser = useContext(CurrentUserContext)?.currentUser;

	// TODO: refactor using hashmap(?)
	const itemsArrayExample = [
		{
			categoryName: 'Fruit & Veg',
			items: [
				{
					name: 'banana',
					id: 'adsgas',
				},
			],
		},
	];
	const itemsArray: IItemsArray[] = [];
	const unsortedItems: IItemsData[] = [];

	if (currentUser != undefined) {
		for (const item of currentUser.itemsData) {
			const categoryName = item.categoryName;
			if (categoryName) {
				let category = itemsArray.find(
					(category) => category.categoryName === categoryName
				);
				if (category) {
					// Add the current item to an existing category
					category.items.push(item);
				} else {
					// Create a new category and add the current item to it
					category = {
						categoryName,
						items: [item],
					};
					itemsArray.push(category);
				}
			} else {
				// Add the current item to the "unsorted items" category
				unsortedItems.push(item);
			}
		}

		if (unsortedItems.length > 0) {
			// Create a category for the unsorted items
			itemsArray.push({
				categoryName: 'Unsorted Items',
				items: unsortedItems,
			});
		}
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
				) : (
					<div>something went wrong</div>
				)}
			</div>
			<Cart></Cart>
		</>
	);
}
