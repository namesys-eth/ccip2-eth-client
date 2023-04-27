import React from "react"
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import { ethers } from 'ethers'
import { verifyMessage } from 'ethers/lib/utils'
import LoadingIcons from 'react-loading-icons'
import { FaCheck } from 'react-icons/fa'
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

const types = [
	'name',
	'addr',
	'contenthash',
	'avatar',
  'resolver',
	'revision'
] 
const EMPTY_STRING = {};
for (const key of types) {
  if (key !== 'resolver') {
	  EMPTY_STRING[key] = '';
  }
}

const EMPTY_BOOL = {};
for (const key of types) {
  EMPTY_BOOL[key] = key === 'resolver' ? true : false;
}

const EMPTY_HISTORY = {
  name: '',
  addr: '',
  contenthash: '',
  avatar: '',
  revision: '',
  type: ''
}

const Preview = ({ show, onClose, title, chain, children }) => {
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
  const [trigger, setTrigger] = React.useState(null);
  const [help, setHelp] = React.useState('');
  const [keypair, setKeypair] = React.useState<[string, string]>()
  const [getch, setGetch] = React.useState(false);
  const [write, setWrite] = React.useState(false);
  const [states, setStates] = React.useState<any[]>([]);
  const [icon, setIcon] = React.useState('');
  const [color, setColor] = React.useState('');
  const [message, setMessage] = React.useState('Loading Records');
  const [newValues, setNewValues] = React.useState(EMPTY_STRING);
  const [legit, setLegit] = React.useState(EMPTY_BOOL);
  const [modalState, setModalState] = React.useState<MainBodyState>({
    modalData: undefined,
    trigger: false
  });
  const [history, setHistory] = React.useState(EMPTY_HISTORY);

  const { Revision } = Name
  const { data: accountData } = useAccount()
  const recoveredAddress = React.useRef<string>()
  const { data: signature, error, isLoading, signMessage } = useSignMessage({
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
    setModalState(prevState => ({ ...prevState, modalData: data }));
  };
  const handleTrigger = (trigger: boolean) => {
    setModalState(prevState => ({ ...prevState, trigger: trigger }));
  };

  React.useEffect(() => {
    setBrowser(true) 
    if (browser) {
      getResolver()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [browser]);

  React.useEffect(() => {
    if (modalState.trigger) {
      signMessage({ message: statement })
      setKeygen(true)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalState, statement]);

  React.useEffect(() => {
    setLoading(true)
    if (signature) {
      setMessage('Generating IPNS Key')
      const keygen = async () => {
        const __keypair = await ed25519Keygen(title, caip10, signature, modalState.modalData)
        setKeypair(__keypair)
        setMessage('IPNS Key Generated')
      };
      keygen()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keygen, signature, caip10, title]);

  React.useEffect(() => {
    if (keypair) {
      const cidGen = async () => {
        let key = '08011240' + keypair[0] + keypair[1]
        const w3name = await Name.from(ed25519_2.etc.hexToBytes(key))
        const cidIpns = w3name.toString()
        setCid(cidIpns)
        setMessage('IPNS CID Generated')
      }
      cidGen()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keypair]);

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
    if (states.includes('resolver')) {
      if (cid.startsWith('k5')) {
        migrate()
      }
    } else {
      setMessage(message)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cid, states]);

  React.useEffect(() => {
    if (states.length > 1) {
      const _updatedList = list.map((item) => {
        if (item.type !== 'resolver' && states.includes(item.type)) {
          return { 
            ...item, 
            label: 'edit all',
            help: 'set multiple records in one click'
          };
        }
        return item;
      });
      setList(_updatedList)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [states]);
  
  const handleCloseClick = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setLoading(false)
    const _updatedList = list.map((item) => {
      return { 
        ...item,  
        active: false
      };
    })
    setList(_updatedList)
    setStates([])
    setNewValues(EMPTY_STRING)
    setLegit(EMPTY_BOOL)
    onClose();
  };

  function finishQuery(data: React.SetStateAction<any[]> | undefined) {
    if ( data ) { // @TODO: Second condition probably not needed; check later
      setList(data)
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
          getName()
        })
        .catch(() => {
          setAddr('')
          getName()
        });
    } else {
      setAddr('')
      getName()
    }
  }

  // @TODO: getName() routine for both registrars
  async function getName() {
    if ( resolver?.address !== constants.ccip2 ) {
      setName('to-do')
    } else {
      setName('to-do')
    }
    setFinish(true)
  }

  async function getResolver() {
    await provider.getResolver(title)
      .then(response => {
        setResolver(response?.address);
        getContenthash(response!)
      });
  }

  async function writeRevision(revision: Name.Revision) {
    const request = {
      ens: title,
      address: accountData?.address,
      signature: signature,
      revision: Revision.encode(revision)
    }
    try {
      await fetch(
        "https://sshmatrix.club:3003/revision",
        {
          method: "post",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(request)
        })
        .then(response => response.json())
        .then(data => {
          if (data.status) {
            return data.status === 'true'
          } else {
            return false
          }
        })
    } catch(error) {
      console.log('Failed to write Revision to CCIP2 backend')
    }
  }

  function isName(value: string) {
    return value.endsWith('.eth') && value.length <= 32 + 4
  }

  function isAddr(value: string) {
    const hexRegex = /^[0-9a-fA-F]+$/;
    return value.startsWith('0x') && value.length === 40 && hexRegex.test(value.split('0x')[1])
  }

  function isAvatar(value: string) {
    const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    return urlRegex.test(value)
  }

  function isContenthash(value: string) {
    const ipfsRegex = /^[a-z0-9]{62}$/;
    return ipfsRegex.test(value)
  }

  function setValues(key: string, value: string) {
    let __THIS = EMPTY_BOOL
    __THIS['resolver'] = false
    if (key == 'name') {
      __THIS[key] = isName(value)
    } else if (key == 'addr') {
      __THIS[key] = isAddr(value)
    } else if (key == 'avatar') {
      __THIS[key] = isAvatar(value)
    } else if (key == 'contenthash') {
      __THIS[key] = isContenthash(value)
    } else {
      // @CHECKPOINT: should never trigger
      setStates(prevState => [...prevState, key])
      return
    }
    setLegit(__THIS)
    const _THIS = newValues;
    _THIS[key] = value;
    setNewValues(_THIS)
    const priorState = states
    if (!priorState.includes(key) && newValues[key]) {
      setStates(prevState => [...prevState, key])
    } else if (priorState.includes(key) && !newValues[key]) {
      setStates(prevState => prevState.filter(item => item !== key))
    }
    const _updatedList = list.map((item) => {
      if (states.includes(item.type)) {
        return { 
          ...item, 
          editable: true, 
          active: true,
          state: false
        };
      }
      return item;
    });
    setList(_updatedList)
  }

  async function getUpdate() {
    // @TODO: this is for beta testing only; in alpha, 
    // query should be made to the CCIP2 Resolver instead 
    // of CCIP2 backend
    const request = {
      type: 'read',
      ens: title,
      address: accountData?.address,
      recordsTypes: 'all',
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
          let _history = {
            type: data.type,
            name: data.name,
            addr: data.addr,
            avatar: data.avatar,
            contenthash: data.contenthash,
            revision: data.revision
          }
          setHistory(_history)
        })
    } catch(error) {
      console.log('Failed to read from CCIP2 backend')
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
        active: isName(name),
        state: false,
        label: 'edit',
        help: 'set your reverse record'
      },
      {
        key: 1,
        type: 'resolver',
        value: resolver,
        editable: false,
        active: resolver !== constants.ccip2,
        state: false,
        label: 'migrate',
        help: 'please migrate your resolver to enjoy off-chain records'
      },
      {
        key: 2,
        type: 'avatar',
        value: avatar,
        editable: resolver === constants.ccip2,
        active: isAvatar(avatar),
        state: false,
        label: 'edit',
        help: 'set your avatar'
      },
      {
        key: 3,
        type: 'addr',
        value: addr,
        editable: resolver === constants.ccip2,
        active: isAddr(addr),
        state: false,
        label: 'edit',
        help: 'set your default address'
      },
      {
        key: 4,
        type: 'contenthash',
        value: contenthash,
        editable: resolver === constants.ccip2,
        active: isContenthash(contenthash),
        state: false,
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
    const _updatedList = list.map((item) => {
      if (states.includes(item.type) && item.type !== 'resolver') {
        return { 
          ...item, 
          editable: true, 
          active: true 
        };
      } else if (!states.includes(item.type) && item.type === 'resolver') {
        return { 
          ...item, 
          editable: false, 
          active: false
        };
      }
      return item;
    });
    setList(_updatedList)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);

  React.useEffect(() => {
    if (getch) {
      if (modalState.trigger) {
        signMessage({ message: statement })
        setKeygen(true)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalState, getch, statement]);

  React.useEffect(() => {
    const request = {
      signature: signature,
      ens: title,
      address: recoveredAddress.current,
      ipns: cid,
      recordsTypes: states,
      recordsValues: newValues,
      revision: history.revision
    }
    if (write && keypair && cid) {
      console.log(request)
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
              if (keypair) {
                let key = '08011240' + keypair[0] + keypair[1]
                let w3name: Name.WritableName
                const keygen = async () => {
                  w3name = await Name.from(ed25519_2.etc.hexToBytes(key))
                  const pin = async () => {
                    if (data.response.ipfs && w3name) {
                      const toPublish = '/ipfs/' + data.response.ipfs.split('ipfs://')[1]
                      // w3name broadcast
                      let _revision: Name.Revision;
                      let status: boolean
                      if (!history.revision) {
                        _revision = await Name.v0(w3name, toPublish)
                        const _status = await writeRevision(_revision)
                        if (_status !== undefined) {
                          if (_status) {
                            status = _status
                          }
                        }
                      } else {
                        let _revision_ = Revision.decode(new Uint8Array(Buffer.from(history.revision, "utf-8")))
                        _revision = await Name.increment(_revision_, toPublish)
                      }
                      await Name.publish(_revision, w3name.key)
                      setLoading(false)
                      const _updatedList = list.map((item) => {
                        if (item.type !== 'resolver' && data.response.meta[item.type]) {
                          return { 
                            ...item,  
                            value: data.response[item.type],
                            state: true,
                            label: 'edit'
                          };
                        } else {
                          return item
                        }
                      })
                      setList(_updatedList)
                      setNewValues(EMPTY_STRING)
                    }
                  }
                  pin()
                }
                keygen()
              }
            })
        } catch(error) {
          console.log('Failed to write to CCIP2 backend')
        }
      }
      editRecord()
      setWrite(false)
    }

    if (!write) {
      setGetch(false)
    }
  }, [write, states, cid, signature, newValues, title, keypair]);

  React.useEffect(() => {
    if (isMigrateSuccess && txSuccess && pinned) {
      setResolver(constants.ccip2)
      const _updatedList = list.map((item) => {
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
      setList(_updatedList)
      setLegit(EMPTY_BOOL)
      setStates([])
      getResolver()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMigrateSuccess, txSuccess, pinned]);

  React.useEffect(() => {
    if (isMigrateSuccess && txSuccess) {
      const pin = async () => {
        console.log('Migration Successful')
        setPinned(true)
      }
      pin()
    }
  }, [isMigrateSuccess, txSuccess]);

  React.useEffect(() => {
    if (isMigrateLoading) {
      setFinish(false)
      setMessage('Waiting for Confirmation')
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
                flexDirection: 'column',
                marginTop: '50px',
                marginBottom: '200px'
              }}
            >
              <LoadingIcons.Bars />
              <div
                style={{
                  marginTop: '40px'
                }}
              >
                <span 
                  style={{
                    color: 'white',
                    fontSize: '18px'
                  }}
                >
                  { message }
                </span>
              </div>
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
                        { item.type }
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
                        { item.state &&
                          <div 
                            className="material-icons smol"
                            style={{ 
                              color: 'lightgreen'
                            }}
                          >
                            task_alt
                          </div>
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
                              setHelp(item.help)
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
                          !list[item.key].active ||
                          !legit[item.type] ||
                          item.state
                        }
                        style={{
                          alignSelf: 'flex-end',
                          height: '25px',
                          width: 'auto',
                          marginTop: '-3px',
                        }}
                        onClick={() => { 
                          setTrigger(item.key),
                          setMessage('Waiting for Signature'),
                          item.type === 'resolver' ? setSalt(true) : setGetch(true),
                          item.type === 'resolver' ? setWrite(false) : setWrite(true),
                          item.type === 'resolver' ? setStates(prevState => [...prevState, item.type]) : setStates(states)
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
                        !item.editable
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
