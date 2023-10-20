export const getItems = async (id: string) => {
	const getItemsRequest = new Request(
		`${process.env.NEXT_PUBLIC_URL}/api/itemCard/getItems`,
		{
			method: 'POST',
			body: JSON.stringify({ id: id }),
		}
	);
	const response = await fetch(getItemsRequest);
	if (!response.ok) {
		throw new Error('fetch went wrong');
	}
	return response.json();
};

export const getCategories = async () => {
	const getCategoriesRequest = new Request(
		`${process.env.NEXT_PUBLIC_URL}/api/util`,
		{
			method: 'POST',
			body: JSON.stringify({ action: 'fetchCategory' }),
		}
	);
	const response = await fetch(getCategoriesRequest);
	if (!response.ok) {
		throw new Error('fetch went wrong');
	}
	return response.json();
};
