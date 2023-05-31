import { useContext, useState, useEffect } from 'react';
import * as Form from '@radix-ui/react-form';
import {
	CartStatesContext,
	CurrentUserContext,
} from '@/app/(dashboard)/providers';
import CategoryDialog from './cartCategoryDialog';
import '@/styles/radix-form.css';

// TODO: hookup add new item and category info to db

export default function CartAddItem() {
	const [categoriesList, setCategoriesList] = useState<
		Array<string> | undefined
	>(undefined);
	const cartStates = useContext(CartStatesContext);
	const categories = useContext(CurrentUserContext)?.currentUser.categoriesData;
	useEffect(() => {
		setCategoriesList(categories);
	}, [categories]);

	return (
		<div className='flex flex-col items-center w-72 h-screen p-8 bg-light sm:w-80'>
			<h1 className='text-lg font-medium'>Add a new item</h1>
			<Form.Root className='FormRoot'>
				<Form.Field className='FormField' name='name'>
					<div className='flex items-baseline justify-between'>
						<Form.Label className='FormLabel'>Name</Form.Label>
						<Form.Message className='FormMessage' match='valueMissing'>
							Please enter a name
						</Form.Message>
						<Form.Message className='FormMessage' match='tooLong'>
							Name is too long
						</Form.Message>
					</div>
					<Form.Control asChild>
						<input
							className='Input'
							type='text'
							required
							maxLength={22}
							placeholder='Enter a name'
						/>
					</Form.Control>
				</Form.Field>
				<Form.Field className='FormField' name='note'>
					<div className='flex items-baseline justify-between'>
						<Form.Label className='FormLabel'>Note (optional)</Form.Label>
						<Form.Message className='FormMessage' match='tooLong'>
							{'<X chars pls'}
						</Form.Message>
					</div>
					<Form.Control asChild>
						<textarea
							className='Textarea'
							maxLength={999}
							placeholder='Enter a note'
						/>
					</Form.Control>
				</Form.Field>
				<Form.Field className='FormField' name='img'>
					<div className='flex items-baseline justify-between'>
						<Form.Label className='FormLabel'>Image (optional)</Form.Label>
						<Form.Message className='FormMessage' match='typeMismatch'>
							Invalid url
						</Form.Message>
					</div>
					<Form.Control asChild>
						<input className='Input' type='url' placeholder='Enter a url' />
					</Form.Control>
				</Form.Field>
				<Form.Field className='FormField' name='category'>
					<div className='flex items-baseline justify-between'>
						<Form.Label className='FormLabel'>Category (optional)</Form.Label>
					</div>
					<Form.Control asChild>
						<select className='Select'>
							<option value=''></option>
							{categoriesList?.map((category, idx) => {
								return (
									<option key={`category-${idx}`} value={category} className='font-sans'>
										{category}
									</option>
								);
							})}
						</select>
					</Form.Control>
				</Form.Field>
				<CategoryDialog
					categoriesList={categoriesList}
					setCategoriesList={setCategoriesList}
				></CategoryDialog>
				<div className='flex items-center justify-center mt-8 space-x-1'>
					<button className='grid place-items-center'>
						<p
							className='w-28 text-center text-sm cursor-pointer hover:underline'
							onClick={() => {
								cartStates?.setIsCartAddingItem(false);
							}}
						>
							cancel
						</p>
					</button>

					<Form.Submit asChild>
						<button
							className='grid place-items-center w-28 h-12 rounded-lg bg-orange-400 text-white text-sm cursor-pointer transition hover:bg-orange-600'
							onClick={() => {
								console.log('save new item clicked');
							}}
						>
							Save
						</button>
					</Form.Submit>
				</div>
			</Form.Root>
		</div>
	);
}
