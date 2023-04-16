import React from "react";
import ReactDOM from 'react-dom';
import styled from 'styled-components';

const FAQ = ({ show, onClose }) => {
  const title = 'about';
  const [browser, setBrowser] = React.useState(false);

  React.useEffect(() => {
    setBrowser(true);
  }, []);

  const handleCloseClick = (e) => {
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
                marginTop: '4px'
              }}
            >
              close
            </span>
          </a>
        </StyledModalHeader>
        {title && <StyledModalTitle>{title}</StyledModalTitle>}
        <StyledModalBody>
        </StyledModalBody>
      </StyledModal>
    </StyledModalOverlay>
  ) : null;

  if (browser) {
    return ReactDOM.createPortal(
      modalContent,
      document.getElementById("modal")
    );
  } else {
    return null;
  }
};

const StyledModalBody = styled.div`
  padding-top: 10px;
  padding-left: 20px;
  padding-right: 40px;
  padding-bottom: 20px;
  display: flex;
  justify-content: center;
  height: 500px;
  overflow-y: auto;
  color: white;
`;

const StyledModalTitle = styled.div`
  padding-top: 0px;
  font-size: 22px;
  display: flex;
  justify-content: center;
  font-weight: 800;
  margin-bottom: 20px;
  color: white;
`;

const StyledModalHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  font-size: 20px;
`;

const StyledModal = styled.div`
  background: linear-gradient(127deg, rgba(125,90,78,1) 0%, rgba(125,90,78,1) 100%);
  width: 500px;
  height: 600px;
  border-radius: 6px;
  padding: 15px;
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
  background-color: rgba(0, 0, 0, 0.35);
`;

export default FAQ;