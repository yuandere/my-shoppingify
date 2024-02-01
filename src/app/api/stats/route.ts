import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { z } from 'zod';
import prisma from '@/lib/prisma';

interface IPrismaStatsResponse {
	name: string;
	_count: { [key: string]: number };
}
interface IListsStatsResponse {
	updatedAt: Date;
	_count: { [key: string]: number };
}

const statsConverter = (input: Array<IPrismaStatsResponse>) => {
	const output = [];
	for (let i = 0; i < 3; i++) {
		output.push({
			name: input[i].name,
			count: Object.values(input[i]._count)[0],
			ratio: Math.round(
				(Object.values(input[i]._count)[0] / input.length) * 100
			),
		});
	}
	return output;
};
const listsConverter = (input: Array<IListsStatsResponse>) => {
	const output = [];
	for (let i = 0; i < input.length; i++) {
		output.push({
			month: input[i].updatedAt.toLocaleString('default', { month: 'long' }),
			count: Object.values(input[i]._count)[0],
		});
	}
	// TODO: consolidate same number months, only include past 7 months
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
		const p1 = prisma.item.findMany({
			where: { ownerId: userId },
			select: {
				name: true,
				_count: {
					select: { ListItem: true },
				},
			},
			orderBy: {
				ListItem: {
					_count: 'desc',
				},
			},
		});
		// returns [ { name: string, _count: { items: number } } ]
		const p2 = prisma.category.findMany({
			where: { ownerId: userId },
			select: {
				name: true,
				_count: {
					select: { items: true },
				},
			},
			orderBy: {
				items: {
					_count: 'desc',
				},
			},
		});
		// returns [ { updatedAt: DateTime, _count: { items: number } } ]
		const p3 = prisma.list.findMany({
			where: { ownerId: userId },
			select: {
				updatedAt: true,
				_count: {
					select: { items: true },
				},
			},
			orderBy: {
				updatedAt: 'asc',
			},
		});
		const [items, categories, lists] = await Promise.all([p1, p2, p3]);
		const result = {
			items: statsConverter(items),
			categories: statsConverter(categories),
			lists: listsConverter(lists),
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
