import { z } from 'zod';

// itemCard api schemas
export const itemCardAdd = z.object({
	name: z.string().min(1),
	description: z.string().min(1).optional(),
	imageUrl: z.string().min(1).optional(),
	categoryId: z.string().min(1).optional(),
});

export const itemCardDelete = z.string().cuid();

// list api schemas
export const listAdd = z.object({
	name: z.string().min(1),
	userId: z.string().cuid(),
});

export const listDelete = z.string().cuid();

//listItem api schemas
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

//util schemas
export const categoryAdd = z.string();
