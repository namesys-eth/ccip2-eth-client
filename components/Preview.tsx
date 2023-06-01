/// ENS Domain Preview Modal
import React from "react"
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import { ethers } from 'ethers'
import Web3 from 'web3'
import { AbiItem } from 'web3-utils'
import { verifyMessage } from 'ethers/lib/utils'
//import LoadingIcons from 'react-loading-icons'
import { BiError } from 'react-icons/bi'
import Help from '../components/Help'
import Salt from '../components/Salt'
import Gas from '../components/Gas'
import Loading from '../components/Loading'
import Success from '../components/Success'
import Record from '../components/Record'
import * as constants from '../utils/constants'
import { _KEYGEN } from '../utils/keygen'
import * as Name from 'w3name'
import * as ed25519_2 from 'ed25519-2.0.0' // @noble/ed25519 v2.0.0
import * as ensHash from '@ensdomains/content-hash'
import {
  useAccount,
  useFeeData,
  useContractWrite,
  useSignMessage,
  useWaitForTransaction,
  useContractRead
} from 'wagmi' // Legacy Wagmi 1.6
/* →
import {
  usePrepareContractWrite
} from 'wagmi2' // New Wagmi 2.0.0
*/ 

// State to pass back to homepage
interface MainBodyState {
  modalData: string | undefined;
  trigger: boolean;
}

// Modal data to pass back to homepage
interface ModalProps {
  _ENS_: string,
  chain: string,
  show: boolean;
  onClose: any;
  handleParentModalData: (data: boolean) => void;
  handleParentTrigger: (data: boolean) => void;
}

/// Init 
// Types object with empty strings
function EMPTY_STRING() {
  const EMPTY_STRING = {};
  for (const key of constants.types) {
    if (key !== 'resolver') {
      EMPTY_STRING[key] = '';
    }
  }
  return EMPTY_STRING
}

// Types object with empty bools
function EMPTY_BOOL() {
  const EMPTY_BOOL = {};
  for (const key of constants.types) {
    EMPTY_BOOL[key] = ['resolver'].includes(key) ? true : false;
  }
  return EMPTY_BOOL
}

// History object with empty strings
const EMPTY_HISTORY = {
  name: '',
  addr: '',
  contenthash: '',
  avatar: '',
  revision: '',
  type: ''
}

/// Library
// Check if image URL resolves
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

// Returns ed25519/IPNS keypair formatted for sure
function formatkey(keypair: [[string, string], [string, string]]) {
  return '08011240' + keypair[0][0] + keypair[0][1] // ed25519 keypair = keypair[0]
}

// Encode ENS contenthash
function encodeContenthash(contenthash: string) {
  const matched = contenthash.match(/^(ipfs|sia|ipns|bzz|onion|onion3|arweave):\/\/(.*)/)
    || contenthash.match(/\/(ipfs)\/(.*)/)  
    || contenthash.match(/\/(ipns)\/(.*)/)
    if (matched) {
      const contentType = matched[1]
      const content = matched![2]
      const ensContentHash = ensHash.contentHash.encode(`${contentType}-ns`, content)
      return ensContentHash
    }
    return ''
}

/// Preview Modal
// @input show : Show modal trigger
// @input onClose : Close modal trigger
// @input _ENS_ : Native ENS domain for modal
// @input chain : Chain ID
// @interface handleParentModalData : Send modal data to Homepage
// @interface handleParentTrigger : Send modal state to Homepage
const Preview: React.FC<ModalProps> = ({ show, onClose, _ENS_, chain, handleParentModalData, handleParentTrigger }) => {
  const [browser, setBrowser] = React.useState(false); // Triggers at modal load
  const { data: gasData, isError } = useFeeData(); // Current gas prices
  const [loading, setLoading] = React.useState(true); // Loading process indicator
  const [migration, setMigration] = React.useState(false); // Setup indicator; Setup = Resolver migration + Recordhash setting
  const [keygen, setKeygen] = React.useState(false); // IPNS keygen trigger following signature
  const [crash, setCrash] = React.useState(false);  // Signature fail indicator
  const [CID, setCID] = React.useState(''); // IPNS pubkey/CID value
  const [helpModal, setHelpModal] = React.useState(false); // Help modal trigger
  const [successModal, setSuccessModal] = React.useState(false); // Success modal trigger
  const [gasModal, setGasModal] = React.useState(false); // Gas savings modal trigger
  const [finish, setFinish] = React.useState(false); // Indicates when all records have finished fetching
  const [resolver, setResolver] = React.useState<any>(); // Resolver for ENS Domain
  const [addr, setAddr] = React.useState(''); // Addr record for ENS Domain
  //const [addr60, setAddr60] = React.useState('');
  const [avatar, setAvatar] = React.useState(''); // Avatar record for ENS Domain
  const [tokenID, setTokenID] = React.useState(''); // Token ID of ENS Domain
  const [manager, setManager] = React.useState(''); // Manager of ENS Domain
  const [contenthash, setContenthash] = React.useState(''); // Contenthash record for ENS Domain
  const [name, setName] = React.useState(''); // Name record (Reverse Record) for ENS Domain
  const [salt, setSalt] = React.useState(false); // Salt (password/key-identifier) for IPNS keygen
  const [list, setList] = React.useState<any[]>([]); // Internal LIST[] object with all record keys and values
  const [trigger, setTrigger] = React.useState(null); // Triggered upon button click adjacent to the record in Preview modal
  const [help, setHelp] = React.useState(''); // Sets help text for the Help modal
  const [success, setSuccess] = React.useState(''); // Sets success text for the Success modal
  const [gas, setGas] = React.useState<{}>({}); // Sets historical gas savings
  const [keypair, setKeypair] = React.useState<[[string, string], [string, string]]>(); // Sets generated K0 and K2 keys
  const [getch, setGetch] = React.useState(false); // Triggers signature for record update
  const [write, setWrite] = React.useState(false); // Triggers update of record to the NameSys backend and IPNS
  const [states, setStates] = React.useState<any[]>([]); // Contains keys of active records (that have been edited in the modal)
  const [newValues, setNewValues] = React.useState(EMPTY_STRING()); // Contains new values for the active records in {a:b} format
  const [icon, setIcon] = React.useState(''); // Sets icon for the loading state
  const [color, setColor] = React.useState(''); // Sets color for the loading state
  const [message, setMessage] = React.useState('Loading Records'); // Sets message for the loading state
  
  const [legit, setLegit] = React.useState(EMPTY_BOOL()); // Whether record edit is legitimate
  const [imageLoaded, setImageLoaded] = React.useState<boolean | undefined>(undefined); // Whether avatar resolves or not
  const [modalState, setModalState] = React.useState<MainBodyState>({
    modalData: undefined,
    trigger: false
  }); // Child modal state
  const [history, setHistory] = React.useState(EMPTY_HISTORY); // Record history from last update
  const [sigIPNS, setSigIPNS] = React.useState(''); // Signature S1(K1) for IPNS keygen
  const [sigRecord, setSigRecord] = React.useState(''); // Signature S2(K0) for Record update
  const [sigApproved, setApproved] = React.useState(''); // Signature S3(K1) for Records Manager

  const { Revision } = Name // W3Name Revision object
  const { data: accountData } = useAccount()
  const recoveredAddress = React.useRef<string>()
  const { 
    data: signature, 
    error: signError, 
    isLoading: signLoading, 
    signMessage 
  } = useSignMessage({
    onSuccess(data, variables) {
      const address = verifyMessage(variables.message, data)
      recoveredAddress.current = address
    },
  })  // Wagmi Signature hook

  const apiKey = process.env.NEXT_PUBLIC_ALCHEMY_ID
  const network = process.env.NEXT_PUBLIC_NETWORK === 'goerli' ? 'goerli' : 'homestead'
  const provider = new ethers.providers.AlchemyProvider(network, apiKey);
  const alchemyEndpoint = 'https://eth-goerli.g.alchemy.com/v2/' + apiKey
  const web3 = new Web3(alchemyEndpoint);
  let caip10 = `eip155:${chain}:${accountData?.address}`  // CAIP-10
  let labelhash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(_ENS_.split('.eth')[0]))
  let token = ethers.BigNumber.from(labelhash)
  const zeroAddress = '0x' + '0'.repeat(40)

  // Initialises internal LIST[] object
  function setMetadata() {
    let _LIST = [
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
        help: 'please migrate resolver to enjoy off-chain records'
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
    finishQuery(_LIST)
  }

  // Signature S1 statement; S1(K1)
  function statementIPNSKey() {
    return `Requesting Signature For IPNS Key Generation\n\nUsername: ${_ENS_}\nSigned By: ${caip10}`
  }
  // Signature S2 statement; S2(K0)
  function statementRecords(recordType: string, extradata: string) {
    return `Requesting Signature To Update Off-Chain ENS Record\n\nENS Domain: ${_ENS_}\nRecord Type: ${recordType}\nExtradata: ${extradata}\nSigned By: ${caip10}`
  }

  // Signature S3 statement; S3(K1)
  function statementManager(manageFor: string) {
    return `Requesting Signature To Approve Off-Chain ENS Records Manager Key\n\nENS Domain: ${_ENS_}\nApproved For: ${manageFor}\nSigned By: ${caip10}`
  }

  // Generate Record Type suffix
  function genRecordType(_recordType: string) {
    // return suffixes of filenames
    return constants.files[constants.types.indexOf(_recordType)]
  }

  // Generate extradata
  function genExtradata(_recordType: string) {
    // TODO : Add extradata routine
    // return bytesToHexString(abi.encodePacked(keccak256(result)))
    return '0x0'
  }

  // Signature S2 with K0
  async function _signMessage(input: any) {
    if (keypair) {
      const SignS2 = async () => {
        const _signer = new ethers.Wallet('0x' + keypair[1][0], provider)
        const __signature = await _signer.signMessage(input.message) 
        if (__signature) return __signature
      }
      const _signature = SignS2() 
      return _signature
    }
  }
      
  // Handle secondary modal data return
  const handleModalData = (data: string | undefined) => {
    setModalState(prevState => ({ ...prevState, modalData: data }));
  };
  // Handle secondary modal trigger
  const handleTrigger = (trigger: boolean) => {
    setModalState(prevState => ({ ...prevState, trigger: trigger }));
  };

  /// Preview Domain Metadata
  // Read ENS Registry for ENS domain Controller
  const { data: controller } = useContractRead(
    constants.ensConfig[1],
    'getApproved',
    {
      args: [
        tokenID
      ]
    }
  )
  // Read ENS Registry for ENS domain Owner
  const { data: owner } = useContractRead(
    constants.ensConfig[1],
    'ownerOf',
    {
      args: [
        tokenID
      ]
    }
  )

  // Send data to Homepage and trigger update
  const handleSuccess = () => {
    handleParentModalData(true);
    handleParentTrigger(true);
  };

  // Handles loading of avatar
  React.useEffect(() => {
    checkImageURL(avatar)
      .then(() => setImageLoaded(true))
      .catch(() => setImageLoaded(false));
  }, [avatar]);

  // Triggers upon Preview load and attempts to get Resolver for ENS domain
  React.useEffect(() => {
    setBrowser(true) 
    if (browser) {
      setTokenID(token.toString())
      getResolver()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [browser]);
 
  // Triggers S1(K1) after password is set
  React.useEffect(() => {
    if (modalState.trigger && !getch) {
      signMessage({ message: statementIPNSKey() })
      setKeygen(true)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalState]);

  // Triggers S1(K1) after password is set
  React.useEffect(() => {
    setLoading(true)
    if (sigIPNS && !keypair) {
      setMessage('Generating IPNS Key')
      const keygen = async () => {
        const __keypair = await _KEYGEN(_ENS_, caip10, sigIPNS, modalState.modalData)
        setKeypair(__keypair)
        setMessage('IPNS Key Generated')
      };
      keygen()
    } else {
      setMessage('IPNS Key/CID Exists')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keygen, sigIPNS, caip10, _ENS_]);

  // Triggers IPNS CID derivation with new S1(K1)
  React.useEffect(() => {
    if (keypair) {
      const CIDGen = async () => {
        let key = formatkey(keypair)
        const w3name = await Name.from(ed25519_2.etc.hexToBytes(key))
        const CID_IPNS = w3name.toString()
        setCID(CID_IPNS)
        setMessage('IPNS CID Generated')
      }
      CIDGen()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keypair]);

  // Sets in-app ENS domain manager
  // TODO: Extend to Wrapper
  React.useEffect(() => {
    if (controller && controller?.toString() !== zeroAddress) {
      setManager(controller.toString())
    } else if (owner && controller?.toString() === zeroAddress) {
      setManager(owner.toString())
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenID, controller, owner])

  // Sets signature from Wagmi signMessage() as S1(K1)
  React.useEffect(() => {
    if (signature) {
      setSigIPNS(signature)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature])

  // Sets new ENS Resolver
  // TODO: Extend to Wrapper
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

  // Sets Recordhash in CCIP2 Resolver
  const {
    data: response_,
    write: setRecordhash,
    isLoading: isSetRecordhashLoading_,
    isSuccess: isSetRecordhashSuccess_,
  } = useContractWrite(
    constants.ccip2Config[0],
    'setRecordhash',
    {
      args: [
        ethers.utils.namehash(_ENS_), 
        encodeContenthash(CID)
      ]
    }
  );


  /* → 
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

  // Get gas cost estimate for hypothetical on-chain record update
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
  
  // Triggers Resolver migration after IPNS CID is generated and validated 
  React.useEffect(() => {
    if (states.includes('resolver')) {
      if (CID.startsWith('k5')) {
        migrate()
      }
    } else {
      setMessage(message)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [CID, states]);

  // Handles single vs. mulitple record updates
  React.useEffect(() => {
    if (states.length > 1) {
      const _updatedList = list.map((item) => {
        if (item.type !== 'resolver' && 
          states.includes(item.type) 
        ) 
        {
          return { 
            ...item, 
            label: 'edit all',
            help: 'set multiple records in one click'
          };
        } else {
          return { 
            ...item, 
            label: item.type !== 'resolver' ? 'edit' : 'migrate'
          };
        }
      });
      setList(_updatedList)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [states]);

  // Handle Preview modal close
  const handleCloseClick = (e: { preventDefault: () => void; }) => {
    setLegit(EMPTY_BOOL())
    setLoading(false)
    const _updatedList = list.map((item) => {
      return { 
        ...item,  
        active: resolver !== constants.ccip2
      };
    })
    setList(_updatedList)
    setStates([])
    setCID('')
    setKeypair(undefined) // Purge keypairs from local storage 
    setNewValues(EMPTY_STRING())
    e.preventDefault();
    onClose();
  };

  // Finish query for ENS domain records
  function finishQuery(data: React.SetStateAction<any[]> | undefined) {
    if ( data ) { // TODO: Second condition probably not needed; check later
      setList(data)
      setLoading(false)
    }
  }

  // Get Contenthash for ENS domain first
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

  // Get Avatar for ENS domain second
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

  // Get Addr for ENS domain third
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

  // Get Name for ENS domain last & finish
  // TODO: getName() routine for both registrars
  async function getName() {
    if ( resolver?.address !== constants.ccip2 ) {
      setName(_ENS_)
    } else {
      setName(_ENS_)
    }
    setFinish(true)
  }

  // Get Resolver for ENS domain
  async function getResolver() {
    await provider.getResolver(_ENS_)
      .then(response => {
        setResolver(response?.address);
        getContenthash(response!)
      });
  }

  // Function for writing IPNS Revision metadata to NameSys backend; needed for updates
  async function writeRevision(revision: Name.Revision, gas: {}) {
    const request = {
      ens: _ENS_,
      address: accountData?.address,
      signature: sigIPNS,
      revision: Revision.encode(revision),
      chain: chain,
      gas: JSON.stringify(gas), 
      version: JSON.stringify(revision, (key, value) => {
        return typeof value === 'bigint' ? value.toString() : value;
      })
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
      setMessage('Record Update Failed')
      setCrash(true)
    }
  }

  // Check if value is a valid Name
  function isName(value: string) {
    return value.endsWith('.eth') && value.length <= 32 + 4
  }

  // Check if value is a valid Addr
  function isAddr(value: string) {
    const hexRegex = /^[0-9a-fA-F]+$/;
    return value.startsWith('0x') && value.length === 40 && hexRegex.test(value.split('0x')[1])
  }

  // Check if value is a valid Avatar URL
  function isAvatar(value: string) {
    const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    return urlRegex.test(value)
  }
  // Check if value is a valid Contenthash
  function isContenthash(value: string) {
    const ipfsRegex = /^[a-z0-9]{62}$/;
    return ipfsRegex.test(value)
  }

  // Upates new record values in local storage before pushing updates
  function setValues(key: string, value: string) {
    let __THIS = legit
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

  // Get records from history on NameSys backend
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

  // Triggers fetching history from NameSys backend
  React.useEffect(() => {
    if (finish) {
      getUpdate()
      setMetadata()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finish]);

  // Wagmi hook for awaiting transaction processing
  const { isSuccess: txSuccess, isError: txError, isLoading: txLoading } = useWaitForTransaction({
    hash: response?.hash,
  });

  // Internal state handling of editable/active records during updates by user
  React.useEffect(() => {
    const _updatedList = list.map((item) => {
      if (states.includes(item.type) && !constants.forbidden.includes(item.type)) {
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

  // Handles Signature (S1) prompt when Resolver is to be migrated
  // in the Preview modal
  React.useEffect(() => {
    if (getch) { // Check for false → true
      // Handle incoming password for IPNS key/CID-gen
      signMessage({ message: statementIPNSKey() }) // sign with K1
      setKeygen(true)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalState, getch]);

  // Handles writing records to the NameSys backend and pinning to IPNS
  React.useEffect(() => {
    // Handle Signature (S2) to add as extradata
    let signatures: string[] = []
    states.forEach(async (recordType) => {
      const _signature = await _signMessage({ message: statementRecords(genRecordType(recordType), genExtradata(recordType)) })
      console.log(_signature)
      signatures.push(_signature!) // Sign with K0
    });
    if (write && keypair && signatures.length > 0) {
      // Generate POST request for writing records
      const request = {
        signatures: signatures,
        ens: _ENS_,
        address: recoveredAddress.current,
        ipns: CID,
        recordsTypes: states,
        recordsValues: newValues,
        revision: history.revision,
        chain: chain
      }
      console.log(request)
      const editRecord = async () => {
        setMessage('Writing Records')
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
            .then(async data => {
              setMessage('Publishing to IPNS')
              if (keypair && data.response) {	
                // Get gas consumption estimate	
                let gas = {}	
                list.map(async (item) => {	
                  if (item.type !== 'resolver' && data.response.meta[item.type]) {	
                    // Get gas for each record separately	
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
                // Wait for gas to be estimated
                await new Promise<void>(resolve => {
                  const checkGas = () => {
                    if (Object.keys(gas).length > 0) {
                      resolve()
                    } else {
                      setTimeout(checkGas, 100)
                    }
                  }
                  checkGas()
                })
                // Handle W3Name publish 
                let key = formatkey(keypair)
                let w3name: Name.WritableName
                const keygen = async () => {
                  w3name = await Name.from(ed25519_2.etc.hexToBytes(key))
                  const pin = async () => {
                    if (data.response.ipfs && w3name) {
                      const toPublish = '/ipfs/' + data.response.ipfs.split('ipfs://')[1]
                      // @W3Name broadcast
                      let _revision: Name.Revision;
                      if (!history.revision) {
                        _revision = await Name.v0(w3name, toPublish)
                      } else {
                        let _revision_ = Revision.decode(new Uint8Array(Buffer.from(history.revision, "utf-8")))
                        _revision = await Name.increment(_revision_, toPublish)
                      }
                      // Write revision to database
                      await writeRevision(_revision, gas)
                      // Publish IPNS
                      await Name.publish(_revision, w3name.key)
                      // Wrap up
                      setGas(gas)
                      setTimeout(() => {
                        setGasModal(true)
                        setLoading(false)
                        //setCID('')
                        //setKeypair(undefined)
                        states.map((_state) => {
                          setStates(prevState => prevState.filter(item => item !== _state))
                        })
                        setLegit(EMPTY_BOOL())
                      }, 2000);
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
                      setNewValues(EMPTY_STRING())
                    }
                  }
                  if (Object.keys(gas).length > 0) {
                    pin()
                  }
                }
                keygen()
              }
            })
        } catch(error) {
          console.log('Failed to write to CCIP2 backend')
          setMessage('Record Update Failed')
          setCrash(true)
        }
      }
      editRecord()
      setWrite(false)
    }
    // Handle exception
    if (!write) {
      setGetch(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [write, states, CID, sigIPNS, newValues, _ENS_, keypair]);

  // Handles migration of Resolver to CCIP2
  React.useEffect(() => {
    if (isMigrateSuccess && txSuccess && migration) {
      setResolver(constants.ccip2)
      const _updatedList = list.map((item) => {
        if (constants.forbidden.includes(item.type)) {
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
      setLegit(EMPTY_BOOL())
      setStates([])
      getResolver()
      setSuccess('Resolver Migration Successful')
      setIcon('check_circle_outline')
      setColor('lightgreen')
      setSuccessModal(true)
      //setCID('')
      //setKeypair(undefined)
      handleSuccess()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMigrateSuccess, txSuccess, migration]);

  // Sets migration state to true upon successful transaction receipt
  React.useEffect(() => {
    if (isMigrateSuccess && txSuccess) {
      const pin = async () => {
        console.log('Resolver Migration Successful')
        setMigration(true)
      }
      pin()
    }
  }, [isMigrateSuccess, txSuccess]);

  // Handles transaction wait
  React.useEffect(() => {
    if (isMigrateLoading) {
      setFinish(false)
      setMessage('Waiting for Confirmation')
    }
  }, [isMigrateLoading]);

  // Handles transaction loading and error
  React.useEffect(() => {
    if (txLoading && !txError) {
      setMessage('Waiting for Transaction')
      setCrash(false)
    }
    if (txError && !txLoading) {
      setMessage('Transaction Failed')
      setCrash(true)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [txLoading, txError]);

  // Handles signature loading and error
  React.useEffect(() => {
    if (signLoading && !signError) {
      setMessage('Waiting for Signature')
      setCrash(false)
    }
    if (signError && !signLoading) {
      setMessage('Signature Failed')
      setCrash(true)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signLoading, signError]);

  /// Modal Content
  const modalContent = show ? (
    <StyledModalOverlay>
      <StyledModal
        style={{
          background: crash ? 'red' : 'linear-gradient(180deg, rgba(66,46,40,1) 0%, rgba(0,0,0,1) 35%, rgba(0,0,0,1) 100%)'
        }}
      >
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
        {_ENS_ && !crash && loading && 
          <StyledModalTitle>
            <span 
              className="material-icons miui-small"
              style={{
                marginTop: '4px'
              }}
            >
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
        {loading && !crash && 
          <StyledModalBody>
            <div
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                display: 'flex',
                flexDirection: 'column',
                marginTop: '-60px',
                marginBottom: '80px'
              }}
            >
              <div>
                <Loading 
                  height={50}
                  width={50}
                />
              </div>
              <div
                style={{
                  marginTop: '60px'
                }}
              >
                <span 
                  style={{
                    color: 'white',
                    fontSize: '18px',
                    fontWeight: '700'
                  }}
                >
                  { message }
                </span>
              </div>
            </div>
          </StyledModalBody>
        }
        {crash && 
          <StyledModalBody>
            <div
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                display: 'flex',
                flexDirection: 'column',
                marginTop: '-20px',
                marginBottom: '20px',
                color: 'white',
                fontSize: '150px',
                backgroundColor: 'red'
              }}
            >
              <BiError />
              <div
                style={{
                  marginTop: '-70px'
                }}
              >
                <span 
                  style={{
                    color: 'white',
                    fontSize: '18px',
                    fontWeight: '700'
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
                          item.state ||
                          !accountData ||
                          accountData?.address !== manager
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
                          ['resolver'].includes(item.type) ? setSalt(true) : setGetch(true), // Prompt password for Resolver; derive S2(K0) for Records
                          ['resolver'].includes(item.type) ? setWrite(false) : setWrite(true), // Trigger write for Records
                          ['resolver'].includes(item.type) ? setStates(prevState => [...prevState, item.type]) : setStates(states) // Update edited keys
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
