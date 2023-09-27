import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Toast } from '../toast';
import { IToastProps } from '@/@types/dashboard';
import '@/styles/radix-dialog.css';

interface ICategoryDialog {
	setCategoryFetchFlag: React.Dispatch<React.SetStateAction<boolean>>;
	categoryFetchRef: React.MutableRefObject<boolean>;
}

export default function CategoryDialog({
	setCategoryFetchFlag,
	categoryFetchRef,
}: ICategoryDialog) {
	const [toastOpen, setToastOpen] = useState<boolean>(false);
	const [toastProps, setToastProps] = useState<IToastProps>({
		title: 'Title',
		content: 'Content',
		altText: 'generic text',
	});
	const [newCategoryName, setNewCategoryName] = useState<string>('');

	const handleAddCategory = async () => {
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
					title: 'Success',
					content: 'Category added',
					altText: 'your category has been added',
					style: 'Success',
				});
				setToastOpen(true);
				categoryFetchRef.current = false;
				setCategoryFetchFlag(true);
			})
			.catch((error) => {
				console.log(error);
				setToastProps({
					title: 'Error',
					content: 'Category not added',
					altText: 'your category was not added',
					style: 'Error',
				});
				setToastOpen(true);
			});
	};

	return (
		<>
			<Toast
				open={toastOpen}
				onOpenChange={setToastOpen}
				title={toastProps.title}
				content={toastProps.content}
				altText={toastProps.altText}
				style={toastProps.style}
			></Toast>
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
		</>
	);
}
