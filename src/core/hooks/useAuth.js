import { useEffect, useState } from 'react';
import { firebaseServices } from '../firebase';
import * as CustomerService from '../services/customers';

const { auth } = firebaseServices;

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [customerId, setCustomerId] = useState('');

  useEffect(() => {
    setIsLoading(true);
    auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        CustomerService.getCustomerIdByEmail(firebaseUser?.email)
          .then((id) => {
            setIsAuthenticated(true);
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
            });
            setCustomerId(id);
          })
          .catch(() => {})
          .finally(() => {
            setIsLoading(false);
          });
      } else {
        setIsAuthenticated(false);
        setUser(null);
        setCustomerId('');
        setIsLoading(false);
      }
    });
  }, []);

  return {
    isAuthenticated,
    isLoading,
    user,
    customerId,
  };
};
