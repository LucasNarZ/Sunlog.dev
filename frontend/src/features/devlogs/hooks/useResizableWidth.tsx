import { useState, useRef, useEffect } from 'react';

export function useResizableWidth(defaultWidth = 50) {
	const [width, setWidth] = useState(defaultWidth);
	const containerRef = useRef<HTMLDivElement | null>(null);
	const isResizingRef = useRef(false);

	const handleMouseMove = (e: MouseEvent) => {
		if (!isResizingRef.current || !containerRef.current) return;
		const rect = containerRef.current.getBoundingClientRect();
		const newWidth = ((e.clientX - rect.left) / rect.width) * 100;
		if (newWidth > 20 && newWidth < 80) setWidth(newWidth);
	};

	const stopResizing = () => {
		isResizingRef.current = false;
		document.removeEventListener('mousemove', handleMouseMove);
		document.removeEventListener('mouseup', stopResizing);
	};

	const startResizing = () => {
		isResizingRef.current = true;
		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseup', stopResizing);
	};

	useEffect(() => () => stopResizing(), []);

	return { width, containerRef, startResizing };
}
