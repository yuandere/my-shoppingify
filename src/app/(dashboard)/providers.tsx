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

export const CurrentUserContext = createContext<IUserContext | undefined>(undefined);
export const DashboardStatesContext =
	createContext<IDashboardStatesContext | undefined>(undefined);
export const CartStatesContext = createContext<ICartStatesContext | undefined>(undefined);
export const ViewportContext = createContext<IViewportContext | undefined>(undefined);

export function Providers({
	children,
	session,
}: {
	children: React.ReactNode;
	session: Session | null;
}) {
	const [currentUser, setCurrentUser] = useState<IUserSession>({});
	const [width, setWidth] = useState<number>(300);
	const [height, setHeight] = useState<number>(900);
	const [isMobileLayout, setIsMobileLayout] = useState<boolean>(true);
	const [isSmallFormat, setIsSmallFormat] = useState<boolean>(false);
	// dashboard context
	const [toastOpen, setToastOpen] = useState<boolean>(false);
	const [toastProps, setToastProps] = useState<IToastProps>({
		content: 'toast content',
	});
	const [isViewingList, setIsViewingList] = useState<boolean>(false);
	const [selectedItem, setSelectedItem] = useState<IItemCard | null>(null);
	const [selectedList, setSelectedList] = useState<IList | null>(null);
	const [showSidebarCartCount, setShowSidebarCartCount] =
		useState<boolean>(false);
	// cart context
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

	const handleWindowResize = () => {
		setWidth(window.innerWidth);
		setHeight(window.innerHeight);
		setIsMobileLayout(window.innerHeight > window.innerWidth);
		setIsSmallFormat(window.innerWidth < 465);
	};

	// TODO: look into window.matchMedia instead of checking window width
	useEffect(() => {
		handleWindowResize();
		window.addEventListener('resize', throttle(handleWindowResize, 250));
		return () =>
			window.removeEventListener('resize', throttle(handleWindowResize, 250));
	}, []);

	// TODO: replace useeffect
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
						<ViewportContext.Provider
							value={{ width, height, isMobileLayout, isSmallFormat }}
						>
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
								}}
							>
								<CartStatesContext.Provider
									value={{
										isMobileCartOpen,
										setIsMobileCartOpen,
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
