import React from "react";
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import { CCarousel, CCarouselItem, CImage } from '@coreui/react';

const Preview = ({ show, onClose, title }) => {
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
          <div>
            <a href="#" onClick={handleCloseClick} style={{ width: '100%', marginLeft: '94%' }} >
              x
            </a>
          </div>
        </StyledModalHeader>
        {title &&
          <StyledModalTitle>
            <span style={{ fontFamily: 'RobotoMono', fontSize: '26px', margin: '-7.75px 1px', fontWeight: '800', letterSpacing: '0.5px' }}>{title}</span>
            <span>.100kcat.eth</span>&nbsp;
          </StyledModalTitle>}
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
  padding-top: 30px;
  padding-left: 0px;
  padding-right: 0px;
  padding-bottom: 0px;
  display: flex;
  justify-content: center;
  height: 500px;
  overflow-y: auto;
`;

const StyledModalTitle = styled.div`
  padding-top: 20px;
  font-size: 22px;
  display: flex;
  justify-content: center;
  font-weight: 1200;
  margin-bottom: 0px;
  color: rgba(255, 255, 255, 0.7);
`;

const StyledModalHeader = styled.div`
  font-size: 20px;
`;

const StyledModal = styled.div`
  background: linear-gradient(45deg, rgba(238,119,82,1) 0%, rgba(231,60,126,1) 20%, rgba(35,166,213,1) 40%, rgba(35,213,171,1) 60%, rgba(213,213,35,1) 80%, rgba(60,255,44,1) 100%);
  animation: gradient 10s ease infinite;
  background-size: 400% 400%;
  width: 400px;
  height: 500px;
  border-radius: 6px;
  padding-top: 9px;
  padding-left: 0px;
  padding-right: 8px;
  padding-bottom: 0px;
  overflow-y: initial !important
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
  background-color: rgba(0, 0, 0, 0.15);
`;

export default Preview;
