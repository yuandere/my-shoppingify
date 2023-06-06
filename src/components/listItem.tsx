import { useContext, useState, useRef, useEffect } from 'react';
import { CartStatesContext } from '@/app/(dashboard)/providers';
import { IListItem } from '@/@types/dashboard';

export default function ListItem({ listItem }: { listItem: IListItem }) {
	const [isEditingListItem, setIsEditingListItem] = useState<boolean>(false);
	const [isChecked, setIsChecked] = useState<boolean>(false);
	const [itemQuantity, setItemQuantity] = useState<number>(0);
	const cartStates = useContext(CartStatesContext);
	const listItemRef = useRef<HTMLDivElement>(null);
	const checkboxRef = useRef<HTMLInputElement>(null);

	// TODO: add logic to update checked
	const handleListItemClick = () => {
		if (cartStates?.isCartEditingState) {
			if (!isEditingListItem) {
				setIsEditingListItem(true);
			} else {
				setIsEditingListItem(false);
			}
		} else if (checkboxRef.current) {
			checkboxRef.current.click();
		}
	};

	const handleQuantityChange = (add: boolean) => {
		if (add && itemQuantity < 99) {
			setItemQuantity(itemQuantity + 1);
		} else if (!add && itemQuantity > 1) {
			setItemQuantity(itemQuantity - 1);
		}
	};

	const updateQuantityReq = () => {
		// check for changes to list copy before API call?
		console.log('API req to update quantity called');
	};

	useEffect(() => {
		setItemQuantity(listItem.quantity);
	}, [listItem.quantity]);

	useEffect(() => {
		if (!cartStates?.isCartEditingState && isEditingListItem) {
			setIsEditingListItem(false);
			updateQuantityReq();
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
				updateQuantityReq();
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [listItemRef, isEditingListItem]);

	return (
		<div
			className={`flex items-center justify-between -mb-2 py-1 px-2 w-full rounded-lg bg-theme-3 hover:drop-shadow-[0_2px_9px_rgba(0,0,0,0.14)] cursor-pointer`}
			onClick={() => {
				handleListItemClick();
			}}
			ref={listItemRef}
		>
			{cartStates?.isCartEditingState ? null : (
				<input
					ref={checkboxRef}
					type='checkbox'
					className='accent-theme-1 bg-white w-4 h-4 cursor-pointer'
					checked={isChecked ? true : false}
					onChange={(e) => {
						console.log('checkbox clicked');
						if (e.target.checked === true) {
							setIsChecked(true);
							console.log('req to check');
						} else {
							setIsChecked(false);
							console.log('req to uncheck');
						}
					}}
					onClick={(e) => {
						e.stopPropagation();
					}}
				></input>
			)}
			<p
				className={`w-3/5 font-medium select-none break-words${
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
							handleQuantityChange(false);
						}}
					>
						remove
					</span>
					<div className='grid place-items-center w-14 h-7 rounded-full text-xs font-medium border-2 border-theme-1 select-none'>
						<p className='text-theme-1'>{itemQuantity} pcs</p>
					</div>
					<span
						className='material-icons m-1 text-theme-1 cursor-pointer transition select-none text-xl hover:text-orange-600'
						onClick={(e) => {
							e.stopPropagation();
							handleQuantityChange(true);
						}}
					>
						add
					</span>
				</div>
			) : (
				<div className='grid place-items-center w-14 h-7 rounded-full text-xs font-medium border-2 border-theme-1'>
					<p className='text-theme-1'>{itemQuantity} pcs</p>
				</div>
			)}
		</div>
	);
}
