import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { categoryAdd } from '../../../../prisma/dashboard.schema';

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
			case 'fetchCategory':
				return await fetchCategory(body);
			case 'addCategory':
				const resultAdd = categoryAdd.safeParse(body.name);
				if (!resultAdd.success) {
					console.log(resultAdd.error.format());
					const zodIssues = resultAdd.error.issues;
					throw new Error(`zod found ${zodIssues.length} issue(s)`);
				}
				return await addCategory(body);
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

async function fetchCategory(body: { userId: string }) {
	try {
		const categories = await prisma.category.findMany({
			where: { ownerId: body.userId },
			select: { id: true, name: true },
		});
		return NextResponse.json({
			message: `Categories for user ${body.userId} fetched`,
			success: true,
			data: categories,
		});
	} catch (error) {
		const err = error as Error;
		return NextResponse.json(
			{ message: err.message, success: false },
			{ status: 500 }
		);
	}
}

async function addCategory(body: { userId: string; name: string }) {
	try {
		const newCategory = await prisma.category.create({
			data: {
				name: body.name,
				ownerId: body.userId,
			},
		});
		return NextResponse.json({
			message: `New category '${newCategory.name}' created with id ${newCategory.id}`,
		});
	} catch (error) {
		const err = error as Error;
		return NextResponse.json(
			{ message: err.message, success: false },
			{ status: 500 }
		);
	}
}
