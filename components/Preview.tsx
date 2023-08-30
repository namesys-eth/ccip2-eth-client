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
import Gateway from '../components/Gateway'
import Options from '../components/Options'
import Error from '../components/Error'
import Info from '../components/Info'
import Gas from '../components/Gas'
import Loading from '../components/LoadingColors'
import Success from '../components/Success'
import Confirm from '../components/Confirm'
import * as constants from '../utils/constants'
import { KEYGEN } from '../utils/keygen'
import * as Name from 'w3name'
import * as ed25519v2 from 'ed25519-2.0.0' // @noble/ed25519 v2.0.0
import * as ensContent from '../utils/contenthash'
import * as verifier from '../utils/verifier'
import { isMobile } from 'react-device-detect'
import {
  useAccount,
  useFeeData,
  useContractWrite,
  useSignMessage,
  useWaitForTransaction,
  useContractRead
} from 'wagmi' // Legacy Wagmi 1.6
import { Resolver } from "@ethersproject/providers"

// Modal data to pass back to homepage
interface ModalProps {
  _ENS_: string,
  chain: string,
  show: boolean
  onClose: any
  handleParentModalData: (data: string) => void
  handleParentTrigger: (data: boolean) => void
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
  // React States
  const [browser, setBrowser] = React.useState(false); // Triggers at modal load
  const { data: gasData, isError } = useFeeData(); // Current gas prices
  const [loading, setLoading] = React.useState(true); // Loading process indicator
  const [migrated, setMigrated] = React.useState(false); // Setup indicator; Setup = Resolver migration + Recordhash setting
  const [keygen, setKeygen] = React.useState(false); // IPNS keygen trigger following signature
  const [crash, setCrash] = React.useState(false);  // Signature fail indicator
  const [CID, setCID] = React.useState(''); // IPNS pubkey/CID value
  const [ENS, setENS] = React.useState(''); // ENS name; used to trigger useContractRead()
  const [helpModal, setHelpModal] = React.useState(false); // Help modal trigger
  const [successModal, setSuccessModal] = React.useState(false); // Success modal trigger
  const [gasModal, setGasModal] = React.useState(false); // Gas savings modal trigger
  const [conclude, setConclude] = React.useState(false); // Indicates when all records have finished fetching
  const [resolver, setResolver] = React.useState<any>(); // Resolver for ENS Domain
  const [resolveCall, setResolveCall] = React.useState<any>(); // Resolver object for querying records
  const [sync, setSync] = React.useState(false); // Records sync flag
  const [addr, setAddr] = React.useState(''); // Addr record for ENS Domain
  const [avatar, setAvatar] = React.useState(''); // Avatar record for ENS Domain
  const [thumbnail, setThumbnail] = React.useState(''); // Avatar record for ENS Domain
  const [recordhash, setRecordhash] = React.useState<any>(undefined); // Recordhash for CCIP2 Resolver
  const [ownerhash, setOwnerhash] = React.useState<any>(undefined); // Ownerhash for CCIP2 Resolver
  const [tokenIDLegacy, setTokenIDLegacy] = React.useState(''); // Legacy Token ID of ENS Domain
  const [tokenIDWrapper, setTokenIDWrapper] = React.useState(''); // Wrapper Token ID of ENS Domain
  const [managers, setManagers] = React.useState<string[]>([]); // Manager of ENS Domain
  const [contenthash, setContenthash] = React.useState(''); // Contenthash record for ENS Domain
  const [salt, setSalt] = React.useState(false); // Salt (password/key-identifier) for IPNS keygen
  const [gateway, setGateway] = React.useState(false); // Gateway URL for storage
  const [refresh, setRefresh] = React.useState(''); // Refresh record trigger
  const [refreshedItem, setRefreshedItem] = React.useState(''); // Refresh record item
  const [refreshedValue, setRefreshedValue] = React.useState(''); // Refresh record value
  const [list, setList] = React.useState<any[]>([]); // Internal LIST[] object with all record keys and values
  const [preCache, setPreCache] = React.useState<any[]>([]); // Copy of LIST[] object
  const [trigger, setTrigger] = React.useState<any>(undefined); // Triggered upon button click adjacent to the record in Preview modal
  const [safeTrigger, setSafeTrigger] = React.useState<string>(''); // Cache state for trigger
  const [help, setHelp] = React.useState(''); // Sets help text for the Help modal
  const [isSigner, setIsSigner] = React.useState(false); // Sets help text for the Help modal
  const [success, setSuccess] = React.useState(''); // Sets success text for the Success modal
  const [gas, setGas] = React.useState<{}>({}); // Sets historical gas savings
  const [wrapped, setWrapped] = React.useState(false); // Indicates if the ENS Domain is wrapped
  const [keypairIPNS, setKeypairIPNS] = React.useState<[string, string]>(); // Sets generated K2 keys
  const [keypairSigner, setKeypairSigner] = React.useState<[string, string]>(); // Sets generated K2 and K0 keys
  const [updateRecords, setUpdateRecords] = React.useState(false); // Triggers signature for record update
  const [write, setWrite] = React.useState(false); // Triggers update of record to the NameSys backend and IPNS
  const [states, setStates] = React.useState<any[]>([]); // Contains keys of active records (that have been edited in the modal)
  const [newValues, setNewValues] = React.useState(constants.EMPTY_STRING()); // Contains new values for the active records in {a:b} format
  const [icon, setIcon] = React.useState(''); // Sets icon for the loading state
  const [color, setColor] = React.useState(''); // Sets color for the loading state
  const [message, setMessage] = React.useState(['', '']); // Sets message for the loading state
  const [options, setOptions] = React.useState(false); // Provides option with Ownerhash and Recordhash during migration
  const [confirm, setConfirm] = React.useState(false); // Confirmation modal
  const [infoModal, setInfoModal] = React.useState(false); // Info modal
  const [signatures, setSignatures] = React.useState(constants.EMPTY_STRING()); // Contains S2(K0) signatures of active records in the modal
  const [onChainManagerQuery, setOnChainManagerQuery] = React.useState<string[]>(['', '', '']); // CCIP2 Query for on-chain manager
  const [legit, setLegit] = React.useState(constants.EMPTY_BOOL()); // Whether record edit is legitimate
  const [timestamp, setTimestamp] = React.useState(''); // Stores update timestamp returned by backend
  const [hashType, setHashType] = React.useState(''); // Recordhash or Ownerhash storage
  const [hashIPFS, setHashIPFS] = React.useState(''); // IPFS hash behind IPNS
  const [imageLoaded, setImageLoaded] = React.useState<boolean | undefined>(undefined); // Whether avatar resolves or not
  const [recentCrash, setRecentCrash] = React.useState(false) // Crash state
  const [goodSalt, setGoodSalt] = React.useState(false) // If generated CID matches the available storage
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
  const [gatewayModalState, setGatewayModalState] = React.useState<constants.MainBodyState>({
    modalData: undefined,
    trigger: false
  }); // Confirm modal state
  const [successModalState, setSuccessModalState] = React.useState<constants.MainBodyState>({
    modalData: undefined,
    trigger: false
  }); // Confirm modal state
  const [history, setHistory] = React.useState(constants.EMPTY_HISTORY); // Record history from last update
  const [sigIPNS, setSigIPNS] = React.useState(''); // Signature S1(K1) for IPNS keygen
  const [sigSigner, setSigSigner] = React.useState(''); // Signature S4(K1) for Signer
  const [sigApproved, setSigApproved] = React.useState(''); // Signature S3(K1) for Records Manager
  const [sigCount, setSigCount] = React.useState(0); // Signature Count
  const [processCount, setProcessCount] = React.useState(0); // Process Count
  const [queue, setQueue] = React.useState(0); // Sets queue countdown between successive updates
  const [sustain, setSustain] = React.useState(false); // Sustains status of record update
  const [onChainManager, setOnChainManager] = React.useState(''); // Sets CCIP2 Manager

  // Variables
  const { address: _Wallet_ } = useAccount()
  const { Revision } = Name // W3Name Revision object
  const recoveredAddress = React.useRef<string>()
  const ccip2Contract = constants.ccip2[chain === '1' ? 1 : 0]
  const ccip2Config = constants.ccip2Config[chain === '1' ? 1 : 0]
  const apiKey = chain === '5' ? process.env.NEXT_PUBLIC_ALCHEMY_ID_GOERLI : process.env.NEXT_PUBLIC_ALCHEMY_ID_MAINNET
  const network = chain === '5' ? 'goerli' : 'homestead'
  const provider = new ethers.providers.AlchemyProvider(network, apiKey)
  const alchemyEndpoint = 'https://eth-goerli.g.alchemy.com/v2/' + apiKey
  const web3 = new Web3(alchemyEndpoint)
  const caip10 = `eip155:${chain}:${_Wallet_}`  // CAIP-10
  const origin = `eth:${_Wallet_ || constants.zeroAddress}`
  const PORT = process.env.NEXT_PUBLIC_PORT
  const SERVER = process.env.NEXT_PUBLIC_SERVER
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

  /// Preview Domain Metadata
  // Read Legacy ENS Registry for ENS domain Owner
  const { data: _OwnerLegacy_, isLoading: legacyLoading, isError: legacyError } = useContractRead({
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
    args: [getOwner(), ethers.utils.namehash(ENS), keypairSigner && keypairSigner[0] ? ethers.utils.computeAddress(`0x${keypairSigner[0]}`) : constants.zeroAddress]
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
    args: [ethers.utils.hexZeroPad(getOwner(), 32).toLowerCase()]
  })
  // Read Recordhash from CCIP2 Resolver
  const { data: _Recordhash_ } = useContractRead({
    address: `0x${ccip2Config.addressOrName.slice(2)}`,
    abi: ccip2Config.contractInterface,
    functionName: 'getRecordhash',
    args: [ethers.utils.namehash(ENS)]
  })

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
    args: [ethers.utils.namehash(ENS), ccip2Contract]
  })

  // Sets Short Recordhash in CCIP2 Resolver
  const {
    data: response2of2,
    write: initRecordhash,
    isLoading: isSetRecordhashLoading,
    isSuccess: isSetRecordhashSuccess,
    isError: isSetRecordhashError
  } = useContractWrite({
    address: `0x${ccip2Config.addressOrName.slice(2)}`,
    abi: ccip2Config.contractInterface,
    functionName: 'setShortRecordhash',
    args: [
      ethers.utils.namehash(ENS),
      ethers.utils.defaultAbiCoder.encode(
        ['bytes32'],
        [CID ? `0x${constants.encodeContenthash(CID).split(constants.prefix)[1]}` : constants.zeroBytes]
      )
    ]
  })

  // Wagmi hook for awaiting transaction processing
  const { isSuccess: txSuccess1of2, isError: txError1of2, isLoading: txLoading1of2 } = useWaitForTransaction({
    hash: response1of2?.hash,
  })
  const { isSuccess: txSuccess2of2, isError: txError2of2, isLoading: txLoading2of2 } = useWaitForTransaction({
    hash: response2of2?.hash,
  })

  // Handle Options modal data return
  const handleOptionsModalData = (data: string | undefined) => {
    setOptionsModalState(prevState => ({ ...prevState, modalData: data }))
  }
  // Handle Options modal trigger
  const handleOptionsTrigger = (trigger: boolean) => {
    setOptionsModalState(prevState => ({ ...prevState, trigger: trigger }))
    if (trigger) {
      setSafeTrigger('1')
    } else {
      setSafeTrigger('0')
      setTrigger('')
    }
  }

  // Handle Confirm modal data return
  const handleConfirmModalData = (data: string | undefined) => {
    setConfirmModalState(prevState => ({ ...prevState, modalData: data }))
  }
  // Handle Confirm modal trigger
  const handleConfirmTrigger = (trigger: boolean) => {
    setConfirmModalState(prevState => ({ ...prevState, trigger: trigger }))
    if (trigger) {
      setSafeTrigger('1')
    } else {
      setSafeTrigger('0')
      setTrigger('')
    }
  }

  // Handle Success modal data return
  const handleSuccessModalData = (data: string | undefined) => {
    setSuccessModalState(prevState => ({ ...prevState, modalData: data }))
  }
  // Handle Success modal trigger
  const handleSuccessTrigger = (trigger: boolean) => {
    setSuccessModalState(prevState => ({ ...prevState, trigger: trigger }))
  }

  // Handle Salt modal data return
  const handleSaltModalData = (data: string | undefined) => {
    setSaltModalState(prevState => ({ ...prevState, modalData: data }))
  }
  // Handle Salt modal trigger
  const handleSaltTrigger = (trigger: boolean) => {
    setSaltModalState(prevState => ({ ...prevState, trigger: trigger }))
    if (trigger) {
      setSafeTrigger('1')
    } else {
      setSafeTrigger('0')
      setTrigger('')
    }
    setSalt(false)
  }

  // Handle Salt modal data return
  const handleGatewayModalData = (data: string | undefined) => {
    setGatewayModalState(prevState => ({ ...prevState, modalData: data }))
  }
  // Handle Salt modal trigger
  const handleGatewayTrigger = (trigger: boolean) => {
    setGatewayModalState(prevState => ({ ...prevState, trigger: trigger }))
    if (trigger) {
      setSafeTrigger('1')
    } else {
      setSafeTrigger('0')
      setTrigger('')
    }
  }

  // Handle Info modal data return
  const handleInfoModalData = (data: string | undefined) => {
  }
  // Handle Info modal trigger
  const handleInfoTrigger = (trigger: boolean) => {
  }

  // Handle Preview modal close
  const handleCloseClick = (e: { preventDefault: () => void; }) => {
    setSigApproved('') // Purge Manager Signature S2 from local storage 
    setSignatures(constants.EMPTY_STRING()) // Purge Record Signatures from local storage 
    setKeypairSigner(undefined)
    setKeypairIPNS(undefined)
    setSigSigner('')
    setSigIPNS('')
    handleParentModalData(`${ENS}+`)
    handleParentTrigger(true)
    e.preventDefault()
    onClose()
  }

  // Initialises internal LIST[] object
  function setMetadata(_recordhash: string, _addr: string, _contenthash: string, _avatar: string) {
    let _LIST = [
      {
        key: 0,
        header: hashType === 'recordhash' ? 'Recordhash' : (hashType === 'gateway' ? 'Gateway' : 'Ownerhash'),
        type: 'storage',
        value: _recordhash,
        editable: false,
        active: resolver === ccip2Contract,
        state: false,
        label: 'Set',
        help: '<span>On-chain Record <span style="color: cyan">Storage</span> Pointer</span>',
        tooltip: 'Set New Storage'
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
        value: _avatar,
        editable: resolver === ccip2Contract && queue > 0,
        active: constants.isAvatar(_avatar) && queue > 0,
        state: false,
        label: 'Edit',
        help: '<span>Set your <span style="color: cyan">avatar</span></span>',
        tooltip: 'Set Avatar'
      },
      {
        key: 3,
        header: 'Address',
        type: 'addr',
        value: _addr,
        editable: resolver === ccip2Contract && queue > 0,
        active: constants.isAddr(_addr) && queue > 0,
        state: false,
        label: 'Edit',
        help: '<span>Set your default <span style="color: cyan">address</span></span>',
        tooltip: 'Set Address'
      },
      {
        key: 4,
        header: 'Contenthash',
        type: 'contenthash',
        value: _contenthash,
        editable: resolver === ccip2Contract && queue > 0,
        active: constants.isContenthash(_contenthash) && queue > 0,
        state: false,
        label: 'Edit',
        help: '<span>Set your <span style="color: cyan">web contenthash</span></span>',
        tooltip: 'Set Contenthash'
      }
    ]
    concludeGet(_LIST) // Assign _LIST
  }

  // Set Records to show for ENS domain
  function concludeGet(data: React.SetStateAction<any[]> | undefined) {
    if (data) {
      setPreCache(data)
    }
  }

  /// Keys & Signature Definitions
  /* K0 = Generated secp256k1 Keypair 
   * K1 = Wallet secp256k1 Keypair 
   * K2 = Generated ed25519 Keypair
   * S1 = Signature for K2 Generation (Signed by K1)
   * S2 = Signature for Records (Signed by K0)
   * S3 = Signature for Manager Approval (Signed by K1)
   * S4 = Signature for K0 Generation (Signed by K1)
   */
  // Signature S1 statement; S1(K1) [IPNS Keygen]
  // S1 is not recovered on-chain; no need for buffer prepend and hashing of message required to sign
  function statementIPNSKey(extradata: string, type: string) {
    let _toSign = `Requesting Signature To Generate IPNS Key\n\nOrigin: ${['recordhash', 'storage'].includes(type) ? ENS : origin}\nKey Type: ed25519\nExtradata: ${extradata}\nSigned By: ${caip10}`
    let _digest = _toSign
    return _digest
  }
  // Signature S2 statement; S2(K0) [Record Signature]
  // S2 is recovered on-chain; requires buffer prepend, hashing of message and arrayifying it
  function statementRecords(recordType: string, extradata: string, signer: string) {
    let _signer = 'eip155:' + chain + ':' + ethers.utils.computeAddress(`0x${signer}`)
    let _toSign = `Requesting Signature To Update ENS Record\n\nOrigin: ${ENS}\nRecord Type: ${recordType}\nExtradata: ${extradata}\nSigned By: ${_signer}`
    return _toSign
  }
  // Signature S3 statement; S3(K1) [Approved Signature]
  // S3 is recovered on-chain; requires buffer prepend, hashing of message and arrayifying it
  function statementManager(signer: string) {
    let _signer = 'eip155:' + chain + ':' + ethers.utils.computeAddress(`0x${signer}`) // Convert secp256k1 pubkey to ETH address
    let _toSign = `Requesting Signature To Approve ENS Records Signer\n\nOrigin: ${ENS}\nApproved Signer: ${_signer}\nApproved By: ${caip10}`
    return _toSign
  }
  // Signature S4 statement; S4(K1) [Signer Keygen]
  // S4 is not recovered on-chain; no need for buffer prepend and hashing of message required to sign
  function statementSignerKey(extradata: string, type: string) {
    let _toSign = `Requesting Signature To Generate ENS Records Signer\n\nOrigin: ${ENS}\nKey Type: secp256k1\nExtradata: ${extradata}\nSigned By: ${caip10}`
    let _digest = _toSign
    return _digest
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
    let _result = ethers.utils.defaultAbiCoder.encode([type], [_value])
    let _ABI = [constants.signedRecord]
    let _interface = new ethers.utils.Interface(_ABI)
    let _encodedWithSelector = _interface.encodeFunctionData(
      "signedRecord",
      [
        keypairSigner ? ethers.utils.computeAddress(`0x${keypairSigner[0]}`) : constants.zeroAddress,
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
    let _result = ethers.utils.defaultAbiCoder.encode([type], [_value])
    const toPack = ethers.utils.keccak256(_result)
    const _extradata = ethers.utils.hexlify(ethers.utils.solidityPack(["bytes"], [toPack]))
    return _extradata
  }

  // Returns Owner of wrapped/legacy ENS Domain
  function getOwner() {
    if (_OwnerLegacy_) {
      if (_OwnerLegacy_?.toString() === constants.ensContracts[chain === '1' ? 7 : 3]) {
        return _OwnerWrapped_ ? _OwnerWrapped_.toString() : constants.zeroAddress
      } else {
        return _OwnerLegacy_.toString()
      }
    } else {
      return constants.zeroAddress
    }
  }

  /// Trigger Collapse
  function doCrash() {
    setCrash(true)
    setTrigger('')
    setStates([])
    setCID('')
    setSigSigner('')
    setKeypairSigner(undefined)
    setKeypairIPNS(undefined)
    setLoading(false)
    setSigIPNS('')
    setSalt(false)
    setGoodSalt(false)
    if (write) setWrite(false)
  }

  /// Trigger Enjoy
  function doEnjoy() {
    setIcon('gpp_good'),
      setColor('lime')
    setLegit(constants.EMPTY_BOOL())
    setSalt(false)
    setLoading(false)
    setQueue(1)
    setKeypairSigner(undefined)
    setKeypairIPNS(undefined)
    setSigSigner('')
    setSigIPNS('')
    setCID('')
    setIsSigner(false)
    setSaltModalState({
      modalData: undefined,
      trigger: false
    })
    setOptionsModalState({
      modalData: undefined,
      trigger: false
    })
    setGoodSalt(false)
    setTrigger('')
  }

  // Signature S2 with K0 
  // K0 = keypairSigner; secp256k1
  // K2 = keypairIPNS; ed25519
  async function _signMessage(input: any) {
    if (keypairSigner) {
      const SignS2 = async () => {
        const _signer = new ethers.Wallet('0x' + keypairSigner[0], provider)
        const __signature = await _signer.signMessage(input.message)
        if (__signature) return __signature
      }
      const _signature = SignS2()
      return _signature
    }
  }

  // Signature S3 with K1
  async function __signMessage() {
    setSigCount(3) // Trigger S3(K1)
    setProcessCount(3)
    setMessage(['Waiting For Signature', '3'])
    if (keypairSigner) {
      const SignS3 = async () => {
        signMessage({
          message:
            statementManager(
              keypairSigner[0]
            )
        })
      }
      SignS3()
    }
  }

  // Signature S4 with K1
  async function ___signMessage(_value: string) {
    setProcessCount(3)
    if (keypairIPNS) {
      const SignS4 = async () => {
        signMessage({
          message: statementSignerKey(
            ethers.utils.keccak256(ethers.utils.solidityPack(
              ['bytes32', 'address'],
              [
                ethers.utils.keccak256(ethers.utils.solidityPack(['string'], [_value])),
                _Wallet_
              ]
            )),
            hashType === 'recordhash' ? hashType : (optionsModalState.trigger ? (optionsModalState.modalData === '0' ? hashType : 'recordhash') : hashType)
          )
        })
      }
      SignS4()
    }
  }

  // Get gas cost estimate for hypothetical on-chain record update
  async function getGas(key: string, value: string) {
    const getGasAmountForContractCall = async () => {
      const contract = new web3.eth.Contract(
        constants.ensConfig[chain === '1' ? 6 : 6].contractInterface as AbiItem[],
        constants.ensConfig[chain === '1' ? 6 : 6].addressOrName
      )
      let gasAmount: any
      if (key === 'contenthash') {
        gasAmount = await contract.methods.setContenthash(ethers.utils.namehash(ENS), ensContent.encodeContenthash(value).encoded).estimateGas({ from: _Wallet_ })
      } else if (key === 'avatar') {
        gasAmount = await contract.methods.setText(ethers.utils.namehash(ENS), key, value).estimateGas({ from: _Wallet_ })
      } else if (key === 'addr') {
        gasAmount = await contract.methods.setAddr(ethers.utils.namehash(ENS), value).estimateGas({ from: _Wallet_ })
      }
      return gasAmount
    }
    const gas = await getGasAmountForContractCall()
    return gas
  }

  // Get Contenthash for ENS domain first
  async function getContenthash(resolver: ethers.providers.Resolver) {
    await resolver.getContentHash()
      .then((response) => {
        if (!response) {
          setContenthash('')
        } else {
          setContenthash(response)
        }
        getAvatar(resolver)
      })
      .catch(() => {
        setContenthash('')
        getAvatar(resolver)
      })
  }

  // Get Avatar for ENS domain second
  async function getAvatar(resolver: ethers.providers.Resolver) {
    await provider.getAvatar(ENS)
      .then(response => {
        if (!response) {
          getText(resolver, 'avatar')
        } else {
          setAvatar(response)
        }
        getAddr()
      })
      .catch(() => {
        getText(resolver, 'avatar')
      })
  }

  // Get Avatar for ENS domain second
  async function getText(resolver: ethers.providers.Resolver, key: string) {
    await resolver.getText(key)
      .then((response) => {
        if (!response) {
          setAvatar('')
        } else {
          setAvatar(response)
        }
        getAddr()
      })
      .catch(() => {
        setAvatar('')
        getAddr()
      })
  }

  // Get Addr for ENS domain at last
  async function getAddr() {
    await provider.resolveName(ENS)
      .then(response => {
        if (!response) {
          setAddr('')
          setSync(true)
        } else {
          setAddr(response)
          setSync(true)
        }
      })
      .catch(() => {
        setAddr('')
        setSync(true)
      })
  }

  // Get Resolver for ENS domain
  async function getResolver(_history: any, _ENS: string) {
    try {
      const _response = await provider.getResolver(_ENS)
      if (_response?.address) {
        setResolver(_response.address)
        setResolveCall(_response)
        if (_response.address === ccip2Contract) {
          let _Storage = await verifier.quickRecordhash(_ENS, ccip2Config, getOwner())
          let _IPFS: any
          if (_history.ownerstamp.length > 1) {
            for (var i = 0; i < 2; i++) {
              _IPFS = await constants.getIPFSHashFromIPNS(ensContent.decodeContenthash(_Storage).decoded, i)
            }
          } else if (_history.ownerstamp.length === 1) {
            _IPFS = {
              '_sequence': '0'
            }
          } else {
            _IPFS = {
              '_sequence': ''
            }
          }
          if (_history.version) setHashIPFS(_history.version.split('/')[2])
          if (_history.ownerstamp.length >= 1) {
            /// @dev : REDUNDANT [!!!]
            if (Number(_IPFS._sequence) === Number(_history.timestamp.version)) {
              setContenthash(_history.contenthash)
              setAvatar(_history.avatar)
              setAddr(_history.addr)
              setSync(true)
            } else {
              getContenthash(_response)
            }
          } else {
            setContenthash('')
            setAvatar('')
            setAddr('')
            setSync(true)
          }
        } else {
          const _contenthash = await refreshRecord(['contenthash', ''], _response, _ENS, false)
          setContenthash(_contenthash || '')
          let _avatar: string
          _avatar = await refreshRecord(['avatar', ''], _response, _ENS, false)
          if (!_avatar) {
            _avatar = await refreshRecord(['text', 'avatar'], _response, _ENS, false)
          }
          setAvatar(_avatar || '')
          const _addr = await refreshRecord(['addr', ''], _response, _ENS, false)
          setAddr(_addr || '')
          setSync(true)
        }
      }
    } catch (error) {
      console.error('Error in getResolver():', error)
    }
  }

  // Re-try empty records
  async function refreshRecord(_record: string[], _resolver: Resolver, _ENS: string, _trigger: boolean) {
    if (_trigger) setRefresh(_record[0])
    try {
      if (_record[0] === 'addr') {
        const _response = await provider.resolveName(_ENS)
        if (_response) {
          setAddr(_response)
          if (_trigger) {
            setRefreshedValue(_response)
            setRefresh('1')
          }
          return _response
        }
      } else if (_record[0] === 'avatar') {
        const _response = await provider.getAvatar(_ENS)
        if (_response) {
          setAvatar(_response)
          if (_trigger) {
            setRefreshedValue(_response)
            setRefresh('1')
          }
          return _response
        }
      } else if (_record[0] === 'contenthash') {
        const _response = await _resolver.getContentHash()
        if (_response) {
          setContenthash(_response)
          if (_trigger) {
            setRefreshedValue(_response)
            setRefresh('1')
          }
          return _response
        }
      } else if (_record[0] === 'text') {
        const _response = await _resolver.getText(_record[1])
        if (_response) {
          setAvatar(_response)
          if (_trigger) {
            setRefreshedValue(_response)
            setRefresh('1')
          }
          return _response
        }
      }
      if (_trigger) setRefresh('0')
      return ''
    } catch (error) {
      console.error(`Error in refreshRecord('${_record}'):`, error)
      if (_trigger) setRefresh('0')
      return ''
    }
  }

  // Function for writing IPNS Revision metadata to NameSys backend; needed for updates
  async function writeRevision(revision: Name.Revision, gas: {}, timestamp: string) {
    const request = {
      ens: ENS,
      owner: _Wallet_,
      manager: keypairSigner ? ethers.utils.computeAddress(`0x${keypairSigner[0]}`) : constants.zeroAddress,
      managerSignature: sigApproved,
      revision: Revision.encode(revision),
      chain: chain,
      gas: JSON.stringify(gas),
      version: JSON.stringify(revision, (key, value) => {
        return typeof value === 'bigint' ? value.toString() : value
      }),
      timestamp: timestamp,
      hashType: hashType
    }
    try {
      await fetch(
        `${SERVER}:${PORT}/revision`,
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
    } catch (error) {
      console.error('ERROR:', 'Failed to write Revision to CCIP2 backend')
      setMessage(['Revision Update Failed', ''])
      setCrash(true)
      setLoading(false)
      setSustain(true)
      setColor('orangered')
    }
  }

  // Upates new record values in local storage before pushing updates
  function setValues(key: string, _value: string) {
    let value = _value.trim()
    let __THIS = legit
    __THIS['resolver'] = false
    if (key === 'storage') {
      __THIS[key] = true
    } else if (key === 'addr') {
      __THIS[key] = constants.isAddr(value)
    } else if (key === 'avatar') {
      __THIS[key] = constants.isAvatar(value)
    } else if (key === 'contenthash') {
      __THIS[key] = constants.isContenthash(value)
    } else {
      setStates(prevState => [...prevState, key])
      console.error('Error:', 'Illegal State Checkpoint')
      return
    }
    setLegit(__THIS)
    const _THIS = newValues
    _THIS[key] = value
    setNewValues(_THIS)
    const priorState = states
    if (!priorState.includes(key) && newValues[key]) {
      setStates(prevState => [...prevState, key])
    } else if (priorState.includes(key) && !newValues[key]) {
      setStates(prevState => prevState.filter(item => item !== key))
    }
    let _updatedList = list.map((item) => {
      if (states.includes(item.type)) {
        return {
          ...item,
          editable: true,
          active: true,
          state: false
        }
      }
      return item
    })
    setPreCache(_updatedList)
  }

  // Get records from history on NameSys backend
  // Must get Revision for IPNS update
  async function getUpdate(_storage: string, _type: string, _hashType: string) {
    const request = {
      type: 'read',
      ens: ENS,
      owner: getOwner(),
      recordsTypes: 'all',
      recordsValues: 'all',
      chain: chain,
      storage: _storage,
      hashType: _hashType
    }
    console.log(request)
    try {
      await fetch(
        `${SERVER}:${PORT}/read`,
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
            version: data.response.version,
            revision: data.response.revision,
            timestamp: data.response.timestamp,
            queue: constants.latestTimestamp(data.response.timestamp),
            ownerstamp: data.response.ownerstamp
          }
          setHistory(_HISTORY)
          var _Ownerstamps: number[] = []
          if (_HISTORY.ownerstamp.length > 0) {
            for (const key in _HISTORY.ownerstamp) {
              _Ownerstamps.push(Number(_HISTORY.ownerstamp[key]))
            }
          }
          if (_storage && _Ownerstamps.length > 0 && _type === 'ownerhash') {
            setQueue(Math.round(Date.now() / 1000) - Math.max(..._Ownerstamps) - constants.waitingPeriod)
          } else {
            setQueue(Math.round(Date.now() / 1000) - constants.latestTimestamp(data.response.timestamp) - constants.waitingPeriod)
          }
        })
    } catch (error) {
      console.error('ERROR:', 'Failed to read from CCIP2 backend')
    }
  }

  // Modal load
  React.useEffect(() => {
    if (_ENS_.endsWith('#') || _ENS_.endsWith('-') || _ENS_.endsWith(':')) {
      setBrowser(true)
      setENS(_ENS_.slice(0, -1))
      setMessage([_ENS_.endsWith('-') ? 'Refreshing Records' : (_ENS_.endsWith('#') ? 'Checking History' : 'Loading Records'), '-'])
    } else {
      setBrowser(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Triggers upon Preview load and attempts to get Resolver for ENS domain
  React.useEffect(() => {
    if (browser && ENS) {
      let namehash = ethers.utils.namehash(ENS)
      setTokenIDLegacy(namehash)
      setTokenIDWrapper(ethers.BigNumber.from(namehash).toString())
      setConclude(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [browser, ENS])

  // Handles setting setRecordhash on CCIP2 Resolver
  React.useEffect(() => {
    if (preCache) {
      setList(preCache)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preCache])

  // Captures on-chain manager hook
  React.useEffect(() => {
    if (_CCIP2Manager_) {
      setOnChainManager(_CCIP2Manager_.toString())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_CCIP2Manager_])

  // Capture Ownerhash hook
  React.useEffect(() => {
    if (_Ownerhash_) {
      if (_Ownerhash_.toString().length > 2) {
        let _String: string = ''
        if (_Ownerhash_.toString().startsWith(constants.prefix)) {
          _String = `ipns://${ensContent.decodeContenthash(_Ownerhash_!.toString()).decoded}`
        } else {
          _String = ethers.utils.toUtf8String(_Ownerhash_.toString())
        }
        if (_String.startsWith('https://')) {
          setOwnerhash(`${_String}`)
        } else {
          setOwnerhash(`${_String}`)
        }
      } else {
        setOwnerhash(undefined)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_Ownerhash_])

  React.useEffect(() => {
    if (_Recordhash_) {
      if (_Recordhash_.toString().length > 2 && (_Recordhash_ !== _Ownerhash_)) {
        let _String: string = ''
        if (_Recordhash_.toString().startsWith(constants.prefix)) {
          _String = `ipns://${ensContent.decodeContenthash(_Recordhash_!.toString()).decoded}`
        } else {
          _String = ethers.utils.toUtf8String(_Recordhash_.toString())
        }
        if (_String.startsWith('https://')) {
          setRecordhash(`${_String}`)
        } else {
          setRecordhash(`${_String}`)
        }
        setMessage(['This May Take a While', ''])
        setMessage([_ENS_.endsWith('-') ? 'Refreshing Records' : (_ENS_.endsWith('#') ? 'Checking History' : 'Loading Records'), '-'])
      } else {
        setRecordhash(undefined)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_Recordhash_, _Ownerhash_])

  // Sets Success modal refresh
  React.useEffect(() => {
    if (successModalState.trigger && successModalState.modalData) {
      if (txSuccess1of2) {
        handleSuccess(`${ENS}#`)
      } else if (txSuccess2of2) {
        handleSuccess(`${ENS}-`)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [successModalState, txSuccess1of2, txSuccess2of2])

  // Sets option between Ownerhash and Recordhash
  React.useEffect(() => {
    if (confirmModalState.trigger && confirmModalState.modalData) {
      setConfirm(false)
      if (confirmModalState.modalData === '0') {
        setSalt(true)
      } else {
        setGateway(true)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [confirmModalState])

  // Send data to Home/Account-page and trigger update
  function handleSuccess(_output: string) {
    handleParentModalData(_output)
    handleParentTrigger(true)
  }

  // Sets option between Ownerhash and Recordhash
  React.useEffect(() => {
    if (safeTrigger === '1') {
      if (trigger && !write) {
        if (trigger === 'storage') {
          setConfirm(true)
          setHashType('recordhash')
        } else {
          if (optionsModalState.trigger) {
            setHashType(optionsModalState.modalData === '1' ? 'recordhash' : (optionsModalState.modalData === '2' ? 'gateway' : 'ownerhash'))
            setProcessCount(optionsModalState.modalData === '1' ? 1 : 1)
            migrate()
          }
        }
      } else if (trigger && write) {
        if (recordhash) {
          if (recordhash.startsWith('https://')) {
            setHashType('gateway')
          } else {
            setHashType('recordhash')
          }
        }
        if (ownerhash && !recordhash) {
          if (ownerhash.startsWith('https://')) {
            setHashType('gateway')
          } else {
            setHashType('ownerhash')
          }
        }
        setUpdateRecords(true)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger, optionsModalState, write, safeTrigger])

  // Sets in-app ENS domain manager
  React.useEffect(() => {
    if (_Wallet_) {
      // Set Managers
      if (onChainManager && onChainManager.toString() === 'true') {
        // Set connected account as in-app manager if it is authorised
        setManagers([_Wallet_])
      } else {
        // Set owner as in-app managers if no on-chain manager exists
        let _Owner_ = getOwner()
        setManagers([_Owner_])
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenIDLegacy, _OwnerLegacy_, _OwnerWrapped_, onChainManager, tokenIDWrapper])

  // Sets Wrapper status of ENS Domain
  React.useEffect(() => {
    if (_OwnerLegacy_) {
      if (_OwnerLegacy_?.toString() === constants.ensContracts[chain === '1' ? 7 : 3]) {
        setWrapped(true)
      } else {
        setWrapped(false)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_OwnerLegacy_])

  // Handles loading of avatar
  React.useEffect(() => {
    let _avatar: string = ''
    if (avatar.startsWith('ipfs://')) {
      _avatar = `https://ipfs.io/ipfs/${avatar.split('ipfs://')[1]}`
      constants.checkImageURL(_avatar)
        .then(() => {
          setImageLoaded(true)
          setThumbnail(_avatar)
        })
        .catch(() => {
          setImageLoaded(false)
          setThumbnail('')
        })
    } else if (avatar.startsWith(`eip155:${chain}`)) {
      let _contract = avatar.split(':')[2].split('/')[0]
      let _tokenID = avatar.split(':')[2].split('/')[1]
      constants.alchemy.nft.getNftMetadata(
        _contract,
        _tokenID
      ).then((_response) => {
        _avatar = _response.media[0].thumbnail || _response.media[0].gateway
        constants.checkImageURL(_avatar)
          .then(() => {
            setImageLoaded(true)
            setThumbnail(_avatar)
          })
          .catch(() => {
            setImageLoaded(false)
            setThumbnail('')
          })
      })
    } else if (avatar.startsWith('https://')) {
      _avatar = avatar
      constants.checkImageURL(_avatar)
        .then(() => {
          setImageLoaded(true)
          setThumbnail(_avatar)
        })
        .catch(() => {
          setImageLoaded(false)
          setThumbnail('')
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [avatar])

  // Triggers S1(K1) after password is set
  React.useEffect(() => {
    let _modalData: string = ''
    if (saltModalState.trigger && saltModalState.modalData !== undefined) {
      _modalData = saltModalState.modalData
    } else if (gatewayModalState.trigger && gatewayModalState.modalData) {
      _modalData = gatewayModalState.modalData
    }
    if ((saltModalState.trigger || gatewayModalState.trigger) && !keypairIPNS && trigger && safeTrigger) {
      setSigCount(1)
      setMessage(['Waiting For Signature', '1'])
      setProcessCount(!write && states.includes('resolver') ? 1 : 1)
      signMessage({
        message: statementIPNSKey(
          ethers.utils.keccak256(ethers.utils.solidityPack(
            ['bytes32', 'address'],
            [
              ethers.utils.keccak256(ethers.utils.solidityPack(['string'], [_modalData])),
              _Wallet_
            ]
          )),
          hashType === 'recordhash' ? hashType : (optionsModalState.trigger ? (optionsModalState.modalData === '0' ? hashType : 'recordhash') : hashType)
        )
      })
      setKeygen(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saltModalState, gatewayModalState, recordhash, trigger, safeTrigger, hashType, write, states, keypairIPNS])

  // Triggers S1(K1) after password is set
  React.useEffect(() => {
    if (sigIPNS && !keypairIPNS) {
      setLoading(true)
      setMessage(['Generating IPNS Key', ''])
      const keygen = async () => {
        const _origin = hashType !== 'recordhash' ? `eth:${_Wallet_ || constants.zeroAddress}` : ENS
        const __keypair = await KEYGEN(_origin, caip10, sigIPNS, saltModalState.modalData)
        setKeypairIPNS(__keypair[0])
        setMessage(['IPNS Keypair Generated', ''])
      }
      keygen()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keygen, keypairIPNS, goodSalt, write, sigIPNS])

  // Triggers S4(K1) after password is set
  React.useEffect(() => {
    if (write && saltModalState.trigger && goodSalt) {
      setMessage(['Waiting For Signature', '2'])
      const _sigSigner = async () => {
        if (saltModalState.modalData !== undefined) {
          setSigCount(2) // Trigger S4(K1)
          ___signMessage(saltModalState.modalData)
        }
      }
      _sigSigner()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saltModalState, goodSalt, write])

  // Triggers S1(K1) after password is set
  React.useEffect(() => {
    if (write) {
      if (goodSalt) {
        if (sigSigner && !isSigner) {
          // Set query for on-chain manager [v2]
          setOnChainManagerQuery(
            [
              getOwner(),
              ethers.utils.namehash(ENS),
              keypairSigner ? ethers.utils.computeAddress(`0x${keypairSigner[0]}`) : constants.zeroAddress
            ]
          ) // Checks if connected wallet is on-chain manager
          setLoading(true)
          setMessage(['Generating Signer Key', ''])
          const keygen = async () => {
            const _origin = hashType !== 'recordhash' ? `eth:${_Wallet_ || constants.zeroAddress}` : ENS
            const __keypair = await KEYGEN(_origin, caip10, sigSigner, saltModalState.modalData)
            setKeypairSigner(__keypair[1])
            setIsSigner(true)
            setMessage(['Signer Keypair Generated', ''])
          }
          keygen()
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sigSigner, goodSalt, write, isSigner])

  // Triggers IPNS CID derivation with new S1(K1)
  React.useEffect(() => {
    if (keypairIPNS && sigIPNS) {
      if (hashType !== 'gateway') {
        const CIDGen = async () => {
          let key = constants.formatkey(keypairIPNS)
          const w3name = await Name.from(ed25519v2.etc.hexToBytes(key))
          const CID_IPNS = w3name.toString()
          let _Recordhash = recordhash ? recordhash.split('ipns://')[1] : ''
          let _Ownerhash = ownerhash ? ownerhash.split('ipns://')[1] : ''
          if (write) {
            if (CID_IPNS && (CID_IPNS === _Recordhash || CID_IPNS === _Ownerhash)) {
              setGoodSalt(true)
              setCID(CID_IPNS)
            } else if (CID_IPNS && (CID_IPNS !== _Recordhash && CID_IPNS !== _Ownerhash)) {
              setSaltModalState({
                modalData: undefined,
                trigger: false
              })
              setMessage(['Seems Like Bad Password', ''])
              doCrash()
              setColor('orangered')
              setSigCount(0)
              setProcessCount(0)
            }
          } else {
            setGoodSalt(true)
            setCID(CID_IPNS)
          }
        }
        CIDGen()
      } else if (hashType === 'gateway') {
        setCID(gatewayModalState.modalData || '')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keypairIPNS, sigIPNS, hashType, gatewayModalState, recordhash, ownerhash, write])

  // Sets signature from Wagmi signMessage() as S1(K1)
  React.useEffect(() => {
    if (signature && sigCount === 1) {
      setSigIPNS(signature)
    } else if (signature && sigCount === 3) {
      setSigApproved(signature)
    } else if (signature && sigCount === 2) {
      setSigSigner(signature)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature, sigCount])

  // Triggers Resolver migration after IPNS CID is generated and validated 
  React.useEffect(() => {
    if (CID && keypairIPNS && !write) {
      if (CID.startsWith('k5')) {
        initRecordhash()
      } else if (CID.startsWith('https://')) {
        initRecordhash()
      }
    } else if (write) {
      setProcessCount(3)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [CID, keypairIPNS, write])

  // Handles single vs. mulitple record updates
  React.useEffect(() => {
    if (states.length > 1) {
      let _updatedList = list.map((item) => {
        if (!['resolver', 'storage'].includes(item.type) &&
          states.includes(item.type)
        ) {
          return {
            ...item,
            label: 'Edit',
            help: 'Set Record'
          }
        } else {
          return {
            ...item,
            label: item.type !== 'resolver' ? (item.type !== 'storage' ? 'Edit' : 'Set') : 'Migrate'
          }
        }
      })
      setPreCache(_updatedList)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [states])

  // Concludes fetching records
  React.useEffect(() => {
    if (sync) {
      if (recordhash) {
        setMetadata(recordhash, addr, contenthash, avatar)
      } else if (ownerhash) {
        setMetadata(ownerhash, addr, contenthash, avatar)
      } else {
        setMetadata('', addr, contenthash, avatar)
      }
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sync, recordhash, ownerhash, resolver, addr, contenthash, avatar, hashType])

  // Triggers fetching history from NameSys backend
  React.useEffect(() => {
    if (conclude) {
      getUpdate(
        recordhash || ownerhash,
        recordhash ? 'recordhash' : 'ownerhash',
        recordhash ? 'recordhash' : 'ownerhash'
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conclude, ownerhash, recordhash])

  // Triggers fetching resolver and records
  React.useEffect(() => {
    if (queue && ENS && !sync) {
      getResolver(history, ENS)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history, queue, ENS, sync])

  // Triggers setting metadata
  React.useEffect(() => {
    if (history && queue && resolver && !sync) {
      if (recordhash) {
        if (recordhash.startsWith('https://')) {
          setHashType('gateway')
        } else {
          setHashType('recordhash')
        }
      } else if (ownerhash) {
        if (ownerhash.startsWith('https://')) {
          setHashType('gateway')
        } else {
          setHashType('ownerhash')
        }
      } else {
        setHashType('recordhash')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history, queue, resolver, recordhash, ownerhash, sync])

  // Internal state handling of editable/active records during updates by user
  React.useEffect(() => {
    if (trigger && states.length > 0) {
      let _updatedList = list.map((item) => {
        if (states.includes(item.type) && !constants.forbidden.includes(item.type)) {
          return {
            ...item,
            editable: queue > 0, // allow updates only after the waiting period
            active: queue > 0
          }
        } else if (!states.includes(item.type) && ['resolver'].includes(item.type)) {
          return {
            ...item,
            editable: false,
            active: false
          }
        } else if (['storage'].includes(item.type)) {
          return {
            ...item,
            editable: false,
            active: resolver === ccip2Contract
          }
        }
        return item
      })
      setPreCache(_updatedList)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger, resolver, states])

  // Handles password prompt for S1(K1)
  React.useEffect(() => {
    if (updateRecords && write) { // Check for false → true
      if (!keypairIPNS || (!keypairSigner || !keypairSigner[0]) || !CID) {
        setSalt(true) // Start over
        setUpdateRecords(false) // Reset
      } else {
        if (states.length > 0) {
          setLoading(true)
          setMessage(['Setting Records', states.length.toString()])
          setProcessCount(states.length)
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateRecords, keypairSigner, CID, write])

  // Handles record refresh
  React.useEffect(() => {
    if (refresh && ['0', '1'].includes(refresh)) {
      if (refresh === '1') {
        let _updatedList = list.map((item) => {
          if (item.type === refreshedItem) {
            return {
              ...item,
              value: refreshedValue
            }
          } else {
            return {
              ...item
            }
          }
        })
        setPreCache(_updatedList)
      }
      setTimeout(() => {
        setRefresh('.') // Show result
      }, 10000)
      setTimeout(() => {
        setRefresh('') // Allow refresh after
      }, 30000)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh, refreshedValue, refreshedItem])

  // Handles generating signatures for all records to be updated
  React.useEffect(() => {
    // Handle Signature S2(K0) to add as extradata
    if (write && (keypairSigner && keypairSigner[0]) && newValues && !constants.isEmpty(newValues) && states.length > 0) {
      let __signatures = constants.EMPTY_STRING()
      states.forEach(async (_recordType) => {
        let _signature: any
        if (newValues[_recordType]) {
          _signature = await _signMessage({
            message: statementRecords(constants.files[constants.types.indexOf(_recordType)], genExtradata(_recordType, newValues[_recordType]), keypairSigner[0])
          }) // Sign with K0
        }
        if (_signature) __signatures[_recordType] = _signature
      })
      setSignatures(__signatures)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [write, keypairSigner, newValues, states])

  // Handles generating signatures for off-chain manager
  React.useEffect(() => {
    // Handle Signature S3(K1)
    if (write && !onChainManager && !sigApproved && !constants.isEmpty(signatures)) {
      __signMessage() // Sign with K1
    } else if (write && onChainManager && !constants.isEmpty(signatures)) {
      setSigApproved('0x')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onChainManager, signatures])

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
      keypairIPNS &&
      count === states.length &&
      count > 0 &&
      sigApproved
    ) {
      let _encodedValues = constants.EMPTY_STRING()
      for (const key in newValues) {
        if (newValues.hasOwnProperty(key) && newValues[key] !== '') {
          _encodedValues[key] = encodeValue(key, newValues[key])
        }
      }
      // Generate POST request for writing records
      const request = {
        signatures: signatures,
        manager: keypairSigner ? ethers.utils.computeAddress(`0x${keypairSigner[0]}`) : constants.zeroAddress,
        managerSignature: sigApproved,
        ens: ENS,
        owner: _Wallet_ || constants.zeroAddress,
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
            `${SERVER}:${PORT}/write`,
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
              if (keypairSigner && data.response) {
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
                      gas[item.type] = value * _gasData * 0.000000001
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
                let key = constants.formatkey(keypairIPNS)
                let w3name: Name.WritableName
                const keygen = async () => {
                  w3name = await Name.from(ed25519v2.etc.hexToBytes(key))
                  const pin = async () => {
                    if (data.response.ipfs && w3name && gas) {
                      setHashIPFS(data.response.ipfs.split('ipfs://')[1])
                      const toPublish = '/ipfs/' + data.response.ipfs.split('ipfs://')[1]
                      // @W3Name broadcast
                      let _revision: Name.Revision
                      if (!history.revision) {
                        _revision = await Name.v0(w3name, toPublish)
                      } else {
                        let _revision_ = Revision.decode(new Uint8Array(Buffer.from(history.revision, "utf-8")))
                        _revision = await Name.increment(_revision_, toPublish)
                      }
                      setTimestamp(data.response.timestamp)
                      // Write revision to database
                      await writeRevision(_revision, gas, data.response.timestamp)
                      // Publish IPNS
                      await Name.publish(_revision, w3name.key)
                      // Wrap up
                      setGas(gas)
                      setGasModal(true)
                      setStates([])
                      setLegit(constants.EMPTY_BOOL())
                      setLoading(false)
                      // Update values in the modal to new ones
                      let _updatedList = list.map((item) => {
                        if (!['resolver', 'storage'].includes(item.type)) {
                          let _queue = Math.round(Date.now() / 1000) - constants.latestTimestamp(data.response.timestamp) - constants.waitingPeriod
                          setQueue(_queue)
                          if (data.response.meta[item.type]) {
                            return {
                              ...item,
                              value: data.response[item.type],
                              state: true,
                              label: 'edit',
                              active: _queue > 0,
                              editable: _queue > 0
                            }
                          } else {
                            return {
                              ...item,
                              active: _queue > 0,
                              editable: _queue > 0
                            }
                          }
                        } else {
                          return item
                        }
                      })
                      setPreCache(_updatedList)
                      setNewValues(constants.EMPTY_STRING())
                      setSignatures(constants.EMPTY_STRING())
                      setUpdateRecords(false) // Reset
                      setSigCount(0)
                      setSaltModalState({
                        modalData: undefined,
                        trigger: false
                      })
                      setGatewayModalState({
                        modalData: undefined,
                        trigger: false
                      })
                    }
                  }
                  if (Object.keys(gas).length > 0) {
                    pin()
                  }
                }
                keygen()
              }
            })
        } catch (error) {
          console.error('ERROR:', 'Failed to write to CCIP2 backend')
          setMessage(['Record Update Failed', ''])
          setCrash(true)
          setLoading(false)
          setSustain(true)
          setColor('orangered')
        }
      }
      editRecord()
    }
    // Handle exception
    if (!write) {
      setUpdateRecords(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sigApproved])

  // Handles setting setRecordhash on CCIP2 Resolver
  React.useEffect(() => {
    if (isMigrateSuccess && txSuccess1of2 && migrated && !write && !crash) {
      if (states.includes('resolver') && optionsModalState.modalData === '1') {
        setSuccess('<span><span style="color: lightgreen">Resolver Migrated</span>! You may now set <span style="color: cyan">IPNS Storage</span> next</span>')
        setSuccessModal(true)
        doEnjoy()
      } else {
        setSuccess('<span style="color: lightgreen">Off-chain Setup Complete with <span style="color: cyan">Ownerhash</span>. Enjoy!</span>')
        setSuccessModal(true)
        doEnjoy()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMigrateSuccess, txSuccess1of2, migrated, states, resolver, write])

  // Handles setting Recordhash after transaction 2 
  React.useEffect(() => {
    if (isSetRecordhashSuccess && txSuccess2of2 && CID) {
      setRecordhash(`ipns://${CID}`)
      setMessage(['Transaction Confirmed', '1'])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSetRecordhashSuccess, txSuccess2of2, CID])

  // Handles finishing migration of Resolver to CCIP2
  React.useEffect(() => {
    if (recordhash && txSuccess2of2 && !write && !crash) {
      setSuccess('<span style="color: lightgreen">Off-chain Setup Complete with <span style="color: cyan">Recordhash</span>. Enjoy!</span>')
      setSuccessModal(true)
      doEnjoy()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recordhash, txSuccess2of2, write])

  // Sets migration state to true upon successful transaction 1 receipt
  React.useEffect(() => {
    if (isMigrateSuccess && txSuccess1of2) {
      const pin = async () => {
        setMessage(['Transaction Confirmed', '1'])
        setTimeout(() => {
          setResolver(ccip2Contract)
          setMigrated(true)
        }, 2000)
      }
      pin()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMigrateSuccess, txSuccess1of2])

  // Handles first transaction wait
  React.useEffect(() => {
    if (isMigrateLoading && !isMigrateError) {
      setLoading(true)
      setMessage(['Waiting for Transaction', '1'])
      if (recentCrash) setRecentCrash(false)
    } else if (isMigrateError && !isMigrateLoading) {
      if (!recentCrash) {
        setMessage(['Transaction Declined by User', ''])
        doCrash()
      } else {
        if (recentCrash) setRecentCrash(false)
      }
      setSaltModalState({
        modalData: undefined,
        trigger: false
      })
      setOptionsModalState({
        modalData: undefined,
        trigger: false
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMigrateLoading, isMigrateError])

  // Handles second transaction wait
  React.useEffect(() => {
    if (!isSetRecordhashError && isSetRecordhashLoading) {
      setLoading(true)
      setMessage(['Waiting for Transaction', '1'])
      if (recentCrash) setRecentCrash(false)
    } else if (isSetRecordhashError && !isSetRecordhashLoading) {
      if (!recentCrash) {
        setMessage(['Transaction Declined by User', ''])
        doCrash()
      } else {
        if (recentCrash) setRecentCrash(false)
      }
      setSaltModalState({
        modalData: undefined,
        trigger: false
      })
      setConfirmModalState({
        modalData: undefined,
        trigger: false
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSetRecordhashLoading, isSetRecordhashError])

  // Handles first transaction loading and error
  React.useEffect(() => {
    if (txLoading1of2 && !txError1of2) {
      setLoading(true)
      setMessage(['Waiting for Confirmation', '1'])
      if (recentCrash) setRecentCrash(false)
    } else if (!txLoading1of2 && txError1of2) {
      if (!recentCrash) {
        setMessage(['Transaction Failed', states.includes('storage') ? '1' : '2'])
        doCrash()
      } else {
        if (recentCrash) setRecentCrash(false)
      }
      setSaltModalState({
        modalData: undefined,
        trigger: false
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [txLoading1of2, txError1of2])

  // Handles second transaction loading and error
  React.useEffect(() => {
    if (txLoading2of2 && !txError2of2) {
      setLoading(true)
      setMessage(['Waiting for Confirmation', states.includes('storage') ? '1' : '2'])
      if (recentCrash) setRecentCrash(false)
    } else if (!txLoading2of2 && txError2of2) {
      if (!recentCrash) {
        setMessage(['Transaction Failed', states.includes('storage') ? '1' : '2'])
        doCrash()
      } else {
        if (recentCrash) setRecentCrash(false)
      }
      setSaltModalState({
        modalData: undefined,
        trigger: false
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [txLoading2of2, txError2of2])

  // Handles signature loading and error
  React.useEffect(() => {
    if (signLoading && !signError && trigger) {
      setLoading(true)
      if (recentCrash) setRecentCrash(false)
    } else if (signError && !signLoading && trigger) {
      if (!recentCrash) {
        setMessage(['Signature Failed', sigCount.toString()])
        doCrash()
        setWrite(false)
        setUpdateRecords(false) // Reset
        setLegit(constants.EMPTY_BOOL())
        setNewValues(constants.EMPTY_STRING())
        let _updatedList = list.map((item) => {
          if (item.type !== 'storage') {
            return item
          } else {
            return {
              ...item,
              state: false
            }
          }

        })
        setPreCache(_updatedList)
        if (states.includes('resolver')) handleSuccess(`${ENS}#`)
        setSafeTrigger('0')
      } else {
        if (recentCrash) setRecentCrash(false)
      }
      setSaltModalState({
        modalData: undefined,
        trigger: false
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signLoading, signError, trigger, sigCount, states])

  /// Modal Content
  const modalContent = show ? (
    <StyledModalOverlay
      style={{
        backgroundColor: !loading ? 'rgba(0, 0, 0, 1)' : 'black'
      }}
    >
      <StyledModal
        style={{
          background: loading ? 'none' : 'linear-gradient(180deg, rgba(66,46,40,1) 0%, rgba(0,0,0,1) 35%, rgba(0,0,0,1) 100%)'
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
        {ENS && loading &&
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
        {ENS && avatar && imageLoaded && !loading && list.length > 0 &&
          <StyledModalTitle>
            <img
              src={thumbnail || avatar}
              width={'100px'}
              alt={ENS}
              onError={() => setImageLoaded(false)}
            />
          </StyledModalTitle>
        }
        {ENS && (!avatar || !imageLoaded) && !loading && list.length > 0 &&
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
        {ENS && loading &&
          <StyledModalBody>
            <div
              className='flex-column'
              style={{
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
                  marginTop: '20px'
                }}
              >
                <span
                  style={{
                    color: '#fc6603',
                    fontSize: '20px',
                    fontWeight: '700'
                  }}
                >
                  {message[0]}
                </span>
              </div>
              {message[1] && message[1] !== '-' && (
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
                    <span style={{ fontFamily: 'SF Mono', fontSize: '22px' }}
                    >
                      {processCount}
                    </span>
                  </span>
                </div>
              )}
              {message[1] && message[1] === '-' && (
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
                    <span>{message[0].includes('Refresh') ? 'Please Be Patient' : 'This May Take Some Time'}</span>
                  </span>
                </div>
              )}
            </div>
          </StyledModalBody>
        }
        {ENS && list.length > 0 && !loading &&
          <StyledModalBody>
            <div
              className='flex-column'
            >
              <div
                style={{
                  marginBottom: '15px',
                  marginTop: '-15px'
                }}
              >
                <span
                  style={{
                    color: 'white',
                    fontSize: '20px',
                    fontWeight: '700',
                    fontFamily: 'SF Mono'
                  }}
                >
                  {ENS.split('.eth')[0]}
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
                    letterSpacing: '0px',
                    marginTop: '13px'
                  }}
                >
                  ETH
                </span>
              </div>
              <ul
                style={{
                  listStyle: 'none',
                  color: 'white',
                  marginLeft: !isMobile ? '-5%' : '0'
                }}
              >
                <div
                  className='flex-column'
                  style={{
                    paddingBottom: !isMobile ? '15px' : '5px',
                  }}
                >
                  {list.map((item) => (
                    <li
                      key={item.key}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: !isMobile ? '500px' : '480px',
                        maxWidth: !isMobile ? '95%' : '85%',
                        paddingLeft: '5px',
                        paddingRight: '5px'
                      }}
                    >
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
                            width: !isMobile ? '100%' : '90%'
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
                            { // Label Storage
                              item.type === 'storage' && (
                                <span>
                                  {hashType}
                                </span>
                              )}
                            { // Label+
                              item.type !== 'storage' && (
                                <span>
                                  {item.header}
                                </span>
                              )}
                            { // Set Badge if Resolver is migrated and ONLY Ownerhash is set
                              ['resolver', 'storage'].includes(item.type) && resolver === ccip2Contract && !recordhash && ownerhash && (
                                <button
                                  className="button-tiny"
                                  onClick={() => {
                                    setHelpModal(true),
                                      setIcon('gpp_good'),
                                      setColor(item.type === 'resolver' ? 'lime' : 'cyan'),
                                      setHelp(item.type === 'resolver' ? '<span>Resolver is <span style="color: lime">Migrated</span></span>' : `<span>Global <span style="color: cyan">${ownerhash.startsWith('https://') ? 'Gateway' : 'Ownerhash'}</span> is Set</span>`)
                                  }}
                                  data-tooltip={`Ready For Off-Chain Use With ${ownerhash.startsWith('https://') ? 'Gateway' : 'Ownerhash'}`}
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
                              ['resolver', 'storage'].includes(item.type) && resolver === ccip2Contract && recordhash && (
                                <button
                                  className="button-tiny"
                                  onClick={() => {
                                    setHelpModal(true),
                                      setIcon('gpp_good'),
                                      setColor('lime'),
                                      setHelp(item.type === 'resolver' ? '<span>Resolver is <span style="color: lime">Migrated</span><span>' : `<span>Domain-specific <span style="color: cyan">${recordhash.startsWith('https://') ? 'Gateway' : 'Recordhash'}</span> is Set<span>`)
                                  }}
                                  data-tooltip={`Ready For Off-Chain Use With ${recordhash.startsWith('https://') ? 'Gateway' : 'Recordhash'}`}
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
                            { // Set Badge if Resolver is migrated and no Recordhash or Ownerhash or Gateway is set
                              ['resolver', 'storage'].includes(item.type) && resolver === ccip2Contract && !recordhash && !ownerhash && (
                                <button
                                  className="button-tiny"
                                  onClick={() => {
                                    setHelpModal(true),
                                      setIcon(item.type === 'resolver' ? 'gpp_good' : 'cancel'),
                                      setColor(item.type === 'resolver' ? 'orange' : 'orangered'),
                                      setHelp(item.type === 'resolver' ? '<span>Resolver is <span style="color: lime">Migrated</span><span>' : `<span style="color: cyan">Storage</span> <span style="color: orange">not Set</span>`)
                                  }}
                                  data-tooltip={'Resolver Migrated But Storage Not Set'}
                                >
                                  <div
                                    className="material-icons smol"
                                    style={{
                                      color: item.type === 'resolver' ? 'orange' : 'orangered',
                                      marginLeft: item.type === 'resolver' ? '5px' : '5px'
                                    }}
                                  >
                                    {item.type === 'resolver' ? 'gpp_good' : 'cancel'}
                                  </div>
                                </button>
                              )}
                            { // Set Badge if Resolver is not migrated and no Recordhash or Ownerhash has been set in the past
                              ['resolver', 'storage'].includes(item.type) && resolver !== ccip2Contract && !recordhash && !ownerhash && (
                                <button
                                  className="button-tiny"
                                  onClick={() => {
                                    setHelpModal(true),
                                      setIcon(item.type === 'resolver' ? 'gpp_bad' : 'cancel'),
                                      setColor('orangered'),
                                      setHelp(item.type === 'resolver' ? '<span>Resolver is <span style="color: orange">not Migrated</span><span>' : '<span><span style="color: cyan">Storage</span> <span style="color: orange">not Set</span></span>')
                                  }}
                                  data-tooltip={'Resolver Not Migrated And Storage Not Set'}
                                >
                                  <div
                                    className="material-icons smol"
                                    style={{
                                      color: 'orangered',
                                      marginLeft: item.type === 'resolver' ? '5px' : '5px'
                                    }}
                                  >
                                    {item.type === 'resolver' ? 'gpp_bad' : 'cancel'}
                                  </div>
                                </button>
                              )}
                            { // Resolver is not migrated but Recordhash has been set in the past
                              ['resolver', 'storage'].includes(item.type) && resolver !== ccip2Contract && (recordhash || ownerhash) && (
                                <button
                                  className="button-tiny"
                                  onClick={() => {
                                    setHelpModal(true),
                                      setIcon(item.type === 'resolver' ? 'gpp_bad' : 'gpp_maybe'),
                                      setColor(item.type === 'resolver' ? 'orangered' : (recordhash ? 'orange' : (ownerhash && managers.includes(_Wallet_ || '0') ? 'cyan' : 'cyan'))),
                                      setHelp(item.type === 'resolver' ? '<span>Resolver <span style="color: orange">not Migrated</span></span>' : (recordhash ? `<span><span style="color: cyan">${recordhash.startsWith('https://') ? 'Gateway' : 'Recordhash'}</span> <span style="color: lime">is Set</span></span>` : `<span><span style="color: cyan">${ownerhash.startsWith('https://') ? 'Gateway' : 'Ownerhash'}</span> <span style="color: lime">is Set</span></span>`))
                                  }}
                                  data-tooltip={recordhash ? `Resolver not Migrated But ${recordhash.startsWith('https://') ? 'Gateway' : 'Recordhash'} is Set` : `Resolver not Migrated But ${ownerhash.startsWith('https://') ? 'Gateway' : 'Ownerhash'} is Set`}
                                >
                                  <div
                                    className="material-icons smol"
                                    style={{
                                      color: item.type === 'resolver' ? 'orangered' : (recordhash ? 'orange' : 'cyan'),
                                      marginLeft: item.type === 'resolver' ? '5px' : '5px'
                                    }}
                                  >
                                    {item.type === 'resolver' ? 'gpp_bad' : 'gpp_maybe'}
                                  </div>
                                </button>
                              )}

                            { // Info Storage
                              item.type === 'storage' && (
                                <button
                                  className="button-tiny"
                                  onClick={() => {
                                    setInfoModal(true)
                                  }}
                                  data-tooltip={`Click For IPFS Hash`}
                                  disabled={!hashIPFS}
                                >
                                  <div
                                    className="material-icons smoller"
                                    style={{
                                      color: !hashIPFS ? 'orange' : (recordhash ? 'lime' : 'cyan'),
                                      fontSize: '15px',
                                      marginLeft: '-5.5px'
                                    }}
                                  >
                                    hub
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
                                  data-tooltip={constants.blocked.includes(item.type) ? 'Temporarily Unavailable' : 'Enlighten Me'}
                                >
                                  <div
                                    className="material-icons smol"
                                    style={{
                                      color: constants.blocked.includes(item.type) ? 'orange' : 'cyan',
                                      marginLeft: item.type === 'storage' ? '-5px' : '5px'
                                    }}
                                  >
                                    info_outline
                                  </div>
                                </button>
                              )}

                            { // Countdown
                              !['resolver', 'storage'].includes(item.type) && !constants.blocked.includes(item.type)
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

                            { // Refresh buttons
                              !['resolver', 'storage'].includes(item.type) && !constants.blocked.includes(item.type)
                              && resolver === ccip2Contract && _Wallet_ &&
                              (recordhash || ownerhash) && history.ownerstamp.length > 0 && (
                                <button
                                  className={!['', '.', '0', '1'].includes(refresh) && refresh === item.type ? "button-tiny blink" : "button-tiny"}
                                  onClick={() => {
                                    refresh !== '' ? '' : refreshRecord([item.type, ''], resolveCall, ENS, true),
                                      setRefreshedItem(item.type)
                                  }}
                                  data-tooltip={![item.type, '.', '0', '1'].includes(refresh) ? (item.value === history[item.type] ? 'Record in Sync with IPNS' : 'Record not in Sync. Click to refresh') : (!['.', '', '0', '1'].includes(refresh) ? 'Refresh in Progress' : (refresh === '1' ? 'Record Updated' : (refresh === '0' ? 'Error in Update' : (refresh === '.' ? 'Please Wait to Refresh again' : 'Click to Refresh'))))}
                                >
                                  <div
                                    className="material-icons smol"
                                    style={{
                                      color: ![item.type, '.', '0', '1'].includes(refresh) ? (item.value === history[item.type] ? 'lightgreen' : 'orange') : (!['.', '', '0', '1'].includes(refresh) ? 'white' : (refresh === '1' ? 'lime' : (refresh === '0' ? 'yellow' : (refresh === '.' ? 'orangered' : 'cyan')))),
                                      marginLeft: '-5px'
                                    }}
                                  >
                                    sync
                                  </div>
                                </button>
                              )}

                            { // Updated State marker
                              item.state && (
                                <div
                                  className="material-icons smol"
                                  style={{
                                    color: crash && sustain ? 'orangered' : 'lime',
                                    marginLeft: '-5px'
                                  }}
                                >
                                  {crash && sustain ? 'cancel' : 'task_alt'}
                                </div>
                              )}
                          </span>
                          <button
                            className="button"
                            hidden={
                              !['resolver', 'storage'].includes(item.type) && states.length > 1
                            }
                            disabled={
                              constants.blocked.includes(item.type) ||
                              !list[item.key].active ||
                              !legit[item.type] ||
                              item.state ||
                              !_Wallet_ ||
                              !managers.includes(String(_Wallet_)) ||
                              (!['resolver', 'storage'].includes(item.type) && newValues === constants.EMPTY_STRING())
                            }
                            style={{
                              alignSelf: 'flex-end',
                              height: '25px',
                              width: 'auto',
                              marginTop: '-3px',
                            }}
                            onClick={() => {
                              setTrigger(item.type),
                                setSafeTrigger('1'),
                                ['resolver', 'storage'].includes(item.type) ? (setOptions(true), setWrite(false)) : setWrite(true), // Trigger write for Records
                                ['resolver', 'storage'].includes(item.type) ? setStates(prevState => [...prevState, item.type]) : '' // Update edited keys
                            }}
                            data-tooltip={item.tooltip}
                          >
                            <div
                              className="flex-sans-direction"
                              style={{
                                fontSize: '13px'
                              }}
                            >
                              {item.label}&nbsp;<span className="material-icons smoller">manage_history</span>
                            </div>
                          </button>
                        </div>
                        <input
                          className={!['resolver', 'storage'].includes(item.type) ? 'inputextra' : 'inputextra_'}
                          id={item.key}
                          key={item.key}
                          placeholder={constants.blocked.includes(item.type) ? 'Temporarily Unavailable' : item.value}
                          type='text'
                          disabled={
                            !item.editable || constants.blocked.includes(item.type) || !managers.includes(String(_Wallet_))
                          }
                          style={{
                            fontFamily: 'SF Mono',
                            fontWeight: '400',
                            fontSize: '14px',
                            width: '100%',
                            wordWrap: 'break-word',
                            textAlign: 'left',
                            marginBottom: '-5px',
                            color: !legit[item.type] ? 'white' : 'lightgreen',
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
                </div>
              </ul>
              {states.length > 1 && (
                <div
                  style={{
                    marginTop: '-10px',
                    marginBottom: '40px'
                  }}
                >
                  <button
                    className="button flex-column"
                    hidden={
                      states.length < 2
                    }
                    disabled={
                      !_Wallet_ ||
                      !managers.includes(String(_Wallet_)) ||
                      (newValues === constants.EMPTY_STRING())
                    }
                    style={{
                      alignSelf: 'flex-end',
                      height: '25px',
                      width: 'auto',
                      marginTop: '-3px',
                    }}
                    onClick={() => {
                      setWrite(true)
                      setTrigger('records'),
                        setSafeTrigger('1'),
                        setWrite(true)
                    }}
                    data-tooltip={'Set Multiple Records in One Click'}
                  >
                    <div
                      className="flex-sans-direction"
                      style={{
                        fontSize: '15px'
                      }}
                    >
                      {'Edit All'}&nbsp;<span className="material-icons smoller">manage_history</span>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </StyledModalBody>
        }
        <div id="modal-inner">
          <Help
            color={color}
            icon={icon}
            onClose={() => setHelpModal(false)}
            show={helpModal}
          >
            {help}
          </Help>
          <Success
            color={color}
            icon={icon}
            onClose={() => setSuccessModal(false)}
            show={successModal}
            handleTrigger={handleSuccessTrigger}
            handleModalData={handleSuccessModalData}
          >
            {success}
          </Success>
          <Gas
            color={'lime'}
            icon={'free_breakfast'}
            onClose={() => {
              setGasModal(false),
                setLoading(false)
            }}
            show={gasModal}
          >
            {gas}
          </Gas>
          <Info
            handleTrigger={handleInfoTrigger}
            handleModalData={handleInfoModalData}
            onClose={() => {
              setInfoModal(false)
            }}
            show={infoModal}
          >
            {hashIPFS}
          </Info>
          <Salt
            handleTrigger={handleSaltTrigger}
            handleModalData={handleSaltModalData}
            onClose={() => {
              setSalt(false)
            }}
            show={salt}
          >
            {ENS}
          </Salt>
          <Gateway
            handleTrigger={handleGatewayTrigger}
            handleModalData={handleGatewayModalData}
            onClose={() => {
              setSalt(false)
            }}
            show={gateway}
          >
          </Gateway>
          <Options
            handleTrigger={handleOptionsTrigger}
            handleModalData={handleOptionsModalData}
            onClose={() => {
              setOptions(false)
            }}
            show={options && trigger === 'resolver'}
          >
            {ownerhash ? true : false}
          </Options>
          <Confirm
            handleTrigger={handleConfirmTrigger}
            handleModalData={handleConfirmModalData}
            onClose={() => {
              setConfirm(false)
            }}
            show={confirm && !salt}
          >
            {'1'}
          </Confirm>
          <Error
            onClose={() => {
              setCrash(false),
                setRecentCrash(true)
            }}
            color={color}
            show={crash && !loading}
            title={'cancel'}
          >
            {message[0]}
          </Error>
        </div>
      </StyledModal>
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
  padding-top: 20px;
  padding-left: 0px;
  padding-right: 0px;
  padding-bottom: 0px;
  display: flex;
  justify-content: center;
  height: auto;
  overflow-y: auto;
  overflow-x: hidden;
`

const StyledModalTitle = styled.div`
  padding-top: 10px;
  padding-bottom: 10px;
  font-size: 22px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-weight: 1200;
  margin-bottom: 0px;
  color: white;
`

const StyledModalHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  font-size: 20px;
`

const StyledModal = styled.div`
  width: auto;
  min-width: 400px;
  border-radius: 6px;
  padding-top: 0px;
  padding-left: 0px;
  padding-right: 8px;
  padding-bottom: 0px;
  overflow-y: initial !important;
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

export default Preview
