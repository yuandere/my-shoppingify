import { useContext } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { DashboardStatesContext } from '@/app/(dashboard)/providers';
import { ToastPresets } from '@/components/toast';
import { IListsResponse } from '@/@types/dashboard';

export default function useMutateListComplete(listId: string | undefined, completing: boolean) {
	const dashboardStates = useContext(DashboardStatesContext);
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: () => {
			const data = {
			  action: 'complete',
        completing: completing,
			  listId: listId,
			};
			return fetch('/api/list', {
			  method: 'POST',
			  body: JSON.stringify(data),
			});
		},
		onSuccess: () => {
			queryClient.setQueryData(['lists'], (oldData: IListsResponse) => {
				if (!oldData) return oldData;
				const changeIndex = oldData.data.findIndex(
					(list) => list.id === listId
				);
				const clonedData = structuredClone(oldData);
				clonedData.data[changeIndex].completed = completing;
				return clonedData;
			});
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