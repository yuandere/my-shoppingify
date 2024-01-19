import { SetStateAction, useContext } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DashboardStatesContext } from '@/app/(dashboard)/providers';
import { ToastPresets } from '@/components/toast';
import {
	IDashboardStatesContext,
	IListItem,
	IListItemsResponse,
} from '@/@types/dashboard';

interface IMutateListItemCheck {
	listItem: IListItem;
	isChecking: boolean;
	setIsChecked: React.Dispatch<SetStateAction<boolean>>;
}
interface IMutateListItemQuantity {
	itemQuantity: number;
	setItemQuantity: React.Dispatch<SetStateAction<number>>;
	listItem: IListItem;
}

const errorHandler = (
	error: Error,
	dashboardStates: IDashboardStatesContext | null
) => {
	const err = error as Error;
	console.error(error);
	dashboardStates?.setToastProps({
		preset: ToastPresets.error,
		content: err.message,
	});
	dashboardStates?.setToastOpen(true);
};

export function useMutateListItemCheck({
	listItem,
	isChecking,
	setIsChecked,
}: IMutateListItemCheck) {
	const dashboardStates = useContext(DashboardStatesContext);
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: () => {
			const data = {
				action: 'check',
				checked: isChecking,
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
					clonedData.data[changeIndex].checked = isChecking;
					return clonedData;
				}
			);
			setIsChecked(isChecking);
		},
		onError: (error) => errorHandler(error, dashboardStates),
	});
}

export function useMutateListItemDelete(listItem: IListItem) {
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
		onError: (error) => errorHandler(error, dashboardStates),
	});
}

export function useMutateListItemQuantity({
	itemQuantity,
	setItemQuantity,
	listItem,
}: IMutateListItemQuantity) {
	const dashboardStates = useContext(DashboardStatesContext);
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: () => {
			const data = {
				action: 'quantity',
				quantity: itemQuantity,
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
					clonedData.data[changeIndex].quantity = itemQuantity;
					return clonedData;
				}
			);
		},
		onError: (error) => errorHandler(error, dashboardStates),
	});
}
