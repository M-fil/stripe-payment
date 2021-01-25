import React, {
  useMemo, useState, useCallback, useContext,
} from 'react';
import { Modal, Button } from '@material-ui/core';
import PropTypes from 'prop-types';
import StripeCheckout from 'react-stripe-checkout';

import { useStyles, styles } from './styles';
import * as StripeService from '../../../../core/services/stripe';
import SelectedProductItem from '../SelectedProductItem';
import { EnvConfig } from '../../../../core/constants/config';
import Toast from '../../../../core/components/toast';
import * as PaymentService from '../../../../core/services/payment';
import { GlobalContext } from '../../../../core/context/global';

const PayModal = ({
  isVisible, closeModal, selectedProduct, updateProducts,
}) => {
  const classes = useStyles();
  const [message, setMessage] = useState({ text: '', type: '' });
  const globalContext = useContext(GlobalContext);
  const oneTimePrice = useMemo(() => StripeService
    .retrievePriceByType(selectedProduct, 'one_time'), [selectedProduct]);
  const subscriptionPrice = useMemo(() => StripeService
    .retrievePriceByType(selectedProduct, 'recurring'), [selectedProduct]);
  const convertedPrice = useMemo(
    () => (oneTimePrice?.numberValue * 100) || (subscriptionPrice?.numberValue * 100),
    [oneTimePrice, subscriptionPrice],
  );
  const isCustomerSubscribed = useMemo(
    () => (selectedProduct && selectedProduct?.subPlans.length > 0),
    [selectedProduct],
  );

  const hideMessageComponent = useCallback(() => {
    setTimeout(() => {
      setMessage({ text: '', type: '' });
    }, 4000);
  }, []);

  const handlePayment = useCallback((type) => async (token) => {
    try {
      const product = {
        name: selectedProduct.name,
        price: convertedPrice,
        description: selectedProduct.description || '',
        currency: (type === 'one_time' ? oneTimePrice?.currency : subscriptionPrice?.currency) || '',
      };
      const customerId = globalContext?.customerId || '';
      const priceIds = [subscriptionPrice?.id || ''];
      const createPayment = type === 'one_time'
        ? PaymentService.createStripeCharge.bind(null, product, token, customerId)
        : PaymentService.createSubscriptionPayment.bind(null, customerId, priceIds);

      const status = await createPayment();
      if (status === 'success') {
        setMessage({
          text: 'Success! Thanks for the payment!',
          type: 'success',
        });
        updateProducts();
      } else {
        throw new Error();
      }
    } catch {
      setMessage({
        text: 'Error! Error ocurred in the payment process',
        type: 'error',
      });
    }
    hideMessageComponent();
    closeModal();
  }, [
    convertedPrice, selectedProduct, globalContext?.customerId,
    oneTimePrice, subscriptionPrice, updateProducts, hideMessageComponent,
    closeModal,
  ]);

  const renderPaymentForm = useCallback((type) => {
    const buttonContent = type === 'one_time'
      ? `Pay ${oneTimePrice?.value}`
      : `Get Subscription for ${subscriptionPrice?.value} per ${subscriptionPrice?.interval}`;
    const amount = type === 'one_time'
      ? oneTimePrice?.numberValue * 100
      : subscriptionPrice?.numberValue * 100;

    return (
      <StripeCheckout
        stripeKey={EnvConfig.REACT_APP_STRIPE_PUBLIC_KEY}
        token={handlePayment(type)}
        amount={amount}
        name={selectedProduct?.name}
        billingAddress={type === 'one_time'}
        shippingAddress={type === 'one_time'}
        email={globalContext.user?.email || ''}
      >
        <Button
          variant="contained"
          color="primary"
          style={styles.payButton}
        >
          {buttonContent}
        </Button>
      </StripeCheckout>
    );
  }, [
    handlePayment, oneTimePrice, subscriptionPrice,
    selectedProduct?.name, globalContext.user?.email,
  ]);

  const unsubscribeFromSubscription = useCallback(() => {
    if (selectedProduct?.subPlans) {
      const subscriptionId = selectedProduct?.subPlans[0].id;
      PaymentService.unsubscribeFromStripeSubscription(subscriptionId)
        .then(() => {
          setMessage({
            text: 'You was successfully unsubscribed!',
            type: 'success',
          });
        })
        .catch(() => {
          setMessage({
            text: 'Error! Error ocurred in the unsubscribe process.',
            type: 'error',
          });
        })
        .finally(() => {
          hideMessageComponent();
          updateProducts();
          closeModal();
        });
    }
  }, [selectedProduct?.subPlans, hideMessageComponent, updateProducts, closeModal]);

  return (
    <>
      <Toast
        type={message.type}
        message={message.text}
      />
      <Modal
        open={isVisible}
        className={classes.modal}
        onClose={closeModal}
        disablePortal
        disableEnforceFocus
        disableAutoFocus
      >
        <div className={classes.modalContainer}>
          {selectedProduct && (
            <SelectedProductItem
              name={selectedProduct.name}
              description={selectedProduct.description}
              image={selectedProduct.image}
            />
          )}
          <div>
            {oneTimePrice && renderPaymentForm('one_time')}
            {isCustomerSubscribed
              ? (
                <Button
                  variant="contained"
                  color="secondary"
                  style={styles.payButton}
                  onClick={unsubscribeFromSubscription}
                >
                  {`Unsubscribe from ${subscriptionPrice?.value} per ${subscriptionPrice?.interval}`}
                </Button>
              )
              : subscriptionPrice && renderPaymentForm('recurring')}
          </div>
        </div>
      </Modal>
    </>
  );
};

PayModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  closeModal: PropTypes.func,
  selectedProduct: PropTypes.shape({
    id: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    pricing: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      numberValue: PropTypes.number.isRequired,
      type: PropTypes.string.isRequired,
      interval: PropTypes.string,
      currency: PropTypes.string.isRequired,
    })),
    subPlans: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      priceId: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      numberValue: PropTypes.number.isRequired,
      interval: PropTypes.string,
      currency: PropTypes.string.isRequired,
    })),
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
  }),
  updateProducts: PropTypes.func.isRequired,
};

PayModal.defaultProps = {
  closeModal: () => {},
  selectedProduct: {},
};

export default PayModal;
