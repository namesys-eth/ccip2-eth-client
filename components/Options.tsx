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

const Options: React.FC<ModalProps> = ({ show, onClose, children, handleModalData, handleTrigger }) => {
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

  const handleOwnerhashSubmit = () => {
    handleModalData('0')
    handleTrigger(true)
    onClose()
  }

  const handleRecordhashSubmit = () => {
    handleModalData('1')
    handleTrigger(true)
    onClose()
  }

  const handleGatewaySubmit = () => {
    handleModalData('2')
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
              cloud_upload
            </div>
            <div
              style={{
                marginTop: '15px'
              }}
            >
              Please choose your Storage
            </div>
          </StyledModalTitle>}
        <StyledModalBody>
          {/* Top Button */}
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
              onClick={ handleOwnerhashSubmit }
              data-tooltip={ children ? 'Uses Preset Global Ownerhash' : 'No Global Ownerhash Found' }
              disabled={ !children }
            >
              <div 
                className="flex-row"
              >
                { 'Ownerhash' }&nbsp;<span className="material-icons chonk">recycling</span>
              </div>
            </button>
            <button 
              className="button-tiny"
              onClick={() => { 
                setHelpModal(true),
                setHelp('<span><span style="color: cyan">Ownerhash</span> works for all your names in a wallet and must be set in <span style="color: orange">UTILS</span>. This is a slower but cheaper option. If you prefer this option, please go to <span style="color: orange">UTILS</span> tab first and set the <span style="color: cyan">Ownerhash</span></span>')
              }}
              data-tooltip={ 'Cheaper but Slower IPNS' }
            >
              <div 
                className="material-icons smol"
                style={{ 
                  color: 'yellow',
                  marginLeft: '5px',
                  marginTop: '21px'
                }}
              >
                info_outline 
              </div>
            </button>
          </div>
          {/* Middle Button */}
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
              onClick={ handleRecordhashSubmit }
              data-tooltip='Sets New On-chain Recordhash'
            >
              <div 
                className="flex-row"
              >
                { 'Recordhash' }&nbsp;<span className="material-icons chonk">create</span>
              </div>
            </button>
            <button 
              className="button-tiny"
              onClick={() => { 
                setHelpModal(true),
                setHelp('<span><span style="color: cyan">Recordhash</span> is specific to each name and it is a faster but expensive option</span>')
              }}
              data-tooltip={ 'Faster but Expensive IPNS' }
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
          {/* Bottom Button */}
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
              onClick={ handleGatewaySubmit }
              data-tooltip='Sets New On-chain Gateway'
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
                setHelp('<span><span style="color: cyan">HTTP Gateway</span> can point to a <span style="color: cyan">web<span style="font-family: \'SF Mono\'; font-size: 15px">2</span></span> gateway or <span style="color: cyan">L<span style="font-family: \'SF Mono\'; font-size: 15px">2</span></span> proxy</span>')
              }}
              data-tooltip={ 'Rapid But Centralised' }
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
        </StyledModalBody>
      </StyledModal>
      <div id="modal-inner">
        <Help
          color={ 'cyan' }
          icon={ 'info' }
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
  background-color: rgba(0, 0, 0, 1);
`

export default Options
