import { useContext, useEffect, useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CurrentUserContext, CartStatesContext } from '../providers';
import ItemCard from '@/components/itemCard';
import Loading from '@/components/loading';
import { dashboardSorter } from '@/lib/utils';
import { getItems } from '@/lib/fetchers';
import useViewport from '@/lib/useViewport';
import { IItemsArray, IItemCard } from '@/@types/dashboard';

// TODO: change currentUser conditional render -> "something went wrong" to showing that there are no items if itemsArray is empty, and prompt user to add some

export default function ItemsView() {
	const currentUser = useContext(CurrentUserContext)?.currentUser;
	const cartStates = useContext(CartStatesContext);
	const [searchTerm, setSearchTerm] = useState<string>('');
	const [itemsData, setItemsData] = useState<Array<IItemCard>>([]);
	const id = currentUser?.id;
	const itemsArray: IItemsArray[] = useMemo(() => [], []);
	const uncategorizedItems: IItemCard[] = useMemo(() => [], []);
	const { isMobileLayout, isSmallFormat } = useViewport();

	const { isPending, isError, data, error } = useQuery({
		queryKey: ['itemCards'],
		queryFn: () => getItems(id),
		enabled: !!id,
	});

	useEffect(() => {
		if (!data?.success) return;
		itemsArray.length = 0;
		uncategorizedItems.length = 0;
		setItemsData(data.data);
		dashboardSorter(data.data, itemsArray, uncategorizedItems);
	}, [itemsArray, uncategorizedItems, data]);

	return (
		<div
			className={`flex flex-col items-center ${
				isMobileLayout
					? 'w-screen px-2 text-sm'
					: 'w-full px-4 md:min-w-[640px] overflow-y-scroll overflow-x-hidden'
			}`}
		>
			{/* search bar */}
			<div
				className={`bg-white p-2 rounded-xl text-sm flex self-center items-center mx-1 my-6 drop-shadow-[0_2px_6px_rgba(0,0,0,0.1)] focus-within:drop-shadow-[0_2px_9px_rgba(0,0,0,0.14)] ${
					isSmallFormat ? 'w-full' : 'w-2/3 max-w-[320px] mt-12'
				}`}
			>
				<span className='material-icons select-none'>search</span>
				<input
					className='outline-none'
					type='search'
					placeholder='search items'
					onChange={(e) => setSearchTerm(e.target.value)}
				></input>
			</div>
			{isPending ? <Loading /> : null}
			{isError ? <span className='mb-4'>Error: {error.message}</span> : null}
			{/* items */}
			{currentUser !== null && currentUser !== undefined ? (
				searchTerm != '' ? (
					<div className='flex flex-wrap justify-evenly px-2 w-full'>
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
						{itemsArray.map((category, i) => {
							return (
								<div
									className={`flex flex-col items-center mb-4 w-full ${
										isSmallFormat ? 'mx-3' : 'mx-6'
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
									<div
										className={`w-full flex flex-wrap ${
											isSmallFormat ? 'justify-center' : 'justify-center'
										}`}
									>
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
						})}
						<div
							className='group grid place-items-center mb-16 h-12 w-12 rounded-full bg-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.1)] cursor-pointer transition hover:scale-[1.03] hover:bg-theme-3 hover:drop-shadow-[0_2px_9px_rgba(0,0,0,0.14)]'
							onClick={() => cartStates?.setIsCartAddingItem(true)}
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
