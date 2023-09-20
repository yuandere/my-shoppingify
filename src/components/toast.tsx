import * as ToastPrimitive from '@radix-ui/react-toast';
import '@/styles/radix-toast.css';

interface IToast {
	style?: string;
	title: string;
	content: string;
	altText: string;
	open: boolean;
	onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
	duration?: number;
	children?: React.ReactNode;
}

export const Toast = ({
	style,
	title,
	content,
	altText,
	open,
	onOpenChange,
	duration,
	children,
	...props
}: IToast) => {
	return (
		<>
			<ToastPrimitive.Root
				{...props}
				className={style ? `ToastRoot Toast${style}` : 'ToastRoot'}
				open={open}
				onOpenChange={onOpenChange}
				duration={duration ? duration : undefined}
			>
				{title && (
					<ToastPrimitive.Title className='ToastTitle'>
						{title}
					</ToastPrimitive.Title>
				)}
				<ToastPrimitive.Description className='ToastDescription text-gray-500'>
					{content}
				</ToastPrimitive.Description>
				{children && (
					<ToastPrimitive.Action
						asChild
						className='ToastAction'
						altText={altText}
					>
						{children}
					</ToastPrimitive.Action>
				)}
				<ToastPrimitive.Close aria-label='Close'>
					<span aria-hidden className='cursor-pointer'>×</span>
				</ToastPrimitive.Close>
			</ToastPrimitive.Root>
			<ToastPrimitive.ToastViewport className='ToastViewport' />
		</>
	);
};
