import { useContext } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DashboardStatesContext } from '@/app/(dashboard)/providers';
import { ToastPresets } from '@/components/toast';
import { IListItem, IListItemsResponse } from '@/@types/dashboard';

export default function useMutateListItemDelete(listItem: IListItem) {
	const dashboardStates = useContext(DashboardStatesContext);
	const queryClient = useQueryClient();
	return useMutation({
    	mutationFn: () => {
    		const data = {
    			action: 'delete',
    			listId: listItem.listId,
    			listItemId: listItem.id,
    		};
    		return fetch('/api/listItem', {
    			method: 'POST',
    			body: JSON.stringify(data),
    		});
    	},
    	onSuccess: () => {
    		queryClient.setQueryData(
    			['listItems', listItem.listId],
    			(oldData: IListItemsResponse) => {
    				if (!oldData) {
    					return oldData;
    				}
    				const changeIndex = oldData.data.findIndex(
    					(item) => item.id === listItem.id
    				);
    				const clonedData = structuredClone(oldData);
    				let newItems = oldData.data.toSpliced(changeIndex, 1);
    				clonedData.data = newItems;
    				return clonedData;
    			}
    		);
    		console.log('listItem deleted, ui wip');
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
