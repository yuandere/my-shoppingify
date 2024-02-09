import { useState, useEffect, useRef, useContext } from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';
import { IItemCard } from '@/@types/dashboard';
import {
	DashboardStatesContext,
	CartStatesContext,
} from '@/app/(dashboard)/providers';
import {
	useMutateAddToNewList,
	useMutateListAddItem,
} from '@/lib/mutations/list-mutations';

export default function ItemCard({
	itemData,
	small,
}: {
	itemData: IItemCard;
	small?: boolean;
}) {
	const dashboardStates = useContext(DashboardStatesContext);
	const cartStates = useContext(CartStatesContext);
	const [shouldTruncate, setShouldTruncate] = useState<boolean>(false);
	const ref = useRef<HTMLDivElement>(null);
	const setSelectedItem = dashboardStates?.setSelectedItem;
	const setIsCartViewingItem = cartStates?.setIsCartViewingItem;
	const selectedListId = dashboardStates?.selectedList?.id;

	const mutateAddToNewList = useMutateAddToNewList(itemData);
	const mutateListAddItem = useMutateListAddItem({ itemData, selectedListId });

	const handleAddToList = () => {
		if (selectedListId && itemData) {
			mutateListAddItem.mutate({
				itemData: itemData,
				selectedListId: selectedListId,
			});
		} else if (itemData) {
			mutateAddToNewList.mutate(itemData);
		}
	};

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
			className={`flex items-center justify-between rounded-xl drop-shadow-[0_2px_6px_rgba(0,0,0,0.1)] min-h-min max-h-20 bg-white select-none transition hover:bg-theme-3 hover:scale-[1.03] hover:drop-shadow-[0_2px_9px_rgba(0,0,0,0.14)] ${
				!itemData.listId ? 'cursor-pointer' : ''
			} ${small ? 'w-40 m-1 p-2' : 'w-48 mx-2 my-4 p-4'}`}
			onClick={() => {
				if (setSelectedItem && setIsCartViewingItem && !itemData.listId) {
					setSelectedItem(itemData);
					setIsCartViewingItem(true);
				}
			}}
		>
			<p ref={ref} className='mr-1 break-words w-[120px]'>
				{shouldTruncate ? `${itemData.name.slice(0, 21)}...` : itemData.name}
			</p>
			{itemData.listId ? (
				<span className='text-theme-1 text-xs'>
					{itemData.quantity === 1 ? '1 pc' : `${itemData.quantity} pcs`}
				</span>
			) : (
				<Tooltip.Root>
					<Tooltip.Trigger asChild>
						<span
							className='material-icons transition text-ui cursor-pointer hover:text-ui-dark'
							onClick={(e) => {
								e.stopPropagation();
								handleAddToList();
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
			)}
		</div>
	);
}
