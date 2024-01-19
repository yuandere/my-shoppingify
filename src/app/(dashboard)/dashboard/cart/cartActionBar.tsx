import { useState, useContext, useRef, useEffect } from 'react';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { useQuery } from '@tanstack/react-query';
import {
	CartStatesContext,
	DashboardStatesContext,
} from '@/app/(dashboard)/providers';
import { getLists } from '@/lib/fetchers';
import {
	useMutateListComplete,
	useMutateListDelete,
	useMutateListName,
} from '@/lib/mutations/list-mutations';
import '@/styles/radix-alert-dialog.css';

export default function CartActionBar() {
	const [newListName, setNewListName] = useState<string>('');
	const [isCompleted, setCompleted] = useState<boolean>(false);
	const cartStates = useContext(CartStatesContext);
	const dashboardStates = useContext(DashboardStatesContext);
	const selectedList = dashboardStates?.selectedList;
	const listId = selectedList?.id;
	const nameInputRef = useRef<HTMLInputElement>(null);

	const mutateName = useMutateListName(listId, newListName);
	const mutateComplete = useMutateListComplete(listId, !isCompleted);
	const mutateDelete = useMutateListDelete(listId);

	const { data } = useQuery({
		queryKey: ['lists'],
		queryFn: () => getLists(),
		enabled: !!listId,
	});

	const handleSaveListName = () => {
		if (!selectedList?.id || !nameInputRef.current) return;
		mutateName.mutate();
		nameInputRef.current.value = '';
	};

	useEffect(() => {
		if (!data) return;
		//TODO: improve api instead of using this workaround
		for (const list of data.data) {
			if (!list) return;
			if (list.id === listId) {
				setCompleted(list.completed);
				return;
			}
		}
	}, [data, listId]);

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
							onChange={(e) => setNewListName(e.target.value)}
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
											onClick={() => mutateDelete.mutate()}
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
							if (selectedList) mutateComplete.mutate();
						}}
					>
						{isCompleted ? 'Undo complete' : 'Complete'}
					</button>
				</div>
			)}
		</>
	);
}
