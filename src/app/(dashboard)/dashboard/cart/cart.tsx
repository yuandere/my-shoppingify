import { useContext, useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import * as Tooltip from '@radix-ui/react-tooltip';
import { CartStatesContext, DashboardStatesContext } from '../../providers';
import CartAddItem from '@/app/(dashboard)/dashboard/cart/cartAddItem';
import CartViewItem from '@/app/(dashboard)/dashboard/cart/cartViewItem';
import CartActionBar from '@/app/(dashboard)/dashboard/cart/cartActionBar';
import ListItem from '@/components/listItem';
import { getListItems } from '@/lib/fetchers';
import { dashboardSorter } from '@/lib/utils';
import {
	IListItemsArray,
	IUserShoppingList,
	IListItem,
} from '@/@types/dashboard';
import addItemGraphic from '@/assets/source.svg';
import cartGraphic from '@/assets/undraw_shopping_app_flsj 1.svg';

// TODO: useMutation, listItem API interactions

export default function Cart() {
	const [selectedListItems, setSelectedListItems] =
		useState<IUserShoppingList | null>(null);
	const dashStates = useContext(DashboardStatesContext);
	const cartStates = useContext(CartStatesContext);
	const selectedList = dashStates?.selectedList;
	const listId = selectedList?.id;
	const listItemsArray: IListItemsArray[] = useMemo(() => [], []);
	const uncategorizedListItems: IListItem[] = useMemo(() => [], []);

	const { fetchStatus, isError, data, error } = useQuery({
		queryKey: ['listItems', listId],
		// @ts-ignore
		queryFn: () => getListItems(listId),
		enabled: !!listId,
	});

	useEffect(() => {
		if (!data) {
			return;
		}
		listItemsArray.length = 0;
		uncategorizedListItems.length = 0;
		setSelectedListItems(data.data);
		dashboardSorter(data.data, listItemsArray, uncategorizedListItems);
	}, [data, listItemsArray, selectedListItems, uncategorizedListItems]);

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
								className='grid place-items-center w-28 h-8 rounded-lg bg-white cursor-pointer transition drop-shadow-[0_2px_6px_rgba(0,0,0,0.1)] hover:drop-shadow-[0_2px_9px_rgba(0,0,0,0.14)] hover:bg-[#FFF0DE]'
								onClick={() => {
									cartStates?.setIsCartAddingItem(true);
								}}
							>
								Add item
							</button>
						</div>
					</div>
					{isError ? <span>Error{error.message}</span> : null}
					{data ? (
						<div className='flex flex-col w-full px-8 py-6 overflow-y-auto'>
							<div className='flex items-center justify-between mb-4'>
								<p className='text-xl font-medium'>{selectedList?.name}</p>
								<Tooltip.Root>
									<Tooltip.Trigger asChild>
										<span
											className='material-icons select-none cursor-pointer text-lg hover:scale-125'
											onClick={() => {
												if (cartStates?.isCartEditingState) {
													cartStates?.setIsCartEditingState(false);
												} else {
													cartStates?.setIsCartEditingState(true);
												}
											}}
										>
											{cartStates?.isCartEditingState ? 'checklist' : 'edit'}
										</span>
									</Tooltip.Trigger>
									<Tooltip.Portal>
										<Tooltip.Content className='TooltipContent' sideOffset={5}>
											edit/complete
											<Tooltip.Arrow className='TooltipArrow' />
										</Tooltip.Content>
									</Tooltip.Portal>
								</Tooltip.Root>
							</div>
							{listItemsArray.map((item, i) => {
								return (
									<div className='mb-4' key={`items-category-${i}`}>
										<p className='text-xs text-[#888888] my-2'>
											{item.categoryName}
										</p>
										<div className='flex flex-col items-center space-y-4'>
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
					) : fetchStatus === 'fetching' ? (
						<div>Loading...</div>
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
					<CartActionBar></CartActionBar>
				</div>
			)}
		</>
	);
}
