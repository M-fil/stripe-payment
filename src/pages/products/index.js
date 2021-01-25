import React, {
  useEffect, useState, useCallback, useContext, useMemo,
} from 'react';
import { Grid } from '@material-ui/core';
import { useMediaQuery } from 'react-responsive';

import * as StripeService from '../../core/services/stripe';
import Loader from '../../core/components/loader';
import ProductItem from './components/ProductItem';
import PayModal from './components/PayModal';
import { GlobalContext } from '../../core/context/global';
import Toast from '../../core/components/toast';
import { styles, mediaStyles720, mediaStyles425 } from './styles';

const ProductsPage = () => {
  const isLaptopScreen = useMediaQuery({ query: '(max-width: 720px)' });
  const isMobileScreen = useMediaQuery({ query: '(max-width: 425px)' });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [products, setProducts] = useState([]);
  const [isProductModalOpened, setIsProductModalOpened] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const globalContext = useContext(GlobalContext);
  const currentStyles = useMemo(
    () => (isMobileScreen ? mediaStyles425 : isLaptopScreen ? mediaStyles720 : styles),
    [isLaptopScreen, isMobileScreen],
  );

  const getAllProducts = useCallback(() => {
    if (globalContext?.customerId) {
      setIsLoading(true);
      StripeService.getAllProducts(globalContext?.customerId)
        .then((items) => {
          setProducts(items || []);
          setErrorMessage('');
        })
        .catch((error) => {
          setErrorMessage(error.message);
          setTimeout(() => {
            setErrorMessage('');
          }, 4000);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [globalContext?.customerId]);

  useEffect(() => {
    getAllProducts();
  }, [getAllProducts]);

  const openBuyProductModal = useCallback(() => {
    setIsProductModalOpened(true);
  }, []);

  const closeBuyProductModal = useCallback(() => {
    setIsProductModalOpened(false);
  }, []);

  const onBuyProductClickHandler = useCallback((event) => {
    const targetBuyButton = event.target.closest('[data-card-id]');
    const cardId = targetBuyButton ? targetBuyButton.dataset.cardId : '';

    if (targetBuyButton && cardId) {
      const targetProduct = products.find((product) => product.id === cardId);
      if (targetProduct) {
        setSelectedProduct(targetProduct);
        openBuyProductModal();
      }
    }
  }, [products, openBuyProductModal]);

  return (
    <div style={currentStyles.mainContainer}>
      <Toast
        type="error"
        message={errorMessage}
      />
      <PayModal
        isVisible={isProductModalOpened}
        closeModal={closeBuyProductModal}
        selectedProduct={selectedProduct}
        updateProducts={getAllProducts}
      />
      {isLoading ? (
        <Loader />
      ) : (
        <Grid
          container
          style={currentStyles.gridContainer}
          spacing={10}
          onClick={onBuyProductClickHandler}
        >
          <>
            {products.map((product) => (
              <Grid
                key={product.id}
                item
                style={currentStyles.gridItem}
              >
                <ProductItem
                  id={product.id}
                  name={product.name}
                  description={product.description}
                  image={product.image}
                  pricing={product.pricing}
                  hasSubscription={product.subPlans.length > 0}
                />
              </Grid>
            ))}
          </>
        </Grid>
      )}
    </div>
  );
};

export default ProductsPage;
