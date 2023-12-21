import { useContext } from "react";
import { useMutation } from "@tanstack/react-query";
import { DashboardStatesContext } from "@/app/(dashboard)/providers";
import { IItemCard } from "@/@types/dashboard";

export default function useMutateAddToNewList(itemData: IItemCard | null | undefined) { 
  const dashboardStates = useContext(DashboardStatesContext);
  return useMutation({
    mutationFn: async (itemData: IItemCard) => {
      const res = await fetch('/api/list', {
        method: 'POST',
        body: JSON.stringify({ action: 'add', firstItemData: itemData }),
      });
      if (!res.ok) {
        throw new Error('Something went wrong');
      }
      return res.json();
    },
    onSuccess: (data) => {
      // TODO: set selected list in context
      console.log('response received WIP', data);
      dashboardStates?.setToastProps({
        title: 'Success',
        content: 'New list created',
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
        style: 'Danger',
      });
      dashboardStates?.setToastOpen(true);
    },
  });
}
