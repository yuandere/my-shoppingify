import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, res: NextResponse) {
	// console.log('REQUEST BODY:', req.body);
	const body = await req.json();
	try {
		const newListItem = await prisma.listItem.create({
			data: {
				name: 'banana',
				item: {
					connect: {
						id: 'clk01f08q0000v3u4c023yjfg',
					},
				},
				list: {
					connect: {
						id: 'cljzcs3uh0004v3h4z1z1j8r9',
					},
				},
			},
		});
		return NextResponse.json({
			message: 'item created',
			success: 'true',
			data: newListItem,
		});
	} catch (err) {
		console.error(err);
		return NextResponse.json({
			message: 'prisma operation failed',
			success: false,
			data: err,
		});
	}
	// return NextResponse.json({
	// 	message: 'test 1 successful',
	// 	success: true,
	// 	data: body,
	// });
}
