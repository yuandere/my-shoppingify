export const getItems = async (id: string) => {
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

export const getLists = async (id: string) => {
	const listsRequest = new Request(
		`${process.env.NEXT_PUBLIC_URL}/api/list`,
		{
			method: 'POST',
			body: JSON.stringify({ action: 'fetchList', userId: id }),
		}
	);
	const response = await fetch(listsRequest);
	if (!response.ok) {
		throw new Error('fetch went wrong');
	}
	return response.json();
};