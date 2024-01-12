import { useContext } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { DashboardStatesContext } from "@/app/(dashboard)/providers";
import { ToastPresets } from "@/components/toast";
import { IListsResponse } from "@/@types/dashboard";

export default function useMutateListName(listId: string | undefined, newListName: string) {
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
      queryClient.setQueryData(
        ['lists'],
          (oldData: IListsResponse) => {
            if (!oldData) return oldData;
            const changeIndex = oldData.data.findIndex(list => list.id === listId);
            const clonedData = structuredClone(oldData);
            clonedData.data[changeIndex].name = newListName;
            return clonedData;
          }
      );
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