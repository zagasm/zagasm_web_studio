import React, { useState } from 'react';
import PropTypes from 'prop-types';

const CoinBalance = ({ balance, iconColor = '#FA6342', balanceColor = '#FA6342' }) => {
  const [showBalance, setShowBalance] = useState(false);

  const toggleBalance = () => {
    setShowBalance(!showBalance);
  };

  return (
    <div className="coin-balance-container" style={{ display: 'inline-block' }}> 
      <h5 title="Available POKI coin" style={{fontSize:'14px', color:'white'}}> Available balance
        <b className="badge" style={{ 
          background: iconColor,
          cursor: 'pointer',
          padding: '5px 10px',
          borderRadius: '20px',
          marginLeft:"10px"
        }} onClick={toggleBalance}>
          
          <i className={`fa-solid ${showBalance ? 'fa-eye-slash' : 'fa-eye'}`} 
             style={{ marginRight: '5px' }}></i>
          {showBalance ? (
            <span style={{ color: balanceColor }}>
              {/* <i className="fa-solid fa-coins" style={{ marginRight: '5px' }}></i> */}
              {balance.toFixed(2)}
            </span>
          ) : (
            <span style={{ color: balanceColor }}>
              {/* <i className="fa-solid fa-coins" style={{ marginRight: '5px' }}></i> */}
              •••••
            </span>
          )}
        </b>
      </h5>
    </div>
  );
};

CoinBalance.propTypes = {
  balance: PropTypes.number.isRequired,
  iconColor: PropTypes.string,
  balanceColor: PropTypes.string
};

export default CoinBalance;