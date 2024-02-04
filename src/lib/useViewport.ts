import { useContext } from 'react';
import { ViewportContext } from '@/app/(dashboard)/providers';

const useViewport = () => {
	const viewport = useContext(ViewportContext);
	return { width: viewport?.width, height: viewport?.height };
};

export default useViewport;
