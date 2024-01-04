import React from "react";

interface Props {
  variable: string
  mobile: boolean
}

const GasTicker: React.FC<Props> = ({ variable, mobile }) => {
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
      data-tooltip={'Total Gas Saved by Off-chain Records'}
    >
      <div
        className="material-icons-round smol"
        style={{
          color: 'lime',
          fontSize: mobile ? '18px' : '22px',
          marginRight: '5px'
        }}
      >
        {'energy_savings_leaf'}
      </div>
      <div>
        <span
          style={{
            fontFamily: 'SF Mono',
            color: 'white',
            fontSize: mobile ? '14px' : '16px',
            fontWeight: '700'
          }}
        >
          {variable ? variable : '0.00'}&nbsp;
          <span
            style={{
              fontFamily: 'Spotnik',
              fontSize: mobile ? '12px' : '14px',
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

export default GasTicker;