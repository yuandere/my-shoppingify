import prisma from '@/lib/prisma';
import { NextResponse, NextRequest } from 'next/server';
import { authOptions } from '../auth/[...nextauth]/route';
import { getServerSession } from 'next-auth/next';
import {
	itemCardAdd,
	itemCardDelete,
} from '../../../../prisma/itemCard.schema';

interface IItemCardAdd {
	name: string;
	description?: string;
	imageUrl?: string;
	categoryId?: string;
}
interface IItemCardDelete {
	itemId: string;
}

export async function POST(req: NextRequest, res: NextResponse) {
	try {
		const body = await req.json();
		if (!body.action) {
			throw new Error('Action specifier is missing or incorrect');
		}
		switch (body.action) {
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
						id: 'clgu4e0tl0000v3v89i3xw9sv',
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
		console.log(newItem);
		return NextResponse.json({
			message: 'Item card successfully added',
			success: true,
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
