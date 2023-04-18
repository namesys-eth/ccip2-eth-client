import React from "react"
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import { ethers } from 'ethers'
import LoadingIcons from 'react-loading-icons'
import Modal from '../components/Modal'
import Salt from '../components/Salt'
import {
  useFeeData,
  useContractWrite,
  useWaitForTransaction
} from 'wagmi'
import * as constants from '../utils/constants'
import { ed25519Keygen } from '../utils/keygen'

interface MainBodyState {
  modalData: string | null;
}

const Preview = ({ show, onClose, title, children }) => {
  const [state, setState] = React.useState<MainBodyState>({
    modalData: null,
  });
  const [browser, setBrowser] = React.useState(false);
  const { data: gasData, isError } = useFeeData()
  const [loading, setLoading] = React.useState(true);
  const [modal, setModal] = React.useState(false)
  const [finish, setFinish] = React.useState(false)
  const [resolver, setResolver] = React.useState<any>();
  const [addr, setAddr] = React.useState('');
  //const [addr60, setAddr60] = React.useState('');
  const [avatar, setAvatar] = React.useState('');
  const [contenthash, setContenthash] = React.useState('');
  const [name, setName] = React.useState('');
  const [salt, setSalt] = React.useState(false);
  const [list, setList] = React.useState<any[]>([]);
  const [edit, setEdit] = React.useState<any[]>([]);
  const [trigger, setTrigger] = React.useState(null);
  const [help, setHelp] = React.useState('');

  const apiKey = process.env.NEXT_PUBLIC_ALCHEMY_ID
  const network = process.env.NEXT_PUBLIC_NETWORK === 'goerli' ? 'goerli' : 'homestead'
  const provider = new ethers.providers.AlchemyProvider(network, apiKey);

  const handleModalData = (data: string) => {
    setState({ ...state, modalData: data });
  };

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

  async function getContenthash(resolver: ethers.providers.Resolver | null) {
    if ( resolver?.address !== constants.ccip2 ) {
      console.log(resolver?.address)
      console.log(constants.ccip2)
      await resolver!.getContentHash()
        .then((response: React.SetStateAction<string>) => {
          if (!response) {
            setContenthash('')
          } else {
            setContenthash(response)
          }
          getAvatar()
        })
        .catch(() => {
          setContenthash('')
          getAvatar()
        });
    } else {
      setContenthash('')
      getAvatar()
    }
  }

  async function getAvatar() {
    if ( resolver?.address !== constants.ccip2 ) {
      await provider.getAvatar(title)
        .then(response => {
          if (!response) {
            setAvatar('')
          } else {
            setAvatar(response)
          }
          getRecord()
        })
        .catch(() => {
          setAvatar('')
          getRecord()
        });
    } else {
      setAvatar('')
      getRecord()
    }
  }

  async function getRecord() {
    if ( resolver?.address !== constants.ccip2 ) {
      await provider.resolveName(title)
        .then(response => {
          if (!response) {
            setAddr('')
          } else {
            setAddr(response)
          }
          setName(title)
          setFinish(true)
        })
        .catch(() => {
          setAddr('')
          setName(title)
          setFinish(true)
        });
    } else {
      setAddr('')
      setName(title)
      setFinish(true)
    }
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
    if (finish) setMetadata()
  }, [finish]);

  function setMetadata() {
    let data = [
      {
        key: 0,
        type: 'reverse record',
        value: name,
        editable: resolver === constants.ccip2,
        active: resolver === constants.ccip2,
        action: 'setName',
        label: 'edit',
        help: 'your reverse record'
      },
      {
        key: 1,
        type: 'resolver',
        value: resolver,
        editable: false,
        active: resolver !== constants.ccip2,
        action: 'migrate',
        label: 'migrate',
        help: 'please migrate your resolver to enjoy off-chain records'
      },
      {
        key: 2,
        type: 'avatar',
        value: avatar,
        editable: resolver === constants.ccip2,
        active: resolver === constants.ccip2,
        action: 'setAvatar',
        label: 'edit',
        help: 'set avatar'
      },
      {
        key: 3,
        type: 'address',
        value: addr,
        editable: resolver === constants.ccip2,
        active: resolver === constants.ccip2,
        action: 'setAddr',
        label: 'edit',
        help: 'set default address'
      },
      {
        key: 4,
        type: 'web-contenthash',
        value: contenthash,
        editable: resolver === constants.ccip2,
        active: resolver === constants.ccip2,
        action: 'setContenthash',
        label: 'edit',
        help: 'set your web contenthash'
      }
    ]
    finishQuery(data)
  }

  const {
    data: response,
    write: migrate,
    isLoading: isMigrateLoading,
    isSuccess: isMigrateSuccess,
  } = useContractWrite(
    constants.ensConfig[0],
    'setResolver',
    {
      args: [
        ethers.utils.namehash(title), 
        constants.ccip2
      ]
    }
  );

  const { isSuccess: txSuccess } = useWaitForTransaction({
    hash: response?.hash,
  });

  React.useEffect(() => {
    setEdit(list)
    const updatedList = list.map((item) => {
      if (item.key === trigger && item.type !== 'resolver') {
        return { 
          ...item, 
          editable: false, 
          active: false 
        };
      } else if (item.key === trigger && item.type === 'resolver') {
        return { 
          ...item, 
          editable: false, 
          active: constants.ccip2 !== resolver 
        };
      }
      return item;
    });
    console.log(updatedList)
    setEdit(updatedList)
  }, [trigger]);

  React.useEffect(() => {
    if (isMigrateSuccess && txSuccess) {
      setAvatar('')
      setContenthash('')
      setAddr('')
      setResolver(constants.ccip2)
      console.log('Resolver Migrated')
      setEdit(list)
      const updatedList = list.map((item) => {
        if (item.type !== 'resolver') {
          return { 
            ...item, 
            editable: false, 
            active: false 
          };
        } else if (item.type === 'resolver') {
          return { 
            ...item, 
            editable: true, 
            active: true 
          };
        }
        return item;
      });
      console.log(updatedList)
      setEdit(updatedList)
      setFinish(true)
    }
  }, [isMigrateSuccess, txSuccess]);

  React.useEffect(() => {
    if (isMigrateLoading) {
      setFinish(false)
      setLoading(true)
    }
  }, [isMigrateLoading]);

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
                    <span>{ help }</span>
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
                        marginBottom: '10px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '100%'
                      }}
                    >
                      <span 
                        style={{ 
                          fontFamily: 'Spotnik',
                          fontWeight: '700',
                          fontSize: '15px',
                          color: 'skyblue',
                          marginRight: '15px'
                        }}
                      >
                        {item.type}
                        { (item.type !== 'resolver' || resolver !== constants.ccip2)  &&
                          <button 
                            className="button-tiny"
                            onClick={() => { 
                              setModal(true),
                              setHelp(item.help)
                            }}
                          >
                            <div className="material-icons smol">info_outline</div>
                          </button>
                        }
                        { resolver === constants.ccip2 && item.type === 'resolver' &&
                          <span 
                            style={{ 
                              color: 'lightgreen',
                              marginLeft: '5px'
                            }}
                            className="material-icons smoller"
                          >
                            gpp_good
                          </span>
                        }
                      </span>
                      <button
                        className="button"
                        disabled={ 
                          !edit[item.key]?.active
                        }
                        style={{
                          alignSelf: 'flex-end',
                          height: '25px',
                          width: 'auto',
                          marginTop: '-3px',
                        }}
                        onClick={() => { 
                          setTrigger(item.key),
                          setSalt(true),
                          item.type === 'resolver' && salt ? migrate() : ''
                        }}
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
                      <Salt
                        handleModalData={handleModalData}
                        onClose={() => setSalt(false)}
                        show={salt}
                      >
                      </Salt>
                    </div>
                    <input 
                      id={ item.key }
                      key={ item.key }
                      placeholder={ item.value }
                      type='text'
                      defaultValue={ item.value }
                      disabled={ !item.active }
                      style={{ 
                        fontFamily: 'SF Mono',
                        letterSpacing: '-0.5px',
                        fontWeight: '400',
                        fontSize: '14px',
                        width: '100%',
                        wordWrap: 'break-word',
                        textAlign: 'left',
                        marginBottom: '-5px',
                        color: 'rgb(255, 255, 255, 0.6)',
                        cursor: 'copy'
                      }}
                    />
                  </div>
                  <hr style={{ marginTop: '5px' }}></hr>
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
