import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import '@/styles/radix-dialog.css';

interface ICategoryDialog {
	categoriesList: Array<string> | undefined;
	setCategoriesList: React.Dispatch<React.SetStateAction<string[] | undefined>>;
}

export default function CategoryDialog({
	categoriesList,
	setCategoriesList,
}: ICategoryDialog) {
	const [newCategoryName, setNewCategoryName] = useState<string>('');

	let newCategoriesList: string[] = [];
	if (categoriesList != undefined) {
		newCategoriesList = [...categoriesList];
	}

	return (
		<Dialog.Root>
			<Dialog.Trigger asChild>
				<button className='ButtonDialog white text-sm w-full h-10 mt-2 transition bg-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.1)] hover:drop-shadow-[0_2px_9px_rgba(0,0,0,0.14)]'>
					Add category
				</button>
			</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Overlay className='DialogOverlay' />
				<Dialog.Content className='DialogContent'>
					{/* <Dialog.Title className='DialogTitle'>Add category</Dialog.Title> */}
					<Dialog.Description className='DialogDescription'>
						Enter a new item category here
					</Dialog.Description>
					<fieldset className='Fieldset'>
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
								className='ButtonDialog green h-10'
								onClick={() => {
									newCategoriesList.push(newCategoryName);
									setCategoriesList(newCategoriesList);
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
