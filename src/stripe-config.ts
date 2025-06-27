export interface StripeProduct {
  id: string;
  priceId: string;
  name: string;
  description: string;
  mode: 'payment' | 'subscription';
  price?: string;
  currency?: string;
}

export const stripeProducts: StripeProduct[] = [
  {
    id: 'prod_SYu5W02FRl0eYD',
    priceId: 'price_1RdmGzQotKuiqEGp17VctpVF',
    name: 'Donation',
    description: 'Support ScoreSweep development with a one-time donation',
    mode: 'payment',
    price: '$5.00',
    currency: 'usd'
  }
];

export const getProductById = (id: string): StripeProduct | undefined => {
  return stripeProducts.find(product => product.id === id);
};

export const getProductByPriceId = (priceId: string): StripeProduct | undefined => {
  return stripeProducts.find(product => product.priceId === priceId);
};