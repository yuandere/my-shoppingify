import * as ToastPrimitive from '@radix-ui/react-toast';
import '@/styles/radix-toast.css';

interface IToast {
	title: string;
	content: string;
	altText: string;
	children: React.ReactNode;
}

export const Toast = ({
	title,
	content,
	altText,
	children,
	...props
}: IToast) => {
	return (
		<ToastPrimitive.Root {...props}>
			{title && <ToastPrimitive.Title>{title}</ToastPrimitive.Title>}
			<ToastPrimitive.Description>{content}</ToastPrimitive.Description>
			{children && (
				<ToastPrimitive.Action asChild altText={altText}>
					{children}
				</ToastPrimitive.Action>
			)}
			<ToastPrimitive.Close aria-label='Close'>
				<span aria-hidden>×</span>
			</ToastPrimitive.Close>
		</ToastPrimitive.Root>
	);
};
