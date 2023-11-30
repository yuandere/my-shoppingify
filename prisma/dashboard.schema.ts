import { z } from 'zod';

// itemCard api schemas
export const itemCardAdd = z.object({
	name: z.string().min(1),
	description: z.string().min(1).optional(),
	imageUrl: z.string().min(1).optional(),
	categoryId: z.string().min(1).optional(),
});

export const itemCardDelete = z.string().cuid();

//listItem api schemas
export const listItemsGet = z.string().cuid();

export const listItemRequest = z.object({
	listItemId: z.string().cuid(),
	listId: z.string().cuid(),
	action: z.enum(['add', 'delete', 'quantity', 'check']),
});

export const listItemAdd = z.object({
	listId: z.string().cuid(),
	action: z.enum(['add', 'delete', 'quantity', 'check']),
	itemId: z.string().cuid(),
	name: z.string().min(1),
	categoryName: z.string().min(1).optional(),
});

export const listItemChangeQuantity = listItemRequest.extend({
	quantity: z.number().int().lte(99),
});

export const listItemChangeChecked = listItemRequest.extend({
	checked: z.boolean(),
});

// list api schemas
export const listEdit = z.object({
	name: z.string().min(1).optional(),
	firstItemData: listItemAdd,
	listId: z.string().cuid(),
})

//util schemas
export const categoryAdd = z.string();
