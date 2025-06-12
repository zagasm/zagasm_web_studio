import React from 'react';
import PropTypes from 'prop-types';

const NumberFormatter = ({ number, className }) => {
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  // Remove .0 from numbers like 1.0K to make them 1K
  const formattedNumber = formatNumber(number).replace(/\.0([KM])/, '$1');

  return (
      <>{formattedNumber}</>
  );
};

NumberFormatter.propTypes = {
  number: PropTypes.number.isRequired,
//   className: PropTypes.string
};

export default NumberFormatter;