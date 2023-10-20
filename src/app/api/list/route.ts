import prisma from '@/lib/prisma';
import { NextResponse, NextRequest } from 'next/server';
import {
	listAdd,
	listDelete,
} from '../../../../prisma/dashboard.schema';

interface IListAdd {
	name: string;
	userId: string;
  items: Array<string>;
}
interface IListDelete {
	listId: string;
}

export async function POST(req: NextRequest, res: NextResponse) {
	try {
		const body = await req.json();
		if (!body.action) {
			throw new Error('Action specifier is missing or incorrect');
		}
		switch (body.action) {
			case 'fetchList':
				return await fetchLists(body);
			case 'add':
        return NextResponse.json({ message: 'request successful and under construction', success: true})
				// const resultAdd = listAdd.safeParse(body);
				// if (!resultAdd.success) {
				// 	console.log(resultAdd.error.format());
				// 	const zodIssues = resultAdd.error.issues;
				// 	throw new Error(`zod found ${zodIssues.length} issue(s)`);
				// }
				// return await addList(body);
			case 'delete':
        return NextResponse.json({ message: 'request successful and under construction', success: true})
				// const resultDelete = listDelete.safeParse(body.listId);
				// if (!resultDelete.success) {
				// 	console.log(resultDelete.error.format());
				// 	const zodIssues = resultDelete.error.issues;
				// 	throw new Error(`zod found ${zodIssues.length} issue(s)`);
				// }
				// return await deleteList(body);
			default:
				throw new Error('Action not recognized');
		}
	} catch (error) {
		const err = error as Error;
		return NextResponse.json({ message: err.message, success: false });
	}
}

async function fetchLists(body: { userId: string }) {
	try {
		const result = await prisma.list.findMany({
			where: { ownerId: body.userId },
		});
		return NextResponse.json({
			message: 'Lists successfully retrieved',
			success: true,
			data: result,
		});
	} catch (error) {
		const err = error as Error;
		return NextResponse.json({ message: err.message, success: false });
	}
}

// async function addList(body: IListAdd) {
// 	try {
// 		const newItem = await prisma.item.create({
// 			data: {
// 				name: body.name,
// 				owner: {
// 					connect: {
// 						id: body.userId,
// 					},
// 				},
// 				...(body.description ? { description: body.description } : null),
// 				...(body.imageUrl ? { imageUrl: body.imageUrl } : null),
// 				...(body.categoryId
// 					? {
// 							category: {
// 								connect: {
// 									id: body.categoryId,
// 								},
// 							},
// 					  }
// 					: null),
// 			},
// 		});
// 		return NextResponse.json({
// 			message: 'Item card successfully added',
// 			success: true,
// 			data: newItem,
// 		});
// 	} catch (error) {
// 		console.error('Request error', error);
// 		return NextResponse.json({
// 			error: 'Error adding item card',
// 			success: false,
// 		});
// 	}
// }

// async function deleteList(body: IListDelete) {
// 	try {
// 		const result = await prisma.item.delete({
// 			where: {
// 				id: body.itemId,
// 			},
// 		});
// 		return NextResponse.json({
// 			message: 'Item successfully deleted',
// 			success: true,
// 		});
// 	} catch (error) {
// 		console.error('Request error', error);
// 		return NextResponse.json({
// 			error: 'Error deleting item card',
// 			success: false,
// 		});
// 	}
// }
