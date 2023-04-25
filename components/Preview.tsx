import React from "react"
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import { ethers } from 'ethers'
import { verifyMessage } from 'ethers/lib/utils'
import LoadingIcons from 'react-loading-icons'
import Modal from '../components/Modal'
import Salt from '../components/Salt'
import Record from '../components/Record'
import {
  useAccount,
  useFeeData,
  useContractWrite,
  useSignMessage,
  useWaitForTransaction
} from 'wagmi'
import * as constants from '../utils/constants'
import { ed25519Keygen } from '../utils/keygen'
import * as Name from 'w3name'
import * as ed25519_2 from 'ed25519-2.0.0'

interface MainBodyState {
  modalData: string | undefined;
  trigger: boolean;
}

const Preview = ({ show, onClose, title, chain, children }) => {
  const [state, setState] = React.useState<MainBodyState>({
    modalData: undefined,
    trigger: false
  });
  const [browser, setBrowser] = React.useState(false);
  const { data: gasData, isError } = useFeeData()
  const [loading, setLoading] = React.useState(true);
  const [pinned, setPinned] = React.useState(false);
  const [keygen, setKeygen] = React.useState(false);
  const [cid, setCid] = React.useState('');
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
  const [keypair, setKeypair] = React.useState<[string, string]>()
  const [getch, setGetch] = React.useState(false);
  const [write, setWrite] = React.useState(false);
  const [action, setAction] = React.useState('');
  const [icon, setIcon] = React.useState('');
  const [color, setColor] = React.useState('');
  const [newValue, setNewValue] = React.useState({
    name: '',
    addr: '',
    avatar: '', 
    contenthash: ''
  });
  const [server, setServer] = React.useState({
    type: '',
    name: '',
    addr: '',
    avatar: '', 
    contenthash: ''
  });
  const [duplicate, setDuplicate] = React.useState({
    name: false,
    addr: false,
    avatar: false, 
    contenthash: false
  });
  const [content, setContent] = React.useState({
    name: '',
    addr: '',
    avatar: '', 
    contenthash: ''
  });


  const { data: accountData } = useAccount()
  const recoveredAddress = React.useRef<string>()
  const { data, error, isLoading, signMessage } = useSignMessage({
    onSuccess(data, variables) {
      // Verify signature when sign message succeeds
      const address = verifyMessage(variables.message, data)
      recoveredAddress.current = address
    },
  })

  const apiKey = process.env.NEXT_PUBLIC_ALCHEMY_ID
  const network = process.env.NEXT_PUBLIC_NETWORK === 'goerli' ? 'goerli' : 'homestead'
  const provider = new ethers.providers.AlchemyProvider(network, apiKey);
  let caip10 = `eip155:${chain}:${accountData?.address}`
  let statement = `Requesting signature for IPNS key generation\n\nUSERNAME: ${title}\nSIGNED BY: ${caip10}`
      
  const handleModalData = (data: string | undefined) => {
    setState({ ...state, modalData: data });
  };
  const handleTrigger = (trigger: boolean) => {
    setState({ ...state, trigger: trigger });
  };

  React.useEffect(() => {
    setBrowser(true) 
    getResolver()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (state.trigger) {
      signMessage({ message: statement })
      setKeygen(true)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, statement]);

  React.useEffect(() => {
    if (data) {
      const keygen = async () => {
        const __keypair = await ed25519Keygen(title, caip10, data, state.modalData)
        setKeypair(__keypair)
      };
      keygen()
    }
  }, [keygen, data, caip10, state.modalData, title]);

  React.useEffect(() => {
    if (keypair) {
      const cidGen = async () => {
        let key = '08011240' + keypair[0] + keypair[1]
        const w3Name = await Name.from(ed25519_2.etc.hexToBytes(key))
        const cidIpns = w3Name.toString()
        setCid(cidIpns)
        setWrite(true)
      }
      cidGen()
    }
  }, [keypair, cid]);

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

  React.useEffect(() => {
    if (action === 'resolver') {
        if (cid.startsWith('k5')) {
          migrate()
        }
    } else {
      /* do nothing */
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cid, action]);
  
  const handleCloseClick = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    onClose();
  };

  function finishQuery(data: React.SetStateAction<any[]> | undefined) {
    if ( data ) { // @TODO: Second condition probably not needed; check later
      setList(data)
      setEdit(data)
      setLoading(false)
    }
  }

  async function getContenthash(resolver: ethers.providers.Resolver | null) {
    if ( resolver?.address !== constants.ccip2 ) {
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
    await provider.getResolver(title)
      .then(response => {
        setResolver(response?.address);
        getContenthash(response!)
      });
  }

  function setValues(key: string, value: string) {
    const _array = newValue;
    _array[key] = value;
    setNewValue(_array)
    const updatedList = edit.map((item) => {
      if (item.type === key) {
        return { 
          ...item, 
          editable: true, 
          active: true 
        };
      }
      return item;
    });
    setEdit(updatedList)
  }

  async function getUpdate() {
    // @TODO: this is for beta testing only; in alpha, 
    // query should be made to the CCIP2 Resolver instead 
    // of CCIP2 backend
    const request = {
      type: 'read',
      ens: title,
      address: accountData?.address,
      recordType: 'all',
      recordsValues: 'all'
    }
    try{
      await fetch(
        "https://sshmatrix.club:3003/read",
        {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(request)
        })
        .then(response => response.json())
        .then(data => {
          console.log(data)
        })
    } catch(error) {
      console.log('Failed to read from CCIP2 backend; making fake data for tests')
    }
  }

  React.useEffect(() => {
    if (finish) {
      getUpdate()
      setMetadata()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finish]);

  function setMetadata() {
    let data = [
      {
        key: 0,
        type: 'name',
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
        active: resolver !== constants.ccip2 && salt === false,
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
        type: 'addr',
        value: addr,
        editable: resolver === constants.ccip2,
        active: resolver === constants.ccip2,
        action: 'setAddr',
        label: 'edit',
        help: 'set default address'
      },
      {
        key: 4,
        type: 'contenthash',
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
          active: false
        };
      }
      return item;
    });
    setEdit(updatedList)
  }, [trigger, list]);

  React.useEffect(() => {
    if (getch) {
      if (state.trigger) {
        signMessage({ message: statement })
        setKeygen(true)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, getch, statement]);

  React.useEffect(() => {
    const request = {
      signature: data,
      ens: title,
      address: recoveredAddress.current,
      ipns: cid,
      recordType: action,
      recordsValues: newValue
    }
    if (write) {
      setLoading(true)
      const editRecord = async () => {
        try {
          await fetch(
            "https://sshmatrix.club:3003/write",
            {
              method: "post",
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(request)
            })
            .then(response => response.json())
            .then(data => {
              console.log(data)
              setLoading(false)
              setContent(data)
            })
        } catch(error) {
          console.log('Failed to write to CCIP2 backend; making fake data for tests')
        }
      }
      editRecord()
      setWrite(false)
    }
  }, [write, action, cid, data, newValue, title]);

  React.useEffect(() => {
    if (isMigrateSuccess && txSuccess && pinned) {
      setAvatar('')
      setContenthash('')
      setAddr('')
      setResolver(constants.ccip2)
      setEdit(list)
      const updatedList = list.map((item) => {
        if (item.type === 'resolver') {
          return { 
            ...item, 
            editable: false, 
            active: false
          };
        } else if (item.type !== 'resolver') {
          return { 
            ...item, 
            value: '',
            editable: true, 
            active: true 
          };
        }
        return item;
      });
      setEdit(updatedList)
      setDuplicate({
        name: false,
        addr: false,
        contenthash: false,
        avatar: false
      })
      setList(updatedList)
      setLoading(false)
    }
  }, [isMigrateSuccess, txSuccess, pinned, list]);

  React.useEffect(() => {
    if (isMigrateSuccess && txSuccess) {
      const pin = async () => {
        const key_ = await Name.create()
        const name = await Name.from(key_.key.bytes)
        console.log('Migration Successful')
        setPinned(true)
      }
      pin()
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
              alt={ title }
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
                    color={ color }
                    title={ icon }
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
                        { item.type !== 'resolver' &&
                          <button 
                            className="button-tiny"
                            onClick={() => { 
                              setModal(true),
                              setIcon('info'),
                              setColor('skyblue'),
                              setHelp(item.help)
                            }}
                          >
                            <div className="material-icons smol">info_outline</div>
                          </button>
                        }
                        { item.type === 'resolver' && resolver === constants.ccip2  &&
                          <button 
                            className="button-tiny"
                            onClick={() => { 
                              setModal(true),
                              setIcon('gpp_good'),
                              setColor('lightgreen'),
                              setHelp('Resolver is migrated')
                            }}
                          >
                            <div 
                              className="material-icons smol"
                              style={{
                                color: 'lightgreen',
                                marginLeft: '5px'
                              }}
                            >
                              gpp_good
                            </div>
                          </button>
                        }
                        { item.type === 'resolver' && resolver !== constants.ccip2  &&
                          <button 
                            className="button-tiny"
                            onClick={() => { 
                              setModal(true),
                              setIcon('gpp_maybe'),
                              setColor('orange'),
                              setHelp('Resolver is not migrated')
                            }}
                          >
                            <div 
                              className="material-icons smol"
                              style={{
                                color: 'orange',
                                marginLeft: '5px'
                              }}
                            >
                              gpp_maybe
                            </div>
                          </button>
                        }
                      </span>
                      <button
                        className="button"
                        disabled={ 
                          !edit[item.key]?.active || 
                          (
                            item.type !== 'resolver' && !newValue[item.type]
                          )
                        }
                        style={{
                          alignSelf: 'flex-end',
                          height: '25px',
                          width: 'auto',
                          marginTop: '-3px',
                        }}
                        onClick={() => { 
                          setTrigger(item.key),
                          setAction(item.type),
                          item.type === 'resolver' ? setSalt(true) : setGetch(true)
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
                        handleTrigger={handleTrigger}
                        handleModalData={handleModalData}
                        onClose={() => setSalt(false)}
                        show={salt}
                      >
                      </Salt>
                      <Record
                        handleTrigger={handleTrigger}
                        handleModalData={handleModalData}
                        onClose={() => setGetch(false)}
                        show={getch}
                      >
                      </Record>
                    </div>
                    <input 
                      id={ item.key }
                      key={ item.key }
                      placeholder={ item.value }
                      type='text'
                      defaultValue={ item.value }
                      disabled={ 
                        !item.active || 
                        duplicate[item.type] 
                      }
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
                      onChange={(e) => {
                        setValues(item.type, e.target.value)
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
