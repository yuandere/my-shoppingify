import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { listItemsGet } from '../../../../../prisma/dashboard.schema';

export async function GET(req: NextRequest, res: NextResponse) {
	const searchParams = req.nextUrl.searchParams;
	const listId = searchParams.get('id');
  if (!listId) {
  		return NextResponse.json(
			{ message: 'no listId provided', success: false },
			{ status: 500 }
		);
  }
	try {
		const resultZod = listItemsGet.safeParse(listId);
		if (!resultZod.success) {
			console.log(resultZod.error.format());
			const zodIssues = resultZod.error.issues;
			throw new Error(`zod found ${zodIssues.length} issue(s)`);
		}
    const resultPrisma = await prisma.listItem.findMany({
			where: {
				listId: listId,
			},
		});
    return NextResponse.json({
			message: 'ListItems successfully retrieved',
			success: true,
			data: resultPrisma,
		});
	} catch (error) {
		const err = error as Error;
		return NextResponse.json(
			{ message: err.message, success: false },
			{ status: 500 }
		);
	}
}
