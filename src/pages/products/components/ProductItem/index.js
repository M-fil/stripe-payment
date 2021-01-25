import React, { useMemo } from 'react';
import {
  Card, CardHeader, CardMedia, CardContent, CardActions,
  Typography, Button,
} from '@material-ui/core';
import PropTypes from 'prop-types';

import { styles } from './styles';
import * as StripeService from '../../../../core/services/stripe';

const ProductItem = ({
  id, name, description, image, pricing, hasSubscription,
}) => {
  const pricingObject = useMemo(() => ({ pricing }), [pricing]);
  const oneTimePrice = useMemo(() => StripeService.retrievePriceByType(pricingObject, 'one_time'), [pricingObject]);
  const subscriptionPrice = useMemo(() => StripeService.retrievePriceByType(pricingObject, 'recurring'), [pricingObject]);

  return (
    <Card style={styles.container}>
      <CardHeader
        title={name}
      />
      <CardMedia
        image={image}
        title={name}
        style={styles.cardMedia}
      />
      <CardContent>
        <Typography
          variant="body2"
          color="textSecondary"
          component="p"
        >
          {description}
        </Typography>
        <Typography
          component="h4"
        >
          For the single item:
          {' '}
          {oneTimePrice
            ? (<strong>{oneTimePrice.value}</strong>)
            : 'No price'}
        </Typography>
        <Typography
          component="h4"
        >
          Subscription:
          {' '}
          {subscriptionPrice
            ? (
              <>
                {hasSubscription ? ' subscribed for ' : ''}
                <strong>{subscriptionPrice.value}</strong>
                {` per ${subscriptionPrice.interval}`}
              </>
            )
            : 'No price'}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <Button
          color="primary"
          variant="contained"
          data-card-id={id}
        >
          Buy
        </Button>
      </CardActions>
    </Card>
  );
};

ProductItem.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string,
  image: PropTypes.string,
  pricing: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    numberValue: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
    interval: PropTypes.string,
    currency: PropTypes.string.isRequired,
  })),
  hasSubscription: PropTypes.bool.isRequired,
};

ProductItem.defaultProps = {
  description: '',
  image: '',
  pricing: {},
};

export default ProductItem;
