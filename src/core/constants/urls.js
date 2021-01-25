import { EnvConfig } from './config';

export const StripeQueryUrls = {
  PRODUCTS: 'https://api.stripe.com/v1/products',
  PRICES: 'https://api.stripe.com/v1/prices',
  CUSTOMERS: 'https://api.stripe.com/v1/customers',
  CHARGES: 'https://api.stripe.com/v1/charges',
  SUBSCRIPTIONS: 'https://api.stripe.com/v1/subscriptions',
  STRIPE_CHECKOUT: `${EnvConfig.REACT_APP_SERVER_URL}/checkout`,
};
