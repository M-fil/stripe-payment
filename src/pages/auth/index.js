import React, {
  useCallback, useContext, useMemo, useState,
} from 'react';
import { Container, Button, Typography } from '@material-ui/core';
import { useMediaQuery } from 'react-responsive';

import { styles, stylesMedia720 } from './styles';
import * as AuthServices from '../../core/services/auth';
import FormFiled from './components/FormInput';
import Toast from '../../core/components/toast';
import { GlobalContext } from '../../core/context/global';

const AuthPage = () => {
  const isLaptopScreen = useMediaQuery({ query: '(max-width: 720px)' });
  const [formValues, setFormValues] = useState({
    email: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const globalContext = useContext(GlobalContext);
  const currentStyles = useMemo(() => (isLaptopScreen ? stylesMedia720 : styles), [isLaptopScreen]);

  const showErrorMessage = useCallback((message) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage('');
    }, 4000);
  }, []);

  const onSignUpCustomer = useCallback(async (event) => {
    event.preventDefault();

    AuthServices.signUpUser(formValues.email)
      .then((data) => {
        if (data?.error) {
          showErrorMessage(data?.error?.message || '');
          globalContext.setIsLoggedIn(false);
        } else {
          setErrorMessage('');
          const customerId = data.user.id;
          globalContext.setCustomerId(customerId);
          globalContext.setIsLoggedIn(true);
        }
      })
      .catch((error) => {
        showErrorMessage(error.message);
        globalContext.setIsLoggedIn(false);
      })
      .finally(() => {
        window.location.reload();
      });
  }, [formValues, showErrorMessage]);

  const onFormValueChange = useCallback((name) => (event) => {
    setFormValues((state) => ({ ...state, [name]: event.target.value }));
  }, []);

  return (
    <Container style={currentStyles.container}>
      <Toast
        type="error"
        message={errorMessage}
      />
      <form
        onSubmit={onSignUpCustomer}
        style={currentStyles.form}
      >
        <Typography component="h2" style={currentStyles.title}>
          Sign up
        </Typography>
        <FormFiled
          id="email"
          label="Enter email"
          type="text"
          style={currentStyles.emailField}
          onChange={onFormValueChange('email')}
          withSpacing
        />
        <Button
          variant="contained"
          color="primary"
          type="submit"
          style={currentStyles.submitButton}
        >
          Sign up
        </Button>
      </form>
    </Container>
  );
};

export default AuthPage;
