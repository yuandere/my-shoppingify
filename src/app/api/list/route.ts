import prisma from '@/lib/prisma';
import { NextResponse, NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { listEdit } from '../../../../prisma/dashboard.schema';

interface IListEdit {
	listId: string;
	name?: string;
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
		if (!body.action) {
			throw new Error('Action specifier is missing or incorrect');
		};
		body.userId = userId;
		switch (body.action) {
			case 'fetchList':
				return await fetchLists(body);
			case 'add':
				return await addList(body);
			case 'delete':
				const resultDelete = listEdit.safeParse(body);
				if (!resultDelete.success) {
					console.log(resultDelete.error.format());
					const zodIssues = resultDelete.error.issues;
					throw new Error(`zod found ${zodIssues.length} issue(s)`);
				}
				return await deleteList(body);
			case 'rename':
				const resultRename = listEdit.safeParse(body);
				if (!resultRename.success) {
					console.log(resultRename.error.format());
					const zodIssues = resultRename.error.issues;
					throw new Error(`zod found ${zodIssues.length} issue(s)`);
				}
				return await renameList(body);
			case 'complete':
				const resultComplete = listEdit.safeParse(body);
				if (!resultComplete.success) {
					console.log(resultComplete.error.format());
					const zodIssues = resultComplete.error.issues;
					throw new Error(`zod found ${zodIssues.length} issue(s)`);
				}
				return await completeList(body);
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

// TODO: find out if there are existing 'new lists' and change name field accordingly
async function addList(body: { userId: string}) {
	try {
		const newItem = await prisma.list.create({
			data: {
				name: 'New List',
				ownerId: body.userId,
			},
		});
		return NextResponse.json({
			message: 'List successfully created',
			success: true,
			data: newItem,
		});
	} catch (error) {
		console.error('Request error', error);
		return NextResponse.json({
			error: 'Error adding list',
			success: false,
		});
	}
}

async function deleteList(body: IListEdit) {
	try {
		const result = await prisma.list.delete({
			where: {
				id: body.listId,
			},
		});
		return NextResponse.json({
			message: 'List successfully deleted',
			success: true,
		});
	} catch (error) {
		console.error('Request error', error);
		return NextResponse.json({
			error: 'Error deleting list',
			success: false,
		});
	}
}

async function renameList(body: IListEdit) {
	console.log('yaaaaaaaawn')
	// try {
	// 	const result = await prisma.list.update({
	// 		where: {
	// 			id: body.listId,
	// 		},
	// 	});
	// 	return NextResponse.json({
	// 		message: 'List successfully renamed',
	// 		success: true,
	// 	});
	// } catch (error) {
	// 	console.error('Request error', error);
		return NextResponse.json({
			error: 'Error renaming list',
			success: false,
		});
	// }
}

async function completeList(body: IListEdit) {
	console.log('yaaaaaaaawn')
	// try {
	// 	const result = await prisma.list.delete({
	// 		where: {
	// 			id: body.listId,
	// 		},
	// 	});
	// 	return NextResponse.json({
	// 		message: 'List successfully completed',
	// 		success: true,
	// 	});
	// } catch (error) {
	// 	console.error('Request error', error);
		return NextResponse.json({
			error: 'Error completing list',
			success: false,
		});
	// }
}