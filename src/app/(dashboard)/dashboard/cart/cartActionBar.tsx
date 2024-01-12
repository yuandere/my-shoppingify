import { useState, useContext, useRef } from 'react';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import {
	CartStatesContext,
	DashboardStatesContext,
} from '@/app/(dashboard)/providers';
import useMutateListName from '@/lib/mutations/useMutateListName';
import '@/styles/radix-alert-dialog.css';

export default function CartActionBar() {
	const [newListName, setNewListName] = useState<string>('');
	const cartStates = useContext(CartStatesContext);
	const dashboardStates = useContext(DashboardStatesContext);
	const selectedList = dashboardStates?.selectedList;
	const nameInputRef = useRef<HTMLInputElement>(null);

	const mutateName = useMutateListName(selectedList?.id, newListName);

	const handleSaveListName = () => {
		if (!selectedList?.id || !nameInputRef.current) return;
		mutateName.mutate();
		nameInputRef.current.value = '';
	};
	const handleCompleteList = () => {
		console.log('handle complete list');
	};
	const handleDeleteList = () => {
		console.log('handle delete list');
	};
	return (
		<>
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
							ref={nameInputRef}
						></input>
						<button
							className='absolute -right-[81px] grid place-items-center w-20 h-12 rounded-xl bg-theme-1 text-white text-sm cursor-pointer transition -translate-x-full hover:bg-orange-500'
							onClick={() => handleSaveListName()}
						>
							Save
						</button>
					</div>
				</div>
			) : (
				<div className='flex items-center justify-center w-full mt-auto h-28 bg-white space-x-1'>
					<AlertDialog.Root>
						{selectedList ? (
							<AlertDialog.Trigger asChild>
								<p className='w-28 text-center text-sm cursor-pointer hover:underline'>
									cancel
								</p>
							</AlertDialog.Trigger>
						) : (
							<p className='w-28 text-center text-sm cursor-not-allowed text-gray-400 hover:underline'>
								cancel
							</p>
						)}
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
						className={`grid place-items-center w-28 h-12 rounded-lg text-white text-sm transition ${
							selectedList
								? 'cursor-pointer bg-complete hover:bg-sky-500'
								: 'cursor-not-allowed bg-gray-300'
						}`}
						onClick={() => {
							if (selectedList) {
								handleCompleteList();
							}
						}}
					>
						Complete
					</button>
				</div>
			)}
		</>
	);
}
