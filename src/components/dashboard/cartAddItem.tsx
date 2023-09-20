import { useContext, useState, useEffect, FormEvent } from 'react';
import * as Form from '@radix-ui/react-form';
import {
	CartStatesContext,
	CurrentUserContext,
} from '@/app/(dashboard)/providers';
import CategoryDialog from './cartCategoryDialog';
import { Toast } from '../toast';
import { IToastProps } from '@/@types/dashboard';
import '@/styles/radix-form.css';

// TODO: hookup add new item and category info to db
// TODO: add visual confirmation of any api calls (loading indicators, toasts, etc)

export default function CartAddItem() {
	const [toastOpen, setToastOpen] = useState<boolean>(false);
	const [toastProps, setToastProps] = useState<IToastProps>({
		title: 'Title',
		content: 'Content',
		altText: 'generic text',
	});
	const [categoriesList, setCategoriesList] = useState<
		Array<string> | undefined
	>(undefined);
	const cartStates = useContext(CartStatesContext);
	const categories = useContext(CurrentUserContext)?.currentUser.categoriesData;
	useEffect(() => {
		setCategoriesList(categories);
	}, [categories]);

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		const data = Object.fromEntries(new FormData(e.currentTarget));
		const newData: { [key: string]: string | FormDataEntryValue } = {
			action: 'add',
		};
		for (const key in data) {
			if (data[key] != '') {
				newData[key] = data[key];
			}
		}
		const addRequest = new Request('/api/itemCard', {
			method: 'POST',
			body: JSON.stringify(newData),
		});
		fetch(addRequest)
			.then((response) => {
				return response.json();
			})
			.then((value) => {
				if (value.success === true) {
					setToastProps({
						title: 'Success',
						content: 'Your item has been added',
						altText: 'your item has been added',
						style: 'Success',
					});
					setToastOpen(true);
					setTimeout(() => {
						cartStates?.setIsCartAddingItem(false);
					}, 5000);
				}
			})
			.catch((err) => {
				console.log(err);
				setToastProps({
					title: 'Error',
					content: 'Item not added',
					altText: 'your item was not added',
					style: 'Error',
				});
				setToastOpen(true);
			});
	};

	return (
		<div className='flex flex-col items-center w-72 h-screen p-8 bg-light sm:w-80'>
			<Toast
				open={toastOpen}
				onOpenChange={setToastOpen}
				title={toastProps.title}
				content='Your item has been added'
				altText='text alttext'
				style='Success'
			></Toast>
			<h1 className='text-lg font-medium'>Add a new item</h1>
			<Form.Root
				className='FormRoot'
				onSubmit={(e) => {
					handleSubmit(e);
					e.preventDefault();
				}}
			>
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
							autoComplete='off'
						/>
					</Form.Control>
				</Form.Field>
				<Form.Field className='FormField' name='description'>
					<div className='flex items-baseline justify-between'>
						<Form.Label className='FormLabel'>Note (optional)</Form.Label>
						<Form.Message className='FormMessage' match='tooLong'>
							{'<X chars pls'}
						</Form.Message>
					</div>
					<Form.Control asChild>
						<textarea
							className='Textarea'
							maxLength={128}
							placeholder='Enter a note'
						/>
					</Form.Control>
				</Form.Field>
				<Form.Field className='FormField' name='imageUrl'>
					<div className='flex items-baseline justify-between'>
						<Form.Label className='FormLabel'>Image (optional)</Form.Label>
						<Form.Message className='FormMessage' match='typeMismatch'>
							Invalid url
						</Form.Message>
					</div>
					<Form.Control asChild>
						<input
							className='Input'
							type='url'
							placeholder='Enter a url'
							autoComplete='off'
						/>
					</Form.Control>
				</Form.Field>
				<Form.Field className='FormField' name='categoryId'>
					<div className='flex items-baseline justify-between'>
						<Form.Label className='FormLabel'>Category (optional)</Form.Label>
					</div>
					<Form.Control asChild>
						<select className='Select'>
							<option value=''></option>
							{categoriesList?.map((category, idx) => {
								return (
									<option
										key={`category-${idx}`}
										value={category}
										className='font-sans'
									>
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
							type='submit'
							className='grid place-items-center w-28 h-12 rounded-lg bg-orange-400 text-white text-sm cursor-pointer transition hover:bg-orange-600'
						>
							Save
						</button>
					</Form.Submit>
				</div>
			</Form.Root>
		</div>
	);
}
