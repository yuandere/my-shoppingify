import { IList } from '@/@types/dashboard';

export default function ShoppingList({ listProps }: { listProps: IList }) {
  const createdAt = new Date(listProps.createdAt).toDateString();
	return (
		<div className='flex items-center justify-between'>
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
