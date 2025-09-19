import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  ReactNode,
  useEffect,
  useMemo,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// --- Tipos y Hooks ---
import { Address } from '../types/address';
// ✨ 1. IMPORTAMOS NUESTRO NUEVO HOOK DE DATOS
import { useAddresses } from '../hooks/useAddresses';

// Clave para guardar en AsyncStorage
const SELECTED_ADDRESS_ID_KEY = '@selected_address_id';

// ✨ 2. EL TIPO DEL CONTEXTO AHORA ES MUCHO MÁS SIMPLE
interface AddressContextType {
  // Datos que vienen de TanStack Query
  addresses: Address[];
  isLoadingAddresses: boolean;
  // Estado de la UI que maneja este contexto
  selectedAddress: Address | null;
  // Función para cambiar el estado de la UI
  selectAddress: (address: Address | null) => void;
}

const AddressContext = createContext<AddressContextType | undefined>(undefined);

export const AddressProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // ✨ 3. OBTENEMOS LOS DATOS DEL SERVIDOR DESDE NUESTRO NUEVO HOOK
  const { data: addresses = [], isLoading: isLoadingAddresses } =
    useAddresses();

  // ✨ 4. EL CONTEXTO AHORA SOLO GESTIONA ESTE ESTADO
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  /**
   * @description Cambia la dirección seleccionada y guarda el ID en AsyncStorage para persistencia.
   */
  const selectAddress = useCallback(async (address: Address | null) => {
    setSelectedAddress(address);
    try {
      if (address) {
        await AsyncStorage.setItem(SELECTED_ADDRESS_ID_KEY, address.id);
      } else {
        await AsyncStorage.removeItem(SELECTED_ADDRESS_ID_KEY);
      }
    } catch (e) {
      console.error('Failed to save selected address ID.', e);
    }
  }, []);

  // --- Lógica para la selección inicial y la sincronización ---

  // Efecto para cargar la dirección guardada la primera vez que los datos están disponibles
  useEffect(() => {
    const loadSavedSelection = async () => {
      if (addresses.length > 0) {
        try {
          const savedAddressId = await AsyncStorage.getItem(
            SELECTED_ADDRESS_ID_KEY,
          );
          const savedAddress = addresses.find((a) => a.id === savedAddressId);
          // Si encontramos una dirección guardada, la usamos.
          // Si no, usamos la que está marcada como 'isDefault' en los datos.
          // Si ninguna, usamos la primera de la lista.
          setSelectedAddress(
            savedAddress || addresses.find((a) => a.isDefault) || addresses[0],
          );
        } catch (e) {
          console.error('Failed to load selected address ID.', e);
          // Si falla la carga, seleccionamos la predeterminada por si acaso
          setSelectedAddress(
            addresses.find((a) => a.isDefault) || addresses[0],
          );
        }
      }
    };
    // Solo se ejecuta cuando la carga inicial de direcciones ha terminado
    if (!isLoadingAddresses) {
      loadSavedSelection();
    }
  }, [addresses, isLoadingAddresses]); // Depende de 'addresses' y 'isLoadingAddresses'

  useEffect(() => {
    // Si hay una dirección seleccionada...
    if (selectedAddress) {
      // ...buscamos si todavía existe en la lista principal de direcciones.
      const selectionExists = addresses.some(
        (a) => a.id === selectedAddress.id,
      );

      // Si ya no existe (porque fue eliminada)...
      if (!selectionExists) {
        // ...limpiamos la selección.
        // Si todavía quedan direcciones, seleccionamos la nueva por defecto (o la primera).
        // Si no queda ninguna, la establecemos en 'null'.
        const newDefault =
          addresses.find((a) => a.isDefault) || addresses[0] || null;
        setSelectedAddress(newDefault);

        // Opcional: También podrías limpiar el AsyncStorage aquí.
        // selectAddress(newDefault); // Llamar a esta función haría la limpieza.
      }
    }
  }, [addresses, selectedAddress]); // Se ejecuta si 'addresses' o 'selectedAddress' cambian

  // ✨ 5. EL VALOR DEL CONTEXTO AHORA ES MÁS LIMPIO Y DIRECTO
  const contextValue = useMemo(
    () => ({
      addresses,
      isLoadingAddresses,
      selectedAddress,
      selectAddress,
    }),
    [addresses, isLoadingAddresses, selectedAddress, selectAddress],
  );

  return (
    <AddressContext.Provider value={contextValue}>
      {children}
    </AddressContext.Provider>
  );
};

export const useAddress = (): AddressContextType => {
  const context = useContext(AddressContext);
  if (context === undefined) {
    throw new Error('useAddress debe ser usado dentro de un AddressProvider');
  }
  return context;
};
