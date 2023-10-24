import { useContext, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CurrentUserContext } from '../providers';
import ShoppingList from '@/components/shoppingList';
import { getLists } from '@/lib/fetchers';
import { IList } from '@/@types/dashboard';

export default function HistoryView() {
	const [lists, setLists] = useState<Array<IList> | null>(null);
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
		console.log(data.data);
		setLists(data.data);
	}, [data]);
	return (
		<div className='flex flex-col md:min-w-[640px]'>
			<div className='pt-4 pb-4 px-4 md:pt-12 md:px-10'>
				<h2 className='text-xl font-medium'>Shopping history</h2>
			</div>
			{isPending ? <span>Loading...</span> : null}
			{isError ? <span>Error: {error.message}</span> : null}
			{data && lists ? (
				lists.map((list, i) => {
					return (
						<ShoppingList
							listProps={list}
							key={`shoppinglist-${i}`}
						></ShoppingList>
					);
				})
			) : (
				<span>Something went wrong</span>
			)}
		</div>
	);
}
