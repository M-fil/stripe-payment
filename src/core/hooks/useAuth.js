import { useEffect, useState } from 'react';
import * as CustomerService from '../services/customers';
import * as AuthServices from '../services/auth';

export const useAuth = () => {
  const email = AuthServices.getUserEmail();
  const [isAuthenticated, setIsAuthenticated] = useState(!!email);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [customerId, setCustomerId] = useState('');

  useEffect(() => {
    setIsLoading(true);
    CustomerService.getCustomersByEmail(email)
      .then((userFromDB) => {
        const userData = userFromDB && userFromDB.data[0];
        if (!userData && (userFromDB.data.length === 0)) {
          throw new Error();
        }
        setIsAuthenticated(true);
        setCustomerId(userData?.id || '');
        setUser(userData);
      })
      .catch(() => {
        setIsAuthenticated(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return {
    isAuthenticated,
    isLoading,
    user,
    customerId,
  };
};
