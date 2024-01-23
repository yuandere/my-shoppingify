import { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import * as Avatar from '@radix-ui/react-avatar';
import * as Tooltip from '@radix-ui/react-tooltip';
import { DashboardStatesContext } from '../providers';
import { getListItems } from '@/lib/fetchers';
import '@/styles/radix-avatar.css';
import '@/styles/radix-tooltip.css';

const navButtons = [
	{ icon: 'list', tooltip: 'items' },
	{ icon: 'history', tooltip: 'history' },
	{ icon: 'show_chart', tooltip: 'statistics' },
];

interface ISidebar {
	activeTab: string;
	setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}

export default function SideBar({ activeTab, setActiveTab }: ISidebar) {
	const [cartItems, setCartItems] = useState<number>(0);
	const [avatarFallback, setAvatarFallback] = useState<string>('MS');
	const selectedList = useContext(DashboardStatesContext)?.selectedList;
	const showSidebarCartCount = useContext(
		DashboardStatesContext
	)?.showSidebarCartCount;
	const listId = selectedList?.id;

	const { data } = useQuery({
		queryKey: ['listItems', listId],
		queryFn: () => getListItems(listId),
		enabled: !!listId,
	});

	useEffect(() => {
		if (!data?.data) return;
		setCartItems(data.data.length);
	}, [listId, data]);

	return (
		<div className='flex flex-col justify-between items-center py-4 w-12 h-screen bg-white select-none sm:w-16'>
			<Link href='/settings'>
				<div className=''>
					<Avatar.Root className='AvatarRoot'>
						<Avatar.Image
							className='AvatarImage'
							src='https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=80'
							alt={avatarFallback}
						></Avatar.Image>
						<Avatar.Fallback className='AvatarFallback'>
							{avatarFallback}
						</Avatar.Fallback>
					</Avatar.Root>
				</div>
			</Link>
			<div className='flex flex-col justify-between h-56'>
				{navButtons.map((x, i) => {
					return (
						<Tooltip.Root key={`sidebar-btn-${i}`}>
							<Tooltip.Trigger asChild>
								<div className='relative grid place-items-center'>
									{activeTab === x.tooltip ? (
										<span className='block absolute -left-[1.25rem] w-1.5 h-12 rounded-r-md bg-theme-1 animate-fadeInFromLeft'></span>
									) : null}
									<span
										className='material-icons text-ui-dark cursor-pointer hover:text-theme-1'
										onClick={() => {
											setActiveTab(x.tooltip);
										}}
									>
										{x.icon}
									</span>
								</div>
							</Tooltip.Trigger>
							<Tooltip.Portal>
								<Tooltip.Content className='TooltipContent' sideOffset={5}>
									{x.tooltip}
									<Tooltip.Arrow className='TooltipArrow' />
								</Tooltip.Content>
							</Tooltip.Portal>
						</Tooltip.Root>
					);
				})}
			</div>
			<div className='w-8 h-8 grid place-items-center rounded-full relative bg-orange-400'>
				{showSidebarCartCount ? (
					<div className='w-4 h-4 rounded-md bg-red-500 text-white text-xs absolute -top-1 -right-1 grid place-items-center'>
						<p>{cartItems}</p>
					</div>
				) : null}
				<span className='material-icons-outlined text-white text-lg'>
					shopping_cart
				</span>
			</div>
		</div>
	);
}
