import { useContext, useEffect, useState } from 'react';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import * as Tooltip from '@radix-ui/react-tooltip';
import { CartStatesContext, DashboardStatesContext } from '../../providers';
import CartAddItem from '@/app/(dashboard)/dashboard/cart/cartAddItem';
import CartViewItem from '@/app/(dashboard)/dashboard/cart/cartViewItem';
import CartActionBar from '@/app/(dashboard)/dashboard/cart/cartActionBar';
import CartListItem from '@/components/cartListItem';
import useViewport from '@/lib/useViewport';
import { dashboardSorter } from '@/lib/utils';
import { getListItems, getLists } from '@/lib/fetchers';
import { IItemsArray, IListItem } from '@/@types/dashboard';
import addItemGraphic from '@/assets/source.svg';
import cartGraphic from '@/assets/undraw_shopping_app_flsj 1.svg';

export default function Cart() {
	const [sortedItems, setSortedItems] = useState<IItemsArray[] | null>(null);
	const [listName, setListName] = useState<string>('');
	const [showCartClickoffButton, setShowCartClickoffButton] =
		useState<boolean>(false);
	const dashboardStates = useContext(DashboardStatesContext);
	const cartStates = useContext(CartStatesContext);
	const selectedList = dashboardStates?.selectedList;
	const listId = selectedList?.id;
	const { width, isMobileLayout } = useViewport();
	const isMobileCartOpen = cartStates?.isMobileCartOpen;

	const listsQuery = useQuery({
		queryKey: ['lists'],
		queryFn: () => getLists(),
	});
	const listItemsQuery = useQuery({
		queryKey: ['listItems', listId],
		queryFn: () => getListItems(listId),
		enabled: !!listId,
	});

	const toggleCartEditing = () => {
		if (
			cartStates?.isCartEditingState === undefined ||
			cartStates?.setIsCartEditingState === undefined
		)
			return;
		cartStates.setIsCartEditingState((current) => !current);
	};
	const toggleMobileCartOpen = () => {
		if (
			cartStates?.isMobileCartOpen === undefined ||
			cartStates?.setIsMobileCartOpen === undefined
		)
			return;
		cartStates.setIsMobileCartOpen((current) => !current);
	};

	//TODO: improve api instead of using this workaround
	useEffect(() => {
		if (!listsQuery.data || !listId) return;
		for (const list of listsQuery.data.data) {
			if (!list) return;
			if (list.id === listId) {
				setListName(list.name);
				return;
			}
		}
	}, [listId, listsQuery.data]);

	useEffect(() => {
		if (!listItemsQuery.data) return;
		const listItemsArray: IItemsArray[] = [];
		const uncategorizedListItems: IListItem[] = [];
		dashboardSorter(
			listItemsQuery.data.data,
			listItemsArray,
			uncategorizedListItems
		);
		setSortedItems(listItemsArray);
	}, [listItemsQuery.data]);

	useEffect(() => {
		if (width === undefined) return;
		if (width - 288 < 75) {
			setShowCartClickoffButton(true);
		} else {
			setShowCartClickoffButton(false);
		}
	}, [width]);

	return (
		<>
			{/* mobile cart clickoff button */}
			{isMobileLayout && isMobileCartOpen && showCartClickoffButton ? (
				<div
					className='fixed z-50 bottom-2 left-2 w-8 h-8 grid place-items-center rounded-full bg-orange-400 cursor-pointer'
					onClick={toggleMobileCartOpen}
				>
					<div className='animate-ping absolute z-0 inline-flex h-3/4 w-3/4 rounded-full bg-orange-300 opacity-75'></div>
					<span className='material-icons-outlined text-white text-lg'>
						shopping_cart
					</span>
				</div>
			) : null}
			{/* mobile cart clickoff area */}
			{isMobileLayout && isMobileCartOpen ? (
				<div
					className={`w-screen h-screen fixed z-30 left-0 top-0 bg-black animate-opacityIn`}
					onClick={toggleMobileCartOpen}
				></div>
			) : null}
			{/*cart container*/}
			<div
				className={`${
					isMobileLayout && isMobileCartOpen
						? 'OPENEDMOBCART fixed z-40 bottom-0 -right-72 -translate-x-72 duration-200 transition-all ease-out shadow-md'
						: isMobileLayout && !isMobileCartOpen
						? 'CLOSEDMOBCART fixed bottom-0 -right-72'
						: 'NOTMOBCART'
				}`}
			>
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
								priority={true}
							></Image>
							<div className='absolute right-4 top-0 flex flex-col justify-center w-36 h-full space-y-2 text-sm'>
								<p className='text-white'>{`Didn't find what you need?`}</p>
								<button
									className='grid place-items-center w-28 h-8 rounded-lg bg-white cursor-pointer transition drop-shadow-[0_2px_6px_rgba(0,0,0,0.1)] hover:drop-shadow-[0_2px_9px_rgba(0,0,0,0.14)] hover:bg-[#FFF0DE]'
									onClick={() => cartStates?.setIsCartAddingItem(true)}
								>
									Add item
								</button>
							</div>
						</div>
						{sortedItems && selectedList ? (
							<div className='flex flex-col w-full px-8 py-6 overflow-y-auto'>
								<div className='flex items-center justify-between mb-4'>
									<p className='text-xl font-medium'>{listName}</p>
									<Tooltip.Root>
										<Tooltip.Trigger asChild>
											<span
												className='material-icons select-none cursor-pointer text-lg hover:scale-125'
												onClick={toggleCartEditing}
											>
												{cartStates?.isCartEditingState ? 'checklist' : 'edit'}
											</span>
										</Tooltip.Trigger>
										<Tooltip.Portal>
											<Tooltip.Content
												className='TooltipContent'
												sideOffset={5}
											>
												edit/complete
												<Tooltip.Arrow className='TooltipArrow' />
											</Tooltip.Content>
										</Tooltip.Portal>
									</Tooltip.Root>
								</div>
								{sortedItems.map((category, i) => {
									return (
										<div className='mb-4' key={`items-category-${i}`}>
											<p className='text-xs text-[#888888] my-2'>
												{category.categoryName}
											</p>
											<div className='flex flex-col items-center space-y-4'>
												{category.items.map((item, i) => {
													return (
														<CartListItem
															// @ts-ignore
															listItem={item}
															key={`${item.categoryName}-${i}`}
														></CartListItem>
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
									priority={true}
								></Image>
							</div>
						)}
						<CartActionBar></CartActionBar>
					</div>
				)}
			</div>
		</>
	);
}
