import { uuid } from 'uuidv4';
import { StripeQueryUrls } from '../constants/urls';
import { EnvConfig } from '../constants/config';
import * as CustomerService from './customers';

export const createStripeCharge = async (product, token, customerId) => {
  let result = '';

  try {
    const idempotencyKey = uuid();
    const requestDataStringLine = `amount=${product.price}&`
      + `currency=${product.currency}&`
      + `customer=${customerId}&`
      + `description=Purchased the ${product.name}&`
      + `shipping[name]=${token.card.name}&`
      + `shipping[address][line1]=${token.card.address_line1}&`
      + `shipping[address][line1]=${token.card.address_line1}&`
      + `shipping[address][city]=${token.card.address_city}&`
      + `shipping[address][country]=${token.card.address_country}&`
      + `shipping[address][postal_code]=${token.card.address_zip}`;

    await CustomerService.updateCustomer(customerId, `source=${token.id}`);
    const response = await fetch(`${StripeQueryUrls.CHARGES}?${requestDataStringLine}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${EnvConfig.REACT_APP_STRIPE_SECRET_KEY}`,
        'Idempotency-Key': idempotencyKey,
      },
    });
    if (!response.ok) {
      throw new Error('Error');
    }
    result = 'success';
  } catch {
    result = 'error';
  }

  return result;
};

export const createSubscriptionPayment = async (customerId, priceIds) => {
  let result = '';

  try {
    const idsRequestLine = priceIds.map((id, index) => `items[${index}][price]=${id}`).join('&');
    const requestDataStringLine = `customer=${customerId}&${idsRequestLine}`;

    const response = await fetch(`${StripeQueryUrls.SUBSCRIPTIONS}?${requestDataStringLine}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${EnvConfig.REACT_APP_STRIPE_SECRET_KEY}`,
      },
    });
    result = 'success';
    if (!response.ok) {
      throw new Error();
    }
  } catch {
    result = 'error';
  }

  return result;
};

export const getAllSubscriptionsForCustomer = async (customerId) => {
  const response = await fetch(`${StripeQueryUrls.SUBSCRIPTIONS}?customer=${customerId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${EnvConfig.REACT_APP_STRIPE_SECRET_KEY}`,
    },
  });
  const data = await response.json();

  return data;
};

export const unsubscribeFromStripeSubscription = async (subscriptionId) => {
  await fetch(`${StripeQueryUrls.SUBSCRIPTIONS}/${subscriptionId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${EnvConfig.REACT_APP_STRIPE_SECRET_KEY}`,
    },
  });
};
