import { useContext } from 'react';
import { DashboardStatesContext } from '@/app/(dashboard)/providers';
import { IList } from '@/@types/dashboard';

export default function ShoppingList({
	listProps,
	small,
}: {
	listProps: IList;
	small?: boolean;
}) {
	const dashboardStates = useContext(DashboardStatesContext);
	const selectedList = dashboardStates?.selectedList;
	const createdAt = new Date(listProps.createdAt).toDateString();
	return (
		<div
			className={`flex justify-between items-center rounded-xl select-none border-black cursor-pointer bg-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.1)] transition hover:bg-theme-3 hover:scale-[1.01] hover:drop-shadow-[0_2px_9px_rgba(0,0,0,0.14) ${
				small ? 'mx-1 p-2' : 'mx-4 px-6 py-4'
			}`}
			onClick={() => {
				if (selectedList?.id !== listProps.id) {
					dashboardStates?.setSelectedList(listProps);
				} else {
					dashboardStates?.setIsViewingList(true);
				}
				dashboardStates?.setShowSidebarCartCount(true);
			}}
		>
			<p>{listProps.name}</p>
			<div className={`flex items-center ${small ? 'space-x-1' : 'space-x-4'}`}>
				<div
					className={`flex items-center text-ui ${
						small ? 'text-[10px]' : 'text-xs'
					}`}
				>
					<span
						className={`material-icons ${
							small ? 'text-[16px]' : 'text-[20px]'
						}`}
					>
						calendar_month
					</span>
					<p>{createdAt}</p>
				</div>
				<div
					className={`rounded-lg border-2 text-xs py-[2px] px-1 ${
						listProps.completed ? 'border-complete' : 'border-red-500'
					}`}
				>
					{listProps.completed ? (
						<p className='text-complete'>completed</p>
					) : (
						<p className='text-red-500'>incomplete</p>
					)}
				</div>
			</div>
		</div>
	);
}
