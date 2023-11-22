import { useContext, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CurrentUserContext, DashboardStatesContext } from '../providers';
import ShoppingList from '@/components/shoppingList';
import ItemCard from '@/components/itemCard';
import { getLists, getListItems } from '@/lib/fetchers';
import { listsSorter, dashboardSorter } from '@/lib/utils';
import { IList, IItemsArray, IListItem } from '@/@types/dashboard';

interface IListObject {
	lists: Array<IList>;
	monthYear: string;
}

export default function HistoryView() {
	const [sortedLists, setSortedLists] = useState<Array<IListObject> | null>(
		null
	);
	const [sortedListItems, setSortedListItems] =
		useState<Array<IItemsArray> | null>(null);
	const dashboardStates = useContext(DashboardStatesContext);
	const currentUser = useContext(CurrentUserContext)?.currentUser;
	const id = currentUser?.id;
	const listId = dashboardStates?.selectedList?.id;
	const isViewingList = dashboardStates?.isViewingList;
	const setIsViewingList = dashboardStates?.setIsViewingList;
	const selectedList = dashboardStates?.selectedList;

	const listsQuery = useQuery({
		queryKey: ['lists'],
		// @ts-ignore
		queryFn: () => getLists(id),
		enabled: !!id,
	});

	const listItemsQuery = useQuery({
		queryKey: ['listItems', listId],
		// @ts-ignore
		queryFn: () => getListItems(listId),
		enabled: !!listId,
	});

	useEffect(() => {
		if (!listsQuery.data || listsQuery.data.success === false) {
			return;
		}
		setSortedLists(listsSorter(listsQuery.data.data));
	}, [listsQuery.data]);

	useEffect(() => {
		if (!listItemsQuery.data || !setIsViewingList) {
			return;
		}
		const listItemsArray: IItemsArray[] = [];
		const uncategorizedListItems: IListItem[] = [];
		dashboardSorter(
			listItemsQuery.data.data,
			listItemsArray,
			uncategorizedListItems
		);
		setSortedListItems(listItemsArray);
		setIsViewingList(true);
	}, [listItemsQuery.data, setIsViewingList]);

	return (
		<div className='flex flex-col md:min-w-[640px]'>
			{isViewingList ? (
				<>
					<p
						className='self-start text-xs font-medium cursor-pointer text-orange-400 transition hover:text-orange-600'
						onClick={() => {
							dashboardStates?.setIsViewingList(false);
						}}
					>
						🡐 back
					</p>
					<div className='pt-4 pb-4 px-4 md:pt-12 md:px-10'>
						<h2 className='text-xl font-medium'>{listItemsQuery.data.name}</h2>
					</div>
					{listItemsQuery.isPending ? <span>Loading...</span> : null}
					{listItemsQuery.isError ? (
						<span>Error: {listItemsQuery.error.message}</span>
					) : null}
					{selectedList ? (
						<h2 className='text-xl font-semibold mb-4'>{selectedList.name}</h2>
					) : null}
					{!sortedListItems || sortedListItems.length === 0 ? (
						<span>No items found</span>
					) : (
						sortedListItems.map((category, i) => {
							return (
								<div className='' key={`items-category-${i}`}>
									<h1 className='text-lg max-w-xs'>{category.categoryName}</h1>
									<div className='flex'>
										{category.items.map((item, i) => {
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
					)}
				</>
			) : (
				<>
					<div className='pt-4 pb-4 px-4 md:pt-12 md:px-10'>
						<h2 className='text-xl font-medium'>Shopping history</h2>
					</div>
					{listsQuery.isPending ? <span>Loading...</span> : null}
					{listsQuery.isError ? (
						<span>Error: {listsQuery.error.message}</span>
					) : null}
					{listsQuery.data && sortedLists ? (
						sortedLists.map((sortedObject, idx) => {
							return (
								<div key={`sorted-month-${idx}`}>
									<h3 className='text-xl font-semibold'>
										{sortedObject.monthYear}
									</h3>
									{sortedObject.lists.map((list, innerIdx) => {
										return (
											<ShoppingList
												listProps={list}
												key={`shopping-list-${idx}-${innerIdx}`}
											></ShoppingList>
										);
									})}
								</div>
							);
						})
					) : (
						<span>Something went wrong (or no lists found, wip)</span>
					)}
				</>
			)}
		</div>
	);
}
