import { useContext } from 'react';
import { DashboardStatesContext } from '@/app/(dashboard)/providers';
import { IList } from '@/@types/dashboard';

export default function ShoppingList({ listProps }: { listProps: IList }) {
	const dashStates = useContext(DashboardStatesContext);
	const selectedList = dashStates?.selectedList;
	const createdAt = new Date(listProps.createdAt).toDateString();
	return (
		<div
			className='flex items-center justify-between select-none border-black cursor-pointer hover:border-2'
			onClick={() => {
				if (selectedList?.id != listProps.id) {
					dashStates?.setSelectedList(listProps);
				} else {
					dashStates?.setIsViewingList(true);
				}
			}}
		>
			<p>{listProps.name}</p>
			<div className='flex items-center'>
				<span className='material-icons'>calendar</span>
				<p>{createdAt}</p>
			</div>
			{listProps.completed ? (
				<p className='text-green-500'>Completed</p>
			) : (
				<p className='text-red-500'>Incomplete</p>
			)}
		</div>
	);
}
