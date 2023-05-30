import React from "react";

interface Props {
  variable: string;
}

const MyComponent: React.FC<Props> = ({ variable }) => {
  return (
    <button 
      className="button-tiny"
      style={{ 
        color: 'lightgreen',
        marginRight: '15px',
        fontSize: '16px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
      }}
      data-tooltip={ 'Total Gas Saved by Off-chain Records' }
    >
      <div 
        className="material-icons smol"
        style={{ 
          color: 'lightgreen',
          fontSize: '22px',
          marginRight: '5px'
        }}
      >
        {'local_gas_station'}
      </div>
      <div>
        <span
          style={{ 
            fontFamily: 'SF Mono',
            color: 'white',
            fontSize: '16px',
            fontWeight: '700'
          }}
        >
          { variable ? variable : '0.00' }&nbsp;
          <span
            style={{ 
              fontFamily: 'Spotnik',
              fontSize: '15px',
              fontWeight: '700'
            }}
          >
            ETH
          </span>
      </span>
      </div>
    </button>
  );
};

export default MyComponent;