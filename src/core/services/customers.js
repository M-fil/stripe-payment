import { StripeQueryUrls } from '../constants/urls';
import { EnvConfig } from '../constants/config';

export const getCustomersByEmail = async (email) => {
  const response = await fetch(`${StripeQueryUrls.CUSTOMERS}?email=${email}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${EnvConfig.REACT_APP_STRIPE_SECRET_KEY}`,
    },
  });
  const data = await response.json();

  return data;
};

export const createCustomer = async (email) => {
  await fetch(`${StripeQueryUrls.CUSTOMERS}?email=${email}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${EnvConfig.REACT_APP_STRIPE_SECRET_KEY}`,
    },
  });
};

export const getCustomerIdByEmail = async (email) => {
  const customerResponse = await getCustomersByEmail(email);
  const id = customerResponse.data && customerResponse.data[0].id;

  return id;
};

export const updateCustomer = async (customerId, itemsToChange) => {
  await fetch(`${StripeQueryUrls.CUSTOMERS}/${customerId}?${itemsToChange}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${EnvConfig.REACT_APP_STRIPE_SECRET_KEY}`,
    },
  });
};
