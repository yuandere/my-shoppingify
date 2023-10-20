import { useContext, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CurrentUserContext } from '../../app/(dashboard)/providers';

export default function HistoryView() {
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
	}, [data]);
	return (
		<div className='flex flex-col md:min-w-[640px]'>
			<div className='pt-4 pb-4 px-4 md:pt-12 md:px-10'>
				<h2 className='text-xl font-medium'>Shopping history</h2>
			</div>
		</div>
	);
}
