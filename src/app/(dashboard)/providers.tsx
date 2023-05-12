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
		name: 'test list 1',
		completed: false,
		items: [
			{
				id: 'GbdfRY',
				itemId: 'sdthdhr',
				listId: 'BnsXXg',
				checked: false,
				quantity: 1,
			},
			{
				id: 'pbudmm',
				itemId: 'vrsdrg',
				listId: 'BnsXXg',
				checked: true,
				quantity: 5,
			},
		],
	},
	{
		id: 'FMopsy',
		name: 'test list 2',
		completed: true,
		items: [
			{
				id: 'GbdfRY',
				itemId: 'sdthdhr',
				listId: 'BnsXXg',
				checked: false,
				quantity: 1,
			},
		],
	},
];

// const categoriesData = {
// 	1: 'Fruit & Veg',
// 	2: 'Building Materials',
// 	3: 'Medicine',
// 	4: 'Ready To Eat',
// };
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
