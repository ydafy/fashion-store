import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useCallback,
} from 'react';

interface AddressModalContextType {
  isAddressModalVisible: boolean;
  openAddressModal: () => void;
  closeAddressModal: () => void;
  // Podríamos añadir un estado para pasar datos a la modal si fuera necesario en el futuro
  // modalPayload: any;
  // setModalPayload: (payload: any) => void;
}

const AddressModalContext = createContext<AddressModalContextType | undefined>(
  undefined,
);

export const AddressModalProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isAddressModalVisible, setIsAddressModalVisible] = useState(false);

  const openAddressModal = useCallback(() => {
    setIsAddressModalVisible(true);
  }, []);

  const closeAddressModal = useCallback(() => {
    setIsAddressModalVisible(false);
  }, []);

  const value: AddressModalContextType = {
    isAddressModalVisible,
    openAddressModal,
    closeAddressModal,
  };

  return (
    <AddressModalContext.Provider value={value}>
      {children}
    </AddressModalContext.Provider>
  );
};

export const useAddressModal = (): AddressModalContextType => {
  const context = useContext(AddressModalContext);
  if (context === undefined) {
    throw new Error(
      'useAddressModal debe ser usado dentro de un AddressModalProvider',
    );
  }
  return context;
};
