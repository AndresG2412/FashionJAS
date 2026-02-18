import { useEffect, useRef } from "react";

export function useOutsideClick<T extends HTMLElement>(callback: () => void) {
    const ref = useRef<T>(null);

    useEffect(() => {
        const handleClickedOutside = (e: MouseEvent | TouchEvent) => {
            // Si el click es fuera del elemento referenciado, ejecuta el callback
            if (ref.current && !ref.current.contains(e.target as Node)) {
                callback();
            }
        };

        // 1. Registramos los eventos fuera de la función interna
        document.addEventListener('mousedown', handleClickedOutside);
        document.addEventListener('touchstart', handleClickedOutside);

        // 2. Limpiamos los eventos cuando el componente se desmonte
        return () => {
            document.removeEventListener('mousedown', handleClickedOutside);
            document.removeEventListener('touchstart', handleClickedOutside);
        };
    }, [callback]); // El efecto se reinicia si el callback cambia

    return ref; // ¡No olvides retornar el ref para usarlo en tu componente!
}