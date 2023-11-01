export interface IToastProps {
	title: string;
	content: string;
	altText: string;
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
	setCurrentUser: React.Dispatch<React.SetStateAction<IUserSession>>;
}

export interface IDashboardStatesContext {
	setToastOpen: React.Dispatch<React.SetStateAction<boolean>>;
	setToastProps: React.Dispatch<React.SetStateAction<IToastProps>>;
	isViewingList: boolean;
	setIsViewingList: React.Dispatch<React.SetStateAction<boolean>>;
	selectedItem: IItemCard | null;
	setSelectedItem: React.Dispatch<React.SetStateAction<IItemCard | null>>;
	selectedList: IList | null;
	setSelectedList: React.Dispatch<React.SetStateAction<IList | null>>;
	selectedListItems: Array<IItemsArray> | null;
	setSelectedListItems: React.Dispatch<React.SetStateAction<Array<IItemsArray> | null>>;
}

export interface ICartStatesContext {
	isCartAddingItem: boolean;
	setIsCartAddingItem: React.Dispatch<React.SetStateAction<boolean>>;
	isCartViewingItem: boolean;
	setIsCartViewingItem: React.Dispatch<React.SetStateAction<boolean>>;
	isCartEditingState: boolean;
	setIsCartEditingState: React.Dispatch<React.SetStateAction<boolean>>;
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
