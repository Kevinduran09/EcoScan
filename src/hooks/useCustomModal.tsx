import React, { useState, useCallback } from 'react';
import CustomModal from '../components/CustomModal';

interface ModalProps {
  title?: string;
  description?: string;
  imageUrl?: string | null;
  animation?: object | null;
  sound?: string | null;
  vibrate?: boolean;
  buttonText?: string;
  onButtonClick?: () => void;
  children?: React.ReactNode;
}

export const useCustomModal = () => {
  const [show, setShow] = useState(false);
  const [modalProps, setModalProps] = useState<ModalProps>({});

  const openModal = useCallback((props: ModalProps = {}) => {
    setModalProps(props);
    setShow(true);
  }, []);

  const closeModal = useCallback(() => {
    setShow(false);
  }, []);

  const Modal = (
    <CustomModal
      show={show}
      onClose={closeModal}
      {...modalProps}
    />
  );

  return { Modal, openModal, closeModal };
}; 