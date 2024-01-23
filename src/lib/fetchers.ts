export const getItems = async (id: string | null | undefined) => {
	if (id === undefined || id === null) return;
	const itemsRequest = new Request(
		`${process.env.NEXT_PUBLIC_URL}/api/itemCard/getItems`,
		{
			method: 'POST',
			body: JSON.stringify({ userId: id }),
		}
	);
	const response = await fetch(itemsRequest);
	if (!response.ok) {
		throw new Error('fetch went wrong');
	}
	return response.json();
};

export const getCategories = async () => {
	const categoriesRequest = new Request(
		`${process.env.NEXT_PUBLIC_URL}/api/util`,
		{
			method: 'POST',
			body: JSON.stringify({ action: 'fetchCategory' }),
		}
	);
	const response = await fetch(categoriesRequest);
	if (!response.ok) {
		throw new Error('fetch went wrong');
	}
	return response.json();
};

export const getLists = async () => {
	const listsRequest = new Request(
		`${process.env.NEXT_PUBLIC_URL}/api/list`,
		{
			method: 'POST',
			body: JSON.stringify({ action: 'fetchList' }),
		}
	);
	const response = await fetch(listsRequest);
	if (!response.ok) {
		throw new Error('fetch went wrong');
	}
	return response.json();
};

export const getListItems = async (id: string | undefined) => {
	if (id === undefined) return;
	const listItemsRequest = new Request(
		`${process.env.NEXT_PUBLIC_URL}/api/listItem/get?id=${id}`
	);
	const response = await fetch(listItemsRequest);
	if (!response.ok) {
		throw new Error('fetch went wrong');
	}
	return response.json();
};