import { useContext } from 'react';
import { DashboardStatesContext } from '@/app/(dashboard)/providers';

interface IUseToast {
	preset?: string;
	title?: string;
	content: string;
	style?: string;
}

// TODO: test empty title

export const useToast = ({ preset, title, content, style }: IUseToast) => {
	const dashboardStates = useContext(DashboardStatesContext);
	if (preset) {
		switch (preset) {
			case 'success':
				dashboardStates?.setToastProps({
					title: 'Success',
					content: content,
					style: 'Success',
				});

				break;
			case 'error':
				dashboardStates?.setToastProps({
					title: 'Error',
					content: content,
					style: 'Danger',
				});
			default:
				break;
		}
	} else {
		dashboardStates?.setToastProps({
			title: title ? title : '',
			content: content,
		});
	}

	dashboardStates?.setToastOpen(true);
};
