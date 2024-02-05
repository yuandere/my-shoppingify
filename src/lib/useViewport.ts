import { useContext } from 'react';
import { ViewportContext } from '@/app/(dashboard)/providers';

const useViewport = () => {
	const viewport = useContext(ViewportContext);
	return {
		width: viewport?.width,
		height: viewport?.height,
		isMobileLayout: viewport?.isMobileLayout,
	};
};

export default useViewport;
