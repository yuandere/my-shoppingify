'use client';
import * as Avatar from '@radix-ui/react-avatar';
import '@/styles/radix-avatar.css';

export default function SideBar({}) {
	return (
		<div className='flex flex-col justify-between items-center py-4 w-12 h-screen bg-white border border-black sm:w-16'>
			<div className=''>
				<Avatar.Root className='AvatarRoot'>
					<Avatar.Image
						className='AvatarImage'
						src='https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=80'
						alt='Derek Lee'
					></Avatar.Image>
					<Avatar.Fallback className='AvatarFallback'>DL</Avatar.Fallback>
				</Avatar.Root>
			</div>
			<div className='flex flex-col justify-between h-56'>
				<span className='material-icons text-ui-dark'>list</span>
				<span className='material-icons text-ui-dark'>history</span>
				<span className='material-icons text-ui-dark'>show_chart</span>
			</div>
			<div className='rounded-full bg-orange-400'>
				<span className='material-icons-outlined text-white'>
					shopping_cart
				</span>
			</div>
		</div>
	);
}
