import { useContext, useState } from 'react';
import { CartStatesContext } from '@/app/(dashboard)/providers';
import { IListItem } from '@/@types/dashboard';

export default function ListItem({ listItem }: { listItem: IListItem }) {
	const [isEditingListItem, setIsEditingListItem] = useState<boolean>(true);
	const [isChecked, setIsChecked] = useState<boolean>(false);
	const cartStates = useContext(CartStatesContext);
	return (
		<div
			className='flex items-center justify-between -mb-2 py-1 px-2 w-full rounded-lg bg-theme-3 hover:drop-shadow-[0_2px_9px_rgba(0,0,0,0.14)]'
			onClick={() => {
				if (cartStates?.isCartEditingState && !isEditingListItem) {
					setIsEditingListItem(true);
				} else {
					setIsEditingListItem(false);
				}
			}}
		>
			{cartStates?.isCartEditingState ? null : (
				<input
					type='checkbox'
					className='accent-theme-1 bg-white w-4 h-4'
					onChange={(e) => {
						console.log('checkbox clicked');
						if (e.target.checked === true) {
							setIsChecked(true);
						} else {
							setIsChecked(false);
						}
					}}
					onClick={(e) => {
						e.stopPropagation();
					}}
				></input>
			)}
			<p
				className={`w-3/5 font-medium break-words${
					isChecked ? ' line-through' : ''
				}`}
			>
				{listItem.name}
			</p>
			{isEditingListItem ? (
				<div className='flex items-center bg-white'>
					<div className='grid items-center bg-theme-1 rounded-lg text-white text-sm cursor-pointer transition hover:bg-orange-600'>
						<span className='material-icons-outlined'>delete</span>
					</div>
					<span className='material-icons text-theme-1 cursor-pointer transition hover:text-orange-600'>
						remove
					</span>
					<div className='grid place-items-center w-14 h-8 rounded-full text-xs border-2 border-theme-1'>
						<p className='text-theme-1'>{listItem.quantity} pcs</p>
					</div>
					<span className='material-icons text-theme-1 cursor-pointer transition hover:text-orange-600'>
						add
					</span>
				</div>
			) : (
				<div className='grid place-items-center w-14 h-8 rounded-full text-xs border-2 border-theme-1'>
					<p className='text-theme-1'>{listItem.quantity} pcs</p>
				</div>
			)}
		</div>
	);
}
