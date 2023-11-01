'use client';
import { createContext, useState, useEffect } from 'react';
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
	IItemCard,
	IList,
	IItemsArray,
} from '@/@types/dashboard';
import { Session } from 'next-auth';

export const CurrentUserContext = createContext<IUserContext | null>(null);
export const DashboardStatesContext =
	createContext<IDashboardStatesContext | null>(null);
export const CartStatesContext = createContext<ICartStatesContext | null>(null);

export function Providers({
	children,
	session,
}: {
	children: React.ReactNode;
	session: Session | null;
}) {
	const [queryClient] = useState(
		() =>
			new QueryClient({ defaultOptions: { queries: { staleTime: 5 * 60 * 1000 } } })
	);
	const [currentUser, setCurrentUser] = useState<IUserSession>({});
	const [toastOpen, setToastOpen] = useState<boolean>(false);
	const [toastProps, setToastProps] = useState<IToastProps>({
		title: 'Title',
		content: 'Content',
		altText: 'generic text',
	});
	const [isViewingList, setIsViewingList] = useState<boolean>(false);
	const [selectedItem, setSelectedItem] = useState<IItemCard | null>(null);
	const [selectedList, setSelectedList] = useState<IList | null>(null);
	const [selectedListItems, setSelectedListItems] = useState<Array<IItemsArray> | null>(null);
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
								isViewingList,
								setIsViewingList,
								selectedItem,
								setSelectedItem,
								selectedList,
								setSelectedList,
								selectedListItems,
								setSelectedListItems
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
