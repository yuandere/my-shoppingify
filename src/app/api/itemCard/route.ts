import prisma from '@/lib/prisma';
import { NextResponse, NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import {
	itemCardAdd,
	itemCardDelete,
} from '../../../../prisma/dashboard.schema';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

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
		return NextResponse.json(
			{ message: err.message, success: false },
			{ status: 500 }
		);
	}
	try {
		const body = await req.json();
		body.userId = userId;
		if (!body.action) {
			throw new Error('Action specifier is missing or incorrect');
		}
		switch (body.action) {
			case 'fetch':
				return await fetchItemCards(body);
			case 'add':
				const resultAdd = itemCardAdd.safeParse(body);
				if (!resultAdd.success) {
					console.log(resultAdd.error.format());
					const zodIssues = resultAdd.error.issues;
					throw new Error(`zod found ${zodIssues.length} issue(s)`);
				}
				return await addItemCard(body);
			case 'delete':
				const resultDelete = itemCardDelete.safeParse(body.itemId);
				if (!resultDelete.success) {
					console.log(resultDelete.error.format());
					const zodIssues = resultDelete.error.issues;
					throw new Error(`zod found ${zodIssues.length} issue(s)`);
				}
				return await deleteItemCard(body);
			default:
				throw new Error('Action not recognized');
		}
	} catch (error) {
		const err = error as Error;
		return NextResponse.json(
			{ message: err.message, success: false },
			{ status: 500 }
		);
	}
}

async function fetchItemCards(body: { userId: string }) {
	try {
		const itemCards = await prisma.item.findMany({
			where: { ownerId: body.userId },
		});
		return NextResponse.json({
			message: 'Item cards successfully retrieved',
			success: true,
			data: itemCards,
		});
	} catch (error) {
		const err = error as Error;
		return NextResponse.json(
			{ message: err.message, success: false },
			{ status: 500 }
		);
	}
}

async function addItemCard(body: IItemCardAdd) {
	try {
		const newItem = await prisma.item.create({
			data: {
				name: body.name,
				User: {
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
		return NextResponse.json(
			{ message: 'error adding item card', success: false },
			{ status: 500 }
		);
	}
}

async function deleteItemCard(body: IItemCardDelete) {
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
		const err = error as PrismaClientKnownRequestError;
		console.error('Request error', error);
		return NextResponse.json(
			{
				error: 'Error deleting item card',
				success: false,
				code: err.code,
			},
			{ status: 500 }
		);
	}
}
