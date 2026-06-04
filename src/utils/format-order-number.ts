export const formatOrderNumber = (orderId?: string): string | null =>
  orderId ? `#${orderId.slice(0, 8).toUpperCase()}` : null;
