import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import { isMobile } from 'react-device-detect';

const Success = ({ _ENS_, color, show, onClose, children }) => {
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
        {_ENS_ && 
          <StyledModalTitle>
            <span 
              className="material-icons"
              style={{
                marginTop: '4px',
                fontSize: '68px',
                color: color
              }}
            >
              { _ENS_ }
            </span>
          </StyledModalTitle>}
        <StyledModalBody dangerouslySetInnerHTML={{ __html: children }} />
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
  padding-left: 40px;
  padding-right: 40px;
  padding-bottom: 5px;
  margin-top: 0px;
  margin-left: 40px;
  margin-right: 40px;
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  height: auto;
  overflow-y: auto;
  color: white;
  font-size: 18px;
  font-weight: 700;
  line-height: 22px;
  max-width: 400px;
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
  background: rgba(66,46,40,1);
  background-size: 400% 400%;
  width: auto;
  max-width: ${isMobile ? '90%' : '60%'};
  border-radius: 6px;
  overflow-y: initial !important
  display: flex;
  text-align: center;
  justify-content: center;
`;

const StyledModalOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.1);
`;

export default Success;
