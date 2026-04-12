import { useState, useRef, useEffect, useCallback } from 'react';

export function useResizableWidth(defaultWidth = 50) {
	const [width, setWidth] = useState(defaultWidth);
	const containerRef = useRef<HTMLDivElement | null>(null);
	const isResizingRef = useRef(false);

	const handleMouseMove = useCallback((e: MouseEvent) => {
		if (!isResizingRef.current || !containerRef.current) return;
		const rect = containerRef.current.getBoundingClientRect();
		const newWidth = ((e.clientX - rect.left) / rect.width) * 100;
		if (newWidth > 20 && newWidth < 80) setWidth(newWidth);
	}, []);

	const stopResizing = useCallback(() => {
		isResizingRef.current = false;
		document.removeEventListener('mousemove', handleMouseMove);
		document.removeEventListener('mouseup', stopResizing);
	}, [handleMouseMove]);

	const startResizing = () => {
		isResizingRef.current = true;
		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseup', stopResizing);
	};

	useEffect(() => {
		return () => {
			isResizingRef.current = false;
			document.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('mouseup', stopResizing);
		};
	}, [handleMouseMove, stopResizing]);

	return { width, containerRef, startResizing };
}
