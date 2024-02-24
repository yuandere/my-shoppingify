import { useContext } from 'react';
import { ViewportContext } from '@/app/(dashboard)/providers';

const useViewport = () => {
	const viewport = useContext(ViewportContext);
	if (viewport === null || viewport === undefined) {
		throw new Error('useViewport must be used within a provider');
	}
	return {
		width: viewport.width,
		height: viewport.height,
		isMobileLayout: viewport.isMobileLayout,
		isSmallFormat: viewport.isSmallFormat,
	};
};

export default useViewport;
