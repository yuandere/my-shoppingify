import { useContext, useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { DashboardStatesContext } from '../providers';
import ShoppingList from '@/components/shoppingList';
import ItemCard from '@/components/itemCard';
import { useMutateAddNewList } from '@/lib/mutations/list-mutations';
import useViewport from '@/lib/useViewport';
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
	const [listName, setListName] = useState<string>('');
	const dashboardStates = useContext(DashboardStatesContext);
	const listId = dashboardStates?.selectedList?.id;
	const isViewingList = dashboardStates?.isViewingList;
	const setIsViewingList = dashboardStates?.setIsViewingList;
	const selectedList = dashboardStates?.selectedList;
	const mutateAddNewList = useMutateAddNewList();
	const queryClient = useQueryClient();
	const { isMobileLayout, isSmallFormat } = useViewport();

	const listsQuery = useQuery({
		queryKey: ['lists'],
		queryFn: () => getLists(),
	});
	const listItemsQuery = useQuery({
		queryKey: ['listItems', listId],
		queryFn: () => getListItems(listId),
		enabled: !!listId,
	});

	const handleExitList = () => {
		dashboardStates?.setIsViewingList(false);
		dashboardStates?.setSelectedList(null);
		dashboardStates?.setShowSidebarCartCount(false);
		queryClient.invalidateQueries({ queryKey: ['lists'] });
	};

	useEffect(() => {
		if (!listsQuery.data.data || listsQuery.data.success === false) return;
		setSortedLists(listsSorter(listsQuery.data.data));
		//TODO: improve api instead of using this workaround
		for (const list of listsQuery.data.data) {
			if (!list) return;
			if (list.id === listId) {
				setListName(list.name);
				return;
			}
		}
	}, [listId, listsQuery.data]);

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
		<div
			className={`flex flex-col ${
				isMobileLayout
					? 'w-screen px-2 text-sm'
					: 'w-full px-4 md:min-w-[640px]'
			}`}
		>
			{isViewingList ? (
				// view for items on list
				<>
					{isMobileLayout ? null : (
						<p
							className={`mt-4 px-2 self-start text-xs font-medium cursor-pointer text-orange-400 transition hover:text-orange-600 ${
								isMobileLayout ? '' : 'mt-14'
							}`}
							onClick={() => handleExitList()}
						>
							🡐 back
						</p>
					)}
					<div className='pt-4 pb-4 px-4 md:px-10'>
						<h2 className='text-xl font-medium'>
							{listItemsQuery?.data?.name}
						</h2>
					</div>
					{listItemsQuery.isPending ? <span>Loading...</span> : null}
					{listItemsQuery.isError ? (
						<span>Error: {listItemsQuery.error.message}</span>
					) : null}
					{selectedList ? (
						<h2
							className={`ml-2 font-semibold mb-4 ${
								isMobileLayout ? 'text-lg' : 'text-xl'
							}`}
						>
							{listName}
						</h2>
					) : null}
					{!sortedListItems || sortedListItems.length === 0 ? (
						<span>No items found</span>
					) : (
						sortedListItems.map((category, i) => {
							return (
								<div
									className={`flex flex-col mb-4 w-full ${
										isSmallFormat ? 'mx-2' : 'mx-6'
									}`}
									key={`items-category-${i}`}
								>
									<h1
										className={`max-w-xs ${
											isSmallFormat
												? 'text-base underline underline-offset-4 decoration-theme-1 decoration-2'
												: 'text-lg'
										}`}
									>
										{category.categoryName}
									</h1>
									<div className='w-full flex flex-wrap'>
										{category.items.map((item, i) => {
											return (
												<ItemCard
													itemData={item}
													key={`${item.categoryName}-${i}`}
													small={isSmallFormat ? true : undefined}
												></ItemCard>
											);
										})}
									</div>
								</div>
							);
						})
					)}
					{isMobileLayout ? (
						<p
							className='ml-6 mt-4 self-start text-xs font-medium cursor-pointer text-orange-400 transition hover:text-orange-600'
							onClick={() => handleExitList()}
						>
							🡐 back
						</p>
					) : null}
				</>
			) : (
				// view of lists
				<>
					<div className={`md:pt-12 ${isMobileLayout ? 'py-3' : 'py-4'}`}>
						<h2
							className={`${
								isMobileLayout ? 'text-lg' : 'text-xl font-medium'
							}`}
						>
							Shopping history
						</h2>
					</div>
					<button
						className={`flex items-center justify-center grid-flow-col mb-6 rounded-lg bg-theme-2 cursor-pointer text-white transition drop-shadow-[0_2px_6px_rgba(0,0,0,0.1)] hover:drop-shadow-[0_2px_9px_rgba(0,0,0,0.14)] hover:bg-rose-900 ${
							isMobileLayout ? 'w-36 h-8' : 'w-44 h-10'
						}`}
						onClick={() => mutateAddNewList.mutate()}
					>
						<span className='material-icons'>add</span>
						<p className=''>Add new list</p>
					</button>
					{listsQuery.isPending ? <span>Loading...</span> : null}
					{listsQuery.isError ? (
						<span>Error: {listsQuery.error.message}</span>
					) : null}
					{listsQuery.data && sortedLists ? (
						sortedLists.map((sortedObject, idx) => {
							return (
								<div className='mb-4' key={`sorted-month-${idx}`}>
									<h3
										className={`${isMobileLayout ? '' : 'text-lg font-medium'}`}
									>
										{sortedObject.monthYear}
									</h3>
									<div className='flex flex-col space-y-2'>
										{sortedObject.lists.map((list, innerIdx) => {
											return (
												<ShoppingList
													listProps={list}
													small={isSmallFormat ? true : undefined}
													key={`shopping-list-${idx}-${innerIdx}`}
												></ShoppingList>
											);
										})}
									</div>
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
