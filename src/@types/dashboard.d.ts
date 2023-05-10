export interface IUserSession {
	itemsData: Array<IItemsData>;
	// categoriesData: { [key: number]: string };
	categoriesData: Array<string>;
	userShoppingLists: Array<IUserShoppingList>;
}

interface IItemsData {
	name: string;
	id: string;
	categoryId?: string;
	categoryName?: string;
	note?: string;
	img?: string;
}

export interface IUserContext {
	currentUser: IUserSession;
	setCurrentUser: Dispatch<SetStateAction<IUserSession>>;
}

interface IUserShoppingLists {
	id: string;
	name: string;
	completed: boolean;
	items: IListItem;
}

interface IListItem {
	id: string;
	itemId: string;
	listId: string;
	checked: boolean;
	quantity: number;
}
