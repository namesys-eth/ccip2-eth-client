import React from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import Help from '../components/Help'

interface ModalProps {
  show: boolean
  onClose: any
  children: any
  handleModalData: (data: string | undefined) => void
  handleTrigger: (data: boolean) => void
}

const Confirm: React.FC<ModalProps> = ({ show, onClose, children, handleModalData, handleTrigger }) => {
  const [browser, setBrowser] = React.useState(false)
  const [helpModal, setHelpModal] = React.useState(false)
  const [help, setHelp] = React.useState('')
  
  React.useEffect(() => {
    setBrowser(true)
  }, [])

  const handleCloseClick = (e: { preventDefault: () => void; }) => {
    handleModalData(undefined)
    handleTrigger(false)
    e.preventDefault()
    onClose()
  }

  const handleConfirmSubmit = (trigger: string) => {
    handleModalData(trigger)
    handleTrigger(true)
    onClose()
  }

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
                fontSize: '66px'
              }}
            >
              notification_important
            </div>
          </StyledModalTitle>}
        <StyledModalBody>
          {/* Button */}
          <div
            className="flex-column"
            style={{
              marginTop: '10px',
              marginBottom: '10px'
            }}
          >
            <div
              style={{
                lineHeight: '16px',
                fontWeight: '700'
              }}
            >
              <span
                style={{
                  fontSize: '15px',
                  lineHeight: '20px'
                }}
              >
                This will set a new on-chain&nbsp;
              </span>
              <span style={{ color: 'cyan', fontWeight: '700', lineHeight: '20px' }}>
                Recordhash
              </span>&nbsp;Or&nbsp;
              <span style={{ color: 'cyan', fontWeight: '700', lineHeight: '20px' }}>
                Gateway
              </span>. If you intend to set a global&nbsp;
              <span style={{ color: 'cyan', fontWeight: '700', lineHeight: '20px' }}>
                Ownerhash
              </span>,&nbsp;please update it in&nbsp;
              <span style={{ color: 'orange', fontWeight: '700', lineHeight: '20px' }}>
                UTILS
              </span>&nbsp;tab
            </div>
            <div
              className="flex-row"
              style={{
                marginLeft: '25px'
              }}
            >
              <button 
                className="button-option"
                style={{
                  height: '35px',
                  width: '175px',
                  marginTop: '20px',
                  fontSize: '15px',
                  fontWeight: '700'
                }}
                onClick={() => { 
                  handleConfirmSubmit('0') 
                }}
                data-tooltip={ 'Continue With Recordhash' }
              >
                <div 
                  className="flex-row"
                >
                  { 'Recordhash' }&nbsp;<span className="material-icons chonk">hub</span>
                </div>
              </button>
              <button 
                className="button-tiny"
                onClick={() => { 
                  setHelpModal(true),
                  setHelp('<span><span style="color: cyan">Recordhash</span> is specific to each name and it is the <span style="color: lime">permissionless</span> and <span style="color: lime">decentralised</span> option</span>')
                }}
                data-tooltip={ 'Enlighten Me' }
              >
                <div 
                  className="material-icons smol"
                  style={{ 
                    color: 'cyan',
                    marginLeft: '5px',
                    marginTop: '16px'
                  }}
                >
                  info_outline 
                </div>
              </button>
            </div>
            <div
              className="flex-row"
              style={{
                marginLeft: '25px'
              }}
            >
              <button 
                className="button-option"
                style={{
                  height: '35px',
                  width: '175px',
                  marginTop: '15px',
                  fontSize: '15px',
                  fontWeight: '700'
                }}
                onClick={ () => { 
                  handleConfirmSubmit('1')
                }}
                data-tooltip={ 'Continue With HTTP Gateway' }
                disabled
              >
                <div 
                  className="flex-row"
                >
                  { 'HTTP Gateway' }&nbsp;<span className="material-icons chonk">dns</span>
                </div>
              </button>
              <button 
                className="button-tiny"
                onClick={() => { 
                  setHelpModal(true),
                  setHelp('<span><span style="color: orange">COMING SOON<span style="font-family: \'SF Mono\'; font-size: 16px">!</span></span> <span style="color: cyan">HTTP Gateway</span> could point to a <span style="color: cyan">web<span style="font-family: \'SF Mono\'; font-size: 15px">2</span></span> gateway or <span style="color: cyan">L<span style="font-family: \'SF Mono\'; font-size: 15px">2</span></span> proxy</span>')
                }}
                data-tooltip={ 'Satanic and Evil Middleware' }
              >
                <div 
                  className="material-icons smol"
                  style={{ 
                    color: 'orange',
                    marginLeft: '5px',
                    marginTop: '16px'
                  }}
                >
                  info_outline 
                </div>
              </button>
            </div>
          </div>
        </StyledModalBody>
      </StyledModal>
      <div id="modal-inner">
        <Help
          color={ 'lightblue' }
          _ENS_={ 'info' }
          onClose={() => setHelpModal(false)}
          show={helpModal}
        >
          { help }
        </Help>
      </div>
    </StyledModalOverlay>
  ) : null

  if (browser) {
    return ReactDOM.createPortal(
      modalContent,
      document.getElementById("modal")!
    )
  } else {
    return null
  }
}

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
`

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
`

const StyledModalHeader = styled.div`
  display: flex;
  justify-content: flex-end;
`

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
`

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
`

export default Confirm
