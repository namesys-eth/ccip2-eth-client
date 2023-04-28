import React from "react"
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import { ethers } from 'ethers'
import Web3 from 'web3'
import { AbiItem } from 'web3-utils'
import { verifyMessage } from 'ethers/lib/utils'
import LoadingIcons from 'react-loading-icons'
import { BiError } from 'react-icons/bi'
import Help from '../components/Help'
import Salt from '../components/Salt'
import Gas from '../components/Gas'
import Success from '../components/Success'
import Record from '../components/Record'
import {
  useAccount,
  useFeeData,
  useContractWrite,
  useSignMessage,
  useWaitForTransaction
} from 'wagmi'
/*
import {
  usePrepareContractWrite
} from 'wagmi2'
*/
import * as constants from '../utils/constants'
import { ed25519Keygen } from '../utils/keygen'
import * as Name from 'w3name'
import * as ed25519_2 from 'ed25519-2.0.0'

interface MainBodyState {
  modalData: string | undefined;
  trigger: boolean;
}

/// @dev : constants
const forbidden = [
  'resolver',
  'name'
]

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
  EMPTY_BOOL[key] = ['resolver'].includes(key) ? true : false;
}

const EMPTY_HISTORY = {
  name: '',
  addr: '',
  contenthash: '',
  avatar: '',
  revision: '',
  type: ''
}

/// @dev : library
function checkImageURL(url: string) {
  return new Promise(function(resolve, reject) {
    var img = new Image();
    img.onload = function() {
      resolve(true);
    };
    img.onerror = function() {
      reject(false);
    };
    img.src = url;
  });
}

const Preview = ({ show, onClose, _ENS_, chain, children }) => {
  const [browser, setBrowser] = React.useState(false);
  const { data: gasData, isError } = useFeeData()
  const [loading, setLoading] = React.useState(true);
  const [pinned, setPinned] = React.useState(false);
  const [keygen, setKeygen] = React.useState(false);
  const [fatal, setFatal] = React.useState(false);
  const [cid, setCid] = React.useState('');
  const [helpModal, setHelpModal] = React.useState(false)
  const [successModal, setSuccessModal] = React.useState(false)
  const [gasModal, setGasModal] = React.useState(false);
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
  const [success, setSuccess] = React.useState('');
  const [gas, setGas] = React.useState<{}>({});
  const [keypair, setKeypair] = React.useState<[string, string]>()
  const [getch, setGetch] = React.useState(false);
  const [write, setWrite] = React.useState(false);
  const [states, setStates] = React.useState<any[]>([]);
  const [icon, setIcon] = React.useState('');
  const [color, setColor] = React.useState('');
  const [message, setMessage] = React.useState('Loading Records');
  const [newValues, setNewValues] = React.useState(EMPTY_STRING);
  const [legit, setLegit] = React.useState(EMPTY_BOOL);
  const [imageLoaded, setImageLoaded] = React.useState<boolean | undefined>(undefined);
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
  const alchemyEndpoint = 'https://eth-goerli.g.alchemy.com/v2/' + apiKey
  const web3 = new Web3(alchemyEndpoint);
  let caip10 = `eip155:${chain}:${accountData?.address}`
  let statement = `Requesting signature for IPNS key generation\n\nUSERNAME: ${_ENS_}\nSIGNED BY: ${caip10}`
      
  const handleModalData = (data: string | undefined) => {
    setModalState(prevState => ({ ...prevState, modalData: data }));
  };
  const handleTrigger = (trigger: boolean) => {
    setModalState(prevState => ({ ...prevState, trigger: trigger }));
  };

  React.useEffect(() => {
    checkImageURL(avatar)
      .then(() => setImageLoaded(true))
      .catch(() => setImageLoaded(false));
  }, [avatar]);

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
        const __keypair = await ed25519Keygen(_ENS_, caip10, signature, modalState.modalData)
        setKeypair(__keypair)
        setMessage('IPNS Key Generated')
      };
      keygen()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keygen, signature, caip10, _ENS_]);

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
        ethers.utils.namehash(_ENS_), 
        constants.ccip2
      ]
    }
  );


  /*
  async function getGas(key: string, value: string) {
    const { 
      config: config, 
      error: _error 
    } = usePrepareContractWrite(
      {
        address: `0x${constants.ensConfig[2].addressOrName.substring(2)}`,
        abi: constants.ensConfig[2].contractInterface,
        functionName: 'setText',
        args: [ethers.utils.namehash(_ENS_), key, value]
      }
    )
    return {
      config,
       _error
    }
  }
  */

  async function getGas(key: string, value: string) {
    const getGasAmountForContractCall = async () => {
      const contract = new web3.eth.Contract(
        constants.ensConfig[2].contractInterface as AbiItem[], 
        constants.ensConfig[2].addressOrName
      );
      let gasAmount = await contract.methods.setText(ethers.utils.namehash(_ENS_), key, value).estimateGas({ from: accountData?.address });
      return gasAmount
    }
    const gas = await getGasAmountForContractCall()
    return gas
  }
    
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
      await provider.getAvatar(_ENS_)
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
      await provider.resolveName(_ENS_)
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
      setName(_ENS_)
    } else {
      setName(_ENS_)
    }
    setFinish(true)
  }

  async function getResolver() {
    await provider.getResolver(_ENS_)
      .then(response => {
        setResolver(response?.address);
        getContenthash(response!)
      });
  }

  async function writeRevision(revision: Name.Revision) {
    const request = {
      ens: _ENS_,
      address: accountData?.address,
      signature: signature,
      revision: Revision.encode(revision),
      chain: chain
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
    if (key === 'name') {
      //__THIS[key] = isName(value)
      __THIS[key] = false
    } else if (key === 'addr') {
      __THIS[key] = isAddr(value)
    } else if (key === 'avatar') {
      __THIS[key] = isAvatar(value)
    } else if (key === 'contenthash') {
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
      ens: _ENS_,
      address: accountData?.address,
      recordsTypes: 'all',
      recordsValues: 'all',
      chain: chain
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
        editable: false,
        active: false,
        state: false,
        label: 'edit',
        help: 'off-chain reverse record feature not available'
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

  const { isSuccess: txSuccess, isError: txError, isLoading: txLoading } = useWaitForTransaction({
    hash: response?.hash,
  });

  React.useEffect(() => {
    const _updatedList = list.map((item) => {
      if (states.includes(item.type) && !forbidden.includes(item.type)) {
        return { 
          ...item, 
          editable: true, 
          active: true 
        };
      } else if (!states.includes(item.type) && ['resolver'].includes(item.type)) {
        return { 
          ...item, 
          editable: false, 
          active: false
        };
      } else if (['name'].includes(item.type)) {
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
      ens: _ENS_,
      address: recoveredAddress.current,
      ipns: cid,
      recordsTypes: states,
      recordsValues: newValues,
      revision: history.revision,
      chain: chain
    }
    if (write && keypair && cid && signature) {
      //console.log(request)
      setMessage('Writing Records')
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
              setMessage('Publishing to IPNS')
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
                      let gas = {}
                      list.map(async (item) => {
                        if (item.type !== 'resolver' && data.response.meta[item.type]) {
                          const _gas = getGas(item.type, data.response[item.type])
                          const _promise = async () => {
                            await Promise.all([_gas])
                          }
                          await _promise()
                          _gas.then((value) => {
                            gas[item.type] = value * gasData?.gasPrice!?.toNumber() * 0.000000001 * 0.000000001
                          })
                          if (item.type === 'avatar') {
                            setAvatar(data.response.avatar)
                          }
                        }
                      })
                      if (gas) {
                        setGas(gas)
                        setTimeout(() => {
                          setGasModal(true)
                          setLoading(false)
                          setCid('')
                          setKeypair(undefined)
                          states.map((_state) => {
                            setStates(prevState => prevState.filter(item => item !== _state))
                          })
                        }, 2000);
                      }
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
  }, [write, states, cid, signature, newValues, _ENS_, keypair]);

  React.useEffect(() => {
    if (isMigrateSuccess && txSuccess && pinned) {
      setResolver(constants.ccip2)
      const _updatedList = list.map((item) => {
        if (forbidden.includes(item.type)) {
          return { 
            ...item, 
            editable: false, 
            active: false
          };
        } else {
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
      setSuccess('Resolver Migration Successful')
      setIcon('check_circle_outline')
      setColor('lightgreen')
      setSuccessModal(true)
      setCid('')
      setKeypair(undefined)
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

  React.useEffect(() => {
    if (txLoading && !txError) {
      setMessage('Waiting for Transaction')
    }
    if (txError && !txLoading) {
      setMessage('Transaction Failed')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [txLoading, txError]);

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
        {_ENS_ && loading && 
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
        {_ENS_ && avatar && imageLoaded && !loading && list.length > 0 &&
          <StyledModalTitle>
            <img 
              // @TODO: async wait for resolution across multiple public gateways 
              //src={ avatar.replace('ipfs.io','pinata.cloud') } 
              src={ avatar }
              width={ '100px' }
              alt={ _ENS_ }
              onError={() => setImageLoaded(false)}
            />
          </StyledModalTitle>
        }
        {_ENS_ && (!avatar || !imageLoaded) && !loading && list.length > 0 &&
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
        {loading && !fatal && 
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
        {loading && fatal && 
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
              <BiError />
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
                  <div id="modal-inner">
                    <Help
                      color={ color }
                      _ENS_={ icon }
                      onClose={() => setHelpModal(false)}
                      show={helpModal}
                    >
                      <span>{ help }</span>
                    </Help>
                    <Success
                      color={ color }
                      _ENS_={ icon }
                      onClose={() => setSuccessModal(false)}
                      show={successModal}
                    >
                      <span>{ success }</span>
                    </Success>
                  </div>
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
                              setHelpModal(true),
                              setIcon('info'),
                              setColor(['name'].includes(item.type) ? 'rgb(255, 255, 255, 0.60)' : 'skyblue'),
                              setHelp(item.help)
                            }}
                          >
                            <div 
                              className="material-icons smol"
                              style={{ 
                                color: ['name'].includes(item.type) ? 'rgb(255, 255, 255, 0.60)' : 'skyblue'
                              }}
                            >
                              info_outline
                            </div>
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
                        { ['resolver'].includes(item.type) && resolver === constants.ccip2  &&
                          <button 
                            className="button-tiny"
                            onClick={() => { 
                              setHelpModal(true),
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
                        { ['resolver'].includes(item.type) && resolver !== constants.ccip2  &&
                          <button 
                            className="button-tiny"
                            onClick={() => { 
                              setHelpModal(true),
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
                          ['resolver'].includes(item.type) ? setSalt(true) : setGetch(true),
                          ['resolver'].includes(item.type) ? setWrite(false) : setWrite(true),
                          ['resolver'].includes(item.type) ? setStates(prevState => [...prevState, item.type]) : setStates(states)
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
                    </div>
                    <input 
                      id={ item.key }
                      key={ item.key }
                      placeholder={ item.value }
                      type='text'
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
                        color: ['resolver'].includes(item.type) ? 'skyblue' : (
                          ['name'].includes(item.type) ? 'rgb(255, 255, 255, 0.60)' : 'rgb(255, 255, 255, 0.75)'
                          ),
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
            <div id="modal-inner">
              <Gas
                color={ 'lightgreen' }
                _ENS_={ 'check_circle_outline' }
                onClose={() => setGasModal(false)}
                show={gasModal}
              >
                { gas }
              </Gas>
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
