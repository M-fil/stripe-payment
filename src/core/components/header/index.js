import './style.scss';
import React, { useCallback, useContext } from 'react';
import { Typography, Button } from '@material-ui/core';
import PropTypes from 'prop-types';

import * as AuthService from '../../services/auth';
import { GlobalContext } from '../../context/global';

const Header = ({ userEmail }) => {
  const globalContext = useContext(GlobalContext);

  const onLogOutUser = useCallback(() => {
    AuthService.logOutUser();
    globalContext.setIsLoggedIn(false);
    globalContext.setCustomerId('');
    window.location.reload();
  }, [globalContext]);

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
