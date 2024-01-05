import { useContext } from "react";
import { useMutation } from "@tanstack/react-query";
import { DashboardStatesContext } from "@/app/(dashboard)/providers";
import { ToastPresets } from "@/components/toast";
import { IItemCard } from "@/@types/dashboard";

export default function useMutateAddToNewList(itemData: IItemCard | null | undefined) { 
  const dashboardStates = useContext(DashboardStatesContext);
  return useMutation({
    mutationFn: async (itemData: IItemCard) => {
      const res = await fetch('/api/list', {
        method: 'POST',
        body: JSON.stringify({ action: 'addWithItem', firstItemData: itemData }),
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
      dashboardStates?.setToastProps({
        preset: ToastPresets.success,
        content: 'New list created',
      });
      dashboardStates?.setToastOpen(true);
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
