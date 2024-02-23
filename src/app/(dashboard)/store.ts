import { create, StateCreator } from 'zustand'
import { IToastProps, IItemCard, IList } from '@/@types/dashboard';

type CurrentUser = {
	name: string, email: string, image: string, id: string
}
interface IUserSlice {
	currentUser: CurrentUser | undefined;
	setCurrentUser: (user: CurrentUser) => void;
}
export const createUserSlice: StateCreator<IUserSlice & IDashboardSlice & ICartSlice, [], [], IUserSlice> = (set) => ({
	currentUser: undefined,
	setCurrentUser: (user) => set(() => ({ currentUser: {
		name:user.name, email: user.email, image: user.image, id: user.id
	}}))
})

interface IDashboardSlice {
	toastOpen: boolean;
	setToastOpen: (toast: boolean) => void;
	toastProps: IToastProps;
	setToastProps: (toastProps: IToastProps) => void;
	isViewingList: boolean;
	setIsViewingList: (isViewingList: boolean) => void;
	selectedItem: IItemCard | undefined;
	setSelectedItem: (item: IItemCard) => void;
	selectedList: IList | undefined;
	setSelectedList: (list: IList) => void;
	showSidebarCartCount: boolean;
	setShowSidebarCartCount: (showSidebarCartCount: boolean) => void;
}
  const createDashboardSlice: StateCreator<IUserSlice & IDashboardSlice & ICartSlice, [], [], IDashboardSlice> = (set) => ({
	toastOpen: false,
	setToastOpen: (bool) => set(() => ({ toastOpen: bool})),
	toastProps: { content: 'toast content'},
	setToastProps: (props) => set(() => ({ toastProps: {
		preset: props.preset, title: props.title, content: props.content, altText: props.altText, style: props.style
	}})),
	isViewingList: false,
	setIsViewingList: (bool) => set(() => ({ isViewingList: bool})),
	selectedItem: undefined,
	setSelectedItem: (item) => set(() => ({ selectedItem: {
		name: item.name, id: item.id, categoryId: item.categoryId, categoryName: item.categoryName, description: item.description, imageUrl: item.imageUrl, itemId: item.itemId, listId: item.listId, quantity: item.quantity, checked: item.checked
	}})),
	selectedList: undefined,
	setSelectedList: (list) => set(() => ({ selectedList: {
		id: list.id, createdAt: list.createdAt, updatedAt: list.updatedAt, completed: list.completed, name: list.name, ownerId: list.ownerId,
	}})),
	showSidebarCartCount: false,
	setShowSidebarCartCount: (bool) => set(() => ({ showSidebarCartCount: bool })),
})

interface ICartSlice {
  isMobileCartOpen: boolean;
  setIsMobileCartOpen: (bool: boolean) => void;
  isCartAddingItem: boolean;
  setIsCartAddingItem: (bool: boolean) => void;
  isCartViewingItem: boolean;
  setIsCartViewingItem: (bool: boolean) => void;
  isCartEditingState: boolean;
  setIsCartEditingState: (bool: boolean) => void;
}
  const createCartSlice: StateCreator<IUserSlice & IDashboardSlice & ICartSlice, [], [], ICartSlice> = (set) => ({
  isMobileCartOpen: false,
  setIsMobileCartOpen: (bool) => set(() => ({ isMobileCartOpen: bool })),
  isCartAddingItem: false,
  setIsCartAddingItem: (bool) => set(() => ({ isCartAddingItem: bool })),
  isCartViewingItem: false,
  setIsCartViewingItem: (bool) => set(() => ({ isCartViewingItem: bool })),
  isCartEditingState: false,
  setIsCartEditingState: (bool) => set(() => ({ isCartEditingState: bool }))
})

export type AppStore = IUserSlice & IDashboardSlice & ICartSlice;
export const createAppStore = create<AppStore>()((...a) => ({
  ...createUserSlice(...a),
  ...createDashboardSlice(...a),
  ...createCartSlice(...a)
}))