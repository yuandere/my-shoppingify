import { useState, useContext } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import * as Dialog from '@radix-ui/react-dialog';
import { DashboardStatesContext } from '@/app/(dashboard)/providers';
import { ToastPresets } from '@/components/toast';
import '@/styles/radix-dialog.css';

export default function CategoryDialog() {
	const [newCategoryName, setNewCategoryName] = useState<string>('');
	const dashboardStates = useContext(DashboardStatesContext);
	const setToastOpen = dashboardStates?.setToastOpen;
	const setToastProps = dashboardStates?.setToastProps;
	const queryClient = useQueryClient();

	const handleAddCategory = async () => {
		if (setToastOpen === undefined || setToastProps === undefined) {
			return;
		}
		const categoriesRequest = new Request('/api/util', {
			method: 'POST',
			body: `{"action": "addCategory",
		"name": "${newCategoryName}"}`,
		});
		fetch(categoriesRequest)
			.then((response) => {
				return response.json();
			})
			.then(() => {
				setToastProps({
					preset: ToastPresets.success,
					content: 'Category added',
				});
				setToastOpen(true);
				queryClient.invalidateQueries({ queryKey: ['itemCategories'] });
			})
			.catch((error) => {
				console.log(error);
				setToastProps({
					preset: ToastPresets.error,
					content: 'Category not added',
				});
				setToastOpen(true);
			});
	};

	return (
		<Dialog.Root>
			<Dialog.Trigger asChild>
				<button className='ButtonDialog white w-full text-sm h-10 mt-2 transition bg-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.1)] hover:drop-shadow-[0_2px_9px_rgba(0,0,0,0.14)]'>
					Add category
				</button>
			</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Overlay className='DialogOverlay' />
				<Dialog.Content className='DialogContent'>
					<Dialog.Description className='DialogDescription'>
						Enter a new item category here
					</Dialog.Description>
					<fieldset className='Fieldset mt-8'>
						<label className='Label' htmlFor='name'>
							Name
						</label>
						<input
							className='Input'
							id='name'
							defaultValue=''
							autoComplete='off'
							maxLength={48}
							onChange={(e) => {
								setNewCategoryName(e.target.value);
							}}
						/>
					</fieldset>
					<div
						style={{
							display: 'flex',
							marginTop: 25,
							justifyContent: 'flex-end',
						}}
					>
						<Dialog.Close asChild>
							<button
								className='ButtonDialog px-[15px] green h-10'
								onClick={() => {
									if (newCategoryName === '') {
										return;
									}
									handleAddCategory();
								}}
							>
								Add
							</button>
						</Dialog.Close>
					</div>
					<Dialog.Close asChild>
						<button className='IconButtonDialog' aria-label='Close'>
							<span className='material-icons transition text-ui cursor-pointer hover:text-ui-dark'>
								close
							</span>
						</button>
					</Dialog.Close>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
