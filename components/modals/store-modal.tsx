"use client";

import { Modal } from "@/components/ui/modal";
import { useStoreModal } from "@/hooks/use-store-modal";

export const StoreModal = () => {
  const StoreModal = useStoreModal();

  return (
    <Modal
      title='Create Store'
      description='Add new Store to mangae products and categories'
      isOpen={StoreModal.isOpen}
      onClose={StoreModal.onClose}
    >
      Future create store form
    </Modal>
  );
};
