'use client';
import { useState } from 'react';
import ItemsView from '@/app/(dashboard)/dashboard/itemsView';
import HistoryView from '@/app/(dashboard)/dashboard/historyView';
import StatisticsView from '@/app/(dashboard)/dashboard/statisticsView';
import SideBar from './sideBar';
import Cart from './cart/cart';

export default function Dashboard() {
	const [activeTab, setActiveTab] = useState<string>('items');

	return (
		<>
			<SideBar activeTab={activeTab} setActiveTab={setActiveTab}></SideBar>
			{activeTab === 'items' ? (
				<ItemsView></ItemsView>
			) : activeTab === 'history' ? (
				<HistoryView></HistoryView>
			) : activeTab === 'statistics' ? (
				<StatisticsView></StatisticsView>
			) : (
				<div className=''>no such tab exists</div>
			)}
			<Cart></Cart>
		</>
	);
}
