import { useContext, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CurrentUserContext } from '../providers';
import ShoppingList from '@/components/shoppingList';
import { getLists } from '@/lib/fetchers';
import { listsSorter } from '@/lib/utils';
import { IList } from '@/@types/dashboard';

interface IListObject {
	lists: Array<IList>;
	monthYear: string;
}

export default function HistoryView() {
	const [sortedLists, setSortedLists] = useState<Array<IListObject> | null>(
		null
	);
	const currentUser = useContext(CurrentUserContext)?.currentUser;
	const id = currentUser?.id;
	const { isPending, isError, data, error } = useQuery({
		queryKey: ['lists'],
		// @ts-ignore
		queryFn: () => getLists(id),
		enabled: !!id,
	});
	useEffect(() => {
		if (!data) {
			return;
		}
		setSortedLists(listsSorter(data.data));
	}, [data]);
	return (
		<div className='flex flex-col md:min-w-[640px]'>
			<div className='pt-4 pb-4 px-4 md:pt-12 md:px-10'>
				<h2 className='text-xl font-medium'>Shopping history</h2>
			</div>
			{isPending ? <span>Loading...</span> : null}
			{isError ? <span>Error: {error.message}</span> : null}
			{data && sortedLists ? (
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
				<span>Something went wrong</span>
			)}
		</div>
	);
}
