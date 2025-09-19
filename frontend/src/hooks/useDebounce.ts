import { useState, useEffect } from 'react';

/**
 * @description Un custom hook que retrasa la actualización de un valor.
 * Es ideal para evitar llamadas a la API en cada pulsación de tecla en un campo de búsqueda.
 * @param value El valor que se quiere "retrasar" (ej. el texto de un input).
 * @param delay El tiempo en milisegundos que se debe esperar antes de actualizar (ej. 500).
 * @returns El valor "retrasado".
 */
export const useDebounce = <T>(value: T, delay: number): T => {
  // 1. Estado para guardar el valor retrasado
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // 2. Se crea un temporizador (timer) que se ejecutará después del 'delay'
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // 3. Función de limpieza: Esto es lo más importante.
    //    Cada vez que el 'value' original cambia (el usuario teclea otra letra),
    //    este useEffect se vuelve a ejecutar. La función de limpieza cancela
    //    el temporizador anterior ANTES de crear uno nuevo.
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Solo se re-ejecuta si el valor o el delay cambian

  // 4. Devolvemos el valor retrasado
  return debouncedValue;
};
