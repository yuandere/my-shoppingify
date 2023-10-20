'use client';
import { createContext, useState, useRef, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
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

export function Providers({
	children,
	session,
}: {
	children: React.ReactNode;
	session: Session | null;
}) {
	const [queryClient] = useState(
		() =>
			new QueryClient({ defaultOptions: { queries: { staleTime: 60 * 1000 } } })
	);
	const [currentUser, setCurrentUser] = useState<IUserSession>({
		// TODO: remove
		userShoppingLists: userShoppingLists,
	});
	const [toastOpen, setToastOpen] = useState<boolean>(false);
	const [toastProps, setToastProps] = useState<IToastProps>({
		title: 'Title',
		content: 'Content',
		altText: 'generic text',
	});

	//TODO: review behavior for the 3 below
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
				// TODO: remove
				userShoppingLists: userShoppingLists,
			});
		}
	}, [session]);

	return (
		<QueryClientProvider client={queryClient}>
			<TooltipProvider skipDelayDuration={0}>
				<ToastProvider>
					<CurrentUserContext.Provider value={{ currentUser, setCurrentUser }}>
						<DashboardStatesContext.Provider
							value={{
								setToastOpen,
								setToastProps,
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
		</QueryClientProvider>
	);
}
