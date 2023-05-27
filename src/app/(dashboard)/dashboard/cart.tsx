import { useContext, useState } from 'react';
import Image from 'next/image';
import { CurrentUserContext, CartStatesContext } from '../providers';
import CartAddItem from '@/components/dashboard/cartAddItem';
import CartViewItem from '@/components/dashboard/cartViewItem';
import ListItem from '@/components/listItem';
import { dashboardSorter } from '@/lib/utils';
import { IItemsData, IListItemsArray, IListItem } from '@/@types/dashboard';
import addItemGraphic from '@/assets/source.svg';
import cartGraphic from '@/assets/undraw_shopping_app_flsj 1.svg';

export default function Cart({ itemDetails }: { itemDetails?: IItemsData }) {
	// const [selectedList, setSelectedList] = useState<IUserShoppingList | null>(null);
	// if (currentUser && currentUser.userShoppingLists) {
	// 	console.log(currentUser.userShoppingLists[0])
	// }

	const [isUnsavedList, setIsUnsavedList] = useState<boolean>(false);
	const [isEditingList, setIsEditingList] = useState<boolean>(false);

	const currentUser = useContext(CurrentUserContext)?.currentUser;
	const cartStates = useContext(CartStatesContext);
	const selectedList = currentUser?.userShoppingLists[0];

	const listItemsArray: IListItemsArray[] = [];
	const uncategorizedListItems: IListItem[] = [];
	if (currentUser != undefined) {
		dashboardSorter(
			selectedList?.items,
			listItemsArray,
			uncategorizedListItems
		);
	}
	// console.log(selectedList);
	// console.log(listItemsArray);

	return (
		<>
			{cartStates?.isCartAddingItem ? (
				<CartAddItem />
			) : cartStates?.isCartViewingItem ? (
				<CartViewItem />
			) : (
				<div className='flex flex-col items-center w-72 h-screen bg-theme-3 sm:w-80'>
					<div className='flex relative rounded-3xl bg-theme-2 mt-8 px-4 py-2 h-36 w-72'>
						<Image
							src={addItemGraphic}
							alt='graphic for adding item'
							height={125}
							className='absolute -top-6 w-auto'
						></Image>
						<div className='absolute right-4 top-0 flex flex-col justify-center w-36 h-full space-y-2 text-sm'>
							<p className='text-white'>{`Didn't find what you need?`}</p>
							<button
								className='grid place-items-center w-28 h-8 rounded-lg bg-white cursor-pointer transition hover:bg-[#FFF0DE]'
								onClick={() => {
									cartStates?.setIsCartAddingItem(true);
								}}
							>
								Add item
							</button>
						</div>
					</div>

					{/* TESTING SECTION */}
					<div className='border-2 border-red-500 p-4'>
						<button
							className='rounded-full bg-theme-1 text-white p-2'
							onClick={() => {
								cartStates?.setIsCartViewingItem(true);
							}}
						>
							VIEW ITEM
						</button>
					</div>

					{selectedList != undefined ? (
						<div className='flex flex-col w-full px-8 py-6 overflow-y-auto'>
							<div className='flex items-center justify-between mb-4'>
								<p className='text-xl font-medium'>{selectedList.name}</p>
								<span
									className='material-icons select-none cursor-pointer text-lg'
									onClick={() => {
										console.log('list pencil icon clicked');
									}}
								>
									edit
								</span>
							</div>
							{listItemsArray.map((item, i) => {
								return (
									<div className='mb-4' key={`items-category-${i}`}>
										<p className='text-xs text-[#888888] my-2'>
											{item.categoryName}
										</p>
										<div className='flex flex-col space-y-4'>
											{item.items.map((item, i) => {
												return (
													<ListItem
														listItem={item}
														key={`${item.categoryName}-${i}`}
													></ListItem>
												);
											})}
										</div>
									</div>
								);
							})}
						</div>
					) : (
						<div className='flex flex-col items-center justify-between h-full mb-0'>
							<p className='invisible'>formatting text</p>
							<p className=''>No items</p>
							<Image
								src={cartGraphic}
								alt='shopping cart graphic'
								className='translate-y-3'
							></Image>
						</div>
					)}

					<div className='grid place-items-center w-full mt-auto p-8 bg-white'>
						<div className='border border-black'>
							<p>this is the action bar</p>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
