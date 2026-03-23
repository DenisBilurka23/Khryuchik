export type CartItem = {
  id: string;
  slug: string;
  title: string;
  price: number;
  emoji: string;
  bgColor?: string;
  quantity: number;
  variant?: string;
};