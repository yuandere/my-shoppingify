import { useContext } from 'react';
import Image from 'next/image';
import { useQueryClient } from '@tanstack/react-query';
import {
	CartStatesContext,
	DashboardStatesContext,
} from '@/app/(dashboard)/providers';

export default function CartViewItem() {
	const dashboardStates = useContext(DashboardStatesContext);
	const cartStates = useContext(CartStatesContext);
	const setToastOpen = dashboardStates?.setToastOpen;
	const setToastProps = dashboardStates?.setToastProps;
	const itemData = dashboardStates?.selectedItem;
	const queryClient = useQueryClient();

	const handleDelete = async () => {
		if (!itemData || !setToastOpen || !setToastProps) {
			return;
		}
		const deleteRequest = new Request('/api/itemCard', {
			method: 'POST',
			body: JSON.stringify({
				action: 'delete',
				itemId: itemData.id,
			}),
		});
		fetch(deleteRequest)
			.then((response) => {
				return response.json();
			})
			.then((value) => {
				if (value.success === true) {
					setToastProps({
						title: 'Success',
						content: 'Your item has been deleted',
						altText: 'your item has been deleted',
						style: 'Success',
					});
					setToastOpen(true);
					cartStates?.setIsCartViewingItem(false);
					queryClient.invalidateQueries({ queryKey: ['itemCards'] });
				} else {
					setToastProps({
						title: 'Error',
						content: 'Item not deleted',
						altText: 'your item was not deleted',
						style: 'Danger',
					});
					setToastOpen(true);
				}
			})
			.catch((err) => {
				console.log(err);
				setToastProps({
					title: 'Error',
					content: 'Item not deleted',
					altText: 'your item was not deleted',
					style: 'Danger',
				});
				setToastOpen(true);
			});
	};

	const handleAddToList = async () => {
		console.log('under construction');
	};

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
					itemData?.imageUrl ? '' : ' grid place-items-center w-20'
				}`}
			>
				<Image
					src={
						itemData?.imageUrl
							? itemData.imageUrl
							: 'https://img.icons8.com/?size=64&id=j1UxMbqzPi7n&format=png'
					}
					height={200}
					width={300}
					alt='image for item'
					className={
						itemData?.imageUrl ? 'h-full w-full object-cover' : 'object-none'
					}
				></Image>
			</div>
			<div className='w-full mt-4'>
				<p className='text-xs text-ui mt-6'>name</p>
				<h1 className='mt-1 text-lg'>{itemData?.name}</h1>
				{itemData?.categoryName ? (
					<>
						<p className='text-xs text-ui mt-6'>category</p>
						<h1 className='mt-1'>{itemData.categoryName}</h1>
					</>
				) : null}
				{itemData?.description ? (
					<>
						<p className='text-xs text-ui mt-6'>description</p>
						<h1 className='mt-1'>{itemData.description}</h1>
					</>
				) : null}
			</div>
			<div className='flex items-center mt-8 space-x-1'>
				<p
					className='w-28 text-center text-sm cursor-pointer hover:underline'
					onClick={() => handleDelete()}
				>
					delete
				</p>
				<button
					className='grid place-items-center w-28 h-12 rounded-lg bg-orange-400 text-white text-sm cursor-pointer transition hover:bg-orange-600'
					onClick={() => handleAddToList()}
				>
					Add to list
				</button>
			</div>
		</div>
	);
}
