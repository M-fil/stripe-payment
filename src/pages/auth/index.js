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
    password: '',
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

    AuthServices.signUpUser(formValues.email, formValues.password)
      .then((data) => {
        if (data?.error) {
          showErrorMessage(data?.error?.message || '');
        } else {
          setErrorMessage('');
          const customerId = data.id;
          globalContext.setCustomerId(customerId);
        }
      })
      .catch((error) => {
        showErrorMessage(error.message);
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
        <FormFiled
          id="password"
          label="Enter password"
          type="password"
          onChange={onFormValueChange('password')}
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
