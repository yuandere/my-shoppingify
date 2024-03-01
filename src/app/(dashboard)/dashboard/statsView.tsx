import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
	LineChart,
	Line,
	CartesianGrid,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
} from 'recharts';
import Loading from '@/components/loading';
import useViewport from '@/lib/useViewport';
import { getStatsData } from '@/lib/fetchers';

interface IStatsResponse {
	name: string;
	count: number;
	ratio: number;
}
interface IStatsList {
	month: string;
	count: number;
}

export default function StatsView() {
	const [statsItems, setStatsItems] = useState<Array<IStatsResponse> | null>(
		null
	);
	const [statsCategories, setStatsCategories] =
		useState<Array<IStatsResponse> | null>(null);
	const [statsLists, setStatsLists] = useState<Array<IStatsList> | undefined>(
		undefined
	);
	const { isMobileLayout } = useViewport();

	const { isPending, isError, data, error } = useQuery({
		queryKey: ['stats'],
		queryFn: () => getStatsData(),
	});

	useEffect(() => {
		if (!data) return;
		setStatsItems(data.data.items);
		setStatsCategories(data.data.categories);
		setStatsLists(data.data.lists);
	}, [data]);
	return (
		<div
			className={`flex flex-col items-center w-full p-2 ${
				isMobileLayout ? 'mb-12' : ''
			}`}
		>
			{isPending ? (
				<Loading />
			) : isError ? (
				<p>{error.message}</p>
			) : (
				<>
					{/* top items and categories */}
					<div
						className={`flex items-center justify-center m-4 ${
							isMobileLayout ? 'flex-col w-full h-1/2' : 'w-4/5 my-12'
						}`}
					>
						<div className='w-4/5 m-4'>
							<h2 className='text-lg font-medium mb-2'>Top Items</h2>
							{statsItems ? (
								statsItems[0] ? (
									statsItems.map((statsItem, idx) => {
										return (
											<div className='flex flex-col' key={`statsItem-${idx}`}>
												<div className='flex justify-between text-sm'>
													<p>{statsItem.name}</p>
													<p>{statsItem.ratio}%</p>
												</div>
												<div className='relative rounded-full h-2 w-full bg-gray-300'>
													<div
														className='absolute top-0 left-0 rounded-full h-2 bg-theme-1'
														style={{ width: `${statsItem.ratio}%` }}
													></div>
												</div>
											</div>
										);
									})
								) : (
									<p>No items found! Make some lists!</p>
								)
							) : (
								<p>Loading...</p>
							)}
						</div>
						<div className='w-4/5 m-4'>
							<h2 className='text-lg font-medium mb-2'>Top Categories</h2>
							{statsCategories ? (
								statsCategories[0] ? (
									statsCategories.map((statsCategory, idx) => {
										return (
											<div className='flex flex-col' key={`statsItem-${idx}`}>
												<div className='flex justify-between text-sm'>
													<p>{statsCategory.name}</p>
													<p>{statsCategory.ratio}%</p>
												</div>
												<div className='relative rounded-full h-2 w-full bg-gray-300'>
													<div
														className='absolute top-0 left-0 rounded-full h-2 bg-complete'
														style={{ width: `${statsCategory.ratio}%` }}
													></div>
												</div>
											</div>
										);
									})
								) : (
									<p>No categories found! Add some items!</p>
								)
							) : (
								<p>Loading...</p>
							)}
						</div>
					</div>
					{/* monthly summary */}
					<div
						className={`flex flex-col items-center m-4 max-w-screen-xl max-h-96 -translate-x-5 ${
							isMobileLayout ? 'w-96 h-64' : 'w-4/5 h-1/2'
						}`}
					>
						<h2 className='text-lg translate-x-5'>Monthly Summary</h2>
						<ResponsiveContainer width='100%' height='100%'>
							<LineChart width={1200} height={800} data={statsLists}>
								<Line type='monotone' dataKey='count' stroke='#f9a109' />
								<CartesianGrid stroke='#ccc' />
								<XAxis dataKey='month' />
								<YAxis />
								<Tooltip />
							</LineChart>
						</ResponsiveContainer>
					</div>
				</>
			)}
		</div>
	);
}
