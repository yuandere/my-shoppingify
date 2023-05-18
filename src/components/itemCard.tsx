import { useState, useEffect, useRef } from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';
import { IItemsData } from '@/@types/dashboard';

export default function ItemCard({ itemData }: { itemData: IItemsData }) {
	// TODO: remove name truncate code after setting limit on chars when adding new items
	const [shouldTruncate, setShouldTruncate] = useState<boolean>(false);
	const ref = useRef<HTMLDivElement>(null);
	useEffect(() => {
		const canvas = document.createElement('canvas');
		const context = canvas.getContext('2d');
		if (!ref.current || !context) return;
		context.font = '12px poppins';
		const width = context.measureText(itemData.name).width;
		if (width > 120) {
			setShouldTruncate(true);
		} else {
			setShouldTruncate(false);
		}
	}, [itemData.name]);

	return (
		<div
			className='flex items-center justify-between rounded-xl drop-shadow-[0_2px_6px_rgba(0,0,0,0.1)] w-48 min-h-min max-h-20 bg-white mx-2 my-4 p-4 cursor-pointer transition hover:bg-theme-3 hover:scale-[1.03] hover:drop-shadow-[0_2px_9px_rgba(0,0,0,0.14)]'
			onClick={() => {
				// TODO: add fetch logic using itemdata id
				console.log('item card clicked');
			}}
		>
			<p ref={ref} className='mr-1 break-words w-[120px]'>
				{shouldTruncate ? `${itemData.name.slice(0, 21)}...` : itemData.name}
			</p>
			<Tooltip.Root>
				<Tooltip.Trigger asChild>
					<span
						className='material-icons transition text-ui cursor-pointer hover:text-ui-dark'
						onClick={(e) => {
							e.stopPropagation();
							console.log('add to list clicked');
						}}
					>
						add
					</span>
				</Tooltip.Trigger>
				<Tooltip.Portal>
					<Tooltip.Content className='TooltipContent' sideOffset={5}>
						Add to list
						<Tooltip.Arrow className='TooltipArrow' />
					</Tooltip.Content>
				</Tooltip.Portal>
			</Tooltip.Root>
		</div>
	);
}
