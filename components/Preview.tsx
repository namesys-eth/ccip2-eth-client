import React from "react"
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import { ethers } from 'ethers'
import LoadingIcons from 'react-loading-icons'
import Modal from '../components/Modal'

const Preview = ({ show, onClose, title, children }) => {
  const [browser, setBrowser] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [modal, setModal] = React.useState(false)
  const [resolver, setResolver] = React.useState<any>();
  const [addr, setAddr] = React.useState('');
  //const [addr60, setAddr60] = React.useState('');
  const [avatar, setAvatar] = React.useState('');
  const [contenthash, setContenthash] = React.useState('');
  const [name, setName] = React.useState('');
  const [list, setList] = React.useState<any[]>([]);
  const [edit, setEdit] = React.useState<any[]>([]);
  const [trigger, setTrigger] = React.useState(null);
  const [help, setHelp] = React.useState('');

  const ccip2 = '0x0'
  const apiKey = process.env.NEXT_PUBLIC_ALCHEMY_ID
  const network = process.env.NEXT_PUBLIC_NETWORK === 'goerli' ? 'goerli' : 'homestead'
  const provider = new ethers.providers.AlchemyProvider(network, apiKey);

  React.useEffect(() => {
    setBrowser(true) 
    getResolver()
  }, []);
  
  const handleCloseClick = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    onClose();
  };

  function finishQuery(data: React.SetStateAction<any[]> | undefined) {
    if ( data && data[0].value === title ) {
      setList(data)
      setEdit(data)
      setLoading(false)
    }
  }

  React.useEffect(() => {
    setEdit(list)
    const updatedList = list.map((item) => {
      if (item.key === trigger) {
        return { ...item, show: false };
      }
      return item;
    });
    console.log(updatedList)
    setEdit(updatedList)
  }, [trigger]);

  async function getContenthash(resolver: ethers.providers.Resolver | null) {
    await resolver!.getContentHash()
      .then((response: React.SetStateAction<string>) => {
        setContenthash(response!)
        getAvatar()
      });
  }

  async function getAvatar() {
    await provider.getAvatar(title)
      .then(response => {
        setAvatar(response!)
        getX()
      });
  }

  async function getX() {
    await provider.resolveName(title)
      .then(response => {
        setAddr(response!)
        setName(title)
      });
  }

  async function getResolver() {
    console.log('Fetching ENS data')
    await provider.getResolver(title)
      .then(response => {
        setResolver(response?.address);
        getContenthash(response!)
      });
  }

  React.useEffect(() => {
    setMetadata()
  }, [name]);

  function setMetadata() {
    let data = [
      {
        key: 0,
        type: 'reverse record',
        value: name,
        show: resolver === ccip2,
        action: 'setName',
        label: 'edit',
        help: 'your reverse record'
      },
      {
        key: 1,
        type: 'resolver',
        value: resolver,
        show: true,
        action: 'setResolver',
        label: 'migrate',
        help: 'migrate to gasless resolver'
      },
      {
        key: 2,
        type: 'avatar',
        value: avatar,
        show: resolver === ccip2,
        action: 'setAvatar',
        label: 'edit',
        help: 'set avatar'
      },
      {
        key: 3,
        type: 'address',
        value: addr,
        show: resolver === ccip2,
        action: 'setAddr',
        label: 'edit',
        help: 'set default address'
      },
      {
        key: 4,
        type: 'web-contenthash',
        value: contenthash,
        show: resolver === ccip2,
        action: 'setContenthash',
        label: 'edit',
        help: 'set your web contenthash'
      }
    ]
    finishQuery(data)
  }

  const modalContent = show ? (
    <StyledModalOverlay>
      <StyledModal>
        <StyledModalHeader>
          <a href="#" onClick={handleCloseClick}>
            <span 
              className="material-icons"
              style={{
                marginTop: '7px'
              }}
            >
              close
            </span>
          </a>
        </StyledModalHeader>
        {title && loading && 
          <StyledModalTitle>
            <span 
              className="material-icons miui-small"
              style={{
                marginTop: '4px'
              }}
            >
              display_settings
            </span>
          </StyledModalTitle>
        }
        {title && avatar && !loading && list.length > 0 &&
          <StyledModalTitle>
            <img 
              src={ avatar.replace('ipfs.io','pinata.cloud') } 
              width={ '100px' }
            >
            </img>
          </StyledModalTitle>
        }
        {title && !avatar && !loading && list.length > 0 &&
          <StyledModalTitle>
            <span 
              className="material-icons miui"
              style={{
                marginTop: '4px'
              }}
            >
              portrait
            </span>
          </StyledModalTitle>
        }
        {loading && 
          <StyledModalBody>
            <div
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                display: 'flex',
                marginTop: '50px',
                marginBottom: '200px'
              }}
            >
              <LoadingIcons.Bars />
            </div>
          </StyledModalBody>
        }
        {list.length > 0 && !loading && 
          <StyledModalBody>
            <ul
              style={{
                listStyle: 'none',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
              }}>
              {list.map((item) => (
                <li
                  key={item.key}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '500px',
                    maxWidth: '85%',
                    paddingLeft: '20px',
                    paddingRight: '20px'
                  }}
                >
                  <Modal
                    onClose={() => setModal(false)}
                    show={modal}
                  >
                    {help}
                  </Modal>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      flexDirection: 'column'
                    }}
                  >
                    <div 
                      style={{                      
                        marginBottom: '15px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '100%'
                      }}
                    >
                      <span 
                        style={{ 
                          fontFamily: 'Spotnik',
                          fontWeight: '700',
                          fontSize: '17px',
                          color: 'skyblue',
                          marginRight: '15px'
                        }}
                      >
                        {item.type}
                        <button 
                          className="button-tiny"
                          onClick={() => { 
                            setModal(true),
                            setHelp(item.help)
                          }}
                        >
                          <div className="material-icons smol">info_outline</div>
                        </button>
                      </span>
                      <button
                        className="button"
                        disabled={ 
                          !edit[item.key]?.show
                        }
                        style={{
                          alignSelf: 'flex-end',
                          height: '25px',
                          width: 'auto',
                          marginTop: '-3px',
                        }}
                        onClick={() => { setTrigger(item.key) }}
                        data-tooltip={ item.help }
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
                              {item.label}&nbsp;<span className="material-icons smoller">manage_history</span>
                          </div>
                      </button>
                    </div>
                    <input 
                      id={ item.key }
                      key={ item.key }
                      placeholder={ item.value }
                      type='text'
                      defaultValue={ item.value }
                      style={{ 
                        fontFamily: 'SF Mono',
                        letterSpacing: '-0.5px',
                        fontWeight: '400',
                        fontSize: '14px',
                        width: '100%',
                        wordWrap: 'break-word',
                        textAlign: 'left',
                        marginBottom: '-5px'
                      }}
                    />
                  </div>
                  <hr></hr>
                </li>
              ))}
            </ul>
          </StyledModalBody>
        }
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
  padding-top: 20px;
  padding-left: 0px;
  padding-right: 0px;
  padding-bottom: 0px;
  display: flex;
  justify-content: center;
  height: auto;
  overflow-y: auto;
  overflow-x: hidden;
`;

const StyledModalTitle = styled.div`
  padding-top: 10px;
  padding-bottom: 10px;
  font-size: 22px;
  display: flex;
  justify-content: center;
  font-weight: 1200;
  margin-bottom: 0px;
  color: white;
`;

const StyledModalHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  font-size: 20px;
`;

const StyledModal = styled.div`
  background: linear-gradient(180deg, rgba(66,46,40,1) 0%, rgba(0,0,0,1) 35%, rgba(0,0,0,1) 100%);
  width: auto;
  min-width: 400px;
  border-radius: 6px;
  padding-top: 0px;
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
