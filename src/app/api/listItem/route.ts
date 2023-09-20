import prisma from '@/lib/prisma';
import { NextResponse, NextRequest } from 'next/server';
import {
	listItemAdd,
	listItemRequest,
	listItemChangeQuantity,
	listItemChangeChecked,
} from '../../../../prisma/dashboard.schema';

interface IListItemRequest {
	listItemId: string;
	listId: string;
	action: string;
}
interface IListItemAdd {
	listId: string;
	action: string;
	itemId: string;
	name: string;
	categoryName?: string;
}
interface IListItemChangeQuantity extends IListItemRequest {
	quantity: number;
}
interface IListItemChangeChecked extends IListItemRequest {
	checked: boolean;
}

export async function POST(req: NextRequest, res: NextResponse) {
	try {
		const body = await req.json();
		if (!body.action) {
			throw new Error('Action specifier is missing or incorrect');
		}
		switch (body.action) {
			case 'add':
				const resultAdd = listItemAdd.safeParse(body);
				if (!resultAdd.success) {
					console.log(resultAdd.error.format());
					const zodIssues = resultAdd.error.issues;
					throw new Error(`zod found ${zodIssues.length} issue(s)`);
				}
				return await addListItem(req, res, body);
			case 'delete':
				const resultDelete = listItemRequest.safeParse(body);
				if (!resultDelete.success) {
					console.log(resultDelete.error.format());
					const zodIssues = resultDelete.error.issues;
					throw new Error(`zod found ${zodIssues.length} issue(s)`);
				}
				return await deleteListItem(req, res, body);
			case 'quantity':
				const resultQuantity = listItemChangeQuantity.safeParse(body);
				if (!resultQuantity.success) {
					console.log(resultQuantity.error.format());
					const zodIssues = resultQuantity.error.issues;
					throw new Error(`zod found ${zodIssues.length} issue(s)`);
				}
				return await changeQuantityListItem(req, res, body);
			case 'check':
				const resultChecked = listItemChangeChecked.safeParse(body);
				if (!resultChecked.success) {
					console.log(resultChecked.error.format());
					const zodIssues = resultChecked.error.issues;
					throw new Error(`zod found ${zodIssues.length} issue(s)`);
				}
				return await changeCheckedListItem(req, res, body);
			default:
				throw new Error('Action not recognized');
		}
	} catch (error) {
		const err = error as Error;
		return NextResponse.json({
			message: err.message,
			success: false,
		});
	}
}

async function addListItem(
	req: NextRequest,
	res: NextResponse,
	body: IListItemAdd
) {
	try {
		const result = await prisma.listItem.findFirst({
			where: {
				itemId: body.itemId,
			},
		});
		if (!result?.id) {
			await prisma.listItem.create({
				data: {
					name: body.name,
					item: {
						connect: {
							id: body.itemId,
						},
					},
					list: {
						connect: {
							id: body.listId,
						},
					},
					quantity: 1,
					checked: false,
					...(body.categoryName ? { categoryName: body.categoryName } : null),
				},
			});
			const updatedDate = new Date();
			await prisma.list.update({
				where: {
					id: body.listId,
				},
				data: {
					updatedAt: updatedDate.toISOString(),
				},
			});
		}
		return NextResponse.json({
			message: 'List item successfully added or already exists',
			success: true,
		});
	} catch (error) {
		console.error('Request error', error);
		return NextResponse.json({
			error: 'Error adding list item',
			success: false,
		});
	}
}

async function deleteListItem(
	req: NextRequest,
	res: NextResponse,
	body: IListItemRequest
) {
	try {
		await prisma.listItem.delete({
			where: {
				id: body.listItemId,
			},
		});
		const updatedDate = new Date();
		await prisma.list.update({
			where: {
				id: body.listId,
			},
			data: {
				updatedAt: updatedDate.toISOString(),
			},
		});
		return NextResponse.json({ message: 'List item deleted', success: true });
	} catch (error) {
		console.error('Request error', error);
		return NextResponse.json({
			error: 'Error deleting list item',
			success: false,
		});
	}
}

async function changeQuantityListItem(
	req: NextRequest,
	res: NextResponse,
	body: IListItemChangeQuantity
) {
	try {
		await prisma.listItem.update({
			where: { id: body.listItemId },
			data: { quantity: body.quantity },
		});
		const updatedDate = new Date();
		await prisma.list.update({
			where: {
				id: body.listId,
			},
			data: {
				updatedAt: updatedDate.toISOString(),
			},
		});
		return NextResponse.json({
			message: 'List item quantity updated',
			success: true,
		});
	} catch (error) {
		console.error('Request error', error);
		return NextResponse.json({
			error: 'Error changing list item quantity',
			success: false,
		});
	}
}

async function changeCheckedListItem(
	req: NextRequest,
	res: NextResponse,
	body: IListItemChangeChecked
) {
	try {
		await prisma.listItem.update({
			where: { id: body.listItemId },
			data: { checked: body.checked },
		});
		const updatedDate = new Date();
		await prisma.list.update({
			where: {
				id: body.listId,
			},
			data: {
				updatedAt: updatedDate.toISOString(),
			},
		});
		return NextResponse.json({
			message: 'List item checked status updated',
			success: true,
		});
	} catch (error) {
		console.error('Request error', error);
		return NextResponse.json({
			error: 'Error changing list item quantity',
			success: false,
		});
	}
}
