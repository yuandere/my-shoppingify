import { useState } from 'react';
import { IListItem } from '@/@types/dashboard';

export default function ListItem({ listItem }: { listItem: IListItem }) {
	const [isEditingListItem, setIsEditingListItem] = useState<boolean>(false);
	const [isChecked, setIsChecked] = useState<boolean>(false);
	return (
		<div className='flex items-center justify-between w-full'>
			<input
				type='checkbox'
				className='accent-theme-1'
				onChange={(e) => {
					console.log('checkbox clicked');
					if (e.target.checked === true) {
						setIsChecked(true);
					} else {
						setIsChecked(false);
					}
				}}
			></input>
			<p
				className={`w-3/5 font-medium break-words${
					isChecked ? ' line-through' : ''
				}`}
			>
				{listItem.name}
			</p>
			<div className='grid place-items-center w-14 h-8 rounded-full text-xs border-2 border-theme-1'>
				<p className='text-theme-1'>{listItem.quantity} pcs</p>
			</div>
		</div>
	);
}
