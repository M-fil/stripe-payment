import React from 'react';
import { Snackbar } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import PropTypes from 'prop-types';

const Toast = React.memo(({
  type, message, isOpened = (message !== ''),
}) => (
  <Snackbar open={isOpened}>
    <Alert severity={type}>
      {message}
    </Alert>
  </Snackbar>
));

Toast.propTypes = {
  type: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  isOpened: PropTypes.bool.isRequired,
};

export default Toast;
