'use client';
import { useState, useEffect, useRef } from 'react';

interface IItemData {
	name: string;
	ref: Number;
	category: Number;
	note: string;
	img?: string;
}

export default function ItemCard({ itemData }: { itemData: IItemData }) {
	const [shouldTruncate, setShouldTruncate] = useState<boolean>(false);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const canvas = document.createElement('canvas');
		const context = canvas.getContext('2d');
		if (!ref.current || !context) return;
		context.font = '12px poppins';
		const width = context.measureText(itemData.name).width;
		if (width > 120) {
			setShouldTruncate(true);
		} else {
			setShouldTruncate(false);
		}
	}, [itemData.name]);

	return (
		<div className='flex items-center justify-between rounded-xl shadow-md w-48 min-h-min max-h-20 bg-white mx-2 my-4 p-4 transition hover:bg-theme-3 hover:scale-[1.03]'>
			<p ref={ref} className='mr-1 break-words w-[120px]'>
				{shouldTruncate ? `${itemData.name.slice(0, 21)}...` : itemData.name}
			</p>
			<span className='material-icons text-ui cursor-pointer hover:text-ui-dark'>
				add
			</span>
		</div>
	);
}
