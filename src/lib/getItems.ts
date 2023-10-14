import { cache } from 'react';

export const preload = (id: string) => {
	void getItems(id);
};

export const getItems = cache(async (id: string) => {
		const getItemsRequest = new Request(`${process.env.NEXT_PUBLIC_URL}/api/itemCard/getItems`, {
		method: 'POST',
		body: JSON.stringify({ id: id }),
	});
	const data = fetch(getItemsRequest)
		.then((res) => {
			return res.json();
		})
		.catch((err) => {
			console.error(err);
		});
	return data;
});
