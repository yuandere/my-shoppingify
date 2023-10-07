import { useContext, useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import {
	CurrentUserContext,
	CartStatesContext,
	DashboardStatesContext,
} from '../../app/(dashboard)/providers';
import ItemCard from '@/components/itemCard';
import { dashboardSorter } from '@/lib/utils';
import { IItemsArray, IItemsData } from '@/@types/dashboard';

// TODO: add visual confirmation of fetch/loading
// TODO: change currentUser conditional render -> "something went wrong" to showing that there are no items if itemsArray is empty, and prompt user to add some
// TODO: format search results

export default function ItemsView() {
	const currentUser = useContext(CurrentUserContext)?.currentUser;
	const dashboardStates = useContext(DashboardStatesContext);
	const cartStates = useContext(CartStatesContext);
	const [searchTerm, setSearchTerm] = useState<string>('');
	const [itemsData, setItemsData] = useState<Array<IItemsData>>([]);
	const itemsFetchFlag = dashboardStates?.itemsFetchFlag;
	const itemsFetchRef = dashboardStates?.itemsFetchRef;

	const itemsArray: IItemsArray[] = useMemo(() => [], []);
	const uncategorizedItems: IItemsData[] = useMemo(() => [], []);

	useEffect(() => {
		if (itemsFetchRef === undefined || itemsFetchRef.current) {
			return;
		}
		const itemCardsRequest = new Request('/api/itemCard', {
			method: 'POST',
			body: `{"action": "fetch"}`,
		});
		fetch(itemCardsRequest)
			.then((response) => {
				itemsArray.length = 0;
				uncategorizedItems.length = 0;
				return response.json();
			})
			.then((value) => {
				setItemsData(value.data);
				dashboardSorter(value.data, itemsArray, uncategorizedItems);
			})
			.catch((error) => {
				console.log(error);
			});
		itemsFetchRef.current = true;
	}, [itemsArray, uncategorizedItems, itemsFetchFlag, itemsFetchRef]);

	return (
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
						{itemsData.map((item, i) => {
							if (item.name.toLowerCase().includes(searchTerm.toLowerCase())) {
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
					<>
						{itemsArray.map((item, i) => {
							return (
								<div className='' key={`items-category-${i}`}>
									<h1 className='text-lg max-w-xs'>{item.categoryName}</h1>
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
						})}
						<div
							className='group grid place-items-center h-12 w-12 rounded-full bg-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.1)] cursor-pointer transition hover:scale-[1.03] hover:bg-theme-3 hover:drop-shadow-[0_2px_9px_rgba(0,0,0,0.14)]'
							onClick={() => {
								cartStates?.setIsCartAddingItem(true);
							}}
						>
							<span className='material-icons transition text-ui cursor-pointer group-hover:text-ui-dark'>
								add
							</span>
						</div>
					</>
				)
			) : (
				<div>something went wrong</div>
			)}
		</div>
	);
}
