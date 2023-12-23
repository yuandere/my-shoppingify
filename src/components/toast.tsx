import * as ToastPrimitive from '@radix-ui/react-toast';
import '@/styles/radix-toast.css';

interface IToast {
	preset?: ToastPresets | string;
	style?: string;
	title?: string;
	content: string;
	altText?: string;
	open?: boolean;
	onOpenChange?: React.Dispatch<React.SetStateAction<boolean>>;
	duration?: number;
	children?: React.ReactNode;
}

export enum ToastPresets {
	success = 'Success',
	error = 'Error',
}

export const Toast = ({
	preset,
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
				className={`ToastRoot${preset ? ` Toast${preset}` : style ? ` Toast${style}` : ''}`}
				open={open}
				onOpenChange={onOpenChange}
				duration={duration ? duration : undefined}
			>
				{(title || preset) && (
					<ToastPrimitive.Title className='ToastTitle'>
						{title ? title : preset ? preset : ''}
					</ToastPrimitive.Title>
				)}
				<ToastPrimitive.Description className='ToastDescription text-gray-500'>
					{content}
				</ToastPrimitive.Description>
				{children && (
					<ToastPrimitive.Action
						asChild
						className='ToastAction'
						altText={altText ? altText : content }
					>
						{children}
					</ToastPrimitive.Action>
				)}
				<ToastPrimitive.Close aria-label='Close'>
					<span aria-hidden className='cursor-pointer'>
						×
					</span>
				</ToastPrimitive.Close>
			</ToastPrimitive.Root>
			<ToastPrimitive.ToastViewport className='ToastViewport' />
		</>
	);
};
