import React from 'react';
import { CircularProgress } from '@material-ui/core';
import './style.scss';

const Loader = () => (
  <div className="loader-container">
    <CircularProgress />
  </div>
);

export default Loader;
