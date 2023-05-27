import { useContext } from 'react';
import Image from 'next/image';
import {
	CartStatesContext,
	CurrentUserContext,
} from '@/app/(dashboard)/providers';
// TODO: remove CurrentUserContext, make itemdata a required prop

export default function CartViewItem() {
	const cartStates = useContext(CartStatesContext);
	// TODO*: remove this line
	const exampleData = useContext(CurrentUserContext)?.currentUser.itemsData[0];

	return (
		<div className='flex flex-col items-center w-72 h-screen p-8 bg-white sm:w-80'>
			<p
				className='self-start text-xs font-medium cursor-pointer text-orange-400 transition hover:text-orange-600'
				onClick={() => {
					cartStates?.setIsCartViewingItem(false);
				}}
			>
				🡐 back
			</p>
			<div
				className={`h-44 w-full mt-6 rounded-2xl overflow-hidden${
					exampleData?.img ? '' : ' grid place-items-center w-20'
				}`}
			>
				<Image
					src={
						exampleData?.img
							? exampleData.img
							: 'https://img.icons8.com/?size=64&id=j1UxMbqzPi7n&format=png'
					}
					height={200}
					width={300}
					alt='image for item'
					className={exampleData?.img ? 'h-full w-full object-cover' : 'object-none'}
				></Image>
			</div>
			<div className='w-full mt-4'>
				<p className='text-xs text-ui mt-6'>name</p>
				<h1 className='mt-1 text-lg'>{exampleData?.name}</h1>
				{exampleData?.categoryName ? (
					<>
						<p className='text-xs text-ui mt-6'>category</p>
						<h1 className='mt-1'>{exampleData.categoryName}</h1>
					</>
				) : null}
				{exampleData?.note ? (
					<>
						<p className='text-xs text-ui mt-6'>note</p>
						<h1 className='mt-1'>{exampleData.note}</h1>
					</>
				) : null}
			</div>
			<div className='flex items-center mt-8 space-x-1'>
				<p
					className='w-28 text-center text-sm cursor-pointer hover:underline'
					onClick={() => {
						console.log('delete clicked');
					}}
				>
					delete
				</p>
				<button
					className='grid place-items-center w-28 h-12 rounded-lg bg-orange-400 text-white text-sm cursor-pointer transition hover:bg-orange-600'
					onClick={() => {
						console.log('add item to list clicked');
					}}
				>
					Add to list
				</button>
			</div>
		</div>
	);
}
