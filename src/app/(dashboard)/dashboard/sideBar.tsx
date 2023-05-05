'use client';
import * as Avatar from '@radix-ui/react-avatar';
import * as Tooltip from '@radix-ui/react-tooltip';
import '@/styles/radix-avatar.css';
import '@/styles/radix-tooltip.css';

const navButtons = [
	{ icon: 'list', tooltip: 'tooltip 1' },
	{ icon: 'history', tooltip: 'tooltip 2' },
	{ icon: 'show_chart', tooltip: 'tooltip 3' },
];

export default function SideBar({}) {
	return (
		<div className='flex flex-col justify-between items-center py-4 w-12 h-screen bg-white border border-black sm:w-16'>
			<div className=''>
				<Avatar.Root className='AvatarRoot'>
					<Avatar.Image
						className='AvatarImage'
						src='https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=80'
						alt='Derek Lee'
					></Avatar.Image>
					<Avatar.Fallback className='AvatarFallback'>DL</Avatar.Fallback>
				</Avatar.Root>
			</div>
			<div className='flex flex-col justify-between h-56'>
				{navButtons.map((x, i) => {
					return (
						<Tooltip.Root key={`sidebar-btn-${i}`}>
							<Tooltip.Trigger asChild>
								<span className='material-icons text-ui-dark'>{x.icon}</span>
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
			<div className='rounded-full bg-orange-400'>
				<span className='material-icons-outlined text-white'>
					shopping_cart
				</span>
			</div>
		</div>
	);
}
