import { useState, useEffect, useRef, useContext } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as Tooltip from '@radix-ui/react-tooltip';
import { IItemCard } from '@/@types/dashboard';
import {
	DashboardStatesContext,
	CartStatesContext,
} from '@/app/(dashboard)/providers';

export default function ItemCard({ itemData }: { itemData: IItemCard }) {
	// TODO: remove name truncate code after setting limit on chars when adding new items
	const dashboardStates = useContext(DashboardStatesContext);
	const cartStates = useContext(CartStatesContext);
	const queryClient = useQueryClient();
	const [shouldTruncate, setShouldTruncate] = useState<boolean>(false);
	const ref = useRef<HTMLDivElement>(null);
	const setSelectedItem = dashboardStates?.setSelectedItem;
	const setIsCartViewingItem = cartStates?.setIsCartViewingItem;
	const selectedListId = dashboardStates?.selectedList?.id;

	const mutateAddToNewList = useMutation({
		mutationFn: (itemData: IItemCard) => {
			return fetch('/api/list', {
				method: 'POST',
				body: JSON.stringify({ action: 'add', firstItemData: itemData }),
			});
		},
		onSuccess: (data) => {
			console.log('response received WIP', data);
			dashboardStates?.setToastProps({
				title: 'Success',
				content: 'New list created',
				altText: 'New list created',
				style: 'Success',
			});
			dashboardStates?.setToastOpen(true);
		},
		onError: (error) => {
			const err = error as Error;
			console.error(error);
			dashboardStates?.setToastProps({
				title: 'Error',
				content: err.message,
				altText: err.message,
				style: 'Danger',
			});
			dashboardStates?.setToastOpen(true);
		},
	});

	const mutateListAddItem = useMutation({
		mutationFn: ({
			itemData,
			selectedListId,
		}: {
			itemData: IItemCard;
			selectedListId: string;
		}) => {
			const data = {
				name: itemData.name,
				listId: selectedListId,
				action: 'add',
				itemId: itemData.id,
				...(itemData.categoryName
					? { categoryName: itemData.categoryName }
					: null),
			};
			return fetch('/api/listItem', {
				method: 'POST',
				body: JSON.stringify(data),
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['listItems', mutateListAddItem.variables?.selectedListId],
			});
			// TODO: ui confirmation - turn + green or add animation?
			console.log('item added to list (ui wip)');
		},
		onError: (error) => {
			const err = error as Error;
			console.error(error);
			dashboardStates?.setToastProps({
				title: 'Error',
				content: err.message,
				altText: err.message,
				style: 'Danger',
			});
			dashboardStates?.setToastOpen(true);
		},
	});

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
			className={`flex items-center justify-between rounded-xl drop-shadow-[0_2px_6px_rgba(0,0,0,0.1)] w-48 min-h-min max-h-20 bg-white mx-2 my-4 p-4 select-none transition hover:bg-theme-3 hover:scale-[1.03] hover:drop-shadow-[0_2px_9px_rgba(0,0,0,0.14)] ${
				!itemData.listId ? 'cursor-pointer' : null
			}`}
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
