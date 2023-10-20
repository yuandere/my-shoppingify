import prisma from '@/lib/prisma';
import { NextResponse, NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		return await fetchItemCards(body);
	} catch (error) {
		const err = error as Error;
		return NextResponse.json({ message: err.message, success: false });
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
		return NextResponse.json({ message: err.message, success: false });
	}
}

