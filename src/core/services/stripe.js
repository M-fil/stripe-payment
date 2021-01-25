import { EnvConfig } from '../constants/config';
import { StripeQueryUrls } from '../constants/urls';
import * as PaymentService from './payment';

export const getData = async (url) => {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${EnvConfig.REACT_APP_STRIPE_SECRET_KEY}`,
    },
  });
  const data = response.json();

  return data;
};

export const composeProductForPaymentFromStripeProductData = (stripeProduct) => ({
  id: stripeProduct.id,
  image: stripeProduct.images[0],
  pricing: stripeProduct.pricing.map((priceObject) => ({
    id: priceObject.id,
    value: `${priceObject.unit_amount / 100}${priceObject.currency}`,
    numberValue: priceObject.unit_amount / 100,
    type: priceObject.type,
    interval: priceObject.recurring?.interval,
    currency: priceObject.currency,
  })),
  name: stripeProduct.name,
  description: stripeProduct.description,
  subPlans: stripeProduct.subPlans.map((sub) => ({
    id: sub.id,
    priceId: sub.plan.id,
    value: `${sub.plan.amount / 100}${sub.plan.currency}`,
    numberValue: sub.plan.amount / 100,
    interval: sub.plan?.interval,
    currency: sub.plan.currency,
  })),
});

export const retrievePriceByType = (
  product, type,
) => product && product.pricing.find((price) => price.type === type);

export const getAllProducts = async (customerId) => {
  try {
    const prices = await getData(StripeQueryUrls.PRICES);
    const products = await getData(StripeQueryUrls.PRODUCTS);
    const subscriptions = await PaymentService.getAllSubscriptionsForCustomer(customerId);
    const finalProducts = products.data.map((product) => {
      const pricesForProduct = prices.data.filter((price) => price.product === product.id);
      const subPlans = subscriptions.data.filter((sub) => sub.plan.product === product.id);

      return composeProductForPaymentFromStripeProductData({
        ...product,
        pricing: pricesForProduct,
        subPlans,
      });
    });

    return finalProducts;
  } catch {
    return [];
  }
};
export const getAllPrices = getData.bind(null, StripeQueryUrls.PRICES);
