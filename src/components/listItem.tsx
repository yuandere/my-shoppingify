import { useContext, useState, useRef, useEffect } from 'react';
import { CartStatesContext } from '@/app/(dashboard)/providers';
import { IListItem } from '@/@types/dashboard';

export default function ListItem({ listItem }: { listItem: IListItem }) {
	const [isEditingListItem, setIsEditingListItem] = useState<boolean>(false);
	const [isChecked, setIsChecked] = useState<boolean>(false);
	const cartStates = useContext(CartStatesContext);
	const listItemRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!cartStates?.isCartEditingState && isEditingListItem) {
			setIsEditingListItem(false);
		}
	}, [cartStates?.isCartEditingState, isEditingListItem]);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent): void => {
			if (
				isEditingListItem &&
				listItemRef.current &&
				!listItemRef.current.contains(event.target as Node)
			) {
				setIsEditingListItem(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [listItemRef, isEditingListItem]);

	// TODO add logic to compare new quanitity against old before updating
	return (
		<div
			className={`flex items-center justify-between -mb-2 py-1 px-2 w-full rounded-lg bg-theme-3 hover:drop-shadow-[0_2px_9px_rgba(0,0,0,0.14)]${
				cartStates?.isCartEditingState ? ' cursor-pointer' : null
			}`}
			onClick={() => {
				if (cartStates?.isCartEditingState && !isEditingListItem) {
					setIsEditingListItem(true);
				} else {
					setIsEditingListItem(false);
				}
				console.log('div clicked, item editing:', isEditingListItem);
			}}
			ref={listItemRef}
		>
			{cartStates?.isCartEditingState ? null : (
				<input
					type='checkbox'
					className='accent-theme-1 bg-white w-4 h-4 cursor-pointer'
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
				<div className='flex items-center rounded-lg bg-white'>
					<div
						className='grid items-center bg-theme-1 rounded-lg text-white cursor-pointer transition select-none hover:bg-orange-600'
						onClick={(e) => {
							e.stopPropagation();
						}}
					>
						<span className='material-icons-outlined m-1 text-lg'>delete</span>
					</div>
					<span
						className='material-icons m-1 text-theme-1 cursor-pointer transition select-none text-xl hover:text-orange-600'
						onClick={(e) => {
							e.stopPropagation();
						}}
					>
						remove
					</span>
					<div className='grid place-items-center w-14 h-7 rounded-full text-xs font-medium border-2 border-theme-1 select-none'>
						<p className='text-theme-1'>{listItem.quantity} pcs</p>
					</div>
					<span
						className='material-icons m-1 text-theme-1 cursor-pointer transition select-none text-xl hover:text-orange-600'
						onClick={(e) => {
							e.stopPropagation();
						}}
					>
						add
					</span>
				</div>
			) : (
				<div className='grid place-items-center w-14 h-7 rounded-full text-xs font-medium border-2 border-theme-1'>
					<p className='text-theme-1'>{listItem.quantity} pcs</p>
				</div>
			)}
		</div>
	);
}
