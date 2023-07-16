import prisma from '@/lib/prisma';
import { NextResponse, NextRequest } from 'next/server';

interface IListItemModifyRequest {
  itemId: string;
  listId: string;
}
interface IListItemAddRequest extends IListItemModifyRequest {
	name: string;
	categoryName?: string;
}
interface IListItemQuantityRequest extends IListItemModifyRequest {
  quantity: number;
}

interface IListItemCheckedRequest extends IListItemModifyRequest {
  checked: boolean;
}

// add actions to add/delete/change quantity/checked bool of list item
export async function POST(req: NextRequest, res: NextResponse) {
	const body = await req.json();
	console.log(body);
	return NextResponse.json({ message: 'POST test successful', success: true, data: body })
	// return await addListItem(req, res, body);
}

async function addListItem(req: NextRequest, res: NextResponse, body:IListItemAddRequest) {
	if (!req.body) {
		return NextResponse.json({ message: 'No body provided', success: false });
	}
	try {
		const newListItem = await prisma.listItem.create({
			data: {
				name: body.name,
				itemId: body.itemId,
				item: {
					connect: {
						id: body.itemId,
					},
				},
				listId: body.listId,
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
		return NextResponse.json({ message: 'List item added', success: true });
	} catch (error) {
		console.error('Request error', error);
		return NextResponse.json({
			error: 'Error adding list item',
			success: false,
		});
	}
}
