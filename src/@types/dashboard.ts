import { Dispatch, SetStateAction } from "react";

export interface IToastProps {
	preset?: string;
	title?: string;
	content: string;
	altText?: string;
	style?: string;
}

export interface IUserSession {
	name?: string | null;
	email?: string | null;
	image?: string | null;
	id?: string | null;
}

export interface IUserContext {
	currentUser: IUserSession;
	setCurrentUser: Dispatch<SetStateAction<IUserSession>>;
}

export interface IDashboardStatesContext {
	setToastOpen: Dispatch<SetStateAction<boolean>>;
	setToastProps: Dispatch<SetStateAction<IToastProps>>;
	isViewingList: boolean;
	setIsViewingList: Dispatch<SetStateAction<boolean>>;
	selectedItem: IItemCard | null;
	setSelectedItem: Dispatch<SetStateAction<IItemCard | null>>;
	selectedList: IList | null;
	setSelectedList: Dispatch<SetStateAction<IList | null>>;
	showSidebarCartCount: boolean;
	setShowSidebarCartCount: Dispatch<SetStateAction<boolean>>;
}

export interface ICartStatesContext {
	isCartAddingItem: boolean;
	setIsCartAddingItem: Dispatch<SetStateAction<boolean>>;
	isCartViewingItem: boolean;
	setIsCartViewingItem: Dispatch<SetStateAction<boolean>>;
	isCartEditingState: boolean;
	setIsCartEditingState: Dispatch<SetStateAction<boolean>>;
	isMobileCartOpen: boolean;
	setIsMobileCartOpen: Dispatch<SetStateAction<boolean>>;
}

export interface IViewportContext {
	width: number;
	height: number;
	isMobileLayout: boolean;
}

export interface IApiResponse {
	message: string;
	success: boolean;
}

export interface IListItemsResponse extends IApiResponse {
	data: Array<IListItem>;
}

export interface IListsResponse extends IApiResponse {
	data: Array<IList>;
}

//itemsView
export interface IItemCard {
	name: string;
	id: string;
	categoryId?: string;
	categoryName?: string;
	description?: string;
	imageUrl?: string;
	// listitem props
	itemId?: string;
	listId?: string;
	quantity?: number;
	checked?: boolean;
}

export interface IItemsArray {
	categoryName: string;
	items: Array<IItemCard>;
}

//historyView
export interface IList {
	id: string;
	createdAt: string;
	updatedAt: string;
	completed: boolean;
	name: string;
	ownerId: string;
}

//cart
export interface IListItem {
	id: string;
	name: string;
	categoryName?: string;
	itemId: string;
	listId: string;
	checked: boolean;
	quantity: number;
}

export interface IUserShoppingList {
	id: string;
	name: string;
	createdAt: Date;
	updatedAt: Date;
	completed: boolean;
	ownerId: string;
	items: Array<IListItem>;
}

export interface ICategoriesData {
	id: string;
	name: string;
}
