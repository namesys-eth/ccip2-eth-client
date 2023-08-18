import React from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import Help from '../components/Help'

interface ModalProps {
  show: boolean;
  onClose: any;
  children: any;
  handleModalData: (data: string | undefined) => void;
  handleTrigger: (data: boolean) => void;
}

const Confirm: React.FC<ModalProps> = ({ show, onClose, children, handleModalData, handleTrigger }) => {
  const [browser, setBrowser] = React.useState(false)
  
  React.useEffect(() => {
    setBrowser(true);
  }, []);

  const handleCloseClick = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    onClose();
  };

  const handleConfirmSubmit = () => {
    handleModalData('0');
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
              notification_important
            </div>
          </StyledModalTitle>}
        <StyledModalBody>
          {/* Button */}
          <div
            className="flex-column"
          >
            <div
              style={{
                lineHeight: '16px',
                fontWeight: '700'
              }}
            >
              <span
                style={{
                  marginTop: '15px',
                  fontSize: '15px'
                }}
              >
                Please note that this will set a new on-chain &nbsp;
              </span>
              <span style={{ color: 'cyan', fontWeight: '700' }}>
                Recordhash
              </span>&nbsp;
              for this name. If you intend to set a new &nbsp;
              <span style={{ color: 'cyan', fontWeight: '700' }}>
                Ownerhash
              </span>,&nbsp;
              please update it in &nbsp;
              <span style={{ color: 'orange', fontWeight: '700' }}>
                UTILS
              </span>&nbsp;
              tab
            </div>
            <button 
              className="button-option"
              style={{
                height: '35px',
                width: '130px',
                marginTop: '25px',
                fontSize: '15px',
                fontWeight: '700'
              }}
              onClick={ handleConfirmSubmit }
              data-tooltip={ 'Confirm' }
            >
              <div 
                className="flex-row"
              >
                { 'Confirm' }&nbsp;<span className="material-icons chonk">thumb_up_alt</span>
              </div>
            </button>
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
  padding-top: 10px;
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 15px;
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
  color: cyan;
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
  background-color: rgba(0, 0, 0, 0.75);
`;

export default Confirm;
