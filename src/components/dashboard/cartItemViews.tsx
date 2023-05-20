import { useContext } from 'react';
import { CartStatesContext } from '@/app/(dashboard)/providers';

export function CartAddItem() {
	const cartStates = useContext(CartStatesContext);
	return (
		<div className='flex flex-col items-center w-64 h-screen bg-light sm:w-72'>
			<h1 className='text-lg font-medium'>Add a new item</h1>
			<form>
				<p>add item inputs go here</p>
			</form>
			<button
				className='rounded-full bg-theme-1 text-white'
				onClick={() => {
					cartStates?.setIsCartAddingItem(false);
				}}
			>
				cancel
			</button>
		</div>
	);
}

export function CartViewItem() {
	const cartStates = useContext(CartStatesContext);
	return (
		<div className='flex flex-col items-center w-64 h-screen bg-white sm:w-72'>
			<p className=''>cartviewitem</p>
			<button
				className='rounded-full bg-theme-1 text-white'
				onClick={() => {
					cartStates?.setIsCartViewingItem(false);
				}}
			>
				back
			</button>
		</div>
	);
}
