import React from 'react';
import { TextField } from '@material-ui/core';
import PropTypes from 'prop-types';

import { styles } from './styles';

const FormFiled = ({
  id, label, type, onChange, withSpacing,
}) => (
  <TextField
    id={id}
    label={label}
    type={type}
    style={withSpacing ? styles.textField : {}}
    onChange={onChange}
    InputLabelProps={{
      style: styles.label,
    }}
    InputProps={{
      style: styles.label,
    }}
  />
);

FormFiled.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  withSpacing: PropTypes.bool,
};

FormFiled.defaultProps = {
  withSpacing: false,
};

export default FormFiled;
