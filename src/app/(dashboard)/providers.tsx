'use client';
import { createContext, useState, useEffect } from 'react';
import { Session } from 'next-auth';
import {
	QueryCache,
	QueryClient,
	QueryClientProvider,
} from '@tanstack/react-query';
import { Provider as ToastProvider } from '@radix-ui/react-toast';
import { Provider as TooltipProvider } from '@radix-ui/react-tooltip';
import throttle from 'lodash/throttle';
import { Toast } from '@/components/toast';
import {
	IViewportContext,
	IUserSession,
	IUserContext,
	IDashboardStatesContext,
	ICartStatesContext,
	IToastProps,
	IItemCard,
	IList,
} from '@/@types/dashboard';

export const CurrentUserContext = createContext<IUserContext | null>(null);
export const DashboardStatesContext =
	createContext<IDashboardStatesContext | null>(null);
export const CartStatesContext = createContext<ICartStatesContext | null>(null);
export const ViewportContext = createContext<IViewportContext | null>(null);

export function Providers({
	children,
	session,
}: {
	children: React.ReactNode;
	session: Session | null;
}) {
	const [currentUser, setCurrentUser] = useState<IUserSession>({});
	const [toastOpen, setToastOpen] = useState<boolean>(false);
	const [toastProps, setToastProps] = useState<IToastProps>({
		content: 'toast content',
	});
	const [isViewingList, setIsViewingList] = useState<boolean>(false);
	const [selectedItem, setSelectedItem] = useState<IItemCard | null>(null);
	const [selectedList, setSelectedList] = useState<IList | null>(null);
	const [showSidebarCartCount, setShowSidebarCartCount] =
		useState<boolean>(false);
	const [isMobileCartOpen, setIsMobileCartOpen] = useState<boolean>(false);
	const [isCartAddingItem, setIsCartAddingItem] = useState<boolean>(false);
	const [isCartViewingItem, setIsCartViewingItem] = useState<boolean>(false);
	const [isCartEditingState, setIsCartEditingState] = useState<boolean>(false);
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: { queries: { staleTime: 5 * 60 * 1000 } },
				queryCache: new QueryCache({
					onError: (error) => {
						setToastOpen(true);
						setToastProps({
							title: 'Error',
							content: error.message,
							style: 'Danger',
						});
					},
				}),
			})
	);
	const [width, setWidth] = useState<number>(300);
	const [height, setHeight] = useState<number>(900);

	const handleWindowResize = () => {
		setWidth(window.innerWidth);
		setHeight(window.innerHeight);
	};

	// TODO: look into window.matchMedia instead of checking width
	useEffect(() => {
		handleWindowResize();
		window.addEventListener('resize', throttle(handleWindowResize, 250));
		return () =>
			window.removeEventListener('resize', throttle(handleWindowResize, 250));
	}, []);

	// TODO: check if this is actually needed
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
						<ViewportContext.Provider value={{ width, height }}>
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
									showSidebarCartCount,
									setShowSidebarCartCount,
									isMobileCartOpen,
									setIsMobileCartOpen
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
										preset={toastProps.preset}
										title={toastProps.title}
										content={toastProps.content}
										altText={toastProps.altText}
										style={toastProps.style}
									></Toast>
									{children}
								</CartStatesContext.Provider>
							</DashboardStatesContext.Provider>
						</ViewportContext.Provider>
					</CurrentUserContext.Provider>
				</ToastProvider>
			</TooltipProvider>
		</QueryClientProvider>
	);
}
