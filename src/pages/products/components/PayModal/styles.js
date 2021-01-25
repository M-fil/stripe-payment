import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    padding: theme.spacing(1),
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContainer: {
    backgroundColor: theme.palette.background.paper,
    padding: 20,
    width: 400,
  },
}));

export const styles = {
  cardMedia: {
    height: 100,
    width: 100,
  },
  cardContainer: {
    display: 'flex',
    marginBottom: '30px',
  },
  payButton: {
    marginTop: '20px',
  },
  errorMessage: {
    marginBottom: '20px',
  },
};

export const cardElementOptions = {
  style: {
    base: {
      fontSize: 2,
      color: '#424770',
      letterSpacing: '0.025em',
      fontFamily: 'Source Code Pro, monospace',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#9e2146',
    },
  },
};
