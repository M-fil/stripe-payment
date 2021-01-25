import React from 'react';
import {
  Card, CardMedia, Typography, CardContent,
} from '@material-ui/core';
import PropTypes from 'prop-types';

import { styles } from './styles';

const SelectedProductItem = ({ image, description, name }) => (
  <Card style={styles.cardContainer}>
    <CardMedia
      image={image}
      title={name}
      style={styles.cardMedia}
    />
    <CardContent>
      <Typography
        variant="body1"
        component="h2"
      >
        {name}
      </Typography>
      {description && (
      <Typography
        variant="body2"
        color="textSecondary"
        component="p"
      >
        {description}
      </Typography>
      )}
    </CardContent>
  </Card>
);

SelectedProductItem.propTypes = {
  name: PropTypes.string.isRequired,
  description: PropTypes.string,
  image: PropTypes.string,
};

SelectedProductItem.defaultProps = {
  description: '',
  image: '',
};

export default SelectedProductItem;
