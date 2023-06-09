import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';

const Error = ({ show, onClose, title, children }) => {
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
            <span className="material-icons">cancel</span>
          </a>
        </StyledModalHeader>
        {title && <StyledModalTitle>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <div className="material-icons miui-small">{title}</div>
          </div>
          </StyledModalTitle>}
        <StyledModalBody>{children}</StyledModalBody>
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
  padding-top: 20px;
  display: flex;
  justify-content: center;
  overflow-y: auto;
  font-size: 18px;
  color: white;
  font-weight: 700;
`;

const StyledModalTitle = styled.div`
  font-size: 18px;
  display: flex;
  justify-content: center;
  font-weight: 700;
  color: white;
  margin-top: -20px;
`;

const StyledModalHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  font-size: 20px;
`;

const StyledModal = styled.div`
  background: red;
  width: 400px;
  height: 150px;
  border-radius: 6px;
  padding: 15px;
  overflow-y: initial !important
  padding-bottom: 20px;
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
  background-color: rgba(0, 0, 0, 0.5);
`;

export default Error;
