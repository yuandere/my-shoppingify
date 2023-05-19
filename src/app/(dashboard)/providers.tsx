'use client';
import { createContext, useState } from 'react';
import { Provider as TooltipProvider } from '@radix-ui/react-tooltip';
import { IUserSession, IUserContext } from '@/@types/dashboard';

export const CurrentUserContext = createContext<IUserContext | null>(null);

const itemsData = [
	{
		name: 'Avocado',
		id: 'asdfg',
		categoryId: 'cvbnmx',
		categoryName: 'Fruit & Veg',
		note: 'avocado r cool 247',
		img: 'https://th.bing.com/th/id/R.482b8f5d2021d00e476f94b293c18fa8?rik=ggNg%2b4nh2RaDDw&pid=ImgRaw&r=0',
	},
	{
		name: 'Banana',
		id: 'qwerqwer',
		categoryId: 'cvbnmx',
		categoryName: 'Fruit & Veg',
		note: 'ooh ooh ah ah HOOOOOO',
		img: 'https://th.bing.com/th/id/OIP.uM_t8dY8JMOrsjikQ5EowQHaHa?pid=ImgDet&rs=1',
	},
	{
		name: 'Fry chicken',
		id: 'vdsfvr',
		categoryId: 'dfghjs',
		categoryName: 'Ready To Eat',
		note: 'KFC baybeee',
		img: 'https://media.istockphoto.com/photos/bucket-of-chicken-picture-id477707389?k=6&m=477707389&s=612x612&w=0&h=7CEyzV91Al9eOVdovXqbwuRwnrHwB5m9DoAGUcXZJOs=',
	},
	{
		name: 'This item is long and takes up all the space and then some so here is a cutoff',
		id: 'htrsdrg',
		categoryId: 'wertyu',
		categoryName: 'Building Materials',
		note: 'KFC baybeee',
		img: '',
	},
	{
		name: 'aaaaaaaaaaaaaaaaaaaaaa',
		id: 'vrsdrg',
		categoryId: 'wertyu',
		categoryName: 'Building Materials',
		note: 'KFC baybeee',
		img: '',
	},
	{
		name: 'this is a test string with 5pc vitriol',
		id: 'sdthdhr',
		note: 'KFC baybeee',
		img: '',
	},
];

const userShoppingLists = [
	{
		id: 'BnsXXg',
		ownerId: 'owner id here',
		name: 'test list 1',
		completed: false,
		createdAt: new Date('December 17, 1995 03:24:00'),
		updatedAt: new Date('December 17, 1995 03:24:00'),
		items: [
			{
				id: 'GbdfRY',
				name: 'List Item 1',
				categoryName: 'Building Materials',
				itemId: 'sdthdhr',
				listId: 'BnsXXg',
				checked: false,
				quantity: 1,
			},
			{
				id: 'pbudmm',
				name: 'List Item 2',
				categoryName: 'Building Materials',
				itemId: 'vrsdrg',
				listId: 'BnsXXg',
				checked: true,
				quantity: 5,
			},
			{
				id: 'LMudcv',
				name: 'List Item 3',
				itemId: 'xyxyxy',
				listId: 'BnsXXg',
				checked: true,
				quantity: 25,
			},
		],
	},
	{
		id: 'FMopsy',
		ownerId: 'owner id here',
		name: 'test list 2',
		completed: true,
		createdAt: new Date('December 17, 1995 03:24:00'),
		updatedAt: new Date('December 17, 1995 03:24:00'),
		items: [
			{
				id: 'GbdfRY',
				name: 'List Item 1',
				categoryName: 'Fruits & Veg',
				itemId: 'sdthdhr',
				listId: 'BnsXXg',
				checked: false,
				quantity: 1,
			},
			{
				id: 'pbudmm',
				name: 'List Item 2',
				categoryName: 'Building Materials',
				itemId: 'vrsdrg',
				listId: 'BnsXXg',
				checked: true,
				quantity: 5,
			},
			{
				id: 'GbdfRY',
				name: 'List Item 3',
				categoryName: 'Category 3',
				itemId: 'sdthdhr',
				listId: 'BnsXXg',
				checked: false,
				quantity: 1,
			},
			{
				id: 'pbudmm',
				name: 'List Item 4',
				categoryName: 'Category 4',
				itemId: 'vrsdrg',
				listId: 'BnsXXg',
				checked: true,
				quantity: 5,
			},
			{
				id: 'pbudmm',
				name: 'List Item 5',
				categoryName: 'Category 5',
				itemId: 'vrsdrg',
				listId: 'BnsXXg',
				checked: true,
				quantity: 5,
			},
			{
				id: 'pbudmm',
				name: 'List Item 6',
				categoryName: 'Category 6',
				itemId: 'vrsdrg',
				listId: 'BnsXXg',
				checked: true,
				quantity: 5,
			},
			{
				id: 'pbudmm',
				name: 'List Item 7',
				categoryName: 'Category 7',
				itemId: 'vrsdrg',
				listId: 'BnsXXg',
				checked: true,
				quantity: 5,
			},
			{
				id: 'pbudmm',
				name: 'List Item 8',
				categoryName: 'Category 8',
				itemId: 'vrsdrg',
				listId: 'BnsXXg',
				checked: true,
				quantity: 5,
			},
			{
				id: 'pbudmm',
				name: 'List Item 9',
				categoryName: 'Category 9',
				itemId: 'vrsdrg',
				listId: 'BnsXXg',
				checked: true,
				quantity: 5,
			},
		],
	},
];

const categoriesData = [
	'Fruit & Veg',
	'Building Materials',
	'Medicine',
	'Ready To Eat',
];

export function Providers({ children }: { children: React.ReactNode }) {
	const [currentUser, setCurrentUser] = useState<IUserSession>({
		itemsData: itemsData,
		categoriesData: categoriesData,
		userShoppingLists: userShoppingLists,
	});
	return (
		<TooltipProvider skipDelayDuration={0}>
			<CurrentUserContext.Provider value={{ currentUser, setCurrentUser }}>
				{children}
			</CurrentUserContext.Provider>
		</TooltipProvider>
	);
}
