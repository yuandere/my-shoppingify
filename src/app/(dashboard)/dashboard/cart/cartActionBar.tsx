import { useState, useContext } from 'react';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import {
	CartStatesContext,
	CurrentUserContext,
} from '@/app/(dashboard)/providers';
import '@/styles/radix-alert-dialog.css';

export default function CartActionBar() {
	const [newListName, setNewListName] = useState<string>('');
	const [isListSaved, setIsListSaved] = useState<boolean>(false);
	const cartStates = useContext(CartStatesContext);
	const currentUser = useContext(CurrentUserContext)?.currentUser;
	// const isListCompleted = currentUser?.userShoppingLists[0].completed;
	const handleSaveList = () => {
		console.log('handle save list');
	};
	const handleCompleteList = () => {
		console.log('handle complete list');
	};
	const handleDeleteList = () => {
		console.log('handle delete list');
	};
	return (
		<>
			{/* ACTION BAR states: 1. cart editing 2. cart completing*/}
			{cartStates?.isCartEditingState ? (
				<div className='flex items-center justify-center w-full mt-auto h-28 bg-white space-x-1'>
					<div className='relative flex flex-col items-center justify-center mx-8'>
						<input
							className='h-12 pl-4 w-full flex items-center rounded-xl outline-none text-sm shadow-[0_0_0_2px_#f9a109]'
							type='text'
							placeholder='Enter a name'
							maxLength={22}
							onChange={(e) => {
								setNewListName(e.target.value);
							}}
						></input>
						<button
							className='absolute -right-[81px] grid place-items-center w-20 h-12 rounded-xl bg-theme-1 text-white text-sm cursor-pointer transition -translate-x-full hover:bg-orange-500'
							onClick={() => {
								handleSaveList();
							}}
						>
							Save
						</button>
					</div>
				</div>
			) : (
				<div className='flex items-center justify-center w-full mt-auto h-28 bg-white space-x-1'>
					<AlertDialog.Root>
						<AlertDialog.Trigger asChild>
							<p className='w-28 text-center text-sm cursor-pointer hover:underline'>
								cancel
							</p>
						</AlertDialog.Trigger>
						<AlertDialog.Portal>
							<AlertDialog.Overlay className='AlertDialogOverlay' />
							<AlertDialog.Content className='AlertDialogContent'>
								<AlertDialog.Description className='AlertDialogDescription'>
									Are you sure that you want to delete the list? This action
									cannot be undone.
								</AlertDialog.Description>
								<div className='flex items-center self-end w-max mt-8'>
									<AlertDialog.Cancel asChild>
										<p className='w-28 text-center text-sm cursor-pointer hover:underline'>
											cancel
										</p>
									</AlertDialog.Cancel>
									<AlertDialog.Action asChild>
										<button
											className='grid place-items-center w-20 h-12 rounded-lg bg-red-500 text-white text-sm cursor-pointer transition hover:bg-red-600'
											onClick={() => {
												handleDeleteList();
											}}
										>
											Yes
										</button>
									</AlertDialog.Action>
								</div>
							</AlertDialog.Content>
						</AlertDialog.Portal>
					</AlertDialog.Root>
					<button
						className='grid place-items-center w-28 h-12 rounded-lg bg-complete text-white text-sm cursor-pointer transition hover:bg-sky-500'
						onClick={() => {
							handleCompleteList();
						}}
					>
						Complete
					</button>
				</div>
			)}
		</>
	);
}
