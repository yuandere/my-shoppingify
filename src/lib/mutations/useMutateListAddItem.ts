import { useContext } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardStatesContext } from "@/app/(dashboard)/providers";
import { ToastPresets } from "@/components/toast";
import { IItemCard } from "@/@types/dashboard";

interface IMutateListAddItem {
  itemData: IItemCard | null | undefined;
  selectedListId: string | undefined;
}

export default function useMutateListAddItem({ itemData, selectedListId }: IMutateListAddItem) { 
  const dashboardStates = useContext(DashboardStatesContext);
  const queryClient = useQueryClient();
  return useMutation({
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
				queryKey: ['listItems', selectedListId],
			});
			// TODO: ui confirmation - turn + green or add animation?
			console.log('item added to list (ui wip)');
		},
		onError: (error) => {
			const err = error as Error;
			console.error(error);
			dashboardStates?.setToastProps({
				preset: ToastPresets.error,
				content: err.message,
			});
			dashboardStates?.setToastOpen(true);
		},
	});
}
