'use client';
import { createContext, useState, useRef, useEffect } from 'react';
import { Provider as ToastProvider } from '@radix-ui/react-toast';
import { Provider as TooltipProvider } from '@radix-ui/react-tooltip';
import { Toast } from '@/components/toast';
import {
	IUserSession,
	IUserContext,
	IDashboardStatesContext,
	ICartStatesContext,
	IToastProps,
	IItemsData,
} from '@/@types/dashboard';
import { Session } from 'next-auth';

export const CurrentUserContext = createContext<IUserContext | null>(null);
export const DashboardStatesContext =
	createContext<IDashboardStatesContext | null>(null);
export const CartStatesContext = createContext<ICartStatesContext | null>(null);

const itemsData = [
	{
		name: 'LEGACY EXAMPLE DATA',
		id: 'asdfg',
		categoryId: 'cvbnmx',
		categoryName: 'Fruit & Veg',
		note: 'PHASED OUT, DELETE ANY REFERENCES',
		img: 'https://th.bing.com/th/id/R.482b8f5d2021d00e476f94b293c18fa8?rik=ggNg%2b4nh2RaDDw&pid=ImgRaw&r=0',
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

// TODO: "don't set state through context for perf reasons" so add logic to set user data here, remove setCurrentUser from currentusercontext

export function Providers({
	children,
	session,
}: {
	children: React.ReactNode;
	session: Session | null;
}) {
	const [currentUser, setCurrentUser] = useState<IUserSession>({
		// TODO: remove
		// itemsData: itemsData,
		// categoriesData: categoriesData,
		userShoppingLists: userShoppingLists,
	});
	const [toastOpen, setToastOpen] = useState<boolean>(false);
	const [toastProps, setToastProps] = useState<IToastProps>({
		title: 'Title',
		content: 'Content',
		altText: 'generic text',
	});

	//TODO: review behavior for the 3 below
	const [itemsFetchFlag, setItemsFetchFlag] = useState<boolean>(false);
	const itemsFetchRef = useRef<boolean>(false);
	const [selectedItem, setSelectedItem] = useState<IItemsData | null>(null);

	const [isCartAddingItem, setIsCartAddingItem] = useState<boolean>(false);
	const [isCartViewingItem, setIsCartViewingItem] = useState<boolean>(false);
	const [isCartEditingState, setIsCartEditingState] = useState<boolean>(false);

	useEffect(() => {
		if (session) {
			const user = session.user;
			setCurrentUser({
				name: user.name,
				email: user.email,
				image: user.image,
				id: user.id,
				//TODO: remove
				userShoppingLists: userShoppingLists
			});
		}
	}, [session]);

	return (
		<TooltipProvider skipDelayDuration={0}>
			<ToastProvider>
				<CurrentUserContext.Provider value={{ currentUser, setCurrentUser }}>
					<DashboardStatesContext.Provider
						value={{
							setToastOpen,
							setToastProps,
							itemsFetchFlag,
							setItemsFetchFlag,
							itemsFetchRef,
							selectedItem,
							setSelectedItem,
						}}
					>
						<CartStatesContext.Provider
							value={{
								isCartAddingItem,
								setIsCartAddingItem,
								isCartViewingItem,
								setIsCartViewingItem,
								isCartEditingState,
								setIsCartEditingState,
							}}
						>
							<Toast
								open={toastOpen}
								onOpenChange={setToastOpen}
								title={toastProps.title}
								content={toastProps.content}
								altText={toastProps.altText}
								style={toastProps.style}
							></Toast>
							{children}
						</CartStatesContext.Provider>
					</DashboardStatesContext.Provider>
				</CurrentUserContext.Provider>
			</ToastProvider>
		</TooltipProvider>
	);
}
