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

const Salt: React.FC<ModalProps> = ({ show, onClose, children, handleModalData, handleTrigger }) => {
  const [inputValue, setInputValue] = React.useState("");
  const [browser, setBrowser] = React.useState(false);
  
  React.useEffect(() => {
    setBrowser(true);
  }, []);

  const handleCloseClick = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    onClose();
  };

  const handleSubmit = () => {
    handleModalData(inputValue);
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
              key
            </div>
            <div
              style={{
                marginTop: '10px'
              }}
            >
              Please enter your secret IPNS key identifier
            </div>
          </StyledModalTitle>}
        <StyledModalBody>
          <input 
            id='keyid'
            key='0'
            placeholder='key identifier'
            type='password'
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value)
            }}
            style={{ 
              background: 'black',
              outline: 'none',
              border: 'none',
              padding: '5px',
              borderRadius: '3px',
              fontFamily: 'SF Mono',
              letterSpacing: '-0.5px',
              fontWeight: '400',
              fontSize: '14px',
              width: '100%',
              wordWrap: 'break-word',
              textAlign: 'left',
              color: 'rgb(255, 255, 255, 0.6)',
              cursor: 'copy'
            }}
          />
          <button 
            className="button"
            style={{
              height: '28px',
              width: '120px',
              marginTop: '15px',
              fontSize: '14px'
            }}
            onClick={ handleSubmit }
            data-tooltip='Click to proceed'
          >
            <div 
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '13px'
              }}
            >
              { 'proceed' }&nbsp;<span className="material-icons smoller">vpn_key</span>
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
  margin-bottom: 15px;
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
  max-width: 60%;
  height: 198px;
  border-radius: 6px;
  overflow-y: initial !important
  display: flex;
  text-align: center;
  justify-content: center;
  padding: 3px;
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

export default Salt;
