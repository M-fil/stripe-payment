import './style.scss';
import React, { useCallback } from 'react';
import { Typography, Button } from '@material-ui/core';
import PropTypes from 'prop-types';

import * as AuthService from '../../services/auth';

const Header = ({ userEmail }) => {
  const onLogOutUser = useCallback(() => {
    AuthService.logOutUser();
  }, []);

  return (
    <header className="main-header">
      <div className="main-header__user-data">
        <Typography
          component="h2"
          className="main-header__user-email"
        >
          {userEmail}
        </Typography>
      </div>

      <Button
        variant="contained"
        className="log-out-button"
        onClick={onLogOutUser}
      >
        Log out
      </Button>
    </header>
  );
};

Header.propTypes = {
  userEmail: PropTypes.string,
};

Header.defaultProps = {
  userEmail: '',
};

export default Header;
