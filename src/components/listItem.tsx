import { useState } from 'react';
import { IListItem } from '@/@types/dashboard';

export default function ListItem({ listItem }: { listItem: IListItem }) {
	return (
		<div className='flex items-center'>
			<div className='h-2 w-2 border border-black'></div>
			<p>{listItem.name}</p>
			<div className='rounded-full border border-red'>
				<p>{listItem.quantity} pcs</p>
			</div>
		</div>
	);
}
