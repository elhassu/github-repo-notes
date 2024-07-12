import { RefCallback, useCallback, useDebugValue, useState } from "react";

export function useToggleSidebar() {
    const [isOpen, setIsOpen] = useState(false);

    useDebugValue(isOpen ? "Sidebar is open" : "Sidebar is closed")

    const toggleSidebar = () => setIsOpen(!isOpen);
    return {isOpen, toggleSidebar};
}

export function useOnScreen(): [RefCallback<HTMLTableRowElement>, boolean] {
	// const containerRef = useRef<HTMLTableRowElement | null>(null);
	const [isVisible, setIsVisible] = useState(false);

	const callbackFunction = (entries: IntersectionObserverEntry[]) => {
		const [entry] = entries;
		setIsVisible(entry.isIntersecting);
	};

	const containerRef = useCallback((node: HTMLTableRowElement) => {
		const observer = new IntersectionObserver(callbackFunction);

		if (node) observer.observe(node);

		return () => {
			if (node) observer.unobserve(node);
		};
	}, []);

	useDebugValue(isVisible ? "Element is visible" : "Element is not visible");

	return [containerRef, isVisible];
};