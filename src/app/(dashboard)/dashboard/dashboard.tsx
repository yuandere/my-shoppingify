'use client';
import { useState } from 'react';
import type { Session } from 'next-auth';
import ItemsView from './itemsView';
import HistoryView from './historyView';
import StatisticsView from './statisticsView';
import SideBar from './sideBar';
import Cart from './cart';

export default function Dashboard({ session }: { session?: Session }) {
	// console.log(session)
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
