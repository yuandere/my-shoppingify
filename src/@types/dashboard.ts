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
	selectedItem: IItemsData | null;
	setSelectedItem: React.Dispatch<React.SetStateAction<IItemsData | null>>;
	selectedList: IList | null;
	setSelectedList: React.Dispatch<React.SetStateAction<IList | null>>;
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
export interface IItemsData {
	name: string;
	id: string;
	categoryId?: string;
	categoryName?: string;
	description?: string;
	imageUrl?: string;
}

export interface IItemsArray {
	categoryName: string;
	items: Array<IItemsData>;
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

export interface ICategoriesData {
	id: string;
	name: string;
}
