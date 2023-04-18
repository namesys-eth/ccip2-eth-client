import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';

const Modal = ({ show, onClose, children }) => {
  const [browser, setBrowser] = React.useState(false);
  const title = 'about';
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
        {title && 
          <StyledModalTitle>
            <span 
              className="material-icons"
              style={{
                marginTop: '4px',
                fontSize: '26px'
              }}
            >
              info_outline
            </span>
          </StyledModalTitle>}
        <StyledModalBody>
          { children }
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
  padding-top: 1px;
  padding-left: 2px;
  padding-right: 2px;
  padding-bottom: 5px;
  display: flex;
  justify-content: center;
  height: auto;
  overflow-y: auto;
  color: white;
  font-size: 14px;
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
  width: 300px;
  height: 100px;
  border-radius: 6px;
  overflow-y: initial !important
  padding-bottom: 20px;
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

export default Modal;
