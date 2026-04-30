import { Modal as AntModal } from "antd";
import type { ReactNode } from "react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  width?: number | string;
  children: ReactNode;
};

const Modal = ({ open, onClose, title, width = 720, children }: ModalProps) => {
  return (
    <AntModal
      open={open}
      onCancel={onClose}
      title={title}
      footer={null}
      width={width}
      destroyOnHidden
      centered
    >
      {children}
    </AntModal>
  );
};

export default Modal;
