export type UseOrderDeliveryConfirmationParams = {
  orderId: string;
};

export type UseOrderDeliveryConfirmationResult = {
  isOpen: boolean;
  isSubmitting: boolean;
  hasError: boolean;
  openDialog: () => void;
  closeDialog: () => void;
  confirmDelivery: () => Promise<void>;
};
