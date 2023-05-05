export interface IUserSession {
	itemsData: Array<IItemsDataProps>;
	categoriesData: { [key: number]: string };
}

export interface IItemsData {
	name: string;
	id: string;
	category: number;
	note: string;
	img: string;
}

export interface IUserContext {
	currentUser: IUserSession;
	setCurrentUser: Dispatch<SetStateAction<IUserSession>>;
}