import { useState } from "react";

export function useToggleSidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const toggleSidebar = () => setIsOpen(!isOpen);
    return {isOpen, toggleSidebar};
}