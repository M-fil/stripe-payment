import React, { useMemo, useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import { EnvConfig } from './core/constants/config';
import ProductsPage from './pages/products';
import AuthPage from './pages/auth';
import { useAuth } from './core/hooks/useAuth';
import { GlobalContext } from './core/context/global';
import Loader from './core/components/loader';
import Header from './core/components/header';

const stripe = loadStripe(EnvConfig.REACT_APP_STRIPE_PUBLIC_KEY);

const App = () => {
  const {
    isAuthenticated, isLoading, user, customerId: id,
  } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated);
  const [customerId, setCustomerId] = useState('');
  const contextValue = useMemo(() => ({
    isAuthenticated: isLoggedIn,
    setIsLoggedIn,
    customerId: id || customerId,
    setCustomerId,
    user,
  }), [isAuthenticated, customerId, setCustomerId, user, id]);

  return (
    <GlobalContext.Provider value={contextValue}>
      {isLoading && <Loader />}
      <Elements stripe={stripe}>
        {isAuthenticated ? (
          <main className="main-container">
            <Header userEmail={user?.email || ''} />
            <ProductsPage />
          </main>
        ) : (
          <AuthPage />
        )}
      </Elements>
    </GlobalContext.Provider>
  );
};

export default App;
