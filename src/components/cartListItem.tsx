import { useContext, useState, useRef, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
	CartStatesContext,
	DashboardStatesContext,
} from '@/app/(dashboard)/providers';
import { IListItem, IListItemsResponse } from '@/@types/dashboard';

export default function CartListItem({ listItem }: { listItem: IListItem }) {
	const [isEditingListItem, setIsEditingListItem] = useState<boolean>(false);
	const [isChecked, setIsChecked] = useState<boolean>(listItem.checked);
	const [itemQuantity, setItemQuantity] = useState<number>(listItem.quantity);
	const listItemRef = useRef<HTMLDivElement>(null);
	const checkboxRef = useRef<HTMLInputElement>(null);
	const dashStates = useContext(DashboardStatesContext);
	const cartStates = useContext(CartStatesContext);
	const queryClient = useQueryClient();

	const mutateQuantity = useMutation({
		mutationFn: () => {
			const data = {
				action: 'quantity',
				quantity: itemQuantity,
				listId: listItem.listId,
				listItemId: listItem.id,
			};
			return fetch('/api/listItem', {
				method: 'POST',
				body: JSON.stringify(data),
			});
		},
		onSuccess: () => {
			queryClient.setQueryData(
				['listItems', listItem.listId],
				(oldData: IListItemsResponse) => {
					if (!oldData) {
						return oldData;
					}
					const changeIndex = oldData.data.findIndex(
						(item) => item.id === listItem.id
					);
					let clonedData = { ...oldData };
					clonedData.data = oldData.data.map((a) => {
						return { ...a };
					});
					clonedData.data[changeIndex].quantity = itemQuantity;
					return clonedData;
				}
			);
			// TODO: do something here to cause rerendering in historyview
		},
		onError: (error) => {
			const err = error as Error;
			console.error(error);
			dashStates?.setToastProps({
				title: 'Error',
				content: err.message,
				altText: err.message,
				style: 'Danger',
			});
			dashStates?.setToastOpen(true);
			setItemQuantity(listItem.quantity);
		},
	});

	const mutateChecked = useMutation({
		mutationFn: (check: boolean) => {
			const data = {
				action: 'check',
				checked: check,
				listId: listItem.listId,
				listItemId: listItem.id,
			};
			return fetch('/api/listItem', {
				method: 'POST',
				body: JSON.stringify(data),
			});
		},
		onSuccess: () => {
			queryClient.setQueryData(
				['listItems', listItem.listId],
				(oldData: IListItemsResponse) => {
					if (!oldData || mutateChecked.variables === undefined) {
						return oldData;
					}
					const changeIndex = oldData.data.findIndex(
						(item) => item.id === listItem.id
					);
					let clonedData = { ...oldData };
					clonedData.data = oldData.data.map((a) => {
						return { ...a };
					});
					clonedData.data[changeIndex].checked = mutateChecked.variables;
					console.log('cloned:', clonedData.data[changeIndex].checked);
					return clonedData;
				}
			);
			if (mutateChecked.variables != undefined) {
				setIsChecked(mutateChecked.variables);
			}
		},
		onError: (error) => {
			const err = error as Error;
			console.error(error);
			dashStates?.setToastProps({
				title: 'Error',
				content: err.message,
				altText: err.message,
				style: 'Danger',
			});
			dashStates?.setToastOpen(true);
		},
	});

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

	// TODO: add logic to delete list item and toast here
	const handleDeleteListItem = (
		event: React.MouseEvent<HTMLDivElement, MouseEvent>
	) => {
		console.log('handleDeleteListItem', event.currentTarget);
	};

	const handleQuantityChange = (add: boolean) => {
		if (add && itemQuantity < 99) {
			setItemQuantity(itemQuantity + 1);
		} else if (!add && itemQuantity > 1) {
			setItemQuantity(itemQuantity - 1);
		}
	};

	useEffect(() => {
		if (!isEditingListItem && itemQuantity != listItem.quantity) {
			mutateQuantity.mutate();
		}
	}, [isEditingListItem, itemQuantity, listItem.quantity, mutateQuantity]);

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
						if (e.target.checked === true) {
							mutateChecked.mutate(true);
						} else {
							mutateChecked.mutate(false);
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
							handleDeleteListItem(e);
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
