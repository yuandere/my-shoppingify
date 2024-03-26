import { z } from 'zod';
// itemCard api schemas
export const itemCardAdd = z.object({
	name: z.string().min(1),
	description: z.string().min(1).nullable().optional(),
	imageUrl: z.string().url().nullable().optional(),
	categoryId: z.string().min(1).nullable().optional(),
});
export const itemCardDelete = z.string().uuid();

//listItem api schemas
export const listItemsGet = z.string().uuid();
export const listItemRequest = z.object({
	listItemId: z.string().uuid(),
	listId: z.string().uuid(),
	action: z.enum(['add', 'delete', 'quantity', 'check']),
});
export const listItemAdd = z.object({
	listId: z.string().uuid(),
	action: z.enum(['add', 'delete', 'quantity', 'check']),
	itemId: z.string().uuid(),
	name: z.string().min(1),
	categoryName: z.string().min(1).nullable().optional(),
});
export const listItemChangeQuantity = listItemRequest.extend({
	quantity: z.number().int().lte(99),
});
export const listItemChangeChecked = listItemRequest.extend({
	checked: z.boolean(),
});

// list api schemas
export const listEdit = z.object({
	listId: z.string().uuid(),
	name: z.string().min(1).optional(),
});
export const listComplete = listEdit.extend({
	completing: z.boolean(),
})
export const listAdd = z.object({
	name: z.string().min(1).optional(),
	firstItemData: itemCardAdd
		.extend({
			id: z.string().uuid(),
			categoryName: z.string().min(1).nullable().optional(),
			ownerId: z.string().uuid(),
		})
		.optional(),
});

//util schemas
export const categoryAdd = z.string();
