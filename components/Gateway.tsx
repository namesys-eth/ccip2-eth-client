import React from 'react'
import { isMobile } from 'react-device-detect'
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import Help from '../components/Help'
import * as constants from '../utils/constants'

interface ModalProps {
  show: boolean
  onClose: any
  children: any
  handleModalData: (data: string | undefined) => void
  handleTrigger: (data: boolean) => void
}

const Gateway: React.FC<ModalProps> = ({ show, onClose, children, handleModalData, handleTrigger }) => {
  const [inputValue, setInputValue] = React.useState(constants.defaultGateway)
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

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    handleModalData(inputValue)
    handleTrigger(true)
    e.preventDefault()
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
                fontSize: '46px'
              }}
            >
              dns
            </div>
            <div
              style={{
                marginTop: '5px',
                marginBottom: '10px',
                fontSize: '18px'
              }}
            >
              <span 
                style={{
                  fontWeight: '700'
                }}
              >
                Enter HTTP Gateway URL
              </span>
              <button 
                className="button-tiny"
                style={{
                  marginBottom: '-7.5px'
                }}
                onClick={() => { 
                  setHelpModal(true),
                  setHelp('<span><span style="color: cyan">HTTP Gateway</span> should be a <span style="color: orange">HTTPS<span style="font-family: \'SF Mono\'">:</span>//</span> URL</span>')
                }}
                data-tooltip={ 'Enlighten Me' }
              >
                <div 
                  className="material-icons smol"
                  style={{ 
                    color: 'cyan',
                    marginLeft: '5px'
                  }}
                >
                  info_outline 
                </div>
              </button>
            </div>
          </StyledModalTitle>}
        <StyledModalBody>
          <input 
            id='keyid'
            key='0'
            placeholder={inputValue}
            type='text'
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
              height: '30px',
              width: '120px',
              marginTop: '17px',
              fontSize: '15px'
            }}
            onClick={ handleSubmit }
            data-tooltip='Confirm'
          >
            <div 
              className="flex-row"
              style={{
                fontSize: '15px',
                fontWeight: '700'
              }}
            >
              { 'Confirm' }&nbsp;<span className="material-icons smoller">local_laundry_service</span>
            </div>
          </button>
        </StyledModalBody>
      </StyledModal>
      <div id="modal-inner">
        <Help
          color={ 'cyan' }
          icon={ 'info' }
          onClose={() => setHelpModal(false)}
          show={helpModal}
          position={''}
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
  padding-top: 5px;
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 25px;
  display: flex;_
  justify-content: center;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: auto;
  overflow-y: auto;
  color: white;
  font-size: 14px;
  font-weight: 700;
  margin-top: -15px;
`

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
  color: cyan;
`

const StyledModalHeader = styled.div`
  display: flex;
  justify-content: flex-end;
`

const StyledModal = styled.div`
  background: rgba(66,46,40,1);
  background-size: 400% 400%;
  width: 400px;
  max-width: ${isMobile ? '90%' : '60%'};
  height: 220px;
  border-radius: 6px;
  overflow-y: initial !important
  display: flex;
  text-align: center;
  justify-content: center;
  padding: 3px;
`

const StyledModalOverlay = styled.div`
  position: absolute;
  top: -60px;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 1);
`

export default Gateway
