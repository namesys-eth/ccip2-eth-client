/// ENS Domain Preview Modal
import React from "react"
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import { ethers } from 'ethers'
import Web3 from 'web3'
import { AbiItem } from 'web3-utils'
import { verifyMessage } from 'ethers/lib/utils'
import Help from '../components/Help'
import Salt from '../components/Salt'
import Error from '../components/Error'
import Gas from '../components/Gas'
import Loading from '../components/LoadingColors'
import Success from '../components/Success'
import * as constants from '../utils/constants'
import { _KEYGEN } from '../utils/keygen'
import * as Name from 'w3name'
import * as ed25519_2 from 'ed25519-2.0.0' // @noble/ed25519 v2.0.0
import * as ensContent from '../utils/contenthash'
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

// Get latest timestamp from all records
function latestTimestamp(list: string[]) {
  var _Timestamps: number[] = []
  for (const key in list) {
    if (list.hasOwnProperty(key) && list[key] !== '' && list[key]) {
      _Timestamps.push(Number(list[key]))
    }
  }
  return Math.max(..._Timestamps)
}

/// Init 
// Types object with empty strings
function EMPTY_STRING() {
  const EMPTY_STRING = {};
  for (const key of constants.types) {
    if (!['resolver','recordhash'].includes(key)) {
      EMPTY_STRING[key] = '';
    }
  }
  return EMPTY_STRING
}

// Types object with empty bools
function EMPTY_BOOL() {
  const EMPTY_BOOL = {}
  for (const key of constants.types) {
    EMPTY_BOOL[key] = ['resolver','recordhash','revision'].includes(key) ? true : false
  }
  return EMPTY_BOOL
}

// History object with empty strings
const EMPTY_HISTORY = {
  addr: '',
  contenthash: '',
  avatar: '',
  revision: '',
  type: '',
  timestamp: {...EMPTY_STRING()},
  queue: 0
}

// Waiting period between updates
const waitingPeriod = 1 * 60 // 60 mins

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

// Returns formatted ed25519/IPNS keypair
function formatkey(keypair: [[string, string], [string, string]]) {
  return '08011240' + keypair[0][0] + keypair[0][1] // ed25519 keypair = keypair[0]
}

// Encode ENS contenthash
function encodeContenthash(contenthash: string) {
  if (contenthash) {
    const ensContentHash = ensContent.encodeContenthash(`ipns://${contenthash}`)
    //console.log('Encoded CID:', ensContentHash.encoded)
    return ensContentHash.encoded
  }
  return ''
}

/**
* Preview Modal
* @param show : Show modal trigger
* @param onClose : Close modal trigger
* @param _ENS_ : Native ENS domain for modal
* @param chain : Chain ID
* @interface handleParentModalData : Send modal data to Home/Account page
* @interface handleParentTrigger : Send modal state to Home/Account page
**/
const Preview: React.FC<ModalProps> = ({ show, onClose, _ENS_, chain, handleParentModalData, handleParentTrigger }) => {
  const [browser, setBrowser] = React.useState(false); // Triggers at modal load
  const { data: gasData, isError } = useFeeData(); // Current gas prices
  const [loading, setLoading] = React.useState(true); // Loading process indicator
  const [migrated, setMigrated] = React.useState(false); // Setup indicator; Setup = Resolver migration + Recordhash setting
  const [keygen, setKeygen] = React.useState(false); // IPNS keygen trigger following signature
  const [crash, setCrash] = React.useState(false);  // Signature fail indicator
  const [CID, setCID] = React.useState(''); // IPNS pubkey/CID value
  const [ENS, setENS] = React.useState(_ENS_); // ENS name; used to trigger useContractRead()
  const [helpModal, setHelpModal] = React.useState(false); // Help modal trigger
  const [successModal, setSuccessModal] = React.useState(false); // Success modal trigger
  const [gasModal, setGasModal] = React.useState(false); // Gas savings modal trigger
  const [finish, setFinish] = React.useState(false); // Indicates when all records have finished fetching
  const [resolver, setResolver] = React.useState<any>(); // Resolver for ENS Domain
  const [addr, setAddr] = React.useState(''); // Addr record for ENS Domain
  //const [addr60, setAddr60] = React.useState('');
  const [avatar, setAvatar] = React.useState(''); // Avatar record for ENS Domain
  const [recordhash, setRecordhash] = React.useState(''); // Recordhash for CCIP2 Resolver
  const [tokenID, setTokenID] = React.useState(''); // Token ID of ENS Domain
  const [managers, setManagers] = React.useState<string[]>([]); // Manager of ENS Domain
  const [contenthash, setContenthash] = React.useState(''); // Contenthash record for ENS Domain
  const [salt, setSalt] = React.useState(false); // Salt (password/key-identifier) for IPNS keygen
  const [list, setList] = React.useState<any[]>([]); // Internal LIST[] object with all record keys and values
  const [trigger, setTrigger] = React.useState(null); // Triggered upon button click adjacent to the record in Preview modal
  const [help, setHelp] = React.useState(''); // Sets help text for the Help modal
  const [success, setSuccess] = React.useState(''); // Sets success text for the Success modal
  const [gas, setGas] = React.useState<{}>({}); // Sets historical gas savings
  const [wrapped, setWrapped] = React.useState(false); // Indicates if the ENS Domain is wrapped
  const [keypair, setKeypair] = React.useState<[[string, string], [string, string]]>(); // Sets generated K0 and K2 keys
  const [update, setUpdate] = React.useState(false); // Triggers signature for record update
  const [write, setWrite] = React.useState(false); // Triggers update of record to the NameSys backend and IPNS
  const [states, setStates] = React.useState<any[]>([]); // Contains keys of active records (that have been edited in the modal)
  const [newValues, setNewValues] = React.useState(EMPTY_STRING()); // Contains new values for the active records in {a:b} format
  const [icon, setIcon] = React.useState(''); // Sets icon for the loading state
  const [color, setColor] = React.useState(''); // Sets color for the loading state
  const [message, setMessage] = React.useState(['Loading Records','']); // Sets message for the loading state
  const [signatures, setSignatures] = React.useState(EMPTY_STRING()); // Contains S2(K0) signatures of active records in the modal
  const [query, setQuery] = React.useState<string[]>(['','','']); // CCIP2 Query for on-chain manager
  const [legit, setLegit] = React.useState(EMPTY_BOOL()); // Whether record edit is legitimate
  const [timestamp, setTimestamp] = React.useState(''); // Whether record edit is legitimate
  const [imageLoaded, setImageLoaded] = React.useState<boolean | undefined>(undefined); // Whether avatar resolves or not
  const [modalState, setModalState] = React.useState<MainBodyState>({
    modalData: undefined,
    trigger: false
  }); // Child modal state
  const [history, setHistory] = React.useState(EMPTY_HISTORY); // Record history from last update
  const [sigIPNS, setSigIPNS] = React.useState(''); // Signature S1(K1) for IPNS keygen
  const [sigApproved, setSigApproved] = React.useState(''); // Signature S3(K1) for Records Manager
  const [sigCount, setSigCount] = React.useState(0); // Signature S3(K1) for Records Manager
  const [queue, setQueue] = React.useState(0); // Sets queue countdown between successive updates

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

  // Initialises internal LIST[] object
  function setMetadata() {
    let _LIST = [
      {
        key: 0,
        type: 'recordhash',
        value: recordhash,
        editable: false,
        active: resolver === constants.ccip2[0],
        state: false,
        label: 'set',
        help: 'on-chain recordhash'
      },
      {
        key: 1,
        type: 'resolver',
        value: resolver,
        editable: false,
        active: resolver !== constants.ccip2[0],
        state: false,
        label: 'migrate',
        help: 'please migrate resolver to enjoy off-chain records'
      },
      {
        key: 2,
        type: 'avatar',
        value: avatar,
        editable: resolver === constants.ccip2[0] && queue > 0,
        active: isAvatar(avatar) && queue > 0,
        state: false,
        label: 'edit',
        help: 'set your avatar'
      },
      {
        key: 3,
        type: 'addr',
        value: addr,
        editable: resolver === constants.ccip2[0] && queue > 0,
        active: isAddr(addr) && queue > 0,
        state: false,
        label: 'edit',
        help: 'set your default address'
      },
      {
        key: 4,
        type: 'contenthash',
        value: contenthash,
        editable: resolver === constants.ccip2[0] && queue > 0,
        active: isContenthash(contenthash) && queue > 0,
        state: false,
        label: 'edit',
        help: 'set your web contenthash'
      }
    ]
    finishQuery(_LIST) // Assign _LIST
  }

  /// Keys & Signature Definitions
  /* K0 = Generated secp256k1 Keypair 
   * K1 = Wallet secp256k1 Keypair 
   * K2 = Generated ed25519 Keypair
   * S1 = Signature for K0 & K2 Generation (Signed by K1)
   * S2 = Signature for Records (Signed by K0)
   * S3 = Signature for Manager Approval (Signed by K1)
   */
  // Signature S1 statement; S1(K1) [IPNS Keygen]
  // S1 is not recovered on-chain; no need for buffer prepend and hashing of message required to sign
  function statementIPNSKey() {
    let _toSign = `Requesting Signature For IPNS Key Generation\n\nUsername: ${_ENS_}\nSigned By: ${caip10}`
    let _digest = _toSign
    //console.log('S1 Message/Digest:', _digest)
    return _digest
  }
  // Signature S2 statement; S2(K0) [Record Signature]
  // S2 is recovered on-chain; requires buffer prepend, hashing of message and arrayifying it
  function statementRecords(recordType: string, extradata: string, signer: string) {
    let _signer = 'eip155:' + chain + ':' + ethers.utils.computeAddress(`0x${signer}`)
    let _toSign = `Requesting Signature To Update ENS Record\n\nENS Domain: ${_ENS_}\nRecord Type: ${recordType}\nExtradata: ${extradata}\nSigned By: ${_signer}`
    {/*
    let _digest = ethers.utils.solidityPack(
      ['string', 'string', 'string'],
      [constants.buffer, _toSign.length.toString(), _toSign]
    )
    console.log('S2 Message:', _toSign)
    console.log('S2 Digest:', ethers.utils.keccak256(_digest))
    */}
    return _toSign
  }

  // Signature S3 statement; S3(K1) [Approved Signature]
  // S3 is recovered on-chain; requires buffer prepend, hashing of message and arrayifying it
  function statementManager(signer: string) {
    let _signer = 'eip155:' + chain + ':' + ethers.utils.computeAddress(`0x${signer}`) // Convert secp256k1 pubkey to ETH address
    let _toSign = `Requesting Signature To Approve ENS Records Signer\n\nENS Domain: ${_ENS_}\nApproved Signer: ${_signer}\nOwner: ${caip10}`
    {/*
    let _digest = ethers.utils.solidityPack(
      ['string', 'string', 'string'],
      [constants.buffer, _toSign.length.toString(), _toSign]
    )
    console.log('S3 Message:', _toSign)
    console.log('S3 Digest:', ethers.utils.keccak256(_digest))
    */}
    return _toSign
  }

  /// Encode string values of records
  // returns abi.encodeWithSelector(iCallbackType.signedRecord.selector, _signer, _recordSignature, _approvedSignature, result)
  function encodeValue(key: string, value: string) {
    let encoded: string
    let type: string = ''
    if (key === 'avatar') type = 'string'
    if (key === 'contenthash') type = 'string'
    if (key === 'addr') type = 'address'
    let _result = ethers.utils.defaultAbiCoder.encode([type], [value]);
    let _ABI = [constants.signedRecord]
    let _interface = new ethers.utils.Interface(_ABI);
    {/* 
    console.log('Record Type:', key.toUpperCase())
    console.log('Raw Value:', value)
    console.log('Encoded Result:', _result)
    console.log('Wallet:', accountData?.address)
    console.log('Manager PubKey:', keypair ? `0x${keypair[1][1]}` : '0x0')
    console.log('Manager Address:', keypair ? ethers.utils.computeAddress(`0x${keypair[1][0]}`) : constants.zeroAddress)
    console.log('Record Signature:', signatures[key])
    console.log('Manager Signature:', sigApproved)
    console.log('Manager PrivKey [❗ WARNING]:', keypair ? `0x${keypair[1][0]}` : constants.zeroKey)
    */}
    let _encodedWithSelector = _interface.encodeFunctionData(
      "signedRecord", 
      [
        keypair ? ethers.utils.computeAddress(`0x${keypair[1][0]}`) : constants.zeroAddress, 
        signatures[key],
        sigApproved,
        _result
      ]
    )
    encoded = _encodedWithSelector
    console.log('CCIP Return Value:', encoded)
    return encoded
  }

  // Generate extradata for S2(K0)
  function genExtradata(key: string, _recordValue: string) {
    // returns bytesToHexString(abi.encodePacked(keccak256(result)))
    let type: string = ''
    if (key === 'avatar') type = 'string'
    if (key === 'contenthash') type = 'string'
    if (key === 'addr') type = 'address'
    let _result = ethers.utils.defaultAbiCoder.encode([type], [_recordValue]);
    const toPack = ethers.utils.keccak256(_result)
    const _extradata = ethers.utils.hexlify(ethers.utils.solidityPack(["bytes"], [toPack]))
    //console.log('S2 Extradata:', _extradata)
    return _extradata
  }

  // Signature S2 with K0 
  // K0 = keypair[1]; secp256k1
  // K2 = keypair[0]; ed25519
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

  // Signature S3 with K1
  async function __signMessage() {
    setSigCount(2) // Trigger S3(K1)
    if (keypair) {
      const SignS3 = async () => {
        signMessage({ message: statementManager(keypair[1][0]) })
      }
      SignS3()
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
  // Read Legacy ENS Registry for ENS domain Controller
  const { data: _ControllerLegacy_ } = useContractRead(
    constants.ensConfig[1],
    'getApproved',
    {
      args: [
        tokenID
      ]
    }
  )
  // Read Legacy ENS Registry for ENS domain Owner
  const { data: _OwnerLegacy_ } = useContractRead(
    constants.ensConfig[1],
    'ownerOf',
    {
      args: [
        tokenID
      ]
    }
  )
  // Read CCIP2 for ENS domain on-chain manager
  const { data: _CCIP2Manager_ } = useContractRead(
    constants.ccip2Config[0],
    'isAuthorized',
    {
      args: query
    }
  )
  // Read ownership of a domain from ENS Wrapper
  const { data: _OwnerWrapped_ } = useContractRead(
    constants.ensConfig[3], // ENS Wrapper
    'ownerOf',
    {
      args: [
        tokenID
      ]
    }
  )
  // Get Recordhash from CCIP2 Resolver
  const { data: _Recordhash_ } = useContractRead(
    constants.ccip2Config[0], // CCIP2 Resolver
    'recordhash',
    {
      args: [
        ethers.utils.namehash(ENS)
      ]
    }
  )
  // Get Manager from ENS Wrapper
  const { data: _ManagerWrapped_ } = useContractRead(
    constants.ensConfig[3], // ENS Wrapper
    'getApproved',
    {
      args: [
        tokenID
      ]
    }
  )

  // Returns Owner of wrapped/legacy ENS Domain
  function getOwner() {
    // If domain is wrapped, return owner of token (in new contract) as the controller
    if (_OwnerLegacy_?.toString() === constants.ensContracts[3]) {
      return _OwnerWrapped_ ? _OwnerWrapped_.toString() : constants.zeroAddress
    } else {
      // If domain is unwrapped, return owner of token (in legacy contract) as the controller
      return _OwnerLegacy_ ? _OwnerLegacy_.toString() : constants.zeroAddress
    }
  }

  // Returns Controller of wrapped/legacy ENS Domain
  function getController() {
    // If domain is wrapped, return manager of token (in new contract) as the controller
    if (_OwnerLegacy_?.toString() === constants.ensContracts[3]) {
      
      return _ManagerWrapped_ ? _ManagerWrapped_.toString() : constants.zeroAddress
    } else {
      // If domain is unwrapped, return manager of token (in legacy contract) as the controller
      return _ControllerLegacy_ ? _ControllerLegacy_.toString() : constants.zeroAddress
    }
  }

  // Sets in-app ENS domain manager
  React.useEffect(() => {
    if (accountData?.address) {
      let _OwnerWrapped_ = getOwner()
      let _ManagerWrapped_ = getController()
      // Set Managers
      if (_CCIP2Manager_ && _CCIP2Manager_.toString() === 'true') {
        // Set connected account as in-app manager if it is authorised
        setManagers([accountData.address])
      } else {
        // Set owner and controller as in-app managers if no on-chain manager exists
        setManagers([_OwnerWrapped_, _ManagerWrapped_])
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenID, _ControllerLegacy_, _OwnerLegacy_, _CCIP2Manager_])

  // Sets Wrapper status of ENS Domain
  React.useEffect(() => {
    if (_OwnerLegacy_?.toString() === constants.ensContracts[3]) {
      setWrapped(true)
    } else {
      setWrapped(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_OwnerLegacy_])

  // Send data to Home/Account-page and trigger update
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
    if (modalState.trigger && !update) {
      setSigCount(1)
      signMessage({ message: statementIPNSKey() })
      setKeygen(true)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalState]);

  // Triggers S1(K1) after password is set
  React.useEffect(() => {
    setLoading(true)
    if (sigIPNS && !keypair) {
      setMessage(['Generating IPNS Key', ''])
      const keygen = async () => {
        const __keypair = await _KEYGEN(_ENS_, caip10, sigIPNS, modalState.modalData)
        setKeypair(__keypair)
        setMessage(['IPNS Key Generated', ''])
      };
      keygen()
    } else {
      setMessage(['IPNS Key/CID Exists', ''])
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keygen, sigIPNS]);

  // Triggers IPNS CID derivation with new S1(K1)
  React.useEffect(() => {
    if (keypair) {
      const CIDGen = async () => {
        let key = formatkey(keypair)
        const w3name = await Name.from(ed25519_2.etc.hexToBytes(key))
        const CID_IPNS = w3name.toString()
        setCID(CID_IPNS)
        setMessage(['IPNS CID Generated', ''])
        if (CID_IPNS) console.log('IPNS:', CID_IPNS)
      }
      CIDGen()
      setQuery(
        [
          ethers.utils.namehash(ENS),
          accountData?.address ? accountData.address : constants.zeroAddress,
          keypair ? keypair[1][1] : constants.zeroAddress
        ]
      ) // Checks if connected wallet is on-chain manager
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keypair]);

  // Sets signature from Wagmi signMessage() as S1(K1)
  React.useEffect(() => {
    if (signature && sigCount === 1) {
      setSigIPNS(signature)
    } else if (signature && sigCount === 2) {
      setSigApproved(signature)
      //console.log('Signature S3(K1):', signature)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature, sigCount])

  // Sets new ENS Resolver
  const {
    data: response1of2,
    write: migrate,
    isLoading: isMigrateLoading,
    isSuccess: isMigrateSuccess,
    isError: isMigrateError
  } = useContractWrite(
    !wrapped ? constants.ensConfig[0] : constants.ensConfig[3],
    'setResolver',
    {
      args: [
        ethers.utils.namehash(_ENS_), 
        constants.ccip2[0]
      ]
    }
  );

  // Sets Recordhash in CCIP2 Resolver
  const {
    data: response2of2,
    write: initRecordhash,
    isLoading: isSetRecordhashLoading,
    isSuccess: isSetRecordhashSuccess,
    isError: isSetRecordhashError
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
        address: `0x${constants.ensConfig[4].addressOrName.substring(2)}`,
        abi: constants.ensConfig[4].contractInterface,
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
        constants.ensConfig[4].contractInterface as AbiItem[], 
        constants.ensConfig[4].addressOrName
      );
      let gasAmount = await contract.methods.setText(ethers.utils.namehash(_ENS_), key, value).estimateGas({ from: accountData?.address })
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
    } else if (states.includes('recordhash')) {
      if (CID.startsWith('k5')) {
        initRecordhash()
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
        active: resolver !== constants.ccip2[0]
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
    if ( data ) {
      setList(data)
      setLoading(false)
    }
  }

  // Get Contenthash for ENS domain first
  async function getContenthash(resolver: ethers.providers.Resolver | null) {
    if ( resolver?.address !== constants.ccip2[0] ) {
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
      // TODO : Fix this
      setContenthash('')
      getAvatar()
    }
  }

  // Get Avatar for ENS domain second
  async function getAvatar() {
    if ( resolver?.address !== constants.ccip2[0] ) {
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
      // TODO : Fix this
      setAvatar('')
      getRecord()
    }
  }

  // Get Addr for ENS domain third
  async function getRecord() {
    if ( resolver?.address !== constants.ccip2[0] ) {
      await provider.resolveName(_ENS_)
        .then(response => {
          if (!response) {
            setAddr('')
          } else {
            setAddr(response)
          }
          setFinish(true)
        })
        .catch(() => {
          setAddr('')
          setFinish(true)
        });
    } else {
      setAddr('')
      setFinish(true)
    }
  }

  // Get Resolver for ENS domain
  async function getResolver() {
    await provider.getResolver(_ENS_)
      .then(response => {
        setResolver(response?.address);
        if (response?.address) {
          if (response?.address === constants.ccip2[0] && _Recordhash_!.toString() !== '0x') {
            setRecordhash(`ipns://${ensContent.decodeContenthash(_Recordhash_!.toString()).decoded}`)
          }
          getContenthash(response!)
        } else {
          if (_Recordhash_!.toString() !== '0x') {
            setRecordhash(`ipns://${ensContent.decodeContenthash(_Recordhash_!.toString()).decoded}`)
          }
        }
      });
  }

  // Function for writing IPNS Revision metadata to NameSys backend; needed for updates
  async function writeRevision(revision: Name.Revision, gas: {}) {
    const request = {
      ens: _ENS_,
      owner: accountData?.address,
      manager: keypair ? ethers.utils.computeAddress(`0x${keypair[1][0]}`) : constants.zeroAddress,
      managerSignature: sigApproved,
      revision: Revision.encode(revision),
      chain: chain,
      gas: JSON.stringify(gas), 
      version: JSON.stringify(revision, (key, value) => {
        return typeof value === 'bigint' ? value.toString() : value;
      }),
      timestamp: timestamp
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
      console.error('ERROR:', 'Failed to write Revision to CCIP2 backend')
      setMessage(['Record Update Failed', ''])
      setCrash(true)
      setLoading(false)
    }
  }

  // Check if value is a valid Name
  function isName(value: string) {
    return value.endsWith('.eth') && value.length <= 32 + 4
  }

  // Check if value is a valid Addr
  function isAddr(value: string) {
    const hexRegex = /^[0-9a-fA-F]+$/;
    return value.startsWith('0x') && value.length === 42 && hexRegex.test(value.split('0x')[1])
  }

  // Check if value is a valid Avatar URL
  function isAvatar(value: string) {
    const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    return urlRegex.test(value)
  }
  // Check if value is a valid Contenthash
  function isContenthash(value: string) {
    const prefix = value.substring(7)
    const ipfsRegex = /^[a-z0-9]{62}$/;
    return prefix === 'ipns://' && ipfsRegex.test(value)
  }

  // Upates new record values in local storage before pushing updates
  function setValues(key: string, value: string) {
    let __THIS = legit
    __THIS['resolver'] = false
    if (key === 'recordhash') {
      __THIS[key] = true
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
    _THIS[key] = value
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
  // Must get Revision for IPNS update
  async function getUpdate() {
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
          let _HISTORY = {
            type: data.response.type,
            addr: data.response.addr,
            avatar: data.response.avatar,
            contenthash: data.response.contenthash,
            revision: data.response.revision,
            timestamp: data.response.timestamp,
            queue: latestTimestamp(data.response.timestamp)
          }
          setHistory(_HISTORY)
          setQueue(Math.round(Date.now()/1000) - latestTimestamp(data.response.timestamp) - waitingPeriod)
        })
    } catch(error) {
      console.error('ERROR:', 'Failed to read from CCIP2 backend')
    }
  }

  // Triggers fetching history from NameSys backend
  React.useEffect(() => {
    if (finish) {
      getUpdate()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finish]);
  React.useEffect(() => {
    if (history && queue) {
      setMetadata()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history, queue]);

  // Wagmi hook for awaiting transaction processing
  const { isSuccess: txSuccess1of2, isError: txError1of2, isLoading: txLoading1of2 } = useWaitForTransaction({
    hash: response1of2?.hash,
  });
  const { isSuccess: txSuccess2of2, isError: txError2of2, isLoading: txLoading2of2 } = useWaitForTransaction({
    hash: response2of2?.hash,
  });

  // Internal state handling of editable/active records during updates by user
  React.useEffect(() => {
    const _updatedList = list.map((item) => {
      if (states.includes(item.type) && !constants.forbidden.includes(item.type)) {
        return { 
          ...item, 
          editable: queue > 0, // allow updates only after the waiting period
          active: queue > 0
        };
      } else if (!states.includes(item.type) && ['resolver'].includes(item.type)) {
        return { 
          ...item, 
          editable: false, 
          active: false
        };
      } else if (['recordhash'].includes(item.type)) {
        return { 
          ...item, 
          editable: false, 
          active: true
        };
      }
      return item;
    });
    setList(_updatedList)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);

  // Handles password prompt for S1(K1)
  React.useEffect(() => {
    if (update) { // Check for false → true
      if (!keypair || !CID) {
        setSalt(true) // Start K0 keygen if it doesn't exist in local storage
        setUpdate(false) // Reset
      } else {
        setLoading(true)
        setMessage(['Setting Record', ''])
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [update]);

  // Handles generating signatures for all records to be updated
  React.useEffect(() => {
    // Handle Signature S2(K0) to add as extradata
    if (write && keypair && newValues) {
      let __signatures = EMPTY_STRING()
      states.forEach(async (_recordType) => {
        let _signature: any
        _signature = await _signMessage({ 
          message: statementRecords(constants.files[constants.types.indexOf(_recordType)], genExtradata(_recordType, newValues[_recordType]), keypair[1][0]) 
        }) // Sign with K0
        if (_signature) __signatures[_recordType] = _signature
      });
      setSignatures(__signatures)
      //console.log('Signatures S2(K1):', __signatures)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [write, keypair]);

  // Handles generating signatures for off-chain manager
  React.useEffect(() => {
    // Handle Signature S3(K1) 
    if (write && keypair && !_CCIP2Manager_ && !sigApproved) {
      __signMessage() // Sign with K1
    } else if (write && keypair && _CCIP2Manager_) {
      setSigApproved('0x')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [write, _CCIP2Manager_, signatures]);

  // Handles writing records to the NameSys backend and pinning to IPNS
  React.useEffect(() => {
    let count = 0
    for (const key in signatures) {
      if (signatures.hasOwnProperty(key) && signatures[key] !== '') {
        count++
      }
    }
    if (
      write && 
      keypair && 
      count === states.length && 
      count > 0 && 
      sigApproved
    ) {
      let _encodedValues = EMPTY_STRING()
      for (const key in newValues) {
        if (newValues.hasOwnProperty(key) && newValues[key] !== '') {
          _encodedValues[key] = encodeValue(key, newValues[key])
        }
      }
      // Generate POST request for writing records
      const request = {
        signatures: signatures,
        manager: keypair ? ethers.utils.computeAddress(`0x${keypair[1][0]}`) : constants.zeroAddress,
        managerSignature: sigApproved,
        ens: _ENS_,
        owner: accountData?.address ? accountData?.address : constants.zeroAddress,
        ipns: CID,
        recordsTypes: states,
        recordsValues: _encodedValues,
        recordsRaw: newValues,
        revision: history.revision,
        chain: chain
      }
      //console.log(request)
      const editRecord = async () => {
        setMessage(['Writing Records', ''])
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
              setMessage(['Publishing to IPNS', ''])
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
                    if (item.type === 'addr') {	
                      setAddr(data.response.addr)	
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
                    if (data.response.ipfs && w3name && gas) {
                      const toPublish = '/ipfs/' + data.response.ipfs.split('ipfs://')[1]
                      console.log('IPFS:', data.response.ipfs)
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
                      // Update values in the modal to new ones
                      const _updatedList = list.map((item) => {
                        if (!['resolver','recordhash'].includes(item.type)) {
                          setTimestamp(data.response.timestamp)
                          let _queue = Math.round(Date.now()/1000) - latestTimestamp(data.response.timestamp) - waitingPeriod
                          setQueue(_queue)
                          if (data.response.meta[item.type]) {
                            return { 
                              ...item,  
                              value: data.response[item.type],
                              state: true,
                              label: 'edit',
                              active: _queue > 0,
                              editable: _queue > 0
                            };
                          } else {
                            return { 
                              ...item,  
                              active: _queue > 0,
                              editable: _queue > 0
                            };
                          } 
                        } else {
                          return item
                        }
                      })
                      setList(_updatedList)
                      setNewValues(EMPTY_STRING())
                      setSignatures(EMPTY_STRING())
                      setSigCount(0)
                      setUpdate(false) // Reset
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
          console.error('ERROR:', 'Failed to write to CCIP2 backend')
          setMessage(['Record Update Failed', ''])
          setCrash(true)
          setLoading(false)
        }
      }
      editRecord()
      setWrite(false)
    }
    // Handle exception
    if (!write) {
      setUpdate(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signatures, sigApproved]);

  // Handles setting setRecordhash on CCIP2 Resolver
  React.useEffect(() => {
    if (isMigrateSuccess && txSuccess1of2 && migrated) {
      setResolver(constants.ccip2[0])
      initRecordhash()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMigrateSuccess, txSuccess1of2, migrated]);

  // Handles setting Recordhash after transaction 2 
  React.useEffect(() => {
    if (isSetRecordhashSuccess && txSuccess2of2) {
      setRecordhash(`ipns://${CID}`)
      setENS(_ENS_)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSetRecordhashSuccess, txSuccess2of2]);

  // Handles finishing migration of Resolver to CCIP2
  React.useEffect(() => {
    if (recordhash && txSuccess2of2) {
      const _updatedList = list.map((item) => {
        if (constants.forbidden.includes(item.type)) {
          return { 
            ...item, 
            editable: false, 
            active: false
          }
        } else {
          const Clause = {
            ...item, 
            editable: true, 
            active: true
          }
          if (item.type === 'recordhash') {
            return { 
              ...Clause, 
              value: recordhash,
            }
          } else {
            // TODO : Need to fix this; return should not 
            // return null value but read from the historical 
            // records
            return { 
              ...Clause, 
              value: '',
            }
          }
        }
      });
      setList(_updatedList)
      setLegit(EMPTY_BOOL())
      setStates([])
      getResolver()
      setLoading(false)
      setSuccess('Off-chain Setup Complete. Enjoy!')
      setIcon('check_circle_outline')
      setColor('lightgreen')
      setSuccessModal(true)
      //setCID('')
      //setKeypair(undefined)
      handleSuccess()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recordhash]);

  // Sets migration state to true upon successful transaction 1 receipt
  React.useEffect(() => {
    if (isMigrateSuccess && txSuccess1of2) {
      const pin = async () => {
        console.log('Migration:', 'Resolver Migration Successful')
        setMigrated(true)
      }
      pin()
    }
  }, [isMigrateSuccess, txSuccess1of2]);

  // Handles transaction wait
  React.useEffect(() => {
    if (isMigrateLoading && !isSetRecordhashLoading) {
      setFinish(false)
      setMessage(['Waiting for Confirmation', '1'])
    } 
    if (isMigrateError && !isSetRecordhashLoading) {
      setMessage(['Transaction Declined by User', ''])
      setCrash(true)
      setLoading(false)
    } 
    if (!isMigrateLoading && isSetRecordhashLoading) {
      setFinish(false)
      setMessage(['Waiting for Confirmation', '2'])
    }
    if (isSetRecordhashError && !isSetRecordhashLoading) {
      setMessage(['Transaction Declined by User', ''])
      setCrash(true)
      setLoading(false)
    } 
  }, [isMigrateLoading, isSetRecordhashLoading, isMigrateError, isSetRecordhashError]);

  // Handles first transaction loading and error
  React.useEffect(() => {
    if (txLoading1of2 && !txError1of2) {
      setMessage(['Waiting for Transaction', '1'])
    }
    if (!txLoading1of2 && txError1of2) {
      setMessage(['Transaction Failed', '1'])
      setCrash(true)
      setLoading(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [txLoading1of2, txError1of2]);

  // Handles second transaction loading and error
  React.useEffect(() => {
    if (txLoading2of2 && !txError2of2) {
      setMessage(['Waiting for Transaction', '2'])
    }
    if (!txLoading2of2 && txError2of2) {
      setMessage(['Transaction Failed', '2'])
      setCrash(true)
      setLoading(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [txLoading2of2, txError2of2]);

  // Handles signature loading and error
  React.useEffect(() => {
    if (signLoading && !signError) {
      setMessage(['Waiting for Signature', sigCount.toString()])
    }
    if (signError && !signLoading) {
      setMessage(['Signature Failed', sigCount.toString()])
      setCrash(true)
      setLoading(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signLoading, signError]);

  /// Modal Content
  const modalContent = show ? (
    <StyledModalOverlay>
      <StyledModal
        style={{
          background: 'linear-gradient(180deg, rgba(66,46,40,1) 0%, rgba(0,0,0,1) 35%, rgba(0,0,0,1) 100%)'
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
        {_ENS_ && loading && 
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
              // TODO: async-await for resolution across multiple public gateways 
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
        {loading && 
          <StyledModalBody>
            <div
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                display: 'flex',
                flexDirection: 'column',
                marginTop: '-10px',
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
                  { message[0] }
                </span>
              </div>
              { message[1] && (
                <div
                  style={{
                    marginTop: '10px'
                  }}
                >
                  <span 
                    style={{
                      color: 'white',
                      fontSize: '18px',
                      fontWeight: '700'
                    }}
                  >
                    <span style={{ fontFamily: 'SF Mono', fontSize: '22px' }}>{message[1]}</span>
                    <span>{' Of '}</span>
                    <span style={{ fontFamily: 'SF Mono', fontSize: '22px' }}>{'2'}</span>
                  </span>
                </div>
              )}
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
                        { // Label
                        item.type }

                        { // Updated State marker
                        item.state && (
                          <div 
                            className="material-icons smol"
                            style={{ 
                              color: 'lightgreen'
                            }}
                          >
                            task_alt
                          </div>
                        )}
                        
                        { // Set Badge if Resolver is migrated and Recordhash is set
                        ['resolver','recordhash'].includes(item.type) && resolver === constants.ccip2[0] && recordhash && (
                          <button 
                            className="button-tiny"
                            onClick={() => { 
                              setHelpModal(true),
                              setIcon('gpp_good'),
                              setColor('lightgreen'),
                              setHelp(item.type === 'resolver' ? 'Resolver is migrated' : 'Recordhash is set')
                            }}
                            data-tooltip={ 'Ready For Off-Chain Use' }
                          >
                            <div 
                              className="material-icons smol"
                              style={{
                                color: 'lightgreen',
                                marginLeft: item.type === 'resolver' ? '5px' : '6px'
                              }}
                            >
                              gpp_good
                            </div>
                          </button>
                        )}
                        { // Set Badge if Resolver is migrated and no Recordhash is set
                        ['resolver','recordhash'].includes(item.type) && resolver === constants.ccip2[0] && !recordhash && (
                          <button 
                            className="button-tiny"
                            onClick={() => { 
                              setHelpModal(true),
                              setIcon(item.type === 'resolver' ? 'gpp_good' : 'cancel'),
                              setColor(item.type === 'resolver' ? 'orange' : 'orangered'),
                              setHelp(item.type === 'resolver' ? 'Resolver is migrated' : 'Recordhash not set')
                            }}
                            data-tooltip={ 'Resolver Migrated But Recordhash Not Set' }
                          >
                            <div 
                              className="material-icons smol"
                              style={{
                                color: item.type === 'resolver' ? 'orange' : 'orangered',
                                marginLeft: item.type === 'resolver' ? '5px' : '6px'
                              }}
                            >
                              { item.type === 'resolver' ? 'gpp_good' : 'cancel' }
                            </div>
                          </button>
                        )}
                        { // Set Badge if Resolver is not migrated and no Recordhash has been set in the past
                        ['resolver','recordhash'].includes(item.type) && resolver !== constants.ccip2[0] && !recordhash && (
                          <button 
                            className="button-tiny"
                            onClick={() => { 
                              setHelpModal(true),
                              setIcon(item.type === 'resolver' ? 'gpp_bad' : 'cancel'),
                              setColor('orangered'),
                              setHelp(item.type === 'resolver' ? 'Resolver not migrated' : 'Recordhash not set')
                            }}
                            data-tooltip={ 'Resolver Not Migrated And Recordhash Not Set' }
                          >
                            <div 
                              className="material-icons smol"
                              style={{
                                color: 'orangered',
                                marginLeft: item.type === 'resolver' ? '5px' : '6px'
                              }}
                            >
                              { item.type === 'resolver' ? 'gpp_bad' : 'cancel' }
                            </div>
                          </button>
                        )}
                        { // Resolver is not migrated but Recordhash has been set in the past
                        ['resolver','recordhash'].includes(item.type) && resolver !== constants.ccip2[0] && recordhash && (
                          <button 
                            className="button-tiny"
                            onClick={() => { 
                              setHelpModal(true),
                              setIcon(item.type === 'resolver' ? 'gpp_bad' : 'check_circle'),
                              setColor(item.type === 'resolver' ? 'orangered' : 'orange'),
                              setHelp(item.type === 'resolver' ? 'Resolver not migrated' : 'Recordhash is set')
                            }}
                            data-tooltip={ 'Resolver Not Migrated But Recordhash Has Been Set' }
                          >
                            <div 
                              className="material-icons smol"
                              style={{
                                color: item.type === 'resolver' ? 'orangered' : 'orange',
                                marginLeft: item.type === 'resolver' ? '5px' : '6px'
                              }}
                            >
                              { item.type === 'resolver' ? 'gpp_bad' : 'check_circle' }
                            </div>
                          </button>
                        )}

                        { // Help icons
                        item.type !== 'resolver' && (
                          <button 
                            className="button-tiny"
                            onClick={() => { 
                              setHelpModal(true),
                              setIcon('info'),
                              setColor('skyblue'),
                              setHelp(item.help)
                            }}
                            data-tooltip={ 'Click to Expand' }
                          >
                            <div 
                              className="material-icons smol"
                              style={{ 
                                color: 'skyblue',
                                marginLeft: item.type === 'recordhash' ? '-5px' : '5px'
                              }}
                            >
                              info_outline
                            </div>
                          </button>
                        )}      

                        { // Countdown
                        !['resolver','recordhash'].includes(item.type) && resolver === constants.ccip2[0] && recordhash && (
                          <button 
                            className="button-tiny"
                            onClick={() => { 
                              setHelpModal(true),
                              setIcon('timer'),
                              setColor(queue < 0 ? 'orange' : 'lightgreen'),
                              setHelp(queue < 0 ? 'Too Soon To Update. Please Wait' : 'Ready For Next Record Update')
                            }}
                            data-tooltip={ 
                              queue < 0 ? 'Please Wait For Next Update' : 'Ready For Next Update'
                            }
                          >
                            <div 
                              className="material-icons smol"
                              style={{
                                color: queue < 0 ? 'orange' : 'lightgreen',
                                marginLeft: '-5px'
                              }}
                            >
                              timer
                            </div>
                          </button>
                        )}
                      </span>
                      <button
                        className="button"
                        disabled={ 
                          !list[item.key].active ||
                          !legit[item.type] ||
                          item.state ||
                          !accountData ||
                          !managers.includes(accountData?.address ? accountData.address : '0x0c0cac01ac0ffeecafeNOTHEX')
                        }
                        style={{
                          alignSelf: 'flex-end',
                          height: '25px',
                          width: 'auto',
                          marginTop: '-3px',
                        }}
                        onClick={() => { 
                          setTrigger(item.key),
                          setMessage(['Waiting for Signature', '']),
                          ['resolver','recordhash'].includes(item.type) ? setSalt(true) : setUpdate(true), // Prompt password for Resolver; derive S2(K0) for Records
                          ['resolver','recordhash'].includes(item.type) ? setWrite(false) : setWrite(true), // Trigger write for Records
                          ['resolver','recordhash'].includes(item.type) ? setStates(prevState => [...prevState, item.type]) : setStates(states) // Update edited keys
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
                          ['recordhash'].includes(item.type) ? 'rgb(255, 255, 255, 0.60)' : 'rgb(255, 255, 255, 0.75)'
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
              <Error
                onClose={() => {
                  setCrash(false)
                }}
                show={crash && !loading}
                title={'cancel'}
              >
                { message[0] }
            </Error>
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
