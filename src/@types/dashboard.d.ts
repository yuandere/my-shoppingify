export interface IUserSession {
	itemsData: Array<IItemsData>;
	categoriesData: Array<string>;
	userShoppingLists: Array<IUserShoppingList>;
}

interface IUserShoppingLists {
	id: string;
	name: string;
	completed: boolean;
	items: IListItem;
}

export interface IUserContext {
	currentUser: IUserSession;
	setCurrentUser: Dispatch<SetStateAction<IUserSession>>;
}

export interface ICartStatesContext {
	isCartAddingItem: boolean;
	setIsCartAddingItem: Dispatch<SetStateAction<boolean>>;
	isCartViewingItem: boolean;
	setIsCartViewingItem: Dispatch<SetStateAction<boolean>>;
}

//itemsView
export interface IItemsData {
	name: string;
	id: string;
	categoryId?: string;
	categoryName?: string;
	note?: string;
	img?: string;
}

export interface IItemsArray {
	categoryName: string;
	items: Array<IItemsData>;
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

export interface IListItemsArray {
	categoryName: string;
	items: Array<IListItem>;
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
