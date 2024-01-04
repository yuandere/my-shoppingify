import prisma from '@/lib/prisma';
import { NextResponse, NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { listEdit, listAdd } from '../../../../prisma/dashboard.schema';
import { IItemCard } from '@/@types/dashboard';

interface IListEdit {
	listId: string;
	name?: string;
}

interface IListAdd {
	name: string;
	firstItemData: IItemCard;
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
		if (!body.action) {
			throw new Error('Action specifier is missing or incorrect');
		}
		body.userId = userId;
		switch (body.action) {
			case 'fetchList':
				return await fetchLists(body);
			case 'add':
				return await addList(body);
			case 'addWithItem':
				const resultAddWithItem = listAdd.safeParse(body);
				if (!resultAddWithItem.success) {
					console.log(resultAddWithItem.error.format());
					const zodIssues = resultAddWithItem.error.issues;
					throw new Error(`zod found ${zodIssues.length} issue(s)`);
				}
				return await addListWithItem(body);
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
		return NextResponse.json(
			{ message: err.message, success: false },
			{ status: 500 }
		);
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
		return NextResponse.json(
			{ message: err.message, success: false },
			{ status: 500 }
		);
	}
}

async function addList(body: { userId: string }) {
	try {
		const newListSearch = await prisma.list.findMany({
			where: {
				name: {
					startsWith: 'New List',
				},
			},
		});
		const newList = await prisma.list.create({
			data: {
				name: `New List${
					newListSearch.length === 0 ? '' : `(${newListSearch.length})`
				}`,
				ownerId: body.userId,
			},
		});
		return NextResponse.json({
			message: 'List successfully created',
			success: true,
			data: {
				newList: newList,
			},
		});
	} catch (error) {
		const err = error as Error;
		return NextResponse.json(
			{ message: err.message, success: false },
			{ status: 500 }
		);
	}
}

async function addListWithItem(body: {
	userId: string;
	firstItemData: IItemCard;
}) {
	try {
		const newListSearch = await prisma.list.findMany({
			where: {
				name: {
					startsWith: 'New List',
				},
			},
		});
		const newList = await prisma.list.create({
			data: {
				name: `New List${
					newListSearch.length === 0 ? '' : `(${newListSearch.length})`
				}`,
				ownerId: body.userId,
			},
		});
		const newListItem = await prisma.listItem.create({
			data: {
				name: body.firstItemData.name,
				item: {
					connect: {
						id: body.firstItemData.id,
					},
				},
				list: {
					connect: {
						id: newList.id,
					},
				},
				quantity: 1,
				checked: false,
				...(body.firstItemData.categoryName
					? { categoryName: body.firstItemData.categoryName }
					: null),
			},
		});
		return NextResponse.json({
			message: 'List successfully created with first item',
			success: true,
			data: {
				newList: newList,
				newListItem: newListItem,
			},
		});
	} catch (error) {
		const err = error as Error;
		return NextResponse.json(
			{ message: err.message, success: false },
			{ status: 500 }
		);
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
		const err = error as Error;
		return NextResponse.json(
			{ message: err.message, success: false },
			{ status: 500 }
		);
	}
}

async function renameList(body: IListEdit) {
	try {
		const result = await prisma.list.update({
			where: {
				id: body.listId,
			},
			data: {
				name: body.name,
			},
		});
		return NextResponse.json({
			message: 'List successfully renamed',
			success: true,
		});
	} catch (error) {
		const err = error as Error;
		return NextResponse.json(
			{ message: err.message, success: false },
			{ status: 500 }
		);
	}
}

async function completeList(body: IListEdit) {
	try {
		const result = await prisma.list.update({
			where: {
				id: body.listId,
			},
			data: {
				completed: true,
			},
		});
		return NextResponse.json({
			message: 'List successfully completed',
			success: true,
		});
	} catch (error) {
		const err = error as Error;
		return NextResponse.json(
			{ message: err.message, success: false },
			{ status: 500 }
		);
	}
}
