import React from 'react'
import { isMobile } from 'react-device-detect'
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import * as constants from '../utils/constants'
import Help from '../components/Help'

interface ModalProps {
  show: boolean
  onClose: any
  children: any
  handleModalData: (data: string | undefined) => void
  handleTrigger: (data: boolean) => void
}

const PayTo: React.FC<ModalProps> = ({ show, onClose, children, handleModalData, handleTrigger }) => {
  const [browser, setBrowser] = React.useState(false)
  const [color, setColor] = React.useState(['white', 'white'])
  const [ENS, setENS] = React.useState('')
  const [payee, setPayee] = React.useState('')
  const [amount, setAmount] = React.useState('')
  const [helpModal, setHelpModal] = React.useState(false)
  const [help, setHelp] = React.useState('')
  React.useEffect(() => {
    setBrowser(true)
  }, [])

  const handleCloseClick = (e: { preventDefault: () => void; }) => {
    handleTrigger(false)
    handleModalData('')
    setColor(['white', 'white'])
    e.preventDefault()
    onClose()
  }

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    handleTrigger(true)
    handleModalData(`${ENS}:${payee}:${amount}`)
    setColor(['white', 'white', 'white'])
    e.preventDefault()
    onClose()
  }

  function setENSValue(_value: string) {
    if (_value.endsWith('.eth')) {
      setENS(_value)
      setColor(['lime', color[1],  color[2]])
    } else {
      setENS('')
      setColor(['white', color[1], color[2]])
    }
  }

  function setPayeeValue(_value: string) {
    if (constants.isAddr(_value)) {
      setPayee(_value)
      setColor([color[0], 'lime', color[2]])
    } else {
      setPayee('')
      setColor([color[0], 'white', color[2]])
    }
  }

  function setPayeeAmount(_value: string) {
    if (_value === '0' || _value === '0.' || /[a-zA-Z]/.test(_value)) {
      setAmount('')
      setColor([color[0], color[1], 'white'])
    } else {
      setAmount(_value)
      setColor([color[0], color[1], 'lime'])
    }
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
        <StyledModalTitle>
          <div 
            className="material-icons"
            style={{
              marginTop: '10px',
              fontSize: '66px',
              color: 'lightgreen'
            }}
          >
            shopping_cart_checkout
          </div>
          <div
            style={{
              marginTop: '17px',
              marginBottom: '0px'
            }}
          >
            <span style={{ fontSize: '18px', fontWeight: '700' }}>Enter Payment Info</span>
            <button 
                className="button-tiny"
                style={{
                  marginTop: '-7.5px',
                  marginLeft: '5px'
                }}
                onClick={() => { 
                  setHelpModal(true),
                  setHelp('<span>Please Specify the Requested Details To Receive Private Payment</span>')
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
        </StyledModalTitle>
        <StyledModalBody>
          <div
            className='flex-row'
            style={{
              width: '400px',
              marginTop: '5px'
            }}
          >
            <input 
              id='info'
              key='0'
              placeholder={'enter payee .eth'}
              type='text'
              style={{
                background: 'black',
                outline: 'none',
                border: 'none',
                padding: '7px',
                borderRadius: '3px',
                fontFamily: 'SF Mono',
                letterSpacing: '-0.5px',
                fontWeight: '400',
                fontSize: '15px',
                width: '90%',
                wordWrap: 'break-word',
                textAlign: 'left',
                color: color[0],
                cursor: 'copy'
              }}
              onChange={(e) => {
                setENSValue(e.target.value)
              }}
            />
            <button 
              className="button-tiny"
              style={{
                marginTop: '0px'
              }}
              onClick={() => { 
                setHelpModal(true),
                setHelp('<span>ENS Of <span style="color: cyan">Sender</span></span>')
              }}
              data-tooltip={ 'Sender' }
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
          <div
            className='flex-row'
            style={{
              width: '400px',
              marginTop: '7px'
            }}
          >
            <input 
              id='info'
              key='1'
              placeholder={'enter payee address'}
              type='text'
              style={{
                background: 'black',
                outline: 'none',
                border: 'none',
                padding: '7px',
                borderRadius: '3px',
                fontFamily: 'SF Mono',
                letterSpacing: '-0.5px',
                fontWeight: '400',
                fontSize: '15px',
                width: '90%',
                wordWrap: 'break-word',
                textAlign: 'left',
                color: color[1],
                cursor: 'copy'
              }}
              onChange={(e) => {
                setPayeeValue(e.target.value)
              }}
            />
            <button 
              className="button-tiny"
              style={{
                marginTop: '0px'
              }}
              onClick={() => { 
                setHelpModal(true),
                setHelp('<span>Private Address Of <span style="color: cyan">Receiver</span></span>')
              }}
              data-tooltip={ 'Receiver' }
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
          <div
            className='flex-row'
            style={{
              width: '400px',
              marginTop: '7px'
            }}
          >
            <input 
              id='info'
              key='2'
              placeholder={'enter amount to receive'}
              type='text'
              style={{
                background: 'black',
                outline: 'none',
                border: 'none',
                padding: '7px',
                borderRadius: '3px',
                fontFamily: 'SF Mono',
                letterSpacing: '-0.5px',
                fontWeight: '400',
                fontSize: '15px',
                width: '90%',
                wordWrap: 'break-word',
                textAlign: 'left',
                color: color[2],
                cursor: 'copy'
              }}
              onChange={(e) => {
                setPayeeAmount(e.target.value)
              }}
            />
            <button 
              className="button-tiny"
              style={{
                marginTop: '0px'
              }}
              onClick={() => { 
                setHelpModal(true),
                setHelp('<span>Amount To <span style="color: cyan">Receiver</span></span>')
              }}
              data-tooltip={ 'Ether' }
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
          <button 
            className="button"
            style={{
              height: '33px',
              width: '90px',
              padding: '5px',
              marginTop: '17px',
              fontSize: '16px',
              fontWeight: '700'
            }}
            onClick={ handleSubmit }
            disabled={!ENS || !payee || !amount}
            data-tooltip='Confirm'
          >
            <div 
              className="flex-row"
              style={{
                fontSize: '15px'
              }}
            >
              { 'Next' }&nbsp;<span className="material-icons smoller">navigate_next</span>
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
  margin-top: 5px;
`

const StyledModalTitle = styled.div`
  margin-top: -15px;
  font-size: 14px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  font-weight: 700;
  color: white;
  padding-left: 20px;
  padding-right: 20px;
  color: cyan;
  margin-left: 10px;
`

const StyledModalHeader = styled.div`
  display: flex;
  justify-content: flex-end;
`

const StyledModal = styled.div`
  background: rgba(66,46,40,1);
  background-size: 400% 400%;
  width: 460px;
  max-width: ${isMobile ? '90%' : '60%'};
  height: 360px;
  border-radius: 6px;
  overflow-y: initial !important
  display: flex;
  text-align: center;
  justify-content: center;
  padding: 3px;
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

export default PayTo
