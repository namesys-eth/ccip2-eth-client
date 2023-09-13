import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import { isMobile } from 'react-device-detect'

function sumValues(obj: { [key: string]: number }): number {
  let total = 0;
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      total += obj[key];
    }
  }
  return total;
}

const Gas = ({ icon, color, show, onClose, children }) => {
  const [browser, setBrowser] = React.useState(false);
  React.useEffect(() => {
    setBrowser(true);
  }, []);

  const handleCloseClick = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    onClose();
  };

  const modalContent = show ? (
    <StyledModalOverlay>
      <StyledModal>
        <StyledModalHeader>
          <a href="#" onClick={handleCloseClick}>
            <span
              className="material-icons"
              style={{
                margin: '4px'
              }}
            >
              close
            </span>
          </a>
        </StyledModalHeader>
        {icon &&
          <StyledModalTitle>
            <span
              className="material-icons"
              style={{
                marginTop: '14px',
                fontSize: '72px',
                color: color
              }}
            >
              { 'verified' }
            </span>
          </StyledModalTitle>}
        <StyledModalBody>
          <div
            className='flex-column'
            style={{
              marginBottom: '15px'
            }}
          >
            <div
              style={{
                fontSize: '24px',
                marginTop: '10px',
                color: 'lime',
                fontWeight: '700'
              }}
            >
              Off-Chain Records set
            </div>
            <div 
              style={{
                marginTop: '20px',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '20px',
                fontWeight: '700'
              }}
            >
              <div>Your</div>&nbsp;
              <div
                className="material-icons"
                style={{
                  marginBottom: '3px',
                  fontSize: '28px',
                  color: color
                }}
              >
                {'local_gas_station'}
              </div>&nbsp;
              <div>
                savings
              </div>
            </div>
            <div
              style={{
                marginTop: '18px',
                fontFamily: 'SF Mono',
                fontSize: '24px',
                fontWeight: '600',
                color: 'lime'
              }}
            >
              { sumValues(children).toPrecision(3) } 
              &nbsp;
              <span
                style={{
                  fontFamily: 'Spotnik',
                  fontSize: '21px',
                  fontWeight: '700'
                }}
              >
                ETH
              </span>
            </div>
          </div>
        </StyledModalBody>
      </StyledModal>
    </StyledModalOverlay>
  ) : null;

  if (browser) {
    return ReactDOM.createPortal(
      modalContent,
      document.getElementById("modal")!
    );
  } else {
    return null;
  }
};

const StyledModalBody = styled.div`
  padding-top: 0px;
  padding-left: ${isMobile ? '10px' : '20px'};
  padding-right: ${isMobile ? '10px' : '20px'};
  padding-bottom: ${isMobile ? '10px' : '20px'};
  margin-top: 0px;
  margin-left: ${isMobile ? '10px' : '20px'};
  margin-right: ${isMobile ? '10px' : '20px'};
  margin-bottom: ${isMobile ? '10px' : '20px'};
  display: flex;
  justify-content: center;
  height: auto;
  overflow-y: auto;
  color: white;
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
  max-width: 450px;
`;

const StyledModalTitle = styled.div`
  margin-top: -15px;
  font-size: 20px;
  display: flex;
  justify-content: center;
  font-weight: 700;
  margin-bottom: 15px;
  color: white;
`;

const StyledModalHeader = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const StyledModal = styled.div`
  position: fixed;
  top: 250px;  
  background: rgba(66,46,40,1);
  background-size: 400% 400%;
  width: auto;
  max-width: ${isMobile ? '90%' : '60%'};
  height: 275px;
  border-radius: 6px;
  overflow-y: initial !important
  display: flex;
  text-align: center;
  justify-content: center;
  width: 450px;
`;

const StyledModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 1);
`;

export default Gas;