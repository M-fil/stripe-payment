import { createContext } from 'react';

export const GlobalContext = createContext({
  isAuthenticated: false,
  customerId: '',
  setCustomerId: () => {},
  setIsLoggedIn: () => {},
  user: null,
});
