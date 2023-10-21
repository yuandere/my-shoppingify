import { useContext, useState, useEffect, useRef, FormEvent } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import * as Form from '@radix-ui/react-form';
import {
	CartStatesContext,
	DashboardStatesContext,
} from '@/app/(dashboard)/providers';
import CategoryDialog from './cartCategoryDialog';
import { getCategories } from '@/lib/fetchers';
import { ICategoriesData } from '@/@types/dashboard';
import '@/styles/radix-form.css';

export default function CartAddItem() {
	const dashboardStates = useContext(DashboardStatesContext);
	const cartStates = useContext(CartStatesContext);
	const [categoriesList, setCategoriesList] = useState<
		Array<ICategoriesData> | undefined
	>(undefined);
	const [activeCategory, setActiveCategory] = useState<string>('');
	const submitBtnRef = useRef<HTMLButtonElement>(null);
	const setToastOpen = dashboardStates?.setToastOpen;
	const setToastProps = dashboardStates?.setToastProps;
	const queryClient = useQueryClient();

	const { data } = useQuery({
		queryKey: ['itemCategories'],
		queryFn: () => getCategories(),
	});

	useEffect(() => {
		if (!data) {
			return;
		}
		setCategoriesList(data.data);
	}, [data]);

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		if (!setToastOpen || !setToastProps) {
			return;
		}
		if (submitBtnRef && submitBtnRef.current != null) {
			submitBtnRef.current.disabled = true;
		}
		const data = Object.fromEntries(new FormData(e.currentTarget));
		const newData: { [key: string]: string | FormDataEntryValue } = {
			action: 'add',
		};
		for (const key in data) {
			if (data[key] != '' && key != 'categoryId') {
				newData[key] = data[key];
			}
		}
		if (activeCategory != '') {
			newData.categoryId = activeCategory;
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
					cartStates?.setIsCartAddingItem(false);
					queryClient.invalidateQueries({ queryKey: ['itemCards'] });
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
				if (submitBtnRef && submitBtnRef.current != null) {
					submitBtnRef.current.disabled = false;
				}
			});
	};

	const handleSelectionChange = (selectionIndex: number) => {
		if (selectionIndex > 0 && categoriesList) {
			setActiveCategory(categoriesList[selectionIndex - 1].id);
		} else {
			setActiveCategory('');
		}
	};

	return (
		<div className='flex flex-col items-center w-72 h-screen p-8 bg-light sm:w-80'>
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
						<select
							className='Select'
							onChange={(e) => handleSelectionChange(e.target.selectedIndex)}
						>
							<option value=''></option>
							{categoriesList?.map((category, idx) => {
								return (
									<option
										key={`category-${idx}`}
										value={category.name}
										className='font-sans'
									>
										{category.name}
									</option>
								);
							})}
						</select>
					</Form.Control>
				</Form.Field>
				<CategoryDialog></CategoryDialog>
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
							ref={submitBtnRef}
						>
							Save
						</button>
					</Form.Submit>
				</div>
			</Form.Root>
		</div>
	);
}
