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
import Options from '../components/Options'
import Error from '../components/Error'
import Gas from '../components/Gas'
import Loading from '../components/LoadingColors'
import Success from '../components/Success'
import Confirm from '../components/Confirm'
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

// Modal data to pass back to homepage
interface ModalProps {
  _ENS_: string,
  chain: string,
  show: boolean;
  onClose: any;
  handleParentModalData: (data: string) => void;
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
    if (!['resolver', 'recordhash'].includes(key)) {
      EMPTY_STRING[key] = '';
    }
  }
  return EMPTY_STRING
}

// Types object with empty bools
function EMPTY_BOOL() {
  const EMPTY_BOOL = {}
  for (const key of constants.types) {
    EMPTY_BOOL[key] = ['resolver', 'recordhash', 'revision'].includes(key) ? true : false
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
const waitingPeriod = constants.waitingPeriod

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

/**
* Preview Modal
* @param show : Show modal trigger
* @param onClose : Close modal trigger
* @param _ENS_ : Native ENS domain for modal; can also be eth:0x... for master records
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
  const [avatar, setAvatar] = React.useState(''); // Avatar record for ENS Domain
  const [recordhash, setRecordhash] = React.useState<any>(undefined); // Recordhash for CCIP2 Resolver
  const [ownerhash, setOwnerhash] = React.useState<any>(undefined); // Ownerhash for CCIP2 Resolver
  const [tokenIDLegacy, setTokenIDLegacy] = React.useState(''); // Legacy Token ID of ENS Domain
  const [tokenIDWrapper, setTokenIDWrapper] = React.useState(''); // Wrapper Token ID of ENS Domain
  const [managers, setManagers] = React.useState<string[]>([]); // Manager of ENS Domain
  const [contenthash, setContenthash] = React.useState(''); // Contenthash record for ENS Domain
  const [salt, setSalt] = React.useState(false); // Salt (password/key-identifier) for IPNS keygen
  const [list, setList] = React.useState<any[]>([]); // Internal LIST[] object with all record keys and values
  const [preCache, setPreCache] = React.useState<any[]>([]); // Copy of LIST[] object
  const [trigger, setTrigger] = React.useState(null); // Triggered upon button click adjacent to the record in Preview modal
  const [help, setHelp] = React.useState(''); // Sets help text for the Help modal
  const [success, setSuccess] = React.useState(''); // Sets success text for the Success modal
  const [gas, setGas] = React.useState<{}>({}); // Sets historical gas savings
  const [wrapped, setWrapped] = React.useState(false); // Indicates if the ENS Domain is wrapped
  const [keypair, setKeypair] = React.useState<[[string, string], [string, string]]>(); // Sets generated K0 and K2 keys
  const [updateRecords, setUpdateRecords] = React.useState(false); // Triggers signature for record update
  const [write, setWrite] = React.useState(false); // Triggers update of record to the NameSys backend and IPNS
  const [states, setStates] = React.useState<any[]>([]); // Contains keys of active records (that have been edited in the modal)
  const [newValues, setNewValues] = React.useState(EMPTY_STRING()); // Contains new values for the active records in {a:b} format
  const [icon, setIcon] = React.useState(''); // Sets icon for the loading state
  const [color, setColor] = React.useState(''); // Sets color for the loading state
  const [message, setMessage] = React.useState(['Loading Records', '']); // Sets message for the loading state
  const [options, setOptions] = React.useState(false); // Provides option with Ownerhash and Recordhash during migration
  const [confirm, setConfirm] = React.useState(false); // Confirmation modal
  const [signatures, setSignatures] = React.useState(EMPTY_STRING()); // Contains S2(K0) signatures of active records in the modal
  const [onChainManagerQuery, setOnChainManagerQuery] = React.useState<string[]>(['', '', '']); // CCIP2 Query for on-chain manager
  const [legit, setLegit] = React.useState(EMPTY_BOOL()); // Whether record edit is legitimate
  const [timestamp, setTimestamp] = React.useState(''); // Stores update timestamp returned by backend
  const [hashType, setHashType] = React.useState(''); // Recordhash or Ownerhash storage
  const [imageLoaded, setImageLoaded] = React.useState<boolean | undefined>(undefined); // Whether avatar resolves or not
  const [saltModalState, setSaltModalState] = React.useState<constants.MainBodyState>({
    modalData: undefined,
    trigger: false
  }); // Salt modal state
  const [optionsModalState, setOptionsModalState] = React.useState<constants.MainBodyState>({
    modalData: undefined,
    trigger: false
  }); // Options modal state
  const [confirmModalState, setConfirmModalState] = React.useState<constants.MainBodyState>({
    modalData: undefined,
    trigger: false
  }); // Confirm modal state
  const [history, setHistory] = React.useState(EMPTY_HISTORY); // Record history from last update
  const [sigIPNS, setSigIPNS] = React.useState(''); // Signature S1(K1) for IPNS keygen
  const [sigApproved, setSigApproved] = React.useState(''); // Signature S3(K1) for Records Manager
  const [sigCount, setSigCount] = React.useState(0); // Signature S3(K1) for Records Manager
  const [queue, setQueue] = React.useState(0); // Sets queue countdown between successive updates
  const [sustain, setSustain] = React.useState(false); // Sustains status of record update
  const [onChainManager, setOnChainManager] = React.useState(''); // Sets CCIP2 Manager

  const { Revision } = Name // W3Name Revision object
  const { address: _Wallet_ } = useAccount()
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
  const ccip2Contract = constants.ccip2[chain === '1' ? 1 : 0]
  const ccip2Config = constants.ccip2Config[chain === '1' ? 1 : 0]
  const apiKey = process.env.NEXT_PUBLIC_ALCHEMY_ID
  const network = chain === '5' ? 'goerli' : 'homestead'
  const provider = new ethers.providers.AlchemyProvider(network, apiKey);
  const alchemyEndpoint = 'https://eth-goerli.g.alchemy.com/v2/' + apiKey
  const web3 = new Web3(alchemyEndpoint);
  const caip10 = `eip155:${chain}:${_Wallet_}`  // CAIP-10
  const origin = `eth:${_Wallet_ ? _Wallet_ : constants.zeroAddress}`

  // Initialises internal LIST[] object
  function setMetadata(_recordhash: string) {
    let _LIST = [
      {
        key: 0,
        header: hashType === 'recordhash' ? 'Recordhash' : 'Ownerhash',
        type: 'recordhash',
        value: _recordhash,
        editable: false,
        active: resolver === ccip2Contract,
        state: false,
        label: 'Set',
        help: '<span>On-chain <span style="color: cyan">IPNS</span> storage</span>',
        tooltip: 'Set New Recordhash'
      },
      {
        key: 1,
        header: 'Resolver',
        type: 'resolver',
        value: resolver,
        editable: false,
        active: resolver !== ccip2Contract,
        state: false,
        label: 'Migrate',
        help: '<span>Please <span style="color: cyan">migrate resolver</span> to enjoy off-chain records</span>',
        tooltip: 'Please Migrate Resolver'
      },
      {
        key: 2,
        header: 'Avatar',
        type: 'avatar',
        value: avatar,
        editable: resolver === ccip2Contract && queue > 0,
        active: isAvatar(avatar) && queue > 0,
        state: false,
        label: 'Edit',
        help: '<span>Set your <span style="color: cyan">avatar</span></span>',
        tooltip: 'Set Avatar'
      },
      {
        key: 3,
        header: 'Address',
        type: 'addr',
        value: addr,
        editable: resolver === ccip2Contract && queue > 0,
        active: isAddr(addr) && queue > 0,
        state: false,
        label: 'Edit',
        help: '<span>Set your default <span style="color: cyan">address</span></span>',
        tooltip: 'Set Address'
      },
      {
        key: 4,
        header: 'Contenthash',
        type: 'contenthash',
        value: contenthash,
        editable: resolver === ccip2Contract && queue > 0,
        active: isContenthash(contenthash) && queue > 0,
        state: false,
        label: 'Edit',
        help: '<span>Set your <span style="color: cyan">web contenthash</span></span>',
        tooltip: 'Set Contenthash'
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
  function statementIPNSKey(extradata: string, type: string) {
    let _toSign = `Requesting Signature For IPNS Key Generation\n\nOrigin: ${type === 'recordhash' ? _ENS_ : origin}\nKey Type: ed25519\nExtradata: ${extradata}\nSigned By: ${caip10}`
    let _digest = _toSign
    return _digest
  }
  // Signature S2 statement; S2(K0) [Record Signature]
  // S2 is recovered on-chain; requires buffer prepend, hashing of message and arrayifying it
  function statementRecords(recordType: string, extradata: string, signer: string) {
    let _signer = 'eip155:' + chain + ':' + ethers.utils.computeAddress(`0x${signer}`)
    let _toSign = `Requesting Signature To Update ENS Record\n\nOrigin: ${_ENS_}\nRecord Type: ${recordType}\nExtradata: ${extradata}\nSigned By: ${_signer}`
    return _toSign
  }

  // Signature S3 statement; S3(K1) [Approved Signature]
  // S3 is recovered on-chain; requires buffer prepend, hashing of message and arrayifying it
  function statementManager(signer: string) {
    let _signer = 'eip155:' + chain + ':' + ethers.utils.computeAddress(`0x${signer}`) // Convert secp256k1 pubkey to ETH address
    let _toSign = `Requesting Signature To Approve ENS Records Signer\n\nOrigin: ${_ENS_}\nApproved Signer: ${_signer}\nApproved By: ${caip10}`
    return _toSign
  }

  /// Encode string values of records
  // returns abi.encodeWithSelector(iCallbackType.signedRecord.selector, _signer, _recordSignature, _approvedSignature, result)
  function encodeValue(key: string, value: string) {
    let encoded: string
    let _value: string = ''
    let type: string = ''
    if (key === 'avatar') {
      type = 'string'
      _value = value
    }
    if (key === 'contenthash') {
      type = 'bytes'
      _value = ensContent.encodeContenthash(value).encoded
    }
    if (key === 'addr') {
      type = 'address'
      _value = value
    }
    let _result = ethers.utils.defaultAbiCoder.encode([type], [_value]);
    let _ABI = [constants.signedRecord]
    let _interface = new ethers.utils.Interface(_ABI);
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
    return encoded
  }

  // Generate extradata for S2(K0)
  function genExtradata(key: string, _recordValue: string) {
    // returns bytesToHexString(abi.encodePacked(keccak256(result)))
    let type: string = ''
    let _value: string = ''
    if (key === 'avatar') {
      type = 'string'
      _value = _recordValue
    }
    if (key === 'contenthash') {
      type = 'bytes'
      _value = ensContent.encodeContenthash(_recordValue).encoded
    }
    if (key === 'addr') {
      type = 'address'
      _value = _recordValue
    }
    let _result = ethers.utils.defaultAbiCoder.encode([type], [_value]);
    const toPack = ethers.utils.keccak256(_result)
    const _extradata = ethers.utils.hexlify(ethers.utils.solidityPack(["bytes"], [toPack]))
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
        signMessage({ message: 
          statementManager(
            keypair[1][0]
          ) 
        })
      }
      SignS3()
    }
  }

  // Handle Options modal data return
  const handleOptionsModalData = (data: string | undefined) => {
    setOptionsModalState(prevState => ({ ...prevState, modalData: data }));
  };
  // Handle Options modal trigger
  const handleOptionsTrigger = (trigger: boolean) => {
    setOptionsModalState(prevState => ({ ...prevState, trigger: trigger }));
  };

  // Handle Confirm modal data return
  const handleConfirmModalData = (data: string | undefined) => {
    setConfirmModalState(prevState => ({ ...prevState, modalData: data }));
  };
  // Handle Confirm modal trigger
  const handleConfirmTrigger = (trigger: boolean) => {
    setConfirmModalState(prevState => ({ ...prevState, trigger: trigger }));
  };
      
  // Handle Salt modal data return
  const handleSaltModalData = (data: string | undefined) => {
    setSaltModalState(prevState => ({ ...prevState, modalData: data }));
  };
  // Handle Salt modal trigger
  const handleSaltTrigger = (trigger: boolean) => {
    setSaltModalState(prevState => ({ ...prevState, trigger: trigger }));
  };

  /// Preview Domain Metadata
  // Read ENS Legacy Registrar for Owner record of ENS domain
  const { data: _OwnerLegacy_, isLoading: legacyLoading, isError: legacyError } = useContractRead({
    address: `0x${constants.ensConfig[1].addressOrName.slice(2)}`,
    abi: constants.ensConfig[1].contractInterface,
    functionName: 'ownerOf',
    args: [tokenIDLegacy]
  })
   // Read Legacy ENS Registry for ENS domain Owner
   const { data: _OwnerDomain_, isLoading: domainLoading, isError: domainError } = useContractRead({
    address: `0x${constants.ensConfig[0].addressOrName.slice(2)}`,
    abi: constants.ensConfig[0].contractInterface,
    functionName: 'owner',
    args: [tokenIDLegacy]
  })
  // Read CCIP2 for ENS domain on-chain manager
  const { data: _CCIP2Manager_ } = useContractRead({
    address: `0x${ccip2Config.addressOrName.slice(2)}`,
    abi: ccip2Config.contractInterface,
    functionName: 'isApprovedSigner',
    args: [getOwner(), ethers.utils.namehash(ENS), keypair ? ethers.utils.computeAddress(`0x${keypair[1][0]}`) : constants.zeroAddress]
  })

  // Read ownership of a domain from ENS Wrapper
  const { data: _OwnerWrapped_, isLoading: wrapperLoading, isError: wrapperError } = useContractRead({
    address: `0x${constants.ensConfig[chain === '1' ? 7 : 3].addressOrName.slice(2)}`,
    abi: constants.ensConfig[chain === '1' ? 7 : 3].contractInterface,
    functionName: 'ownerOf',
    args: [tokenIDWrapper]
  })
  // Read Ownerhash from CCIP2 Resolver
  const { data: _Ownerhash_ } = useContractRead({
    address: `0x${ccip2Config.addressOrName.slice(2)}`,
    abi: ccip2Config.contractInterface,
    functionName: 'getRecordhash',
    args: [ethers.utils.hexZeroPad(_Wallet_ ? _Wallet_ : constants.zeroAddress, 32).toLowerCase()]
  })
  // Read Recordhash from CCIP2 Resolver
  const { data: _Recordhash_ } = useContractRead({
    address: `0x${ccip2Config.addressOrName.slice(2)}`,
    abi: ccip2Config.contractInterface,
    functionName: 'getRecordhash',
    args: [ethers.utils.namehash(_ENS_)]
  })

  // Captures on-chain manager hook
  React.useEffect(() => {
    if (_CCIP2Manager_) {
      setOnChainManager(_CCIP2Manager_.toString())
    }
  }, [_CCIP2Manager_])
  // Capture Ownerhash hook
  React.useEffect(() => {
    if (_Ownerhash_) {
      if (_Ownerhash_.toString().length > 2) {
        setOwnerhash(`ipns://${ensContent.decodeContenthash(_Ownerhash_!.toString()).decoded}`)
      } else {
        setOwnerhash(undefined)
      }
    }
  }, [_Ownerhash_])
  React.useEffect(() => {
    if (_Recordhash_) {
      if (_Recordhash_.toString().length > 2  && (_Recordhash_ !== _Ownerhash_)) {
        setRecordhash(`ipns://${ensContent.decodeContenthash(_Recordhash_!.toString()).decoded}`)
      } else {
        setRecordhash(undefined)
      }
    }
  }, [_Recordhash_, _Ownerhash_])

  // Returns Owner of wrapped/legacy ENS Domain
  function getOwner() {
    if (_OwnerLegacy_) {
      if (_OwnerLegacy_?.toString() === constants.ensContracts[chain === '1' ? 7 : 3]) {
        return _OwnerWrapped_ ? _OwnerWrapped_.toString() : constants.zeroAddress
      } else {
        return _OwnerLegacy_.toString()
      }
    } else {
      if (_OwnerDomain_) {
        if (_OwnerDomain_ && _OwnerDomain_?.toString() === constants.ensContracts[chain === '1' ? 7 : 3]) {
          return _OwnerWrapped_ ? _OwnerWrapped_.toString() : constants.zeroAddress
        } else {
          return _OwnerDomain_.toString()
        }
      } else {
        return constants.zeroAddress
      }
    }
  }
                        
  // Sets option between Ownerhash and Recordhash
  React.useEffect(() => {
    if (trigger && !write) {
      if (trigger !== 'resolver') {
        if (trigger === 'recordhash') {
          setConfirm(true)
          setHashType('recordhash')
        }
      } else {
        if (optionsModalState.trigger) {
          setHashType(optionsModalState.modalData === '1' ? 'recordhash' : 'ownerhash')
          migrate()
        }
      }
    } else if (trigger && write) {
      if (recordhash) {
        setHashType('recordhash')
      } 
      if (ownerhash && !recordhash) {
        setHashType('ownerhash')
      }
      setUpdateRecords(true)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger, optionsModalState, write])

  // Sets option between Ownerhash and Recordhash
  React.useEffect(() => {
    if (confirmModalState.trigger && confirmModalState.modalData) {
      setConfirm(false)
      setSalt(true)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [confirmModalState])

  // Sets in-app ENS domain manager
  React.useEffect(() => {
    if (_Wallet_) {
      let _Owner_ = getOwner()
      // Set Managers
      if (onChainManager && onChainManager.toString() === 'true') {
        // Set connected account as in-app manager if it is authorised
        setManagers([_Wallet_])
      } else {
        // Set owner and controller as in-app managers if no on-chain manager exists
        setManagers([_Owner_])
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenIDLegacy, _OwnerLegacy_, _OwnerWrapped_, onChainManager, _OwnerDomain_, tokenIDWrapper])

  // Sets Wrapper status of ENS Domain
  React.useEffect(() => {
    if (_OwnerLegacy_) {
      if (_OwnerLegacy_?.toString() === constants.ensContracts[chain === '1' ? 7 : 3]) {
        setWrapped(true)
      } else {
        setWrapped(false)
      }
    } else {
      if (_OwnerDomain_?.toString() === constants.ensContracts[chain === '1' ? 7 : 3]) {
        setWrapped(true)
      } else {
        setWrapped(false)
      }
    }
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_OwnerLegacy_, _OwnerDomain_])

  // Send data to Home/Account-page and trigger update
  const handleSuccess = () => {
    handleParentModalData(_ENS_);
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
      let labelhash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(_ENS_.split('.eth')[0]))
      let namehash = ethers.utils.namehash(_ENS_)
      if (_ENS_.split('.').length > 2) {
        setTokenIDLegacy(namehash)
      } else {
        setTokenIDLegacy(ethers.BigNumber.from(labelhash).toString())
      }
      
      setTokenIDWrapper(ethers.BigNumber.from(namehash).toString())
      getResolver()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [browser]);
 
  // Triggers S1(K1) after password is set
  React.useEffect(() => {
    if (saltModalState.trigger && !updateRecords && !keypair && trigger) {
      setSigCount(1)
      signMessage({ 
        message: statementIPNSKey(
          ethers.utils.keccak256(ethers.utils.solidityPack(
            ['bytes32', 'address'], 
            [
              ethers.utils.keccak256(ethers.utils.solidityPack(['string'], [saltModalState.modalData])), 
              _Wallet_
            ]
          )),
          hashType
        ) 
      })
      setKeygen(true)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saltModalState, recordhash, trigger]);

  // Triggers S1(K1) after password is set
  React.useEffect(() => {
    setLoading(true)
    if (sigIPNS && !keypair) {
      setMessage(['Generating IPNS Key', ''])
      const keygen = async () => {
        const _origin = hashType === 'ownerhash' ? `eth:${_Wallet_ ? _Wallet_ : constants.zeroAddress}` : _ENS_
        const __keypair = await _KEYGEN(_origin, caip10, sigIPNS, saltModalState.modalData)
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
        let key = constants.formatkey(keypair)
        const w3name = await Name.from(ed25519_2.etc.hexToBytes(key))
        const CID_IPNS = w3name.toString()
        setCID(CID_IPNS)
        setMessage(['IPNS CID Generated', ''])
      }
      CIDGen()
      // Set query for on-chain manager [v2]
      setOnChainManagerQuery(
        [
          getOwner(),
          ethers.utils.namehash(ENS),
          keypair ? ethers.utils.computeAddress(`0x${keypair[1][0]}`) : constants.zeroAddress
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
  } = useContractWrite({
    address: `0x${!wrapped ? constants.ensConfig[0].addressOrName.slice(2) : constants.ensConfig[chain === '1' ? 7 : 3].addressOrName.slice(2)}`,
    abi: !wrapped ? constants.ensConfig[0].contractInterface : constants.ensConfig[chain === '1' ? 7 : 3].contractInterface,
    functionName: 'setResolver',
    args: [ethers.utils.namehash(_ENS_), ccip2Contract]
  })

  // Sets Recordhash in CCIP2 Resolver
  const {
    data: response2of2,
    write: initRecordhash,
    isLoading: isSetRecordhashLoading,
    isSuccess: isSetRecordhashSuccess,
    isError: isSetRecordhashError
  } = useContractWrite({
    address: `0x${ccip2Config.addressOrName.slice(2)}`,
    abi: ccip2Config.contractInterface,
    functionName: 'setRecordhash',
    args: [ethers.utils.namehash(_ENS_), constants.encodeContenthash(CID)]
  })

  // Get gas cost estimate for hypothetical on-chain record update
  async function getGas(key: string, value: string) {
    const getGasAmountForContractCall = async () => {
      const contract = new web3.eth.Contract(
        constants.ensConfig[chain === '1' ? 4 : 6].contractInterface as AbiItem[], 
        constants.ensConfig[chain === '1' ? 4 : 6].addressOrName
      );
      let gasAmount: any
      if (key === 'contenthash') {
        gasAmount = await contract.methods.setContenthash(ethers.utils.namehash(_ENS_), ensContent.encodeContenthash(value).encoded).estimateGas({ from: _Wallet_ })
      } else if (key === 'avatar') {
        gasAmount = await contract.methods.setText(ethers.utils.namehash(_ENS_), key, value).estimateGas({ from: _Wallet_ })
      } else if (key === 'addr') {
        gasAmount = await contract.methods.setAddr(ethers.utils.namehash(_ENS_), value).estimateGas({ from: _Wallet_ })
      }
      return gasAmount
    }
    const gas = await getGasAmountForContractCall()
    return gas
  }
  
  // Triggers Resolver migration after IPNS CID is generated and validated 
  React.useEffect(() => {
    if (states.includes('recordhash') || states.includes('resolver')) {
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
        if (!['resolver', 'recordhash'].includes(item.type) && 
          states.includes(item.type) 
        ) 
        {
          return { 
            ...item, 
            label: 'Edit All',
            help: 'set multiple records in one click'
          };
        } else {
          return { 
            ...item, 
            label: item.type !== 'resolver' ? (item.type !== 'recordhash' ? 'Edit' : 'Set') : 'Migrate'
          };
        }
      });
      setPreCache(_updatedList)
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
        active: resolver !== ccip2Contract
      };
    })
    setPreCache(_updatedList)
    setStates([])
    setCID('') // Purge CID from local storage 
    setSigIPNS('') // Purge IPNS Signature S1 from local storage 
    setSigApproved('') // Purge Manager Signature S2 from local storage 
    setSignatures(EMPTY_STRING()) // Purge Record Signatures from local storage 
    setSaltModalState({
      modalData: undefined,
      trigger: false
    }) // Purge IPNS password/identifier
    setKeypair(undefined) // Purge keypairs from local storage 
    setNewValues(EMPTY_STRING())
    setSustain(false)
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
  async function getContenthash(resolver: ethers.providers.Resolver) {
    await resolver.getContentHash()
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
  }

  // Get Avatar for ENS domain second
  async function getAvatar() {
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
  }

  // Get Addr for ENS domain at last
  async function getRecord() {
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
  }

  // Get Resolver for ENS domain
  async function getResolver() {
    await provider.getResolver(_ENS_)
      .then(response => {
        setMessage(['This May Take a While', ''])
        if (response?.address) {
          setResolver(response?.address)
          if (response?.address === ccip2Contract) {
            getContenthash(response)
          } else {
            setContenthash('')
            setAvatar('')
            setAddr('')
            setFinish(true)
          }
        }
      })
  }

  // Function for writing IPNS Revision metadata to NameSys backend; needed for updates
  async function writeRevision(revision: Name.Revision, gas: {}) {
    const request = {
      ens: _ENS_,
      owner: _Wallet_,
      manager: keypair ? ethers.utils.computeAddress(`0x${keypair[1][0]}`) : constants.zeroAddress,
      managerSignature: sigApproved,
      revision: Revision.encode(revision),
      chain: chain,
      gas: JSON.stringify(gas), 
      version: JSON.stringify(revision, (key, value) => {
        return typeof value === 'bigint' ? value.toString() : value;
      }),
      timestamp: timestamp,
      hashType: hashType
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
      setMessage(['Revision Update Failed', ''])
      setCrash(true)
      setLoading(false)
      setSustain(true)
      setColor('orangered')
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
    const prefix = value.substring(0, 7)
    const ipnsRegex = /^[a-z0-9]{62}$/
    const ipfsRegexCID0 = /^Qm[1-9A-HJ-NP-Za-km-z]{44}$/
    const ipfsRegexCID1 = /^bafy[a-zA-Z0-9]{56}$/
    return true
    /*
    return (
      (prefix === 'ipns://') ||
      (prefix === 'ipfs://')
    )
    return (
      (prefix === 'ipns://' && ipnsRegex.test(value)) || // Check IPNS
      (prefix === 'ipfs://' && ipfsRegexCID0.test(value)) || // Check IPFS CIDv0
      (prefix === 'ipfs://' && ipfsRegexCID1.test(value)) // Check IPFS CIDv1
    )
    */
  }

  // Upates new record values in local storage before pushing updates
  function setValues(key: string, _value: string) {
    let value = _value.trim()
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
    setPreCache(_updatedList)
  }

  // Get records from history on NameSys backend
  // Must get Revision for IPNS update
  async function getUpdate(_ownerhash: string) {
    const request = {
      type: 'read',
      ens: _ENS_,
      owner: _Wallet_,
      recordsTypes: 'all',
      recordsValues: 'all',
      chain: chain,
      ownerhash: _ownerhash,
      hashType: hashType
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
            queue: latestTimestamp(data.response.timestamp),
            ownerstamp: data.response.ownerstamp
          }
          setHistory(_HISTORY)
          var _Ownerstamps: number[] = []
          if (_HISTORY.ownerstamp.length > 0) {
            for (const key in _HISTORY.ownerstamp) {
              _Ownerstamps.push(Number(_HISTORY.ownerstamp[key]))
            }
          }
          if (_ownerhash && _Ownerstamps.length > 0) {
            setQueue(Math.round(Date.now()/1000) - Math.max(..._Ownerstamps) - waitingPeriod)
          } else {
            setQueue(Math.round(Date.now()/1000) - latestTimestamp(data.response.timestamp) - waitingPeriod)
          }
        })
    } catch(error) {
      console.error('ERROR:', 'Failed to read from CCIP2 backend')
    }
  }

  // Triggers fetching history from NameSys backend
  React.useEffect(() => {
    if (finish) {
      getUpdate(ownerhash ? ownerhash : '')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finish, ownerhash]);

  // Triggers setting metadata
  React.useEffect(() => {
    if (history && queue && resolver) {
      if (recordhash) {
        setMetadata(recordhash)
        setHashType('recordhash')
      } else if (ownerhash) {
        setMetadata(ownerhash)
        setHashType('ownerhash')
      } else {
        setMetadata('')
        setHashType('recordhash')
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history, queue, resolver, recordhash, ownerhash]);

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
          active: resolver === ccip2Contract
        };
      }
      return item;
    });
    setPreCache(_updatedList)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger, resolver]);

  // Handles password prompt for S1(K1)
  React.useEffect(() => {
    if (updateRecords) { // Check for false → true
      if (!keypair || !CID) {
        setSalt(true) // Start K0 keygen if it doesn't exist in local storage
        setUpdateRecords(false) // Reset
      } else {
        setLoading(true)
        setMessage(['Setting Record', ''])
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateRecords]);

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
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [write, keypair]);

  // Handles generating signatures for off-chain manager
  React.useEffect(() => {
    // Handle Signature S3(K1)
    if (write && keypair && !onChainManager && !sigApproved && signatures) {
      __signMessage() // Sign with K1
    } else if (write && keypair && onChainManager && signatures) {
      setSigApproved('0x')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onChainManager, signatures]);

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
        owner: _Wallet_ ? _Wallet_ : constants.zeroAddress,
        ipns: CID,
        recordsTypes: states,
        recordsValues: _encodedValues,
        recordsRaw: newValues,
        revision: history.revision,
        chain: chain,
        hashType: hashType,
      }
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
                    let _gas = getGas(item.type, data.response[item.type])	
                    const _promise = async () => {	
                      await Promise.all([_gas])	
                    }
                    await _promise()	
                    _gas.then((value: number) => {	
                      let _gasData = gasData && gasData.formatted && gasData.formatted.gasPrice ? Number(gasData.formatted.gasPrice) : 0
                      gas[item.type] = value * _gasData * 0.000000001 * 0.000000001	
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
                let key = constants.formatkey(keypair)
                let w3name: Name.WritableName
                const keygen = async () => {
                  w3name = await Name.from(ed25519_2.etc.hexToBytes(key))
                  const pin = async () => {
                    if (data.response.ipfs && w3name && gas) {
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
                        states.map((_state) => {
                          setStates(prevState => prevState.filter(item => item !== _state))
                        })
                        setLegit(EMPTY_BOOL())
                      }, 2000);
                      // Update values in the modal to new ones
                      setTimestamp(data.response.timestamp)
                      const _updatedList = list.map((item) => {
                        if (!['resolver', 'recordhash'].includes(item.type)) {
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
                      setPreCache(_updatedList)
                      setNewValues(EMPTY_STRING())
                      setSignatures(EMPTY_STRING())
                      setSigCount(0)
                      setUpdateRecords(false) // Reset
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
          setSustain(true)
          setColor('red')
        }
      }
      editRecord()
      setWrite(false)
    }
    // Handle exception
    if (!write) {
      setUpdateRecords(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signatures, sigApproved]);

  // Handles setting setRecordhash on CCIP2 Resolver
  React.useEffect(() => {
    if (isMigrateSuccess && txSuccess1of2 && migrated) {
      if (optionsModalState.modalData === '1') {
        setLoading(true)
        setMessage(['Waiting For Keygen', ''])
        setSalt(true)
      } else {
        const _updatedList = list.map((item) => {
          if (constants.forbidden.includes(item.type)) {
            return { 
              ...item, 
              editable: false, 
              active: false,
              value: resolver // Update Resolver [!]
            }
          } else {
            const Clause = {
              ...item, 
              editable: true, 
              active: true
            }
            if (item.type === 'recordhash') {
              return { 
                ...Clause
              }
            } else {
              return { 
                ...Clause, 
                value: '',
              }
            }
          }
        });
        setPreCache(_updatedList)
        setLegit(EMPTY_BOOL())
        setStates([])
        setLoading(false)
        setSuccess('<span style="color: lightgreen">Off-chain Setup Complete with <span style="color: cyan">Ownerhash</span>. Enjoy!</span>')
        setIcon('check_circle_outline')
        setColor('lime')
        setSuccessModal(true)
        handleSuccess()
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMigrateSuccess, txSuccess1of2, migrated, optionsModalState, resolver]);

  // Handles setting setRecordhash on CCIP2 Resolver
  React.useEffect(() => {
    if (preCache) {
      setList(preCache)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preCache]);

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
            return { 
              ...Clause, 
              value: '',
            }
          }
        }
      });
      setPreCache(_updatedList)
      setLegit(EMPTY_BOOL())
      setStates([])
      setLoading(false)
      setSuccess('<span style="color: lightgreen">Off-chain Setup Complete with <span style="color: cyan">Recordhash</span>. Enjoy!</span>. Enjoy!')
      setIcon('check_circle_outline')
      setColor('lime')
      setSuccessModal(true)
      handleSuccess()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recordhash]);

  // Sets migration state to true upon successful transaction 1 receipt
  React.useEffect(() => {
    if (isMigrateSuccess && txSuccess1of2) {
      const pin = async () => {
        setResolver(ccip2Contract)
        setMigrated(true)
      }
      pin()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMigrateSuccess, txSuccess1of2]);

  // Handles transaction wait
  React.useEffect(() => {
    if (isMigrateLoading && !isSetRecordhashLoading) {
      setLoading(true) // 
      setFinish(false)
      setMessage(['Waiting for Transaction', '1'])
    } 
    if (isMigrateError && !isSetRecordhashLoading) {
      setMessage(['Transaction Declined by User', ''])
      setCrash(true)
      setLoading(false)
      setStates([])
    } 
    if (!isMigrateLoading && isSetRecordhashLoading) {
      setLoading(true) //
      setFinish(false)
      setMessage(['Waiting for Transaction', '2'])
    }
    if (isSetRecordhashError && !isSetRecordhashLoading) {
      setMessage(['Transaction Declined by User', ''])
      setCrash(true)
      setLoading(false)
      setStates([])
    } 
  }, [isMigrateLoading, isSetRecordhashLoading, isMigrateError, isSetRecordhashError]);

  // Handles first transaction loading and error
  React.useEffect(() => {
    if (txLoading1of2 && !txError1of2) {
      setLoading(true)
      setMessage(['Waiting for Confirmation', '1'])
    }
    if (!txLoading1of2 && txError1of2) {
      setMessage(['Transaction Failed', '1'])
      setCrash(true)
      setLoading(false)
      setStates([])
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [txLoading1of2, txError1of2]);

  // Handles second transaction loading and error
  React.useEffect(() => {
    if (txLoading2of2 && !txError2of2) {
      setLoading(true)
      setMessage(['Waiting for Confirmation', '2'])
    }
    if (!txLoading2of2 && txError2of2) {
      setMessage(['Transaction Failed', '2'])
      setCrash(true)
      setLoading(false)
      setStates([])
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [txLoading2of2, txError2of2]);

  // Handles signature loading and error
  React.useEffect(() => {
    if (signLoading && !signError) {
      setLoading(true)
      setMessage(['Waiting for Signature', sigCount.toString()])
    }
    if (signError && !signLoading) {
      setMessage(['Signature Failed', sigCount.toString()])
      setCrash(true)
      setLoading(false)
      setStates([])
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
              //src={ avatar.replace('ipfs.io', 'pinata.cloud') } 
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
                    <span style={{ fontFamily: 'SF Mono', fontSize: '22px' }}>{optionsModalState.trigger ? String(Number(optionsModalState.modalData) + 1) : '2'}</span>
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
              }}
            >
              <div
                style={{
                  marginBottom: '15px',
                  marginTop: '-15px'
                }}
              >
                <span
                  style={{
                    color: 'orange',
                    fontSize: '20px',
                    fontWeight: '700',
                    fontFamily: 'SF Mono'
                  }}
                >
                  {_ENS_.split('.eth')[0]}
                </span>
                <span 
                  style={{ 
                    fontFamily: 'SF Mono',
                    fontSize: '15px', 
                    color: 'cyan'
                  }}
                >
                  .
                </span>
                <span 
                  style={{ 
                    fontFamily: 'Spotnik',
                    fontSize: '11px', 
                    color: 'cyan',
                    fontWeight: '700',
                    letterSpacing: '0px'
                  }}
                >
                  ETH
                </span>
              </div>
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
                      { help }
                    </Help>
                    <Success
                      color={ color }
                      _ENS_={ icon }
                      onClose={() => setSuccessModal(false)}
                      show={successModal}
                    >
                      { success }
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
                          color: constants.blocked.includes(item.type) ? 'orange' : 'cyan',
                          marginRight: '15px'
                        }}
                      >
                        { // Label Recordhash/Ownerhash
                        item.type === 'recordhash' && (
                          <span>
                            { hashType }
                          </span>
                        )}
                        { // Label+
                        item.type !== 'recordhash' && (
                          <span>
                            { item.header }
                          </span>
                        )}
                        { // Set Badge if Resolver is migrated and ONLY Ownerhash is set
                        ['resolver', 'recordhash'].includes(item.type) && resolver === ccip2Contract && !recordhash && ownerhash && (
                          <button 
                            className="button-tiny"
                            onClick={() => { 
                              setHelpModal(true),
                              setIcon('gpp_good'),
                              setColor(item.type === 'resolver' ? 'lime' : 'cyan'),
                              setHelp(item.type === 'resolver' ? '<span>Resolver is <span style="color: lime">Migrated</span></span>' : '<span>Global <span style="color: cyan">Ownerhash</span> is Set</span>')
                            }}
                            data-tooltip={ 'Ready For Off-Chain Use With Ownerhash' }
                          >
                            <div 
                              className="material-icons smol"
                              style={{
                                color: item.type === 'resolver' ? 'lime' : 'cyan'
                              }}
                            >
                              gpp_good
                            </div>
                          </button>
                        )}
                        { // Set Badge if Resolver is migrated and Recordhash is set
                        ['resolver', 'recordhash'].includes(item.type) && resolver === ccip2Contract && recordhash && (
                          <button 
                            className="button-tiny"
                            onClick={() => { 
                              setHelpModal(true),
                              setIcon('gpp_good'),
                              setColor('lime'),
                              setHelp(item.type === 'resolver' ? '<span>Resolver is <span style="color: lime">Migrated</span><span>' : '<span>Domain-specific <span style="color: cyan">Recordhash</span> is Set<span>')
                            }}
                            data-tooltip={ 'Ready For Off-Chain Use With Recordhash' }
                          >
                            <div 
                              className="material-icons smol"
                              style={{
                                color: 'lime',
                                marginLeft: item.type === 'resolver' ? '5px' : '5px'
                              }}
                            >
                              gpp_good
                            </div>
                          </button>
                        )}
                        { // Set Badge if Resolver is migrated and no Recordhash or Ownerhash is set
                        ['resolver', 'recordhash'].includes(item.type) && resolver === ccip2Contract && !recordhash && !ownerhash && (
                          <button 
                            className="button-tiny"
                            onClick={() => { 
                              setHelpModal(true),
                              setIcon(item.type === 'resolver' ? 'gpp_good' : 'cancel'),
                              setColor(item.type === 'resolver' ? 'orange' : 'tomato'),
                              setHelp(item.type === 'resolver' ? '<span>Resolver is <span style="color: lime">Migrated</span><span>' : '<span style="color: cyan">Recordhash</span> Or <span style="color: cyan">Ownerhash</span> <span style="color: orange">not Set</span>')
                            }}
                            data-tooltip={ 'Resolver Migrated But Recordhash Not Set' }
                          >
                            <div 
                              className="material-icons smol"
                              style={{
                                color: item.type === 'resolver' ? 'orange' : 'tomato',
                                marginLeft: item.type === 'resolver' ? '5px' : '5px'
                              }}
                            >
                              { item.type === 'resolver' ? 'gpp_good' : 'cancel' }
                            </div>
                          </button>
                        )}
                        { // Set Badge if Resolver is not migrated and no Recordhash or Ownerhash has been set in the past
                        ['resolver', 'recordhash'].includes(item.type) && resolver !== ccip2Contract && !recordhash && !ownerhash && (
                          <button 
                            className="button-tiny"
                            onClick={() => { 
                              setHelpModal(true),
                              setIcon(item.type === 'resolver' ? 'gpp_bad' : 'cancel'),
                              setColor('tomato'),
                              setHelp(item.type === 'resolver' ? '<span>Resolver is <span style="color: orange">not Migrated</span><span>' : '<span><span style="color: cyan">Recordhash</span> Or <span style="color: cyan">Ownerhash</span> <span style="color: orange">not Set</span></span>')
                            }}
                            data-tooltip={ 'Resolver Not Migrated And Recordhash Not Set' }
                          >
                            <div 
                              className="material-icons smol"
                              style={{
                                color: 'tomato',
                                marginLeft: item.type === 'resolver' ? '5px' : '5px'
                              }}
                            >
                              { item.type === 'resolver' ? 'gpp_bad' : 'cancel' }
                            </div>
                          </button>
                        )}
                        { // Resolver is not migrated but Recordhash has been set in the past
                        ['resolver', 'recordhash'].includes(item.type) && resolver !== ccip2Contract && (recordhash || ownerhash) && (
                          <button 
                            className="button-tiny"
                            onClick={() => { 
                              setHelpModal(true),
                              setIcon(item.type === 'resolver' ? 'gpp_bad' : 'gpp_maybe'),
                              setColor(item.type === 'resolver' ? 'tomato' : (recordhash ? 'orange' : 'cyan')),
                              setHelp(item.type === 'resolver' ? '<span>Resolver <span style="color: orange">not Migrated</span></span>' : (recordhash ? '<span><span style="color: cyan">Recordhash</span> <span style="color: lime">is Set</span></span>' : '<span><span style="color: cyan">Ownerhash</span> <span style="color: lime">is Set</span></span>'))
                            }}
                            data-tooltip={ recordhash ? 'Resolver not Migrated But Recordhash is Set' : 'Resolver not Migrated But Ownerhash is Set' }
                          >
                            <div 
                              className="material-icons smol"
                              style={{
                                color: item.type === 'resolver' ? 'tomato' : (recordhash ? 'orange' : 'cyan'),
                                marginLeft: item.type === 'resolver' ? '5px' : '5px'
                              }}
                            >
                              { item.type === 'resolver' ? 'gpp_bad' : 'gpp_maybe' }
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
                              setColor(constants.blocked.includes(item.type) ? 'orange' : 'cyan'),
                              setHelp(constants.blocked.includes(item.type) ? '<span style="color: orangered">In Process of Bug Fixing</span>' : `<span>${item.help}</span>`)
                            }}
                            data-tooltip={ constants.blocked.includes(item.type) ? 'Temporarily Unavailable' : 'Click to Expand' }
                          >
                            <div 
                              className="material-icons smol"
                              style={{ 
                                color: constants.blocked.includes(item.type) ? 'orange' : 'cyan',
                                marginLeft: item.type === 'recordhash' ? '-5px' : '5px'
                              }}
                            >
                              info_outline 
                            </div>
                          </button>
                        )}    

                        { // Countdown
                        !['resolver', 'recordhash'].includes(item.type) && !constants.blocked.includes(item.type) 
                        && resolver === ccip2Contract && 
                        (recordhash || ownerhash) && (
                          <button 
                            className="button-tiny"
                            onClick={() => { 
                              setHelpModal(true),
                              setIcon('timer'),
                              setColor(queue < 0 ? 'orange' : 'lime'),
                              setHelp(queue < 0 ? '<span><span style="color: orange">Too Soon To Update</span>. Please wait at least <span style="color: cyan">one hour</span> between updates</span>' : '<span><span style="color: lime">Ready</span> For Next Record Update</span>')
                            }}
                            data-tooltip={ 
                              queue < 0 ? 'Too Soon To Update' : 'Ready For Next Update'
                            }
                          >
                            <div 
                              className="material-icons smol"
                              style={{
                                color: queue < 0 ? 'orange' : 'lime',
                                marginLeft: '-5px'
                              }}
                            >
                              timer
                            </div>
                          </button>
                        )}

                        { // Updated State marker
                        item.state && (
                          <div 
                            className="material-icons smol"
                            style={{ 
                              color: crash && sustain ? 'cancel' : 'lime',
                              marginLeft: '-5px'
                            }}
                          >
                            { crash && sustain ? 'cancel' : 'task_alt' }
                          </div>
                        )}
                      </span>
                      <button
                        className="button"
                        disabled={ 
                          constants.blocked.includes(item.type) ||
                          !list[item.key].active ||
                          !legit[item.type] ||
                          item.state ||
                          !_Wallet_ ||
                          !managers.includes(_Wallet_ ? _Wallet_ : '0x0c0cac01ac0ffeecafeNOTHEX')
                        }
                        style={{
                          alignSelf: 'flex-end',
                          height: '25px',
                          width: 'auto',
                          marginTop: '-3px',
                        }}
                        onClick={() => { 
                          setTrigger(item.type),
                          ['resolver', 'recordhash'].includes(item.type) ? setOptions(true) : setWrite(true), // Trigger write for Records
                          ['resolver', 'recordhash'].includes(item.type) ? setStates(prevState => [...prevState, item.type]) : setStates(states) // Update edited keys
                        }}
                        data-tooltip={ item.tooltip }
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
                      placeholder={ constants.blocked.includes(item.type) ? 'Temporarily Unavailable' : item.value }
                      type='text'
                      disabled={ 
                        !item.editable || constants.blocked.includes(item.type)
                      }
                      style={{ 
                        fontFamily: 'SF Mono',
                        fontWeight: '400',
                        fontSize: '14px',
                        width: '100%',
                        wordWrap: 'break-word',
                        textAlign: 'left',
                        marginBottom: '-5px',
                        color: 'rgb(255, 255, 255, 0.75)',
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
        <div id="modal-inner">
          <Gas
            color={ 'lime' }
            _ENS_={ 'check_circle_outline' }
            onClose={() => {
              setGasModal(false),
              setLoading(false)
            }}
            show={gasModal}
          >
            { gas }
          </Gas>
          <Salt
            handleTrigger={handleSaltTrigger}
            handleModalData={handleSaltModalData}
            onClose={() => {
              setSalt(false)
            }}
            show={salt}
          >
          </Salt>
          <Options
            handleTrigger={handleOptionsTrigger}
            handleModalData={handleOptionsModalData}
            onClose={() => {
              setOptions(false)
              }}
            show={options && trigger === 'resolver'}
          >
            { ownerhash ? true :  false }
          </Options>
          <Confirm
            handleTrigger={handleConfirmTrigger}
            handleModalData={handleConfirmModalData}
            onClose={() => {
              setConfirm(false)
              }}
            show={confirm && !salt}
          >
            {''}
          </Confirm>
          <Error
            onClose={() => {
              setCrash(false),
              setLoading(false)
            }}
            color={color}
            show={crash && !loading}
            title={'cancel'}
          >
            { message[0] }
          </Error>
            </div>
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
