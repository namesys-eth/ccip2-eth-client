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
import * as Nam3 from '@namesys-eth/w3name-client'
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
import { formatsByName } from '@ensdomains/address-encoder'

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
  const [browser, setBrowser] = React.useState(false) // Triggers at modal load
  const { data: gasData, isError } = useFeeData() // Current gas prices
  const [loading, setLoading] = React.useState(true) // Loading process indicator
  const [migrated, setMigrated] = React.useState(false) // Setup indicator; Setup = Resolver migration + Recordhash setting
  const [keygen, setKeygen] = React.useState(false) // IPNS keygen trigger following signature
  const [crash, setCrash] = React.useState(false);  // Signature fail indicator
  const [CID, setCID] = React.useState('') // IPNS pubkey/CID value
  const [ENS, setENS] = React.useState('') // ENS name; used to trigger useContractRead()
  const [helpModal, setHelpModal] = React.useState(false) // Help modal trigger
  const [successModal, setSuccessModal] = React.useState(false) // Success modal trigger
  const [gasModal, setGasModal] = React.useState(false) // Gas savings modal trigger
  const [conclude, setConclude] = React.useState(false) // Indicates when all records have finished fetching
  const [resolver, setResolver] = React.useState<any>() // Resolver for ENS Domain
  const [resolveCall, setResolveCall] = React.useState<any>() // Resolver object for querying records
  const [sync, setSync] = React.useState(false) // Records sync flag
  const [addr, setAddr] = React.useState('') // Addr record for ENS Domain
  const [avatar, setAvatar] = React.useState('') // Avatar record for ENS Domain
  const [email, setEmail] = React.useState('') // Email record for ENS Domain
  const [pubkey, setPubkey] = React.useState('') // Pubkey record for ENS Domain
  const [github, setGithub] = React.useState('') // Github record for ENS Domain
  const [url, setUrl] = React.useState('') // URL record for ENS Domain
  const [twitter, setTwitter] = React.useState('') // Twitter record for ENS Domain
  const [discord, setDiscord] = React.useState('') // Discord record for ENS Domain
  const [farcaster, setFarcaster] = React.useState('') // Farcaster record for ENS Domain
  const [nostr, setNostr] = React.useState('') // Nostr record for ENS Domain
  const [BTC, setBTC] = React.useState('') // BTC address record for ENS Domain
  const [LTC, setLTC] = React.useState('') // LTC address record for ENS Domain
  const [DOGE, setDOGE] = React.useState('') // DOGE address record for ENS Domain
  const [SOL, setSOL] = React.useState('') // SOL address record for ENS Domain
  const [ATOM, setATOM] = React.useState('') // ATOM address record for ENS Domain
  const [zonehash, setZonehash] = React.useState('') // DNS Zonehash record for ENS Domain
  const [thumbnail, setThumbnail] = React.useState('') // Thumbnail from avatar
  const [recordhash, setRecordhash] = React.useState<string>('') // Recordhash for CCIP2 Resolver
  const [ownerhash, setOwnerhash] = React.useState<string>('') // Ownerhash for CCIP2 Resolver
  const [namehashLegacy, setNamehashLegacy] = React.useState('') // Legacy Namehash of ENS Domain
  const [tokenIDLegacy, setTokenIDLegacy] = React.useState('') // Legacy Token ID of ENS Domain
  const [tokenIDWrapper, setTokenIDWrapper] = React.useState('') // Wrapper Token ID of ENS Domain
  const [managers, setManagers] = React.useState<string[]>([]) // Manager of ENS Domain
  const [contenthash, setContenthash] = React.useState('') // Contenthash record for ENS Domain
  const [saltModal, setSaltModal] = React.useState(false) // Salt (password/key-identifier) for IPNS keygen
  const [gateway, setGateway] = React.useState(false) // Gateway URL for storage
  const [refresh, setRefresh] = React.useState('') // Refresh record trigger
  const [refreshedItem, setRefreshedItem] = React.useState('') // Refresh record item
  const [refreshedValue, setRefreshedValue] = React.useState('') // Refresh record value
  const [list, setList] = React.useState<any[]>([]) // Internal LIST[] object with all record keys and values
  const [preCache, setPreCache] = React.useState<any[]>([]) // Copy of LIST[] object
  const [trigger, setTrigger] = React.useState<any>(undefined) // Triggered upon button click adjacent to the record in Preview modal
  const [safeTrigger, setSafeTrigger] = React.useState<string>('') // Cache state for trigger
  const [help, setHelp] = React.useState('') // Sets help text for the Help modal
  const [isSigner, setIsSigner] = React.useState(false) // Sets help text for the Help modal
  const [success, setSuccess] = React.useState('') // Sets success text for the Success modal
  const [gas, setGas] = React.useState<{}>({}) // Sets historical gas savings
  const [wrapped, setWrapped] = React.useState(false) // Indicates if the ENS Domain is wrapped
  const [keypairIPNS, setKeypairIPNS] = React.useState<[string, string]>() // Sets generated K_IPNS keys
  const [keypairSigner, setKeypairSigner] = React.useState<[string, string]>() // Sets generated K_IPNS and K_SIGNER keys
  const [updateRecords, setUpdateRecords] = React.useState(false) // Triggers signature for record update
  const [write, setWrite] = React.useState(false) // Triggers update of record to the NameSys backend and IPNS
  const [states, setStates] = React.useState<any[]>([]) // Contains keys of active records (that have been edited in the modal)
  const [newValues, setNewValues] = React.useState(constants.EMPTY_STRING_RECORDS()) // Contains new values for the active records in {a:b} format
  const [icon, setIcon] = React.useState('') // Sets icon for the loading state
  const [color, setColor] = React.useState('') // Sets color for the loading state
  const [message, setMessage] = React.useState(['', '']) // Sets message for the loading state
  const [options, setOptions] = React.useState(false) // Provides option with Ownerhash and Recordhash during migration
  const [confirm, setConfirm] = React.useState(false) // Confirmation modal
  const [infoModal, setInfoModal] = React.useState(false) // Info modal
  const [signatures, setSignatures] = React.useState(constants.EMPTY_STRING_RECORDS()) // Contains S_RECORDS(K_SIGNER) signatures of active records in the modal
  const [onChainManagerQuery, setOnChainManagerQuery] = React.useState<string[]>(['', '', '']) // CCIP2 Query for on-chain manager
  const [legit, setLegit] = React.useState(constants.EMPTY_BOOL_RECORDS()) // Whether record edit is legitimate
  const [timestamp, setTimestamp] = React.useState('') // Stores update timestamp returned by backend
  const [isLoading, setIsLoading] = React.useState(constants.EMPTY_STRING_RECORDS()) // Loading Records marker
  const [hashType, setHashType] = React.useState('gateway') // Recordhash or Ownerhash storage
  const [hashIPFS, setHashIPFS] = React.useState('') // IPFS hash behind IPNS
  const [imageLoaded, setImageLoaded] = React.useState<boolean | undefined>(undefined) // Whether avatar resolves or not
  const [recentCrash, setRecentCrash] = React.useState(false) // Crash state
  const [goodSalt, setGoodSalt] = React.useState(false) // If generated CID matches the available storage
  const [saltModalState, setSaltModalState] = React.useState<constants.MainBodyState>({
    modalData: undefined,
    trigger: false
  }) // Salt modal state
  const [optionsModalState, setOptionsModalState] = React.useState<constants.MainBodyState>({
    modalData: undefined,
    trigger: false
  }) // Options modal state
  const [confirmModalState, setConfirmModalState] = React.useState<constants.MainBodyState>({
    modalData: undefined,
    trigger: false
  }) // Confirm modal state
  const [gatewayModalState, setGatewayModalState] = React.useState<constants.MainBodyState>({
    modalData: undefined,
    trigger: false
  }) // Gateway modal state
  const [successModalState, setSuccessModalState] = React.useState<constants.MainBodyState>({
    modalData: undefined,
    trigger: false
  }) // Confirm modal state
  const [history, setHistory] = React.useState(constants.EMPTY_HISTORY_RECORDS) // Record history from last update
  const [sigIPNS, setSigIPNS] = React.useState('') // Signature S_IPNS(K_WALLET) for IPNS keygen
  const [sigSigner, setSigSigner] = React.useState('') // Signature S_SIGNER(K_WALLET) for Signer
  const [sigApproved, setSigApproved] = React.useState('') // Signature S_APPROVE(K_WALLET) for Records Manager
  const [sigCount, setSigCount] = React.useState(0) // Signature Count
  const [processCount, setProcessCount] = React.useState(0) // Process Count
  const [queue, setQueue] = React.useState(0) // Sets queue countdown between successive updates
  const [sustain, setSustain] = React.useState(false) // Sustains status of record update
  const [onChainManager, setOnChainManager] = React.useState('') // Sets CCIP2 Manager

  // Variables
  const { address: _Wallet_ } = useAccount()
  const { Revision } = Name // W3Name Revision object
  const recoveredAddress = React.useRef<string>()
  const ccip2Contract = constants.ccip2[chain === '1' ? 1 : 0]
  const ccip2Config = constants.ccip2Config[chain === '1' ? 1 : 0]
  const apiKey = chain === '5' ? process.env.NEXT_PUBLIC_ALCHEMY_ID_GOERLI : process.env.NEXT_PUBLIC_ALCHEMY_ID_MAINNET
  const network = chain === '5' ? 'goerli' : 'mainnet'
  const provider = new ethers.providers.AlchemyProvider(network, apiKey)
  const alchemyEndpoint = `https://eth-${network}.g.alchemy.com/v2/` + apiKey
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
  const { data: _OwnerLegacy_, isLoading: legacyOwnerLoading, isError: legacyOwnerError } = useContractRead({
    address: `0x${constants.ensConfig[1].addressOrName.slice(2)}`,
    abi: constants.ensConfig[1].contractInterface,
    functionName: 'ownerOf',
    args: [tokenIDLegacy]
  })
  // Read Legacy ENS Registry for ENS domain Manager
  const { data: _ManagerLegacy_, isLoading: legacyManagerLoading, isError: legacyManagerError } = useContractRead({
    address: `0x${constants.ensConfig[0].addressOrName.slice(2)}`,
    abi: constants.ensConfig[0].contractInterface,
    functionName: 'owner',
    args: [namehashLegacy]
  })
  // Read CCIP2 for ENS domain on-chain manager
  const { data: _CCIP2Manager_ } = useContractRead({
    address: `0x${ccip2Config.addressOrName.slice(2)}`,
    abi: ccip2Config.contractInterface,
    functionName: 'isApprovedSigner',
    args: [getManager(), ethers.utils.namehash(ENS), keypairSigner && keypairSigner[0] ? ethers.utils.computeAddress(`0x${keypairSigner[0]}`) : constants.zeroAddress]
  })
  // Read ownership of a domain from ENS Wrapper
  const { data: _OwnerWrapped_, isLoading: wrapperOwnerLoading, isError: wrapperOwnerError } = useContractRead({
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
    args: [ethers.utils.hexZeroPad(getManager(), 32).toLowerCase()]
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
    data: response1of3,
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

  // Sets IPNS Short Recordhash in CCIP2 Resolver
  const {
    data: response2of3,
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
        [CID.startsWith('k') ? `0x${constants.encodeContenthash(CID).split(constants.ipnsPrefix)[1]}` : constants.zeroBytes]
      )
    ]
  })

  // Sets Gateway as Recordhash in CCIP2 Resolver
  const {
    data: response3of3,
    write: initGateway,
    isLoading: isSetGatewayLoading,
    isSuccess: isSetGatewaySuccess,
    isError: isSetGatewayError
  } = useContractWrite({
    address: `0x${ccip2Config.addressOrName.slice(2)}`,
    abi: ccip2Config.contractInterface,
    functionName: 'setRecordhash',
    args: [
      ethers.utils.namehash(ENS),
      CID ? ethers.utils.hexlify(ethers.utils.toUtf8Bytes(CID)) : constants.zeroBytes
    ]
  })

  // Wagmi hook for awaiting transaction processing
  const { isSuccess: txSuccess1of3, isError: txError1of3, isLoading: txLoading1of3 } = useWaitForTransaction({
    hash: response1of3?.hash,
  })
  const { isSuccess: txSuccess2of3, isError: txError2of3, isLoading: txLoading2of3 } = useWaitForTransaction({
    hash: response2of3?.hash,
  })
  const { isSuccess: txSuccess3of3, isError: txError3of3, isLoading: txLoading3of3 } = useWaitForTransaction({
    hash: response3of3?.hash,
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
    setSaltModal(false)
  }

  // Handle Gateway modal data return
  const handleGatewayModalData = (data: string | undefined) => {
    setGatewayModalState(prevState => ({ ...prevState, modalData: data }))
  }
  // Handle Gateway modal trigger
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
    setSigApproved('') // Purge Manager Signature S_RECORDS from local storage 
    setSignatures(constants.EMPTY_STRING_RECORDS()) // Purge Record Signatures from local storage 
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
  function setMetadata(
    _recordhash: string, _addr: string, _contenthash: string, _avatar: string, _pubkey: string, _email: string,
    _github: string, _url: string, _twitter: string, _discord: string, _farcaster: string, _nostr: string,
    _btc: string, _ltc: string, _doge: string, _sol: string, _atom: string,
  ) {
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
        header: 'Contenthash',
        type: 'contenthash',
        value: _contenthash,
        editable: resolver === ccip2Contract && queue > 0,
        active: constants.isContenthash(_contenthash) && queue > 0,
        state: false,
        label: 'Edit',
        help: '<span>Set your <span style="color: cyan">web contenthash</span></span>',
        tooltip: 'Set Contenthash'
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
        key: 5,
        header: 'Public Key',
        type: 'pubkey',
        value: _pubkey,
        editable: resolver === ccip2Contract && queue > 0,
        active: constants.isPubkey(_pubkey) && queue > 0,
        state: false,
        label: 'Edit',
        help: '<span>Set your <span style="color: cyan">Public Key</span></span>',
        tooltip: 'Set Public Key'
      },
      {
        key: 6,
        header: 'Email',
        type: 'email',
        value: _email,
        editable: resolver === ccip2Contract && queue > 0,
        active: constants.isEmail(_email) && queue > 0,
        state: false,
        label: 'Edit',
        help: '<span>Set your <span style="color: cyan">Email</span></span>',
        tooltip: 'Set Email Record'
      },
      {
        key: 7,
        header: 'Github',
        type: 'com.github',
        value: _github,
        editable: resolver === ccip2Contract && queue > 0,
        active: constants.isGithub(_github) && queue > 0,
        state: false,
        label: 'Edit',
        help: '<span>Set your <span style="color: cyan">Github username</span></span>',
        tooltip: 'Set Github Record'
      },
      {
        key: 8,
        header: 'Url',
        type: 'url',
        value: _url,
        editable: resolver === ccip2Contract && queue > 0,
        active: constants.isUrl(_url) && queue > 0,
        state: false,
        label: 'Edit',
        help: '<span>Set your <span style="color: cyan">URL</span></span>',
        tooltip: 'Set URL Record'
      },
      {
        key: 9,
        header: 'Twitter',
        type: 'com.twitter',
        value: _twitter,
        editable: resolver === ccip2Contract && queue > 0,
        active: constants.isTwitter(_twitter) && queue > 0,
        state: false,
        label: 'Edit',
        help: '<span>Set your <span style="color: cyan">Twitter username</span></span>',
        tooltip: 'Set Twitter Record'
      },
      {
        key: 10,
        header: 'Discord',
        type: 'com.discord',
        value: _discord,
        editable: resolver === ccip2Contract && queue > 0,
        active: constants.isDiscord(_discord) && queue > 0,
        state: false,
        label: 'Edit',
        help: '<span>Set your <span style="color: cyan">Discord username</span></span>',
        tooltip: 'Set Discord Record'
      },
      {
        key: 11,
        header: 'Farcaster',
        type: 'xyz.farcaster',
        value: _farcaster,
        editable: resolver === ccip2Contract && queue > 0,
        active: constants.isFarcaster(_farcaster) && queue > 0,
        state: false,
        label: 'Edit',
        help: '<span>Set your <span style="color: cyan">Farcaster username</span></span>',
        tooltip: 'Set Farcaster Record'
      },
      {
        key: 12,
        header: 'Nostr',
        type: 'nostr',
        value: _nostr,
        editable: resolver === ccip2Contract && queue > 0,
        active: constants.isNostr(_nostr) && queue > 0,
        state: false,
        label: 'Edit',
        help: '<span>Set your <span style="color: cyan">Nostr username</span></span>',
        tooltip: 'Set Discord Record'
      },
      {
        key: 13,
        header: 'Bitcoin',
        type: 'btc',
        value: _btc,
        editable: resolver === ccip2Contract && queue > 0,
        active: constants.isBTC(_btc) && queue > 0,
        state: false,
        label: 'Edit',
        help: '<span>Set your <span style="color: cyan">BTC Address</span></span>',
        tooltip: 'Set BTC Address'
      },
      {
        key: 14,
        header: 'Litecoin',
        type: 'ltc',
        value: _ltc,
        editable: resolver === ccip2Contract && queue > 0,
        active: constants.isLTC(_ltc) && queue > 0,
        state: false,
        label: 'Edit',
        help: '<span>Set your <span style="color: cyan">LTC Address</span></span>',
        tooltip: 'Set LTC Address'
      },
      {
        key: 15,
        header: 'Dogecoin',
        type: 'doge',
        value: _doge,
        editable: resolver === ccip2Contract && queue > 0,
        active: constants.isDOGE(_doge) && queue > 0,
        state: false,
        label: 'Edit',
        help: '<span>Set your <span style="color: cyan">DOGE Address</span></span>',
        tooltip: 'Set DOGE Address'
      },
      {
        key: 16,
        header: 'Solana',
        type: 'sol',
        value: _sol,
        editable: resolver === ccip2Contract && queue > 0,
        active: constants.isSOL(_sol) && queue > 0,
        state: false,
        label: 'Edit',
        help: '<span>Set your <span style="color: cyan">SOL Address</span></span>',
        tooltip: 'Set SOL Address'
      },
      {
        key: 17,
        header: 'Cosmos',
        type: 'atom',
        value: _atom,
        editable: resolver === ccip2Contract && queue > 0,
        active: constants.isATOM(_atom) && queue > 0,
        state: false,
        label: 'Edit',
        help: '<span>Set your <span style="color: cyan">ATOM Address</span></span>',
        tooltip: 'Set ATOM Address'
      }
    ]
    concludeGet(_LIST) // Assign to LIST[]
  }

  // Set Records to show for ENS domain
  function concludeGet(data: React.SetStateAction<any[]> | undefined) {
    if (data) {
      setPreCache(data)
    }
  }

  // Functions for <Elements>
  function multiEdit(_item: any) {
    return !constants.config.includes(_item.type) && states.length > 1 && !states.includes('resolver') && !states.includes('storage')
  }
  function isDisabled(_item: any) {
    return constants.blocked.includes(_item.type) ||
      !list[_item.key].active ||
      !legit[_item.type] ||
      _item.state ||
      !_Wallet_ ||
      !managers.includes(String(_Wallet_)) ||
      (!constants.config.includes(_item.type) && newValues === constants.EMPTY_STRING_RECORDS())
  }

  /// Keys & Signature Definitions
  /* K_SIGNER = Generated secp256k1 Keypair 
   * K_WALLET = Wallet secp256k1 Keypair 
   * K_IPNS = Generated ed25519 Keypair
   * S_IPNS = Signature for K_IPNS Generation (Signed by K_WALLET)
   * S_RECORDS = Signature for Records (Signed by K_SIGNER)
   * S_APPROVE = Signature for Manager Approval (Signed by K_WALLET)
   * S_SIGNER = Signature for K_SIGNER Generation (Signed by K_WALLET)
   */
  // Signature S_IPNS statement; S_IPNS(K_WALLET) [IPNS Keygen]
  // S_IPNS is not recovered on-chain; no need for buffer prepend and hashing of message required to sign
  function statementIPNSKey(extradata: string, type: string) {
    let _toSign = `Requesting Signature To Generate IPNS Key\n\nOrigin: ${['recordhash', 'gateway'].includes(type) ? ENS : origin}\nKey Type: ed25519\nExtradata: ${extradata}\nSigned By: ${caip10}`
    let _digest = _toSign
    return _digest
  }
  // Signature S_RECORDS statement; S_RECORDS(K_SIGNER) [Record Signature]
  // S_RECORDS is recovered on-chain; requires buffer prepend, hashing of message and arrayifying it
  function statementRecords(recordType: string, extradata: string, signer: string) {
    let _signer = 'eip155:' + chain + ':' + ethers.utils.computeAddress(`0x${signer}`)
    let _toSign = `Requesting Signature To Update ENS Record\n\nOrigin: ${ENS}\nRecord Type: ${recordType}\nExtradata: ${extradata}\nSigned By: ${_signer}`
    return _toSign
  }
  // Signature S_APPROVE statement; S_APPROVE(K_WALLET) [Approved Signature]
  // S_APPROVE is recovered on-chain; requires buffer prepend, hashing of message and arrayifying it
  function statementManager(signer: string) {
    let _signer = 'eip155:' + chain + ':' + ethers.utils.computeAddress(`0x${signer}`) // Convert secp256k1 pubkey to ETH address
    let _toSign = `Requesting Signature To Approve ENS Records Signer\n\nOrigin: ${ENS}\nApproved Signer: ${_signer}\nApproved By: ${caip10}`
    return _toSign
  }
  // Signature S_SIGNER statement; S_SIGNER(K_WALLET) [Signer Keygen]
  // S_SIGNER is not recovered on-chain; no need for buffer prepend and hashing of message required to sign
  function statementSignerKey(extradata: string) {
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
    if (['avatar', 'email', 'pubkey',
      'com.github', 'url', 'com.twitter', 'com.discord', 'xyz.farcaster', 'nostr',
      'zonehash'
    ].includes(key)) {
      type = 'string'
      _value = value
    }
    if ([
      'btc', 'ltc', 'doge', 'sol', 'atom'
    ].includes(key)) {
      type = 'bytes'
      _value = `0x${formatsByName[key.toUpperCase()].decoder(value).toString('hex')}`
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

  // Generate extradata for S_RECORDS(K_SIGNER)
  function genExtradata(key: string, _recordValue: string) {
    // returns bytesToHexString(abi.encodePacked(keccak256(result)))
    let type: string = ''
    let _value: string = ''
    if (['avatar', 'email', 'pubkey',
      'com.github', 'url', 'com.twitter', 'com.discord', 'xyz.farcaster', 'nostr',
      'zonehash'
    ].includes(key)) {
      type = 'string'
      _value = _recordValue
    }
    if ([
      'btc', 'ltc', 'doge', 'sol', 'atom'
    ].includes(key)) {
      type = 'bytes'
      _value = `0x${formatsByName[key.toUpperCase()].decoder(_recordValue).toString('hex')}`
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

  // Returns Owner of Wrapped or Manager of Legacy ENS Domain
  function getManager() {
    if (_OwnerLegacy_ && _ManagerLegacy_) {
      if (String(_OwnerLegacy_) === constants.ensContracts[chain === '1' ? 7 : 3]) {
        return _OwnerWrapped_ ? String(_OwnerWrapped_) : constants.zeroAddress
      } else {
        return String(_ManagerLegacy_)
      }
    } else {
      return constants.zeroAddress
    }
  }

  // Function to set additional records
  function setExtraRecords(key: string, value: string) {
    if (key === 'avatar') setAvatar(value)
    if (key === 'email') setEmail(value)
    if (key === 'pubkey') setPubkey(value)
    if (key === 'com.github') setGithub(value)
    if (key === 'url') setUrl(value)
    if (key === 'com.twitter') setTwitter(value)
    if (key === 'com.discord') setDiscord(value)
    if (key === 'xyz.farcaster') setFarcaster(value)
    if (key === 'nostr') setNostr(value)
    if (key === 'btc') setBTC(value)
    if (key === 'ltc') setLTC(value)
    if (key === 'doge') setDOGE(value)
    if (key === 'sol') setSOL(value)
    if (key === 'atom') setATOM(value)
    if (key === 'zonehash') setZonehash(value)
  }

  // Function to get additional records
  async function getExtraRecords(resolver: ethers.providers.Resolver) {
    await getText(resolver, 'avatar')
    await getText(resolver, 'email')
    await getText(resolver, 'pubkey')
    await getText(resolver, 'com.github')
    await getText(resolver, 'url')
    await getText(resolver, 'com.twitter')
    await getText(resolver, 'com.discord')
    await getText(resolver, 'xyz.farcaster')
    await getText(resolver, 'nostr')
    await getAddress(resolver, 'btc')
    await getAddress(resolver, 'ltc')
    await getAddress(resolver, 'doge')
    await getAddress(resolver, 'sol')
    await getAddress(resolver, 'atom')
    // getDns(type)
  }

  // Function to set empty records
  function setEmptyRecords(key: string) {
    if (key === 'avatar') setAvatar('')
    if (key === 'email') setEmail('')
    if (key === 'pubkey') setPubkey('')
    if (key === 'com.github') setGithub('')
    if (key === 'url') setUrl('')
    if (key === 'com.twitter') setTwitter('')
    if (key === 'com.discord') setDiscord('')
    if (key === 'xyz.farcaster') setFarcaster('')
    if (key === 'nostr') setNostr('')
    if (key === 'btc') setBTC('')
    if (key === 'ltc') setLTC('')
    if (key === 'doge') setDOGE('')
    if (key === 'sol') setSOL('')
    if (key === 'atom') setATOM('')
    if (key === 'zonehash') setZonehash('')
    setSync(true)
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
    setSaltModal(false)
    setGoodSalt(false)
    if (write) setWrite(false)
    setConfirmModalState({
      modalData: undefined,
      trigger: false
    })
    setOptionsModalState({
      modalData: undefined,
      trigger: false
    })
    setGatewayModalState({
      modalData: undefined,
      trigger: false
    })
  }

  /// Trigger Enjoy
  function doEnjoy() {
    setIcon('gpp_good')
    setColor('lime')
    setLegit(constants.EMPTY_BOOL_RECORDS())
    setSaltModal(false)
    setLoading(false)
    setQueue(hashType === 'gateway' ? 1 : 1)
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
    setConfirmModalState({
      modalData: undefined,
      trigger: false
    })
    setOptionsModalState({
      modalData: undefined,
      trigger: false
    })
    setGatewayModalState({
      modalData: undefined,
      trigger: false
    })
    setGoodSalt(false)
    setTrigger('')
    if (write) setWrite(false)
    setUpdateRecords(false)
  }

  // Signature S_RECORDS with K_SIGNER 
  // K_SIGNER = keypairSigner; secp256k1
  // K_IPNS = keypairIPNS; ed25519
  async function signRecords(input: any) {
    if (keypairSigner) {
      const SIGN_RECORDS = async () => {
        const _signer = new ethers.Wallet('0x' + keypairSigner[0], provider)
        const __signature = await _signer.signMessage(input.message)
        if (__signature) return __signature
      }
      const _signature = SIGN_RECORDS()
      return _signature
    }
  }

  // Signature S_APPROVE with K_WALLET
  async function signManager() {
    setSigCount(3) // Trigger S_APPROVE(K_WALLET)
    setMessage(['Waiting For Signature', '3'])
    if (keypairSigner) {
      const SIGN_APPROVE = async () => {
        signMessage({
          message:
            statementManager(
              keypairSigner[0]
            )
        })
      }
      SIGN_APPROVE()
    }
  }

  // Signature S_SIGNER with K_WALLET
  async function signSigner(_value: string) {
    const SIGN_SIGNER = async () => {
      signMessage({
        message: statementSignerKey(
          ethers.utils.keccak256(ethers.utils.solidityPack(
            ['bytes32', 'address'],
            [
              ethers.utils.keccak256(ethers.utils.solidityPack(['string'], [_value])),
              _Wallet_
            ]
          ))
        )
      })
    }
    SIGN_SIGNER()
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
      } else if (['avatar', 'email', 'pubkey',
        'com.github', 'url', 'com.twitter', 'com.discord', 'xyz.farcaster', 'nostr',
        'zonehash'
      ].includes(key)) {
        gasAmount = await contract.methods.setText(ethers.utils.namehash(ENS), key, value).estimateGas({ from: _Wallet_ })
      } else if ([
        'btc', 'ltc', 'doge', 'sol', 'atom'
      ].includes(key)) {
        let _type = key === 'btc' ? 0 : (key === 'ltc' ? 2 : (key === 'doge' ? 3 : (key === 'sol' ? 501 : 118)))
        gasAmount = await contract.methods.setAddr(ethers.utils.namehash(ENS), _type, `0x${formatsByName[key.toUpperCase()].decoder(value).toString('hex')}`).estimateGas({ from: _Wallet_ })
      } else if (key === 'addr') {
        gasAmount = await contract.methods.setAddr(ethers.utils.namehash(ENS), value).estimateGas({ from: _Wallet_ })
      }
      return gasAmount
    }
    const gas = await getGasAmountForContractCall()
    return gas
  }

  // Get Contenthash for ENS domain
  async function getContenthash(resolver: ethers.providers.Resolver) {
    let _Loading = { ...isLoading }
    _Loading['contenthash'] = '-'
    setIsLoading(_Loading)
    setSync(true)
    await resolver.getContentHash()
      .then((response) => {
        if (!response) {
          _Loading['contenthash'] = '0'
          setContenthash('')
          setIsLoading(_Loading)
        } else {
          _Loading['contenthash'] = '1'
          setContenthash(response)
          setIsLoading(_Loading)
        }
        getAddr(resolver)
      })
      .catch(() => {
        _Loading['contenthash'] = '0'
        setContenthash('')
        setIsLoading(_Loading)
        getAddr(resolver)
      })
  }

  // Get Text records for ENS domain
  async function getText(resolver: ethers.providers.Resolver, key: string) {
    let _Loading = { ...isLoading }
    _Loading[key] = '-'
    setIsLoading(_Loading)
    await resolver.getText(key)
      .then((response) => {
        if (!response) {
          _Loading[key] = '0'
          setEmptyRecords(key)
          setIsLoading(_Loading)
        } else {
          _Loading[key] = '1'
          setExtraRecords(key, response)
          setIsLoading(_Loading)
        }
      })
      .catch(() => {
        _Loading[key] = '0'
        setEmptyRecords(key)
        setIsLoading(_Loading)
      })
  }

  // Get non-ETH addresses for ENS domain
  async function getAddress(resolver: ethers.providers.Resolver, key: string) {
    let _type = key === 'btc' ? 0 : (key === 'ltc' ? 2 : (key === 'doge' ? 3 : (key === 'sol' ? 501 : 118)))
    let _Loading = { ...isLoading }
    _Loading[key] = '-'
    setIsLoading(_Loading)
    if (key === 'btc') { // Use Ethers.JS for BTC
      await resolver.getAddress(_type)
        .then((response) => {
          if (!response) {
            _Loading[key] = '0'
            setEmptyRecords(key)
            setIsLoading(_Loading)
          } else {
            _Loading[key] = '1'
            setExtraRecords(key, response)
            setIsLoading(_Loading)
          }
        })
        .catch(() => {
          _Loading[key] = '0'
          setEmptyRecords(key)
          setIsLoading(_Loading)
        })
    }
  }

  // Get Addr60 for ENS domain
  async function getAddr(resolver: ethers.providers.Resolver) {
    let _Loading = { ...isLoading }
    _Loading['addr'] = '-'
    setIsLoading(_Loading)
    await provider.resolveName(ENS)
      .then(async response => {
        if (!response) {
          _Loading['addr'] = '0'
          setAddr('')
          setIsLoading(_Loading)
          await getExtraRecords(resolver)
        } else {
          _Loading['addr'] = '1'
          setAddr(response)
          setIsLoading(_Loading)
          await getExtraRecords(resolver)
        }
      })
      .catch(async () => {
        _Loading['addr'] = '0'
        setAddr('')
        setIsLoading(_Loading)
        await getExtraRecords(resolver)
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
          let _Storage = await verifier.quickRecordhash(_ENS, ccip2Config, getManager())
          let _IPFS: any
          if (_history.ownerstamp.length > 1) {
            for (var i = 0; i < 2; i++) {
              _IPFS = await constants.getIPFSHashFromIPNS(ensContent.decodeContenthash(_Storage[0]).decoded, i)
            }
          } else if (_history.ownerstamp.length === 1) {
            _IPFS = {
              '_value': '//',
              '_sequence': '-1'
            }
          } else {
            _IPFS = {
              '_value': '//',
              '_sequence': ''
            }
          }
          setHashIPFS(_IPFS._value.split('/')[2])
          if (_history.ownerstamp.length >= 1) {
            if ((_IPFS._sequence && _history.timestamp.revision) && (Number(_IPFS._sequence) === Number(_history.timestamp.revision) - 1) && _Storage[1]) {
              _history.addr ? setAddr(_history.addr) : setAddr('')
              _history.contenthash ? setContenthash(_history.contenthash) : setContenthash('')
              _history.avatar ? setAvatar(_history.avatar) : setAvatar('')
              _history.email ? setEmail(_history.email) : setEmail('')
              _history['com.github'] ? setGithub(_history['com.github']) : setGithub('')
              _history.url ? setUrl(_history.url) : setUrl('')
              _history['com.twitter'] ? setTwitter(_history['com.twitter']) : setTwitter('')
              _history['com.discord'] ? setTwitter(_history['com.discord']) : setDiscord('')
              _history['xyz.farcaster'] ? setFarcaster(_history['xyz.farcaster']) : setFarcaster('')
              _history.nostr ? setNostr(_history.nostr) : setNostr('')
              _history.btc ? setBTC(_history.btc) : setBTC('')
              _history.ltc ? setLTC(_history.ltc) : setLTC('')
              _history.doge ? setDOGE(_history.doge) : setDOGE('')
              _history.sol ? setSOL(_history.sol) : setSOL('')
              _history.atom ? setATOM(_history.atom) : setATOM('')
              setSync(true)
            } else {
              getContenthash(_response)
            }
          } else {
            getContenthash(_response)
            /* @TODO
            setContenthash('')
            setAvatar('')
            setAddr('')
            setSync(true)
            */
          }
        } else {
          setSync(true)
          const _addr = await refreshRecord(['addr', ''], _response, _ENS, false)
          setAddr(_addr || '')
          const _contenthash = await refreshRecord(['contenthash', ''], _response, _ENS, false)
          setContenthash(_contenthash || '')
          let _avatar: string
          _avatar = await refreshRecord(['avatar', ''], _response, _ENS, false)
          if (!_avatar) {
            _avatar = await refreshRecord(['text', 'avatar'], _response, _ENS, false)
          }
          setAvatar(_avatar || '')
          const _email = await refreshRecord(['text', 'email'], _response, _ENS, false)
          setEmail(_email || '')
          setPubkey('')
          const _github = await refreshRecord(['text', 'com.github'], _response, _ENS, false)
          setGithub(_github || '')
          const _url = await refreshRecord(['text', 'url'], _response, _ENS, false)
          setUrl(_url || '')
          const _twitter = await refreshRecord(['text', 'com.twitter'], _response, _ENS, false)
          setTwitter(_twitter || '')
          const _discord = await refreshRecord(['text', 'com.discord'], _response, _ENS, false)
          setDiscord(_discord || '')
          const _farcaster = await refreshRecord(['text', 'xyz.farcaster'], _response, _ENS, false)
          setFarcaster(_farcaster || '')
          const _nostr = await refreshRecord(['text', 'nostr'], _response, _ENS, false)
          setNostr(_nostr || '')
          const _btc = await refreshRecord(['address', 'btc'], _response, _ENS, false)
          setBTC(_btc || '')
          const _ltc = await refreshRecord(['address', 'ltc'], _response, _ENS, false)
          setLTC(_ltc || '')
          const _doge = await refreshRecord(['address', 'doge'], _response, _ENS, false)
          setDOGE(_doge || '')
          const _sol = await refreshRecord(['address', 'sol'], _response, _ENS, false)
          setSOL(_sol || '')
          const _atom = await refreshRecord(['address', 'atom'], _response, _ENS, false)
          setATOM(_atom || '')
        }
      } else {
        setResolveCall(_response)
        setResolver('')
        setAddr('')
        setContenthash('')
        setAvatar(''); setEmail(''); setPubkey('')
        setGithub(''); setUrl(''); setTwitter(''); setDiscord(''); setFarcaster(''); setNostr('')
        setBTC(''); setLTC(''); setDOGE(''); setSOL(''); setATOM('')
        setSync(true)
      }
    } catch (error) {
      console.error('Error in getResolver():', error)
    }
  }

  // Re-try empty records
  async function refreshRecord(_record: string[], _resolver: Resolver, _ENS: string, _trigger: boolean) {
    if (_trigger) {
      if (_record[1]) {
        setRefresh(_record[1])
      } else {
        setRefresh(_record[0])
      }
    }
    try {
      if (_record[0] === 'addr') {
        const _response = await provider.resolveName(_ENS)
        if (_response) {
          if (_trigger) {
            setAddr(_response)
            setRefreshedValue(_response)
            setRefresh('1')
          }
          return _response
        }
        return ''
      } else if (_record[0] === 'avatar') {
        const _response = await provider.getAvatar(_ENS)
        if (_response) {
          if (_trigger) {
            setAvatar(_response)
            setRefreshedValue(_response)
            setRefresh('1')
          }
          return _response
        }
        return ''
      } else if (_record[0] === 'pubkey') {
        if (_trigger) {
          setPubkey('')
          setRefreshedValue('')
          setRefresh('1')
        }
        return ''
      } else if (_record[0] === 'contenthash') {
        const _response = await _resolver.getContentHash()
        if (_response) {
          if (_trigger) {
            setContenthash(_response)
            setRefreshedValue(_response)
            setRefresh('1')
          }
          return _response
        }
        return ''
      } else if (_record[0] === 'text') {
        const _response = await _resolver.getText(_record[1])
        if (_response) {
          if (_trigger) {
            if (_record[1] === 'avatar') setAvatar(_response)
            if (_record[1] === 'email') setEmail(_response)
            if (_record[1] === 'com.github') setGithub(_response)
            if (_record[1] === 'url') setUrl(_response)
            if (_record[1] === 'com.twitter') setTwitter(_response)
            if (_record[1] === 'com.discord') setDiscord(_response)
            if (_record[1] === 'xyz.farcaster') setFarcaster(_response)
            setRefreshedValue(_response)
            setRefresh('1')
          }
          return _response
        }
        return ''
      } else if (_record[0] === 'address') {
        let _type = _record[1] === 'btc' ? 0 : (_record[1] === 'ltc' ? 2 : (_record[1] === 'doge' ? 3 : (_record[1] === 'sol' ? 501 : 118)))
        let _response: any = ''
        if (_record[1] === 'btc') { // Use Ethers.JS for BTC
          _response = await _resolver.getAddress(_type)
        } else {
          /*
          let _ABI = await constants.getABI(_resolver.address)
          /// @TODO
          const contract = new web3.eth.Contract(
            _ABI as AbiItem[],
            resolver.address
          )
          await contract.methods.addr(ethers.utils.namehash(ENS), String(_type)).call()
            .then((response: any) => {
              if (!response) {
                setEmptyRecords(_record[1])
              } else {
                let _decoded = `0x${formatsByName[_record[1].toUpperCase()].encoder(response.toString('hex'))}`
                setExtraRecords(_record[1], _decoded)
              }
            })
            .catch(() => {
            })
          */
        }
        if (_response) {
          if (_trigger) {
            if (_record[1] === 'btc') setBTC(_response)
            if (_record[1] === 'ltc') setLTC(_response)
            if (_record[1] === 'doge') setDOGE(_response)
            if (_record[1] === 'sol') setSOL(_response)
            if (_record[1] === 'atom') setATOM(_response)
            setRefreshedValue(_response)
            setRefresh('1')
          }
          return _response
        }
        return ''
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
  async function writeRevision(revision: Name.Revision | undefined, gas: {}, timestamp: string, _ipfs: string) {
    let __revision: any = {}
    if (revision) {
      const _revision = JSON.parse(JSON.stringify(revision, (key, value) => {
        return typeof value === 'bigint' ? String(value) : value
      }))
      if (_revision._name._privKey) _revision._name._privKey._key = {}
      __revision = JSON.stringify(_revision)
    } else {
      __revision = JSON.stringify(__revision)
    }
    const request = {
      ens: ENS,
      controller: _Wallet_,
      manager: keypairSigner ? ethers.utils.computeAddress(`0x${keypairSigner[0]}`) : constants.zeroAddress,
      managerSignature: sigApproved,
      revision: revision ? Revision.encode(revision) : {},
      chain: chain,
      ipns: CID,
      ipfs: _ipfs,
      gas: JSON.stringify(gas),
      version: __revision,
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
    } else if (key === 'contenthash') {
      __THIS[key] = constants.isContenthash(value)
    } else if (key === 'addr') {
      __THIS[key] = constants.isAddr(value)
    } else if (key === 'avatar') {
      __THIS[key] = constants.isAvatar(value)
    } else if (key === 'email') {
      __THIS[key] = constants.isEmail(value)
    } else if (key === 'pubkey') {
      __THIS[key] = constants.isPubkey(value)
    } else if (key === 'com.github') {
      __THIS[key] = constants.isGithub(value)
    } else if (key === 'url') {
      __THIS[key] = constants.isUrl(value)
    } else if (key === 'com.twitter') {
      __THIS[key] = constants.isTwitter(value)
    } else if (key === 'com.discord') {
      __THIS[key] = constants.isDiscord(value)
    } else if (key === 'xyz.farcaster') {
      __THIS[key] = constants.isFarcaster(value)
    } else if (key === 'nostr') {
      __THIS[key] = constants.isEmail(value) || constants.isBTC(value)
    } else if (key === 'btc') {
      __THIS[key] = constants.isBTC(value)
    } else if (key === 'ltc') {
      __THIS[key] = constants.isLTC(value)
    } else if (key === 'doge') {
      __THIS[key] = constants.isDOGE(value)
    } else if (key === 'sol') {
      __THIS[key] = constants.isSOL(value)
    } else if (key === 'atom') {
      __THIS[key] = constants.isATOM(value)
    } else if (key === 'zonehash') {
      __THIS[key] = constants.isZonehash(value)
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
      controller: getManager(),
      recordsTypes: 'all',
      recordsValues: 'all',
      chain: chain,
      storage: _storage,
      hashType: _hashType
    }
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
            contenthash: data.response.contenthash,
            addr: data.response.addr,
            email: data.response.email,
            pubkey: data.response.pubkey,
            avatar: data.response.avatar,
            'com.github': data.response.github,
            url: data.response.url,
            'com.twitter': data.response.twitter,
            'com.discord': data.response.discord,
            'xyz.farcaster': data.response.farcaster,
            nostr: data.response.nostr,
            btc: data.response.btc,
            ltc: data.response.ltc,
            doge: data.response.doge,
            sol: data.response.sol,
            atom: data.response.atom,
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
          } else if (_storage && _Ownerstamps.length > 0 && _type === 'recordhash') {
            setQueue(Math.round(Date.now() / 1000) - constants.latestTimestamp(data.response.timestamp) - constants.waitingPeriod)
          } else if (_type === 'gateway') {
            setQueue(1)
          } else {
            setQueue(1)
          }
        })
    } catch (error) {
      console.error('ERROR:', 'Failed to read from CCIP2 backend')
    }
  }

  // Modal load
  React.useEffect(() => {
    if (_ENS_.endsWith('#') || _ENS_.endsWith('-') || _ENS_.endsWith(':') || _ENS_.endsWith('&')) {
      setBrowser(true)
      setENS(_ENS_.slice(0, -1))
      setMessage([_ENS_.endsWith('-') || _ENS_.endsWith('&') ? 'Refreshing Records' : (_ENS_.endsWith('#') ? 'Checking History' : 'Loading Records'), '-'])
    } else {
      setBrowser(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Triggers upon Preview load and attempts to get Resolver for ENS domain
  React.useEffect(() => {
    if (browser && ENS) {
      let namehash = ethers.utils.namehash(ENS)
      let labelhash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(ENS.split('.eth')[0]))
      setNamehashLegacy(namehash)
      setTokenIDLegacy(String(ethers.BigNumber.from(labelhash)))
      setTokenIDWrapper(String(ethers.BigNumber.from(namehash)))
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
      setOnChainManager(String(_CCIP2Manager_))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_CCIP2Manager_])

  // Capture Ownerhash hook
  React.useEffect(() => {
    if (_Ownerhash_) {
      if (String(_Ownerhash_).length > 2) {
        let _String: string = ''
        if (String(_Ownerhash_).startsWith(constants.ipnsPrefix)) {
          _String = `ipns://${ensContent.decodeContenthash(String(_Ownerhash_)).decoded}`
        } else {
          _String = ethers.utils.toUtf8String(String(_Ownerhash_))
        }
        if (_String.startsWith('https://')) {
          setOwnerhash(`${_String}`)
        } else {
          setOwnerhash(`${_String}`)
        }
      } else {
        setOwnerhash('')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_Ownerhash_])

  // Capture Recordhash hook
  React.useEffect(() => {
    if (_Recordhash_) {
      if (String(_Recordhash_).length > 2 && _Recordhash_ !== _Ownerhash_) {
        let _String: string = ''
        if (String(_Recordhash_).startsWith(constants.ipnsPrefix)) {
          _String = `ipns://${ensContent.decodeContenthash(String(_Recordhash_)).decoded}`
        } else {
          _String = ethers.utils.toUtf8String(String(_Recordhash_))
        }
        if (_String.startsWith('https://')) {
          setRecordhash(`${_String}`)
        } else {
          setRecordhash(`${_String}`)
        }
        setMessage(['This May Take a While', ''])
        setMessage([_ENS_.endsWith('-') || _ENS_.endsWith('&') ? 'Refreshing Records' : (_ENS_.endsWith('#') ? 'Checking History' : 'Loading Records'), '-'])
      } else if (String(_Recordhash_) === '0x' && _Recordhash_ === _Ownerhash_) {
        if (resolver === ccip2Contract) {
          setRecordhash(constants.defaultGateway)
        } else {
          setRecordhash('')
        }
      } else {
        setRecordhash('')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_Recordhash_, _Ownerhash_, resolver])

  // Sets Success modal refresh
  React.useEffect(() => {
    if (successModalState.trigger && successModalState.modalData) {
      if (txSuccess1of3) {
        handleSuccess(`${ENS}#`)
      } else if (txSuccess2of3) {
        handleSuccess(`${ENS}-`)
      } else if (txSuccess3of3) {
        handleSuccess(`${ENS}&`)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [successModalState, txSuccess1of3, txSuccess2of3, txSuccess3of3])

  // Sets option between Ownerhash and Recordhash
  React.useEffect(() => {
    if (confirmModalState.trigger && confirmModalState.modalData) {
      setConfirm(false)
      if (confirmModalState.modalData === '0') {
        setSaltModal(true)
        setProcessCount(1)
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
          setHashType(confirmModalState.modalData === '0' ? 'recordhash' : 'gateway')
        } else {
          if (optionsModalState.trigger) {
            setHashType(optionsModalState.modalData === '1' ? 'recordhash' : (optionsModalState.modalData === '2' ? 'gateway' : 'ownerhash'))
            setProcessCount(1)
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
  }, [trigger, optionsModalState, write, safeTrigger, confirmModalState])

  // Sets in-app ENS domain manager
  React.useEffect(() => {
    if (_Wallet_) {
      // Set Managers
      if (onChainManager && String(onChainManager) === 'true') {
        // Set connected account as in-app manager if it is authorised
        setManagers([_Wallet_])
      } else {
        // Set owner as in-app managers if no on-chain manager exists
        let _Manager_ = getManager()
        setManagers([_Manager_])
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [namehashLegacy, _OwnerLegacy_, _OwnerWrapped_, onChainManager, tokenIDWrapper])

  // Sets Wrapper status of ENS Domain
  React.useEffect(() => {
    if (_OwnerLegacy_) {
      if (String(_OwnerLegacy_) === constants.ensContracts[chain === '1' ? 7 : 3]) {
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

  // Triggers Gateway routine
  React.useEffect(() => {
    if (gatewayModalState.trigger && gatewayModalState.modalData !== undefined && write) {
      setLoading(true)
      setMessage(['Waiting For Signature', hashType !== 'gateway' ? '1' : '2'])
      const _sigSigner = async () => {
        setSigCount(2) // Trigger S_SIGNER(K_WALLET)
        setProcessCount(2)
        signSigner(constants.randomString(10)) // Generates redundant signatures; can bypass this [?]
      }
      _sigSigner()
    } else if (gatewayModalState.trigger && gatewayModalState.modalData !== undefined && !write) {
      setCID(gatewayModalState.modalData)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gatewayModalState, hashType, write])

  // Triggers S_IPNS(K_WALLET) after password is set
  React.useEffect(() => {
    if (saltModalState.trigger && saltModalState.modalData !== undefined && !keypairIPNS && trigger && safeTrigger) {
      setSigCount(1)
      setProcessCount(write ? 3 : 1)
      setMessage(['Waiting For Signature', '1'])
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
  }, [saltModalState, recordhash, trigger, safeTrigger, hashType, write, states, keypairIPNS])

  // Triggers IPNS Keygen after password is set
  React.useEffect(() => {
    if (sigIPNS && !keypairIPNS) {
      setLoading(true)
      setMessage(['Generating IPNS Key', ''])
      const keygen = async () => {
        const _origin = hashType === 'ownerhash' ? `eth:${_Wallet_ || constants.zeroAddress}` : ENS
        const __keypair = await KEYGEN(_origin, caip10, sigIPNS, saltModalState.modalData)
        setKeypairIPNS(__keypair[0])
        setMessage(['IPNS Keypair Generated', ''])
      }
      keygen()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keygen, keypairIPNS, goodSalt, write, sigIPNS])

  // Triggers S_SIGNER(K_WALLET) after password is set
  React.useEffect(() => {
    if (write && saltModalState.trigger && goodSalt) {
      setMessage(['Waiting For Signature', '2'])
      const _sigSigner = async () => {
        if (saltModalState.modalData !== undefined) {
          setSigCount(2) // Trigger S_SIGNER(K_WALLET)
          setProcessCount(3)
          signSigner(saltModalState.modalData) // IPNS Signer Signatures are DETERMINISTIC!
        }
      }
      _sigSigner()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saltModalState, goodSalt, write, trigger])

  // Triggers S_IPNS(K_WALLET) after password is set
  React.useEffect(() => {
    if (write) {
      if (goodSalt) {
        if (sigSigner && !isSigner) {
          // Set query for on-chain manager [v2]
          setOnChainManagerQuery(
            [
              getManager(),
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

  // Triggers IPNS CID derivation with new S_IPNS(K_WALLET)
  React.useEffect(() => {
    if (keypairIPNS && sigIPNS) {
      if (hashType !== 'gateway') {
        const CIDGen = async () => {
          let key = constants.formatkey(keypairIPNS)
          const w3name = await Name.from(ed25519v2.etc.hexToBytes(key))
          const CID_IPNS = String(w3name)
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
      }
    } else {
      if (write && hashType === 'gateway') {
        setGoodSalt(true)
        setCID(recordhash || ownerhash)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keypairIPNS, sigIPNS, recordhash, ownerhash, write, hashType])

  // Sets signature from Wagmi signMessage() as S_IPNS(K_WALLET)
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
    if (CID && !write) {
      setProcessCount(1)
      if (CID.startsWith('k5')) {
        initRecordhash()
      } else if (CID.startsWith('https://')) {
        initGateway()
      }
    } else if (write) {
      if (CID.startsWith('k5')) {
        setProcessCount(3)
      } else if (CID.startsWith('https://')) {
        setProcessCount(2)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [CID, write])

  // Handles single vs. mulitple record updates
  React.useEffect(() => {
    if (states.length > 1) {
      let _updatedList = list.map((item) => {
        if (!constants.config.includes(item.type) &&
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
        setMetadata(recordhash, addr, contenthash, avatar, pubkey, email,
          github, url, twitter, discord, farcaster, nostr, BTC, LTC, DOGE, SOL, ATOM)
      } else if (ownerhash) {
        setMetadata(ownerhash, addr, contenthash, avatar, pubkey, email,
          github, url, twitter, discord, farcaster, nostr, BTC, LTC, DOGE, SOL, ATOM)
      } else {
        setMetadata(recordhash, addr, contenthash, avatar, pubkey, email,
          github, url, twitter, discord, farcaster, nostr, BTC, LTC, DOGE, SOL, ATOM)
      }
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sync, hashType, recordhash, ownerhash, resolver, addr, contenthash, avatar, email,
    pubkey, github, url, twitter, discord, farcaster, nostr, BTC, LTC, DOGE, SOL, ATOM])

  // Triggers fetching history from NameSys backend
  React.useEffect(() => {
    if (conclude) {
      getUpdate(
        recordhash || ownerhash,
        recordhash && recordhash.startsWith('ipns://') ? 'recordhash' : (ownerhash && ownerhash.startsWith('ipns://') ? 'ownerhash' : 'gateway'),
        recordhash && recordhash.startsWith('ipns://') ? 'recordhash' : (ownerhash && ownerhash.startsWith('ipns://') ? 'ownerhash' : 'gateway')
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
    if (history && queue && !sync) {
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
        setHashType('storage')
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

  // Handles password prompt for S_IPNS(K_WALLET)
  React.useEffect(() => {
    if (updateRecords && write) { // Check for false → true
      if (!keypairIPNS || (!keypairSigner || !keypairSigner[0]) || !CID) {
        if (hashType !== 'gateway') {
          if (!saltModalState.trigger) setSaltModal(true) // Salt for IPNS Keygen
        } else {
          if (!saltModalState.trigger) setSaltModal(true) // Start for Manager Keygen
          setKeypairIPNS(['0x', '0x'])
        }
        setUpdateRecords(false) // Reset
      } else {
        if (states.length > 0) {
          setLoading(true)
          setMessage(['Setting Records', String(states.length)])
          setProcessCount(states.length)
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateRecords, keypairSigner, CID, write, hashType, saltModalState])

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
    // Handle Signature S_RECORDS(K_SIGNER) to add as extradata
    if (write && (keypairSigner && keypairSigner[0]) && newValues && !constants.isEmpty(newValues) && states.length > 0) {
      let __signatures = constants.EMPTY_STRING_RECORDS()
      states.forEach(async (_recordType) => {
        let _signature: any
        if (newValues[_recordType]) {
          _signature = await signRecords({
            message: statementRecords(constants.filesRecords[constants.typesRecords.indexOf(_recordType)], genExtradata(_recordType, newValues[_recordType]), keypairSigner[0])
          }) // Sign with K_SIGNER
        }
        if (_signature) __signatures[_recordType] = _signature
      })
      setSignatures(__signatures)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [write, keypairSigner, newValues, states])

  /* HANDLE SIGNER APPROVAL SIGNATURE */
  // Triggers signing Off-Chain Signer's approval by Controller
  React.useEffect(() => {
    // Handle Signature S_APPROVE(K_WALLET)
    if (write && !onChainManager && !sigApproved && !constants.isEmpty(signatures)) {
      if (hashType !== 'gateway') {
        setProcessCount(3)
      } else {
        setProcessCount(3)
      }
      signManager() // Sign with K_WALLET
    } else if (write && onChainManager && !constants.isEmpty(signatures)) {
      setSigApproved('0x')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onChainManager, signatures, hashType])

  /* HANDLE WRITING RECORDS */
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
      CID &&
      count === states.length &&
      count > 0 &&
      sigApproved
    ) {
      let _encodedValues = constants.EMPTY_STRING_RECORDS()
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
        controller: _Wallet_ || constants.zeroAddress,
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
              setMessage([hashType !== 'gateway' ? 'Publishing to IPNS' : 'Publishing to Gateway', ''])
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
                    if (item.type === 'addr') setAddr(data.response.addr)
                    if (item.type === 'avatar') setAvatar(data.response.avatar)
                    if (item.type === 'email') setEmail(data.response.email)
                    if (item.type === 'pubkey') setPubkey(data.response.pubkey)
                    if (item.type === 'com.github') setGithub(data.response.github)
                    if (item.type === 'url') setUrl(data.response.url)
                    if (item.type === 'com.twitter') setTwitter(data.response.twitter)
                    if (item.type === 'com.discord') setDiscord(data.response.discord)
                    if (item.type === 'xyz.farcaster') setFarcaster(data.response.farcaster)
                    if (item.type === 'nostr') setNostr(data.response.nostr)
                    if (item.type === 'btc') setBTC(data.response.btc)
                    if (item.type === 'ltc') setLTC(data.response.ltc)
                    if (item.type === 'doge') setDOGE(data.response.doge)
                    if (item.type === 'sol') setSOL(data.response.sol)
                    if (item.type === 'atom') setATOM(data.response.atom)
                    if (item.type === 'zonehash') setZonehash(data.response.zonehash)
                    if (item.type === 'contenthash') setContenthash(data.response.contenthash)
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
                if (hashType !== 'gateway' && keypairIPNS) {
                  // Handle W3Name publish 
                  let key = constants.formatkey(keypairIPNS)
                  let w3name: Name.WritableName
                  let w3nam3: Nam3.WritableName
                  const keygen = async () => {
                    w3name = await Name.from(ed25519v2.etc.hexToBytes(key))
                    w3nam3 = await Nam3.from(ed25519v2.etc.hexToBytes(key))
                    const pin = async () => {
                      if (data.response.ipfs && w3name && w3nam3 && gas) {
                        setHashIPFS(data.response.ipfs.split('ipfs://')[1])
                        const toPublish = '/ipfs/' + data.response.ipfs.split('ipfs://')[1]
                        // @W3Name broadcast
                        let _revision: Name.Revision
                        let revision_: Nam3.Revision
                        if (!history.revision) {
                          _revision = await Name.v0(w3name, toPublish)
                          //revision_ = await Nam3.v0(w3nam3, toPublish)
                        } else {
                          let _revision_ = Revision.decode(new Uint8Array(Object.values(JSON.parse(JSON.stringify(history.revision)))))
                          if (Number(data.response.timestamp) < constants.w3timestamp) {
                            _revision = await Name.increment(_revision_, toPublish)
                            //revision_ = _revision
                          } else {
                            _revision = await Name.increment(_revision_, toPublish)
                            //revision_ = await Nam3.increment(_revision_, toPublish)
                          }
                        }
                        setTimestamp(data.response.timestamp)
                        // Write revision to database & user directory
                        await writeRevision(_revision, gas, data.response.timestamp, data.response.ipfs.split('ipfs://')[1])
                        // Publish IPNS
                        if (Number(data.response.timestamp) < constants.w3timestamp) {
                          await Name.publish(_revision, w3name.key)
                        } else {
                          await Name.publish(_revision, w3name.key)
                          //await Nam3.publish(revision_, w3nam3.key)
                        }
                        // Wrap up
                        setGas(gas)
                        setGasModal(true)
                        setStates([])
                        setLegit(constants.EMPTY_BOOL_RECORDS())
                        setLoading(false)
                        // Update values in the modal to new ones
                        let _updatedList = list.map((item) => {
                          if (!constants.config.includes(item.type)) {
                            let _queue = Math.round(Date.now() / 1000) - constants.latestTimestamp(data.response.timestamp) - constants.waitingPeriod
                            setQueue(hashType === 'gateway' ? 1 : _queue)
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
                        setNewValues(constants.EMPTY_STRING_RECORDS())
                        setSignatures(constants.EMPTY_STRING_RECORDS())
                        setUpdateRecords(false) // Reset
                        setSigCount(0)
                        setSaltModalState({
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
                } else {
                  const gateway = async () => {
                    if (gas) {
                      setTimestamp(data.response.timestamp)
                      // Write revision to database
                      await writeRevision(undefined, gas, data.response.timestamp, '')
                      setGas(gas)
                      setGasModal(true)
                      setStates([])
                      setLegit(constants.EMPTY_BOOL_RECORDS())
                      setLoading(false)
                      // Update values in the modal to new ones
                      let _updatedList = list.map((item) => {
                        if (!constants.config.includes(item.type)) {
                          let _queue = 1
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
                      setNewValues(constants.EMPTY_STRING_RECORDS())
                      setSignatures(constants.EMPTY_STRING_RECORDS())
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
                  gateway()
                }
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

  /* HANDLE TRANSACTION 1 SUCCESS */
  // Handles setting setRecordhash on CCIP2 Resolver
  React.useEffect(() => {
    if (isMigrateSuccess && txSuccess1of3 && migrated && !write && !crash) {
      if (states.includes('resolver')) {
        setSuccess(optionsModalState.modalData === '1' ? '<span><span style="color: lightgreen">Resolver Migrated</span>! You may now set <span style="color: cyan">IPNS Storage</span> next</span>' : '<span><span style="color: lightgreen">Resolver Migrated</span>! You may now set <span style="color: cyan">HTTP Storage</span> next</span>')
        setSuccessModal(true)
        doEnjoy()
      } else {
        setSuccess('<span style="color: lightgreen">Off-chain Setup Complete with <span style="color: cyan">Ownerhash</span>. Enjoy!</span>')
        setSuccessModal(true)
        doEnjoy()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMigrateSuccess, txSuccess1of3, migrated, states, resolver, write])

  /* SET RECORDHASH AFTER TRANSACTION 2 */
  // Handles setting IPNS as Recordhash after Transaction 2 
  React.useEffect(() => {
    if (isSetRecordhashSuccess && txSuccess2of3 && CID) {
      const purge = async () => {
        await writeRevision(undefined, {}, '', '')
        setRecordhash(`ipns://${CID}`)
        setMessage(['Transaction Confirmed', '1'])
      }
      purge()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSetRecordhashSuccess, txSuccess2of3, CID])
  // Handles setting Gateway as Recordhash after Transaction 2 
  React.useEffect(() => {
    if (isSetGatewaySuccess && txSuccess3of3 && CID) {
      setRecordhash(`${CID}`)
      setMessage(['Transaction Confirmed', '1'])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSetGatewaySuccess, txSuccess3of3, CID])

  /* HANDLE TRANSACTION 2 SUCCESS */
  // Handles setting Recordhash
  React.useEffect(() => {
    if (recordhash && txSuccess2of3 && !write && !crash) {
      setSuccess('<span style="color: lightgreen">Off-chain Setup Complete with <span style="color: cyan">Recordhash</span>. Enjoy!</span>')
      setSuccessModal(true)
      doEnjoy()
    } else if (recordhash && txSuccess3of3 && !write && !crash) {
      setSuccess('<span style="color: lightgreen">Off-chain Setup Complete with <span style="color: cyan">HTTP Gateway</span>. Enjoy!</span>')
      setSuccessModal(true)
      doEnjoy()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recordhash, txSuccess2of3, txSuccess3of3, write])

  /* TRANSACTION 1 HANDLE */
  // Sets migration state to true upon successful Transaction 1 receipt (for Ownerhash)
  React.useEffect(() => {
    if (isMigrateSuccess && txSuccess1of3) {
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
  }, [isMigrateSuccess, txSuccess1of3])
  // Handles Transaction 1 wait for Resolver
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
  // Handles Transaction 1 loading and error for Resolver
  React.useEffect(() => {
    if (txLoading1of3 && !txError1of3) {
      setLoading(true)
      setMessage(['Waiting for Confirmation', '1'])
      if (recentCrash) setRecentCrash(false)
    } else if (!txLoading1of3 && txError1of3) {
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
      setGatewayModalState({
        modalData: undefined,
        trigger: false
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [txLoading1of3, txError1of3])

  /* TRANSACTION 2/3 SUBMIT HANDLING */
  // Handles Transaction 2 wait for Recordhash
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
      setGatewayModalState({
        modalData: undefined,
        trigger: false
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSetRecordhashLoading, isSetRecordhashError])
  // Handles Transaction 3 wait for Gateway
  React.useEffect(() => {
    if (!isSetGatewayError && isSetGatewayLoading) {
      setLoading(true)
      setMessage(['Waiting for Transaction', '1'])
      if (recentCrash) setRecentCrash(false)
    } else if (isSetGatewayError && !isSetGatewayLoading) {
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
      setGatewayModalState({
        modalData: undefined,
        trigger: false
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSetGatewayLoading, isSetGatewayError])

  /* TRANSACTION 2/3 WAIT HANDLING */
  // Handles Transaction 2 loading and error for Recordhash
  React.useEffect(() => {
    if (txLoading2of3 && !txError2of3) {
      setLoading(true)
      setMessage(['Waiting for Confirmation', states.includes('storage') ? '1' : '2'])
      if (recentCrash) setRecentCrash(false)
    } else if (!txLoading2of3 && txError2of3) {
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
      setGatewayModalState({
        modalData: undefined,
        trigger: false
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [txLoading2of3, txError2of3])
  // Handles Transaction 3 loading and error for Gateway
  React.useEffect(() => {
    if (txLoading3of3 && !txError3of3) {
      setLoading(true)
      setMessage(['Waiting for Confirmation', states.includes('storage') ? '1' : '2'])
      if (recentCrash) setRecentCrash(false)
    } else if (!txLoading3of3 && txError3of3) {
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
      setGatewayModalState({
        modalData: undefined,
        trigger: false
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [txLoading3of3, txError3of3])

  /* SIGNATURE ERROR HANDLING */
  // Handles signature loading and error
  React.useEffect(() => {
    if (signLoading && !signError && trigger) {
      setLoading(true)
      if (recentCrash) setRecentCrash(false)
    } else if (signError && !signLoading && trigger) {
      if (!recentCrash) {
        setMessage(['Signature Failed', String(sigCount)])
        doCrash()
        setWrite(false)
        setUpdateRecords(false) // Reset
        setLegit(constants.EMPTY_BOOL_RECORDS())
        setNewValues(constants.EMPTY_STRING_RECORDS())
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
      setGatewayModalState({
        modalData: undefined,
        trigger: false
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signLoading, signError, trigger, sigCount, states])

  /* MODAL */
  /// Modal Content
  const modalContent = show ? (
    <StyledModalOverlay
      style={{
        backgroundColor: loading ? 'black' : (!isMobile ? 'rgba(0, 0, 0, 0.75)' : 'black')
      }}
    >
      <StyledModal
        style={{
          background: loading ? 'none' : '#121212'
        }}
      >
        <StyledModalHeader>
          <a href="#" onClick={handleCloseClick}>
            <span
              className="material-icons-round"
              style={{
                marginTop: !loading ? '7px' : '120px'
              }}
            >
              close
            </span>
          </a>
        </StyledModalHeader>
        {!loading && (
          <div
            style={{
              marginLeft: isMobile ? '5.5%' : '15.5%',
              marginTop: isMobile ? '10px' : '35px',
              marginBottom: isMobile ? '10px' : '0'
            }}
          >
            <div>
              <img
                alt='ens'
                src='ens.png'
                width={isMobile ? '17.5px' : '25px'}
                style={{ margin: isMobile ? '0 10px -2px 0' : '0 10px -3px 0' }}
              />
              <span
                style={{
                  color: '#fc6603',
                  fontSize: isMobile ? '20px' : '30px',
                  fontWeight: '700',
                  fontFamily: 'SF Mono'
                }}
              >
                {ENS.split('.eth')[0]}
              </span>
              <span
                style={{
                  fontFamily: 'SF Mono',
                  fontSize: isMobile ? '18px' : '21px',
                  color: 'grey'
                }}
              >
                .
              </span>
              <span
                style={{
                  fontFamily: 'SF Mono',
                  fontSize: isMobile ? '14px' : '18px',
                  color: 'grey',
                  fontWeight: '700',
                  letterSpacing: '0px',
                  marginTop: '13px'
                }}
              >
                eth
              </span>
            </div>
          </div>
        )}
        {ENS && avatar && imageLoaded && !loading && list.length > 0 &&
          <StyledModalTitle>
            <img
              src={thumbnail || avatar}
              width={isMobile ? '104px' : '125px'}
              alt={ENS}
              onError={() => setImageLoaded(false)}
            />
          </StyledModalTitle>
        }
        {ENS && (!avatar || !imageLoaded) && !loading && list.length > 0 &&
          <StyledModalTitle>
            {['0', '1', '-', ''].includes(isLoading['avatar']) && (
              <span
                className="material-icons-round miui"
                style={{
                  marginTop: '4px'
                }}
              >
                portrait
              </span>
            )}
          </StyledModalTitle>
        }
        {ENS && !loading && list.length > 0 &&
          <StyledModalTitle>
            <div
              className='flex-row'
              style={{
                color: '#fc6603',
                marginTop: isMobile ? '-38.5%' : '-21.5%',
                marginLeft: isMobile ? (!avatar || !imageLoaded ? '27.5%' : '15.5%') : '-4%'
              }}
            >
              <div
                className="flex-column"
                style={{
                  alignItems: 'flex-end',
                  lineHeight: isMobile ? '23.5px' : '23.5px',
                  marginTop: isMobile ? '3px' : '2px',
                  fontSize: isMobile ? '12px' : '14px',
                  fontWeight: '800'
                }}
              >
                <div>
                  <span>{'Migrated'}</span>
                </div>
                <div>
                  <span>{'Owner'}</span>
                </div>
                <div>
                  <span>{'Manager'}</span>
                </div>
                <div>
                  <span>{'Wrapped'}</span>
                </div>
              </div>
              <div
                style={{
                  marginLeft: '5px',
                  lineHeight: '23.5px',
                  fontSize: '14px',
                  fontFamily: 'SF Mono',
                  color: 'white'
                }}
              >
                <div
                  className='flex-column'
                  style={{
                    alignItems: 'flex-start',
                    marginTop: '1px'
                  }}
                >
                  <button
                    className="button-tiny"
                    style={{
                      marginBottom: '-2px'
                    }}
                    data-tooltip={migrated || resolver === ccip2Contract ? `Resolver is migrated` : `Resolver is not migrated`}
                  >
                    <div
                      className="material-icons-round smoller"
                      style={{
                        color: migrated || resolver === ccip2Contract ? 'lightgreen' : 'orange',
                        fontSize: '22px',
                      }}
                    >
                      {migrated || resolver === ccip2Contract ? 'done' : 'close'}
                    </div>
                  </button>
                </div>
                <div style={{ margin: '-5px 0 1px 0' }}>
                  <span
                    className='mono'
                    id="metaOwner"
                    onClick={() => { }}
                    color=''
                  >
                    {isMobile ? constants.truncateHexString(String(_OwnerLegacy_) || constants.zeroAddress) : String(_OwnerLegacy_) || constants.zeroAddress}
                  </span>
                </div>
                <div style={{ margin: '-3px 0 1px 0' }}>
                  <span
                    className='mono'
                    id="metaManager"
                    onClick={() => { }}
                  >
                    {isMobile ? constants.truncateHexString(getManager()) : getManager()}
                  </span>
                </div>
                <div style={{ margin: '0px 0 2px 0' }}>
                  <span
                    className='material-icons-round smoller'
                    style={{
                      color: 'white',
                      fontSize: '21px'
                    }}
                  >
                    {String(_OwnerLegacy_) === constants.ensContracts[chain === '1' ? 7 : 3] ? 'done' : 'close'}
                  </span>
                </div>
              </div>
            </div>
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
              <div
                style={{
                  marginTop: '20px'
                }}
              >
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
                    <span style={{ fontFamily: 'SF Mono', fontSize: '22px' }}>{hashType !== 'gateway' ? message[1] : (!write ? message[1] : String(Number(message[1]) - 1))}</span>
                    <span>{' Of '}</span>
                    <span style={{ fontFamily: 'SF Mono', fontSize: '22px' }}
                    >
                      {hashType !== 'gateway' ? processCount : (!write ? processCount : processCount - 1)}
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
                      fontSize: isMobile ? '12px' : '15px',
                      fontWeight: '700'
                    }}
                  >
                    {message[0].includes('Refresh') ? 'Please Be Patient' : 'This May Take Some Time'}
                  </span>
                </div>
              )}
              <div
                style={{
                  marginTop: '75px',
                  maxWidth: '400px',
                  textAlign: 'center'
                }}
              >
                <span
                  style={{
                    color: 'grey',
                    fontSize: '14px',
                    fontWeight: '700'
                  }}
                >
                  {`If this dialogue persists for too long, try closing and re-opening it`}
                </span>
              </div>
            </div>
          </StyledModalBody>
        }
        {ENS && list.length > 0 && !loading &&
          <StyledModalBody>
            <div
              className='flex-column'
              style={{
                marginTop: isMobile ? (!avatar || !imageLoaded ? '-17.5px' : '0') : '0',
                marginLeft: isMobile ? '-3.5%' : '-2.5%'
              }}
            >
              <div
                className="scrollable-div"
                style={{
                  maxHeight: '500px',
                  overflowY: 'scroll'
                }}
              >
                <ul
                  style={{
                    listStyle: 'none',
                    color: 'white',
                    marginLeft: !isMobile ? '-5%' : '-1%'
                  }}
                >
                  <div
                    className='flex-column'
                    style={{
                      paddingBottom: !isMobile ? '15px' : '5px',
                      paddingTop: '10px'
                    }}
                  >
                    {list.map((item) => (
                      <li
                        key={item.key}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          width: !isMobile ? '630px' : '400px',
                          maxWidth: !isMobile ? '95%' : '92.5%',
                          paddingLeft: !isMobile ? '15px' : '10px',
                          paddingRight: !isMobile ? '15px' : '10px'
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
                                    <span
                                      className="material-icons-round smol"
                                      style={{
                                        fontSize: '20px',
                                        display: 'inline-block',
                                        color: 'white'
                                      }}
                                    >
                                      {'cloud_circle'}
                                    </span>
                                    &nbsp;
                                    <span
                                      style={{
                                        position: 'relative',
                                        top: '-2px',
                                        left: '1px'
                                      }}
                                    >
                                      {hashType}
                                    </span>
                                  </span>
                                )}
                              { // Label+
                                item.type !== 'storage' && (
                                  <span>
                                    <span
                                      className="material-icons-round smol"
                                      style={{
                                        fontSize: '20px',
                                        display: 'inline-block',
                                        color: 'white'
                                      }}
                                    >
                                      {
                                        item.type === 'storage' ? 'cloud_circle' : (
                                          item.type === 'resolver' ? 'gavel' : (
                                            item.type === 'avatar' ? 'portrait' : (
                                              item.type === 'addr' ? 'account_balance_wallet' : (
                                                item.type === 'contenthash' ? 'public' : (
                                                  item.type === 'com.github' ? 'code' : (
                                                    item.type === 'url' ? 'share' : (
                                                      item.type === 'email' ? 'email' : (
                                                        item.type === 'pubkey' ? 'key' : (
                                                          item.type === 'com.twitter' ? 'groups' : (
                                                            item.type === 'com.discord' ? 'group_add' : (
                                                              item.type === 'xyz.farcaster' ? 'people_alt' : (
                                                                item.type === 'nostr' ? 'groups' : (
                                                                  item.type === 'btc' ? 'currency_bitcoin' : (
                                                                    item.type === 'ltc' ? 'currency_lira' : (
                                                                      item.type === 'doge' ? 'pets' : (
                                                                        item.type === 'sol' ? 'flash_on' : (
                                                                          item.type === 'atom' ? 'font_download' : (
                                                                            item.type === 'zonehash' ? 'tag' :
                                                                              'circle_notifications'
                                                                          )
                                                                        )
                                                                      )
                                                                    )
                                                                  )
                                                                )
                                                              )
                                                            )
                                                          )
                                                        )
                                                      )
                                                    )
                                                  )
                                                )
                                              )
                                            )
                                          )
                                        )
                                      }
                                    </span>
                                    &nbsp;
                                    <span
                                      style={{
                                        position: 'relative',
                                        top: '-2px',
                                        left: '1px'
                                      }}
                                    >
                                      {item.header}
                                    </span>
                                  </span>
                                )}
                              { // Set Badge if Resolver is migrated and ONLY Ownerhash is set
                                constants.config.includes(item.type) && resolver === ccip2Contract && !recordhash && ownerhash && (
                                  <button
                                    className="button-tiny"
                                    onClick={() => {
                                      setHelpModal(true)
                                      setIcon('gpp_good')
                                      setColor(item.type === 'resolver' ? 'lime' : (ownerhash === constants.defaultGateway ? 'yellow' : 'cyan'))
                                      setHelp(item.type === 'resolver' ? '<span>Resolver is <span style="color: lime">Migrated</span></span>' : `<span>Global <span style="color: cyan">${ownerhash.startsWith('https://') ? (ownerhash === constants.defaultGateway ? 'Default Storage' : 'Custom Gateway') : 'IPNS'}</span> is set as <span style="color: cyan">Ownerhash</span></span>`)
                                    }}
                                    data-tooltip={item.type === 'resolver' ? 'Resolver Is Migrated' : `${ownerhash.startsWith('https://') ? (ownerhash === constants.defaultGateway ? 'Default Storage Is Ownerhash' : 'Custom Gateway Is Ownerhash') : 'IPNS Ownerhash Is Set'}`}
                                  >
                                    <div
                                      className="material-icons-round smol"
                                      style={{
                                        color: item.type === 'resolver' ? 'lime' : (ownerhash === constants.defaultGateway ? 'yellow' : (ownerhash.startsWith('https://') ? 'cyan' : 'cyan'))
                                      }}
                                    >
                                      gpp_good
                                    </div>
                                  </button>
                                )}
                              { // Set Badge if Resolver is migrated and Recordhash is set
                                constants.config.includes(item.type) && resolver === ccip2Contract && recordhash && (
                                  <button
                                    className="button-tiny"
                                    onClick={() => {
                                      setHelpModal(true)
                                      setIcon('gpp_good')
                                      setColor(item.type === 'resolver' ? 'lime' : (recordhash.startsWith('https://') ? (recordhash === constants.defaultGateway ? 'yellow' : 'cyan') : 'lime'))
                                      setHelp(item.type === 'resolver' ? '<span>Resolver is <span style="color: lime">Migrated</span><span>' : `<span><span style="color: cyan">${recordhash.startsWith('https://') ? (recordhash === constants.defaultGateway ? 'Default Storage' : 'Custom Gateway') : 'IPNS'}</span> is set as Recordhash<span>`)
                                    }}
                                    data-tooltip={item.type === 'resolver' ? 'Resolver Is Migrated' : (`${recordhash.startsWith('https://') ? (recordhash === constants.defaultGateway ? 'Default Storage' : 'Custom Gateway') : 'Recordhash'} Is Set`)}
                                  >
                                    <div
                                      className="material-icons-round smol"
                                      style={{
                                        color: item.type === 'resolver' ? 'lime' : (recordhash.startsWith('https://') ? (recordhash === constants.defaultGateway ? 'yellow' : 'cyan') : 'lime'),
                                        marginLeft: item.type === 'resolver' ? '5px' : '5px'
                                      }}
                                    >
                                      gpp_good
                                    </div>
                                  </button>
                                )}
                              { // Set Badge if Resolver is not migrated and no Recordhash or Ownerhash has been set in the past
                                constants.config.includes(item.type) && resolver !== ccip2Contract && !recordhash && !ownerhash && (
                                  <button
                                    className="button-tiny"
                                    onClick={() => {
                                      setHelpModal(true)
                                      setIcon(item.type === 'resolver' ? 'gpp_bad' : 'cancel')
                                      setColor('orangered')
                                      setHelp(item.type === 'resolver' ? '<span>Resolver is <span style="color: orange">not Migrated</span><span>' : '<span>Resolver is <span style="color: orange">not Migrated</span><span>')
                                    }}
                                    data-tooltip={item.type === 'storage' ? 'Resolver Not Migrated' : 'Resolver Not Migrated'}
                                  >
                                    <div
                                      className="material-icons-round smol"
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
                                constants.config.includes(item.type) && resolver !== ccip2Contract && (recordhash || ownerhash) && (
                                  <button
                                    className="button-tiny"
                                    onClick={() => {
                                      setHelpModal(true)
                                      setIcon(item.type === 'resolver' ? 'gpp_bad' : 'gpp_maybe')
                                      setColor(item.type === 'resolver' ? 'orangered' : (recordhash ? 'orange' : 'lightblue'))
                                      setHelp(item.type === 'resolver' ? '<span>Resolver <span style="color: orange">not Migrated</span></span>' : (recordhash ? `<span><span style="color: cyan">${recordhash.startsWith('https://') ? 'Gateway' : 'Recordhash'}</span> <span style="color: lime">is Set as Recordhash</span></span>` : `<span><span style="color: cyan">${ownerhash.startsWith('https://') ? 'Gateway' : 'Ownerhash'}</span> <span style="color: lime">is Set as Ownerhash</span></span>`))
                                    }}
                                    data-tooltip={recordhash ? `Resolver not Migrated. ${recordhash.startsWith('https://') ? 'Gateway' : 'Recordhash'} Exists as Recordhash` : `Resolver not Migrated. ${ownerhash.startsWith('https://') ? 'Gateway' : 'Ownerhash'} Exists as Ownerhash`}
                                  >
                                    <div
                                      className="material-icons-round smol"
                                      style={{
                                        color: item.type === 'resolver' ? 'orangered' : (recordhash ? 'orange' : 'lightblue'),
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
                                      className="material-icons-round smoller"
                                      style={{
                                        color: !hashIPFS ? 'orange' : (recordhash && recordhash !== constants.defaultGateway ? 'lime' : 'cyan'),
                                        fontSize: '17px',
                                        marginLeft: '-5.5px'
                                      }}
                                    >
                                      rss_feed
                                    </div>
                                  </button>
                                )}

                              { // Help icons
                                item.type !== 'resolver' && (
                                  <button
                                    className="button-tiny"
                                    onClick={() => {
                                      setHelpModal(true)
                                      setIcon('info')
                                      setColor(constants.blocked.includes(item.type) ? 'orange' : 'cyan')
                                      setHelp(constants.blocked.includes(item.type) ? '<span style="color: orangered">In Process of Bug Fixing</span>' : `<span>${item.help}</span>`)
                                    }}
                                    data-tooltip={constants.blocked.includes(item.type) ? 'Coming Soon' : 'Enlighten Me'}
                                  >
                                    <div
                                      className="material-icons-round smol"
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
                                !constants.config.includes(item.type) && !constants.blocked.includes(item.type)
                                && resolver === ccip2Contract &&
                                (recordhash || ownerhash) && (
                                  <button
                                    className="button-tiny"
                                    onClick={() => {
                                      setHelpModal(true)
                                      setIcon('timer')
                                      setColor(queue < 0 ? 'orange' : 'lime')
                                      setHelp(queue < 0 ? '<span><span style="color: orange">Too Soon To Update</span>. Please wait at least <span style="color: cyan">one hour</span> between updates</span>' : '<span><span style="color: lime">Ready</span> For Next Record Update</span>')
                                    }}
                                    data-tooltip={
                                      queue < 0 ? 'Too Soon To Update' : 'Ready For Next Update'
                                    }
                                  >
                                    <div
                                      className="material-icons-round smol"
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
                                !constants.config.includes(item.type) && !constants.blocked.includes(item.type)
                                && resolver === ccip2Contract && _Wallet_ &&
                                (recordhash || ownerhash) && (history.ownerstamp.length > 0) && (
                                  <button
                                    className={!['', '.', '0', '1'].includes(refresh) && refresh === item.type ? "button-tiny blink" : "button-tiny"}
                                    onClick={() => {
                                      refresh !== '' ? '' : refreshRecord([item.type, ''], resolveCall, ENS, true)
                                      setRefreshedItem(item.type)
                                    }}
                                    data-tooltip={![item.type, '.', '0', '1'].includes(refresh) ? (item.value === history[item.type] ? `Record in Sync with ${hashType === 'gateway' ? 'Gateway' : 'IPNS'}` : 'Record not in Sync. Click to refresh') : (!['.', '', '0', '1'].includes(refresh) ? 'Refresh in Progress' : (refresh === '1' ? 'Record Updated' : (refresh === '0' ? 'No New Update' : (refresh === '.' ? 'Please Wait to Refresh again' : (refresh === '-' ? 'No New Update' : 'Click to Refresh')))))}
                                  >
                                    <div
                                      className="material-icons-round smol"
                                      style={{
                                        color: ![item.type, '.', '0', '1'].includes(refresh) ? (item.value === history[item.type] ? 'lightgreen' : 'orange') : (!['.', '', '0', '1'].includes(refresh) ? 'white' : (refresh === '1' ? 'lime' : (refresh === '0' ? 'yellow' : (refresh === '.' ? 'white' : (refresh === '-' ? 'yellow' : 'cyan'))))),
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
                                    className="material-icons-round smol"
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
                              className={item.type === 'resolver' && resolver !== ccip2Contract && managers.includes(String(_Wallet_)) ? "button emphasis" : "button"}
                              hidden={
                                (item.type === 'resolver' && isDisabled(item)) || !_Wallet_
                              }
                              disabled={
                                isDisabled(item)
                              }
                              style={{
                                alignSelf: 'flex-end',
                                height: '25px',
                                width: 'auto',
                                marginBottom: '6px',
                                marginRight: '-6px',
                                background: isDisabled(item) ? (multiEdit(item) ? 'none' : 'rgb(255, 255, 255, 0.2)') : (multiEdit(item) ? 'none' : 'linear-gradient(112deg, rgba(190,95,65,1) 0%, rgba(191,41,36,1) 48%, rgba(203,111,0,1) 100%)')
                              }}
                              onClick={() => { }}
                              data-tooltip={item.tooltip}
                            >
                              <div
                                className="flex-sans-direction"
                                style={{
                                  fontSize: '13px',
                                  color: constants.config.includes(item.type) ? 'white' : (!legit[item.type] ? 'grey' : (states.length > 1 ? 'lime' : 'white'))
                                }}
                              >
                                {multiEdit(item) ? '' : item.label}&nbsp;
                                <span
                                  className="material-icons-round smoller"
                                >
                                  {multiEdit(item) ? (legit[item.type] ? 'task_alt' : 'cancel') : 'manage_history'}
                                </span>
                              </div>
                            </button>
                          </div>
                          <div
                            className="flex-row"
                            style={{
                              width: '100%'
                            }}
                          >
                            <input
                              className={!constants.config.includes(item.type) ? (resolver !== ccip2Contract ? 'inputextra_' : (constants.blocked.includes(item.type) ? 'inputextra___' : 'inputextra')) : (resolver !== ccip2Contract ? 'inputextra_' : (item.type === 'storage' && item.value == constants.defaultGateway ? 'inputextra__' : 'inputextra'))}
                              id={item.key}
                              key={item.key}
                              placeholder={constants.blocked.includes(item.type) ? 'Coming Soon' : item.value}
                              type='text'
                              disabled={
                                !item.editable || constants.blocked.includes(item.type) || !managers.includes(String(_Wallet_))
                              }
                              style={{
                                background: resolver !== ccip2Contract || constants.blocked.includes(item.type) || !managers.includes(String(_Wallet_)) ? (!constants.config.includes(item.type) ? 'none' : 'linear-gradient(90deg, rgba(100,0,0,0.5) 0%, rgba(100,25,25,0.5) 50%, rgba(100,0,0,0.5) 100%)') : (item.type === 'storage' && item.value === constants.defaultGateway ? 'linear-gradient(90deg, rgba(50,50,0,0.5) 0%, rgba(50,50,25,0.5) 50%, rgba(50,50,0,0.5) 100%)' : 'linear-gradient(90deg, rgba(0,50,0,0.5) 0%, rgba(25,50,25,0.5) 50%, rgba(0,50,0,0.5) 100%)'),
                                fontFamily: 'SF Mono',
                                fontWeight: '400',
                                fontSize: '14px',
                                width: '100%',
                                wordWrap: 'break-word',
                                textAlign: 'left',
                                marginTop: '-5px',
                                marginBottom: '-5px',
                                paddingRight: !constants.config.includes(item.type) ? '30px' : '0',
                                color: !legit[item.type] ? 'white' : (item.type === 'storage' && item.value === constants.defaultGateway ? 'yellow' : 'lightgreen'),
                                cursor: 'copy'
                              }}
                              onChange={(e) => {
                                setValues(item.type, e.target.value)
                              }}
                            />
                            {!constants.config.includes(item.type) && !constants.blocked.includes(item.type) && !states.includes(item.type) && (
                              <div
                                id={item.type}
                                className="material-icons-round"
                                style={{
                                  cursor: "copy",
                                  fontSize: '22px',
                                  fontWeight: '700',
                                  marginLeft: '-25px',
                                  color: 'lightgreen',
                                  opacity: isLoading[item.type] === '0' || (!item.value && isLoading[item.type] !== '-') ? '0' : '1',
                                }}
                                onClick={() => constants.copyElement(item.value, item.type)}
                              >
                                {isLoading[item.type] === '1' ? 'content_copy' : (isLoading[item.type] === '-' ? 'hourglass_top' : 'content_copy')}
                              </div>
                            )}
                          </div>
                        </div>
                        <hr style={{ marginTop: '5px' }}></hr>
                      </li>
                    ))}
                  </div>
                </ul>
              </div>
              {states.length > 1 && !states.includes('resolver') && !states.includes('storage') && (
                <div
                  style={{
                    marginTop: '-10px',
                    marginBottom: '40px'
                  }}
                >
                  <button
                    className="button flex-column emphasis"
                    hidden={
                      states.length < 2
                    }
                    disabled={
                      !_Wallet_ ||
                      !managers.includes(String(_Wallet_)) ||
                      (newValues === constants.EMPTY_STRING_RECORDS())
                    }
                    style={{
                      alignSelf: 'flex-end',
                      height: '30px',
                      width: 'auto',
                      marginTop: isMobile ? '-3px' : '35px',
                    }}
                    onClick={() => {
                      setTrigger('records')
                      setSafeTrigger('1')
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
                      {'Edit All'}&nbsp;<span className="material-icons-round smoller">manage_history</span>
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
            position={''}
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
              setGasModal(false)
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
              setSaltModal(false)
            }}
            show={saltModal}
          >
            {[ENS, hashType]}
          </Salt>
          <Gateway
            handleTrigger={handleGatewayTrigger}
            handleModalData={handleGatewayModalData}
            onClose={() => {
              setGateway(false)
            }}
            show={gateway}
          >
            {undefined}
          </Gateway>
          <Options
            handleTrigger={handleOptionsTrigger}
            handleModalData={handleOptionsModalData}
            onClose={() => {
              setOptions(false)
            }}
            show={options && trigger === 'resolver'}
          >
            {ownerhash ? true : (recordhash ? true : false)}
          </Options>
          <Confirm
            handleTrigger={handleConfirmTrigger}
            handleModalData={handleConfirmModalData}
            onClose={() => {
              setConfirm(false)
            }}
            show={confirm && !saltModal}
          >
            {'1'}
          </Confirm>
          <Error
            onClose={() => {
              setCrash(false)
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
  padding-top: 0px;
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
  padding-top: ${isMobile ? '10px' : '30px'};
  padding-bottom: 10px;
  margin-left: ${isMobile ? '5.5%' : '15.5%'};
  font-size: 22px;
  font-weight: 800;
  margin-bottom: ${isMobile ? '0' : '-15px'};
  color: white;
`

const StyledModalHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  font-size: 20px;
`

const StyledModal = styled.div`
  position: fixed;
  top: ${isMobile ? '20px' : '60px'};
  width: ${isMobile ? '95%' : 'auto'};
  min-width: ${isMobile ? '95%' : '900px'};
  min-height: ${isMobile ? '92.5%' : '90%'};
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
