import { SetStateAction, useContext } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardStatesContext } from "@/app/(dashboard)/providers";
import { ToastPresets } from "@/components/toast";
import { IListItem, IListItemsResponse } from "@/@types/dashboard";

interface IMutateListItemQuantity {
  itemQuantity: number;
  setItemQuantity: React.Dispatch<SetStateAction<number>>;
  listItem: IListItem;
}

export default function useMutateListItemQuantity({itemQuantity, setItemQuantity, listItem}: IMutateListItemQuantity) {
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
  onError: (error) => {
    const err = error as Error;
    console.error(error);
    dashboardStates?.setToastProps({
      preset: ToastPresets.error,
      content: err.message,
    });
    dashboardStates?.setToastOpen(true);
    setItemQuantity(listItem.quantity);
  },
});
}