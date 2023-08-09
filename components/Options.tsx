import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';

interface ModalProps {
  show: boolean;
  onClose: any;
  children: any;
  handleModalData: (data: string | undefined) => void;
  handleTrigger: (data: boolean) => void;
}

const Options: React.FC<ModalProps> = ({ show, onClose, children, handleModalData, handleTrigger }) => {
  const [inputValue, setInputValue] = React.useState("");
  const [browser, setBrowser] = React.useState(false);
  
  React.useEffect(() => {
    setBrowser(true);
  }, []);

  const handleCloseClick = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    onClose();
  };

  const handleOwnerhashSubmit = () => {
    handleModalData('0');
    handleTrigger(true);
    onClose();
  };

  const handleRecordhashSubmit = () => {
    handleModalData('1');
    handleTrigger(true);
    onClose();
  };

  const modalContent = show ? (
    <StyledModalOverlay>
      <StyledModal>
        <StyledModalHeader>
          <a href="#" onClick={handleCloseClick}>
            <span 
              className="material-icons"
            >
              close
            </span>
          </a>
        </StyledModalHeader>
        {show && 
          <StyledModalTitle>
            <div 
              className="material-icons"
              style={{
                marginTop: '4px',
                fontSize: '46px'
              }}
            >
              cloud_upload
            </div>
            <div
              style={{
                marginTop: '10px'
              }}
            >
              Please choose your IPNS storage
            </div>
          </StyledModalTitle>}
        <StyledModalBody>
        <button 
            className="button"
            style={{
              height: '28px',
              width: '150px',
              marginTop: '15px',
              fontSize: '14px'
            }}
            onClick={ handleOwnerhashSubmit }
            data-tooltip='Proceed'
          >
            <div 
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '13px',
                fontWeight: '700'
              }}
            >
              { 'Ownerhash' }&nbsp;<span className="material-icons smoller">recycling</span>
            </div>
          </button>
          <button 
            className="button"
            style={{
              height: '28px',
              width: '150px',
              marginTop: '15px',
              fontSize: '14px'
            }}
            onClick={ handleRecordhashSubmit }
            data-tooltip='Proceed'
          >
            <div 
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '13px',
                fontWeight: '700'
              }}
            >
              { 'Recordhash' }&nbsp;<span className="material-icons smoller">create</span>
            </div>
          </button>
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
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 25px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: auto;
  overflow-y: auto;
  color: white;
  font-size: 14px;
  font-weight: 700;
`;

const StyledModalTitle = styled.div`
  margin-top: -15px;
  font-size: 14px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  font-weight: 700;
  margin-bottom: 10px;
  color: white;
  padding-left: 20px;
  padding-right: 20px;
  color: skyblue;
`;

const StyledModalHeader = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const StyledModal = styled.div`
  background: rgba(66,46,40,1);
  background-size: 400% 400%;
  width: auto;
  max-width: 100%;
  height: 208px;
  border-radius: 6px;
  overflow-y: initial !important
  display: flex;
  text-align: center;
  justify-content: center;
  padding: 5px;
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

export default Options;
