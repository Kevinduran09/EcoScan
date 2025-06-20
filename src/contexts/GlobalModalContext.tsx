import React, { createContext, useContext, ReactNode } from 'react';
import { useCustomModal } from '../hooks/useCustomModal';

interface GlobalModalContextType {
  openModal: ReturnType<typeof useCustomModal>['openModal'];
  closeModal: ReturnType<typeof useCustomModal>['closeModal'];
}

const GlobalModalContext = createContext<GlobalModalContextType | undefined>(undefined);

export const GlobalModalProvider = ({ children }: { children: ReactNode }) => {
  const { Modal, openModal, closeModal } = useCustomModal();

  return (
    <GlobalModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      {Modal}
    </GlobalModalContext.Provider>
  );
};

export const useGlobalModal = () => {
  const context = useContext(GlobalModalContext);
  if (!context) {
    throw new Error('useGlobalModal debe usarse dentro de GlobalModalProvider');
  }
  return context;
}; 