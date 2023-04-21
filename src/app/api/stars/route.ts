import prisma from '@/app/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
	try {
		const res = await prisma.star.findMany();
		return NextResponse.json({ res });
	} catch {
		return new Response('db error', { status: 500 });
	}
}
