import prisma from '@/app/lib/prisma'
import { NextResponse } from 'next/server';

export async function GET() {
  const res = await prisma.star.findMany();

  return NextResponse.json({ res })
}