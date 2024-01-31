import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { z } from 'zod';
import prisma from '@/lib/prisma';

interface IPrismaStatsResponse {
	name: string;
	_count: { [key: string]: number };
}

const statsConverter = (input: Array<IPrismaStatsResponse>) => {
	const output = input.map((data) => ({
		name: data.name,
		count: Object.values(data._count)[0],
		ratio: Math.round((Object.values(data._count)[0] / input.length) * 100),
	}));
	output.sort((a, b) => b.count - a.count);
	while (output.length > 3) {
		output.pop();
	}
	return output;
};

export async function GET(req: NextRequest, res: NextResponse) {
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
		const resultZod = z.string().cuid().safeParse(userId);
		if (!resultZod.success) {
			console.log(resultZod.error.format());
			const zodIssues = resultZod.error.issues;
			throw new Error(`zod found ${zodIssues.length} issue(s)`);
		}
		// returns [ { name: string, _count: { ListItem: number } } ]
		const itemsWithCount = await prisma.item.findMany({
			where: { ownerId: userId },
			select: {
				name: true,
				_count: {
					select: { ListItem: true },
				},
			},
		});
		// returns [ { name: string, _count: { items: number } } ]
		const categoriesWithCount = await prisma.category.findMany({
			where: { ownerId: userId },
			select: {
				name: true,
				_count: {
					select: { items: true },
				},
			},
		});
		const result = {
			items: statsConverter(itemsWithCount),
			categories: statsConverter(categoriesWithCount),
		};
		return NextResponse.json({
			message: 'Stats successfully retrieved',
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
