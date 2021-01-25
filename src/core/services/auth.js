import { firebaseServices } from '../firebase';
import * as CustomerServices from './customers';

const { auth } = firebaseServices;
const USER_ALREADY_EXISTS_CODE = 'auth/email-already-in-use';

export const signUpUser = async (email, password) => {
  try {
    await auth.createUserWithEmailAndPassword(email, password);
    await CustomerServices.createCustomer(email);
    const id = await CustomerServices.getCustomerIdByEmail(email);

    return { id };
  } catch (error) {
    if (error.code === USER_ALREADY_EXISTS_CODE) {
      await auth.signInWithEmailAndPassword(email, password);
      const id = await CustomerServices.getCustomerIdByEmail(email);

      return { id };
    }

    return { error };
  }
};

export const logOutUser = async () => {
  await auth.signOut();
};
