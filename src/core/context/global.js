import { createContext } from 'react';

export const GlobalContext = createContext({
  isAuthenticated: false,
  customerId: '',
  setCustomerId: () => {},
  user: null,
});
