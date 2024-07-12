import { MutableRefObject, useDebugValue, useEffect, useRef, useState } from "react";

export function useToggleSidebar() {
    const [isOpen, setIsOpen] = useState(false);

    useDebugValue(isOpen ? "Sidebar is open" : "Sidebar is closed")

    const toggleSidebar = () => setIsOpen(!isOpen);
    return {isOpen, toggleSidebar};
}

export function useOnScreen (): [MutableRefObject<HTMLTableRowElement | null>, boolean] {
	const containerRef = useRef<HTMLTableRowElement | null>(null);
	const [isVisible, setIsVisible] = useState(false);

	const callbackFunction = (entries: IntersectionObserverEntry[]) => {
		const [entry] = entries;
		setIsVisible(entry.isIntersecting);
	};

	useEffect(() => {
		const observer = new IntersectionObserver(callbackFunction);

		if (containerRef.current) observer.observe(containerRef?.current);

		return () => {
			if (containerRef.current) observer.unobserve(containerRef?.current);
		};
	}, [containerRef]);

	return [containerRef, isVisible];
};