import { z } from 'zod';

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
