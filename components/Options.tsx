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
                marginTop: '15px'
              }}
            >
              Please choose your IPNS storage
            </div>
          </StyledModalTitle>}
        <StyledModalBody>
        <button 
            className="button-option"
            style={{
              height: '35px',
              width: '160px',
              marginTop: '15px',
              fontSize: '15px',
              fontWeight: '700'
            }}
            onClick={ handleOwnerhashSubmit }
            data-tooltip={ children ? 'Use Preset Global Ownerhash' : 'No Global Ownerhash Found' }
            disabled={ !children }
          >
            <div 
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              { 'Ownerhash' }&nbsp;<span className="material-icons chonk">recycling</span>
            </div>
          </button>
          <button 
            className="button-option"
            style={{
              height: '35px',
              width: '160px',
              marginTop: '20px',
              fontSize: '15px',
              fontWeight: '700'
            }}
            onClick={ handleRecordhashSubmit }
            data-tooltip='Set New On-chain Recordhash'
          >
            <div 
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center'              
              }}
            >
              { 'Recordhash' }&nbsp;<span className="material-icons chonk">create</span>
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
  padding-top: 10px;
  padding-left: 50px;
  padding-right: 50px;
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
  margin-top: -10px;
  font-size: 17px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  font-weight: 700;
  margin-bottom: 0px;
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
  width: 450px;
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
