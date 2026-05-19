// React Component Example
import React from 'react';
import { ALCURA_LOGO_DATA_URI } from './logo.config';

export const ALCURALogo = ({ width = 200, height = 100 }) => (
  <img 
    src={ALCURA_LOGO_DATA_URI}
    alt="ALCURA - Algae Cultivation Universal Reactor Automation"
    style={{ width, height }}
  />
);

export default ALCURALogo;
