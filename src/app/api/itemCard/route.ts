import prisma from '@/lib/prisma';
import { NextResponse, NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import {
	itemCardAdd,
	itemCardDelete,
} from '../../../../prisma/itemCard.schema';

interface IItemCardsFetch {
	userId: string;
}
interface IItemCardAdd {
	name: string;
	description?: string;
	imageUrl?: string;
	categoryId?: string;
	userId: string;
}
interface IItemCardDelete {
	itemId: string;
}

export async function POST(req: NextRequest, res: NextResponse) {
	let userId = null;
	try {
		const token = await getToken({ req });
		userId = token?.sub;
	} catch (error) {
		const err = error as Error;
		return NextResponse.json({ error: err.message, success: false });
	}
	try {
		const body = await req.json();
		body.userId = userId;
		if (!body.action) {
			throw new Error('Action specifier is missing or incorrect');
		}
		switch (body.action) {
			case 'fetch':
				return await fetchItemCards(req, res, body);
			case 'add':
				const resultAdd = itemCardAdd.safeParse(body);
				if (!resultAdd.success) {
					console.log(resultAdd.error.format());
					const zodIssues = resultAdd.error.issues;
					throw new Error(`zod found ${zodIssues.length} issue(s)`);
				}
				return await addItemCard(req, res, body);
			case 'delete':
				const resultDelete = itemCardDelete.safeParse(body.itemId);
				if (!resultDelete.success) {
					console.log(resultDelete.error.format());
					const zodIssues = resultDelete.error.issues;
					throw new Error(`zod found ${zodIssues.length} issue(s)`);
				}
				return await deleteItemCard(req, res, body);
			default:
				throw new Error('Action not recognized');
		}
	} catch (error) {
		const err = error as Error;
		return NextResponse.json({ message: err.message, success: false });
	}
}

async function fetchItemCards(
	req: NextRequest,
	res: NextResponse,
	body: IItemCardsFetch
) {
	try {
		const itemCards = await prisma.item.findMany();
		return NextResponse.json({
			message: 'Item cards successfully retrieved',
			success: true,
			data: itemCards,
		});
	} catch (error) {
		const err = error as Error;
		return NextResponse.json({ message: err.message, success: false });
	}
}

async function addItemCard(
	req: NextRequest,
	res: NextResponse,
	body: IItemCardAdd
) {
	try {
		const newItem = await prisma.item.create({
			data: {
				name: body.name,
				owner: {
					connect: {
						id: body.userId,
					},
				},
				...(body.description ? { description: body.description } : null),
				...(body.imageUrl ? { imageUrl: body.imageUrl } : null),
				...(body.categoryId
					? {
							category: {
								connect: {
									id: body.categoryId,
								},
							},
					  }
					: null),
			},
		});
		return NextResponse.json({
			message: 'Item card successfully added',
			success: true,
			data: newItem,
		});
	} catch (error) {
		console.error('Request error', error);
		return NextResponse.json({
			error: 'Error adding item card',
			success: false,
		});
	}
}

async function deleteItemCard(
	req: NextRequest,
	res: NextResponse,
	body: IItemCardDelete
) {
	try {
		const result = await prisma.item.delete({
			where: {
				id: body.itemId,
			},
		});
		return NextResponse.json({
			message: 'Item successfully deleted',
			success: true,
		});
	} catch (error) {
		console.error('Request error', error);
		return NextResponse.json({
			error: 'Error deleting item card',
			success: false,
		});
	}
}
