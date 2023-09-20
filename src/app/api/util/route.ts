import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

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
			case 'fetchCategory':
				return await fetchCategory(body);
			default:
				throw new Error('Action not recognized');
		}
	} catch (error) {
		const err = error as Error;
		return NextResponse.json({ message: err, success: false });
	}
}

async function fetchCategory(
	body: { userId: string }
) {
	try {
		const categories = await prisma.category.findMany({
			where: { ownerId: body.userId },
		});
		return NextResponse.json({
			message: `Categories for user ${body.userId} fetched`,
			success: true,
			data: categories,
		});
	} catch (error) {
		const err = error as Error;
		return NextResponse.json({
			error: err.message,
			success: false,
		});
	}
}
