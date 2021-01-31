import * as CustomerServices from './customers';

export const LOCAL_STORAGE_USER_EMAIL = 'LOCALHOST_USER_EMAIL';

export const setUserEmail = (email) => {
  localStorage.setItem(LOCAL_STORAGE_USER_EMAIL, email);
};

export const getUserEmail = () => localStorage.getItem(LOCAL_STORAGE_USER_EMAIL) || '';

export const removeUserEmail = () => localStorage.removeItem(LOCAL_STORAGE_USER_EMAIL);

export const signUpUser = async (email) => {
  try {
    const user = await CustomerServices.getCustomersByEmail(email);
    if (!user || (user && user.data.length === 0)) {
      throw new Error();
    }

    setUserEmail(email);
    return { user: user.data[0] };
  } catch (error) {
    if (error.message) {
      return { error };
    }

    await CustomerServices.createCustomer(email);
    const user = await CustomerServices.getCustomersByEmail(email);
    setUserEmail(email);
    return { user: user.data[0] };
  }
};

export const logOutUser = async () => {
  removeUserEmail();
};
