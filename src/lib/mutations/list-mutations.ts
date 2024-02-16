import { useContext } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { DashboardStatesContext } from '@/app/(dashboard)/providers';
import { ToastPresets } from '@/components/toast';
import {
	IListsResponse,
	IItemCard,
	IDashboardStatesContext,
} from '@/@types/dashboard';

interface IMutateListAddItem {
	itemData: IItemCard | null | undefined;
	selectedListId: string | undefined;
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

export function useMutateAddNewList() {
	const dashboardStates = useContext(DashboardStatesContext);
	return useMutation({
		mutationFn: async () => {
			const res = await fetch('/api/list', {
				method: 'POST',
				body: JSON.stringify({ action: 'add' }),
			});
			if (!res.ok) {
				throw new Error('Something went wrong');
			}
			return res.json();
		},
		onSuccess: (data) => {
			console.log('new list added, ui response wip', data);
			dashboardStates?.setIsViewingList(true);
			dashboardStates?.setSelectedList(data.data.newList);
			dashboardStates?.setShowSidebarCartCount(true);
			dashboardStates?.setToastProps({
				preset: ToastPresets.success,
				content: 'New list created',
			});
			dashboardStates?.setToastOpen(true);
		},
		onError: (error) => errorHandler(error, dashboardStates),
	});
}

export function useMutateAddToNewList(itemData: IItemCard | null | undefined) {
	const dashboardStates = useContext(DashboardStatesContext);
	return useMutation({
		mutationFn: async (itemData: IItemCard) => {
			const res = await fetch('/api/list', {
				method: 'POST',
				body: JSON.stringify({
					action: 'addWithItem',
					firstItemData: itemData,
				}),
			});
			if (!res.ok) {
				throw new Error('Something went wrong');
			}
			return res.json();
		},
		onSuccess: (data) => {
			console.log('new list added, ui response wip', data);
			dashboardStates?.setIsViewingList(true);
			dashboardStates?.setSelectedList(data.data.newList);
			dashboardStates?.setShowSidebarCartCount(true);
			dashboardStates?.setToastProps({
				preset: ToastPresets.success,
				content: 'New list created',
			});
			dashboardStates?.setToastOpen(true);
		},
		onError: (error) => errorHandler(error, dashboardStates),
	});
}

export function useMutateListAddItem({
	itemData,
	selectedListId,
}: IMutateListAddItem) {
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
		onError: (error) => errorHandler(error, dashboardStates),
	});
}

export function useMutateListComplete(
	listId: string | undefined,
	completing: boolean
) {
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
		onError: (error) => errorHandler(error, dashboardStates),
	});
}

export function useMutateListDelete(listId: string | undefined) {
	const dashboardStates = useContext(DashboardStatesContext);
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: () => {
			const data = {
				action: 'delete',
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
				delete clonedData.data[changeIndex];
				return clonedData;
			});
			dashboardStates?.setIsViewingList(false);
			dashboardStates?.setSelectedList(null);
			dashboardStates?.setShowSidebarCartCount(false);
		},
		onError: (error) => errorHandler(error, dashboardStates),
	});
}

export function useMutateListName(
	listId: string | undefined,
	newListName: string
) {
	const dashboardStates = useContext(DashboardStatesContext);
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: () => {
			const data = {
				action: 'rename',
				listId: listId,
				name: newListName,
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
				clonedData.data[changeIndex].name = newListName;
				return clonedData;
			});
		},
		onError: (error) => errorHandler(error, dashboardStates),
	});
}
