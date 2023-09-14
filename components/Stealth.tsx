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
import PayTo from '../components/PayTo'
import Error from '../components/Error'
import Loading from '../components/LoadingColors'
import Success from '../components/Success'
import * as constants from '../utils/constants'
import { KEYGEN, RSAGEN } from '../utils/keygen'
import * as Name from 'w3name'
import * as ed25519v2 from 'ed25519-2.0.0' // @noble/ed25519 v2.0.0
import * as ensContent from '../utils/contenthash'
import * as verifier from '../utils/verifier'
import { isMobile } from 'react-device-detect'
import {
  useAccount,
  useFeeData,
  useSignMessage,
  useContractRead,
  usePrepareSendTransaction,
  useWaitForTransaction,
  useSendTransaction
} from 'wagmi' // Legacy Wagmi 1.6
import { Resolver } from '@ethersproject/providers'
import * as cryptico from 'cryptico-js/dist/cryptico.browser.js'
import { parseEther } from 'viem'

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
const Stealth: React.FC<ModalProps> = ({ show, onClose, _ENS_, chain, handleParentModalData, handleParentTrigger }) => {
  // React States
  const [browser, setBrowser] = React.useState(false); // Triggers at modal load
  const { data: gasData, isError } = useFeeData(); // Current gas prices
  const [loading, setLoading] = React.useState(true); // Loading process indicator
  const [keygen, setKeygen] = React.useState(false); // IPNS keygen trigger following signature
  const [crash, setCrash] = React.useState(false);  // Signature fail indicator
  const [CID, setCID] = React.useState(''); // IPNS pubkey/CID value
  const [ENS, setENS] = React.useState(''); // ENS name; used to trigger useContractRead()
  const [payee, setPayee] = React.useState('') // Payee ENS
  const [payment, setPayment] = React.useState('') // Encrypted Payment
  const [payeeAddr, setPayeeAddr] = React.useState('') // Decrypted Payee Address
  const [payeeAmount, setPayeeAmount] = React.useState('0') // Decrypted Payee Amount
  const [helpModal, setHelpModal] = React.useState(false); // Help modal trigger
  const [successModal, setSuccessModal] = React.useState(false); // Success modal trigger
  const [conclude, setConclude] = React.useState(false); // Indicates when all records have finished fetching
  const [resolver, setResolver] = React.useState<any>(); // Resolver for ENS Domain
  const [resolveCall, setResolveCall] = React.useState<any>(); // Resolver object for querying records
  const [sync, setSync] = React.useState(false); // Records sync flag
  const [recordhash, setRecordhash] = React.useState<any>(undefined); // Recordhash for CCIP2 Resolver
  const [ownerhash, setOwnerhash] = React.useState<any>(undefined); // Ownerhash for CCIP2 Resolver
  const [namehashLegacy, setNamehashLegacy] = React.useState(''); // Legacy Namehash of ENS Domain
  const [tokenIDLegacy, setTokenIDLegacy] = React.useState(''); // Legacy Token ID of ENS Domain
  const [tokenIDWrapper, setTokenIDWrapper] = React.useState(''); // Wrapper Token ID of ENS Domain
  const [managers, setManagers] = React.useState<string[]>([]); // Manager of ENS Domain
  const [stealth, setStealth] = React.useState(''); // Stealth record for ENS Domain
  const [RSA, setRSA] = React.useState(''); // RSA record for ENS Domain
  const [saltModal, setSaltModal] = React.useState(false); // Salt (password/key-identifier) for IPNS keygen
  const [refresh, setRefresh] = React.useState(''); // Refresh record trigger
  const [refreshedItem, setRefreshedItem] = React.useState(''); // Refresh record item
  const [refreshedValue, setRefreshedValue] = React.useState(''); // Refresh record value
  const [list, setList] = React.useState<any[]>([]); // Internal LIST[] object with all record keys and values
  const [preCache, setPreCache] = React.useState<any[]>([]); // Copy of LIST[] object
  const [trigger, setTrigger] = React.useState<any>(undefined); // Triggered upon button click adjacent to the record in Preview modal
  const [safeTrigger, setSafeTrigger] = React.useState<string>(''); // Cache state for trigger
  const [help, setHelp] = React.useState(''); // Sets help text for the Help modal
  const [isSigner, setIsSigner] = React.useState(false); // Sets help text for the Help modal
  const [isPayment, setIsPayment] = React.useState(false); // Logs progress of payment
  const [success, setSuccess] = React.useState(''); // Sets success text for the Success modal
  const [gas, setGas] = React.useState<{}>({}); // Sets historical gas savings
  const [wrapped, setWrapped] = React.useState(false); // Indicates if the ENS Domain is wrapped
  const [keypairIPNS, setKeypairIPNS] = React.useState<[string, string]>(); // Sets generated K_IPNS keys
  const [keypairRSA, setKeypairRSA] = React.useState<[any, string]>(); // Sets generated K_RSA keys
  const [keypairSigner, setKeypairSigner] = React.useState<[string, string]>(); // Sets generated K_IPNS and K_SIGNER keys
  const [updateRecords, setUpdateRecords] = React.useState(false); // Triggers signature for record update
  const [write, setWrite] = React.useState(false); // Triggers update of record to the NameSys backend and IPNS
  const [states, setStates] = React.useState<any[]>([]); // Contains keys of active records (that have been edited in the modal)
  const [newValues, setNewValues] = React.useState(constants.EMPTY_STRING_STEALTH()); // Contains new values for the active records in {a:b} format
  const [icon, setIcon] = React.useState(''); // Sets icon for the loading state
  const [color, setColor] = React.useState(''); // Sets color for the loading state
  const [message, setMessage] = React.useState(['', '']); // Sets message for the loading state
  const [payToModal, setPayToModal] = React.useState(false); // PayTo modal
  const [processed, setProcessed] = React.useState(false); // Checks if Encryption has occured
  const [signatures, setSignatures] = React.useState(constants.EMPTY_STRING_STEALTH()); // Contains S_RECORDS(K_SIGNER) signatures of active records in the modal
  const [onChainManagerQuery, setOnChainManagerQuery] = React.useState<string[]>(['', '', '']); // CCIP2 Query for on-chain manager
  const [timestamp, setTimestamp] = React.useState(''); // Stores update timestamp returned by backend
  const [hashType, setHashType] = React.useState('gateway'); // Recordhash or Ownerhash storage
  const [hashIPFS, setHashIPFS] = React.useState(''); // IPFS hash behind IPNS
  const [recentCrash, setRecentCrash] = React.useState(false) // Crash state
  const [goodSalt, setGoodSalt] = React.useState(false) // If generated CID matches the available storage
  const [saltModalState, setSaltModalState] = React.useState<constants.MainBodyState>({
    modalData: undefined,
    trigger: false
  }); // Salt modal state
  const [payToModalState, setPayToModalState] = React.useState<constants.MainBodyState>({
    modalData: undefined,
    trigger: false
  }); // Salt modal state
  const [successModalState, setSuccessModalState] = React.useState<constants.MainBodyState>({
    modalData: undefined,
    trigger: false
  }); // Confirm modal state
  const [history, setHistory] = React.useState(constants.EMPTY_HISTORY_STEALTH); // Record history from last update
  const [sigIPNS, setSigIPNS] = React.useState(''); // Signature S_IPNS(K_WALLET) for IPNS keygen
  const [sigRSA, setSigRSA] = React.useState(''); // Signature S_RSA(K_WALLET) for RSA keygen
  const [sigSigner, setSigSigner] = React.useState(''); // Signature S_SIGNER(K_WALLET) for Signer
  const [sigApproved, setSigApproved] = React.useState(''); // Signature S_APPROVE(K_WALLET) for Records Manager
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

  // Wagmi Signature hook
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
  })

  // Write hooks
  const { config: sendPayment } = usePrepareSendTransaction({
    to: payeeAddr,
    value: payeeAmount ? parseEther(payeeAmount) : parseEther('0.0001')
  })
  const { data, sendTransaction, isError: sendError, isLoading: sendLoading, isSuccess: sendSuccess } = useSendTransaction(sendPayment)

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

  // Wagmi hook for awaiting transaction processing
  const { isSuccess: txSuccess, isError: txError, isLoading: txLoading } = useWaitForTransaction({
    hash: data?.hash,
  })

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

  // Handle PayTo modal data return
  const handlePayToModalData = (data: string | undefined) => {
    setPayToModalState(prevState => ({ ...prevState, modalData: data }))
  }
  // Handle PayTo modal trigger
  const handlePayToTrigger = (trigger: boolean) => {
    setPayToModalState(prevState => ({ ...prevState, trigger: trigger }))
    if (trigger) {
      setSafeTrigger('1')
    } else {
      setSafeTrigger('0')
      setTrigger('')
    }
    setPayToModal(false)
  }

  // Handle Payment decryption
  const decrypt = () => {
    setMessage(['Searching For Payment', ''])
    setLoading(true)
    const lookup = async () => {
      const _resolver = await provider.getResolver(payee)
      if (_resolver?.address) {
        await _resolver.getText('stealth')
          .then(response => {
            if (!response) {
              setLoading(false)
              setPayeeAddr(constants.zeroAddress)
              setPayeeAmount('0.0')
              setMessage(['Payer Has No Payment For You', ''])
              doCrash()
              setColor('orangered')
            } else {
              setMessage(['Decrypting Payment Data', ''])
              setSaltModal(true)
              setIsPayment(true)
              setPayment(response)
            }
          })
          .catch(() => {
            setLoading(false)
            setPayeeAddr(constants.zeroAddress)
            setPayeeAmount('0.0')
            setMessage(['Error Fetching Payment Data', ''])
            doCrash()
            setColor('orangered')
          })
      } else {
        setLoading(false)
        setPayeeAddr(constants.zeroAddress)
        setPayeeAmount('0.0')
        setMessage(['Payer Has No Resolver', ''])
        doCrash()
        setColor('orangered')
      }
    }
    lookup()
  }

  // Handle Preview modal close
  const handleCloseClick = (e: { preventDefault: () => void; }) => {
    setSigApproved('') // Purge Manager Signature S_RECORDS from local storage 
    setSignatures(constants.EMPTY_STRING_STEALTH()) // Purge Record Signatures from local storage 
    setKeypairSigner(undefined)
    setKeypairIPNS(undefined)
    setKeypairRSA(undefined)
    setSigSigner('')
    setSigIPNS('')
    setSigRSA('')
    setPayment('')
    handleParentModalData(`${ENS}`)
    handleParentTrigger(true)
    e.preventDefault()
    onClose()
  }

  // Initialises internal LIST[] object
  function setMetadata(_encrypted: string, _pubkey: string) {
    let _LIST = [
      {
        key: 0,
        header: 'Encryption Key',
        type: 'rsa',
        value: _pubkey,
        editable: false,
        active: resolver === ccip2Contract && queue > 0,
        state: false,
        label: 'Set',
        help: '<span>Set <span style="color: cyan">Encryption</span> Public Key To <span style="color: orange">Send</span> Money</span>',
        tooltip: 'Set New RSA PubKey'
      },
      {
        key: 1,
        header: 'Encrypted Payment',
        type: 'stealth',
        value: _encrypted,
        editable: false,
        active: resolver === ccip2Contract && queue > 0,
        state: false,
        label: 'Set',
        help: '<span><span style="color: cyan">Encrypted</span> Payment Address To <span style="color: lime">Receive</span> Money</span>',
        tooltip: 'Set New Stealth Payment'
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
  /* K_SIGNER = Generated secp256k1 Keypair 
   * K_WALLET = Wallet secp256k1 Keypair 
   * K_IPNS = Generated ed25519 Keypair
   * K_RSA = Generate RSA Keypair
   * S_IPNS = Signature for K_IPNS Generation (Signed by K_WALLET)
   * S_RECORDS = Signature for Records (Signed by K_SIGNER)
   * S_APPROVE = Signature for Manager Approval (Signed by K_WALLET)
   * S_SIGNER = Signature for K_SIGNER Generation (Signed by K_WALLET)
   * S_RSA = Signature for K_RSA Generation (Signed by K_WALLET)
   */
  // Signature S_IPNS statement; S_IPNS(K_WALLET) [IPNS Keygen]
  // S_IPNS is not recovered on-chain; no need for buffer prepend and hashing of message required to sign
  function statementIPNSKey(extradata: string, type: string) {
    let _toSign = `Requesting Signature To Generate IPNS Key\n\nOrigin: ${['recordhash', 'storage'].includes(type) ? ENS : origin}\nKey Type: ed25519\nExtradata: ${extradata}\nSigned By: ${caip10}`
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
  // Signature S_RSA statement; S_RSA(K_WALLET) [Signer Keygen]
  // S_RSA generates AES-encrypted text
  function statementEncryptionKey(extradata: string) {
    let _toSign = `Requesting Signature To Generate Encryption Key\n\nOrigin: ${ENS}\nKey Type: RSA-2048\nExtradata: ${extradata}\nSigned By: ${caip10}`
    let _digest = _toSign
    return _digest
  }

  /// Encode string values of records
  // returns abi.encodeWithSelector(iCallbackType.signedRecord.selector, _signer, _recordSignature, _approvedSignature, result)
  function encodeValue(key: string, value: string) {
    let encoded: string
    let _value: string = ''
    let type: string = ''
    if (['stealth', 'rsa'].includes(key)) {
      type = 'string'
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
    if (['stealth', 'rsa'].includes(key)) {
      type = 'string'
      _value = _recordValue
    }
    let _result = ethers.utils.defaultAbiCoder.encode([type], [_value])
    const toPack = ethers.utils.keccak256(_result)
    const _extradata = ethers.utils.hexlify(ethers.utils.solidityPack(["bytes"], [toPack]))
    return _extradata
  }

  // Returns Owner of wrapped/legacy ENS Domain
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

  /// Trigger Collapse
  function doCrash() {
    setCrash(true)
    setTrigger('')
    setStates([])
    setCID('')
    setSigSigner('')
    setKeypairSigner(undefined)
    setKeypairIPNS(undefined)
    setKeypairRSA(undefined)
    setLoading(false)
    setSigIPNS('')
    setSigRSA('')
    setIsSigner(false)
    setSaltModal(false)
    setSaltModalState({
      modalData: undefined,
      trigger: false
    })
    setPayToModalState({
      modalData: undefined,
      trigger: false
    })
    setGoodSalt(false)
    if (write) setWrite(false)
  }

  /// Trigger Enjoy
  function doEnjoy() {
    setIcon('gpp_good')
    setColor('lime')
    setSaltModal(false)
    setKeypairSigner(undefined)
    setKeypairIPNS(undefined)
    setKeypairRSA(undefined)
    setSigSigner('')
    setSigIPNS('')
    setSigRSA('')
    setCID('')
    setIsSigner(false)
    setSaltModalState({
      modalData: undefined,
      trigger: false
    })
    setPayToModalState({
      modalData: undefined,
      trigger: false
    })
    setGoodSalt(false)
    setTrigger('')
    setLoading(false)
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
    setSigCount(4) // Trigger S_APPROVE(K_WALLET)
    setMessage(['Waiting For Signature', trigger === 'rsa' ? '4' : '3'])
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
    setSigCount(2)
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
      if (['stealth', 'rsa'].includes(key)) {
        gasAmount = await contract.methods.setText(ethers.utils.namehash(ENS), key, value).estimateGas({ from: _Wallet_ })
      }
      return gasAmount
    }
    const gas = await getGasAmountForContractCall()
    return gas
  }

  // Get Stealth record for ENS domain
  async function getStealth(resolver: ethers.providers.Resolver) {
    await resolver.getText('stealth')
      .then(response => {
        if (!response) {
          setStealth('')
          getRSA(resolver)
        } else {
          setStealth(response)
          getRSA(resolver)
        }
      })
      .catch(() => {
        setStealth('')
        getRSA(resolver)
      })
  }

  // Get RSA record for ENS domain
  async function getRSA(resolver: ethers.providers.Resolver) {
    await resolver.getText('rsa')
      .then(response => {
        if (!response) {
          setRSA('')
          setSync(true)
        } else {
          setRSA(response)
          setSync(true)
        }
      })
      .catch(() => {
        setRSA('')
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
            if (Number(_IPFS._sequence) === Number(_history.timestamp.revision) - 1 && _Storage[1]) {
              if (_history.stealth || _history.rsa) {
                setStealth(_history.stealth)
                setRSA(_history.rsa)
              } else {
                setStealth('')
                setRSA('')
              }
              setSync(true)
            } else {
              getStealth(_response)
            }
          } else {
            getStealth(_response)
            /* @`TODO`
            setStealth('')
            setRSA('')
            setSync(true)
            */
          }
        } else {
          const _stealth = await refreshRecord(['text', 'stealth'], _response, _ENS, false)
          setStealth(_stealth || '')
          const _RSA = await refreshRecord(['text', 'rsa'], _response, _ENS, false)
          setRSA(_RSA || '')
          setSync(true)
        }
      } else {
        setResolveCall(_response)
        setResolver('')
        setStealth('')
        setRSA('')
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
      if (_record[0] === 'text') {
        const _response = await _resolver.getText(_record[1])
        if (_response) {
          if (_record[1] === 'stealth') {
            setStealth(_response)
          } else if (_record[1] === 'rsa') (
            setRSA(_response)
          )
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
  function setPayeeValue(_value: string) {
    if (_value.endsWith('.eth')) {
      setPayee(_value)
    } else {
      setPayee('')
    }
  }

  // Get records from history on NameSys backend
  // Must get Revision for IPNS update
  async function getUpdate(_storage: string, _type: string, _hashType: string) {
    const request = {
      type: 'read',
      ens: ENS,
      controller: getManager(),
      recordsTypes: ['stealth', 'rsa', 'revision', 'version'],
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
            stealth: data.response.stealth,
            rsa: data.response.rsa,
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
    if (_ENS_.endsWith('.eth')) {
      setBrowser(true)
      setENS(_ENS_)
      setMessage(['Loading Stealth Records', '-'])
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
        setOwnerhash(undefined)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_Ownerhash_])

  React.useEffect(() => {
    if (_Recordhash_) {
      if (String(_Recordhash_).length > 2 && (_Recordhash_ !== _Ownerhash_)) {
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
        setMessage(['Loading Stealth Records', '-'])
      } else {
        setRecordhash(undefined)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_Recordhash_, _Ownerhash_])

  // Sets Success modal refresh
  React.useEffect(() => {
    if (successModalState.trigger && successModalState.modalData) {
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [successModalState])

  // Send data to Home/Account-page and trigger update
  function handleSuccess(_output: string) {
    handleParentModalData(_output)
    handleParentTrigger(true)
  }

  // Sets option between Ownerhash and Recordhash
  React.useEffect(() => {
    if (safeTrigger === '1') {
      if (trigger && write) {
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
  }, [trigger, write, safeTrigger])

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

  // Error Handling 
  // Handles Transaction Confirmation
  React.useEffect(() => {
    if (sendSuccess && txSuccess) {
      const pin = async () => {
        setMessage(['Transaction Confirmed', ''])
        setTimeout(() => {
          setSuccess('<span>Payment <span style="color: lightgreen">Sent Successfully</span></span>')
          setSuccessModal(true)
          doEnjoy()
        }, 1000)
      }
      pin()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sendSuccess, txSuccess])
  // Handles Transaction wait
  React.useEffect(() => {
    if (sendLoading && !sendError) {
      setLoading(true)
      setMessage(['Waiting for Transaction', ''])
      if (recentCrash) setRecentCrash(false)
    } else if (sendError && !sendLoading) {
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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sendLoading, sendError])
  // Handles Transaction 1 loading and error
  React.useEffect(() => {
    if (txLoading && !txError) {
      setLoading(true)
      setMessage(['Waiting for Confirmation', ''])
      if (recentCrash) setRecentCrash(false)
    } else if (!txLoading && txError) {
      if (!recentCrash) {
        setMessage(['Transaction Failed', ''])
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
  }, [txLoading, txError])


  // Triggers S_IPNS(K_WALLET) after Payee is set
  React.useEffect(() => {
    let _modalData: string = ''
    if (payToModalState.trigger && payToModalState.modalData !== undefined) {
      if (saltModalState.trigger && saltModalState.modalData !== undefined) {
        _modalData = saltModalState.modalData
      }
    } else {
      if (saltModalState.trigger && saltModalState.modalData !== undefined) {
        _modalData = saltModalState.modalData
      }
    }
    if (trigger === 'rsa' && hashType !== 'gateway') {
      if (saltModalState.trigger && !keypairIPNS && safeTrigger) {
        setSigCount(1)
        setMessage(['Waiting For Signature', '1'])
        signMessage({
          message: statementIPNSKey(
            ethers.utils.keccak256(ethers.utils.solidityPack(
              ['bytes32', 'address'],
              [
                ethers.utils.keccak256(ethers.utils.solidityPack(['string'], [_modalData])),
                _Wallet_
              ]
            )),
            hashType
          )
        })
        setKeygen(true)
      }
    } else if (trigger === 'stealth' && hashType !== 'gateway') {
      if (payToModalState.trigger && !keypairIPNS && safeTrigger && !constants.isEmpty(newValues)) {
        setSigCount(1)
        setMessage(['Waiting For Signature', '1'])
        signMessage({
          message: statementIPNSKey(
            ethers.utils.keccak256(ethers.utils.solidityPack(
              ['bytes32', 'address'],
              [
                ethers.utils.keccak256(ethers.utils.solidityPack(['string'], [_modalData])),
                _Wallet_
              ]
            )),
            hashType
          )
        })
        setKeygen(true)
      }
    } else if (trigger && hashType === 'gateway') {
      setSigIPNS('0')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saltModalState, payToModalState, recordhash, trigger, safeTrigger, hashType, write, states, keypairIPNS])

  // Triggers PayTo modal
  React.useEffect(() => {
    if (trigger === 'stealth') {
      if (saltModalState.trigger && saltModalState.modalData !== undefined) {
        setPayToModal(true)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saltModalState, trigger])

  // Triggers PayTo modal
  React.useEffect(() => {
    if (trigger === 'stealth') {
      if (!payToModalState.trigger && !payToModalState.modalData) {
        setSaltModalState({
          modalData: undefined,
          trigger: false
        })
        setPayToModal(false)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payToModalState, trigger])

  // Triggers Decryption Signature
  React.useEffect(() => {
    if (isPayment) {
      if (saltModalState.trigger && saltModalState.modalData !== undefined) {
        setSigCount(3)
        setProcessCount(hashType === 'gateway' ? 1 : 1)
        setMessage(['Waiting For Signature', '1'])
        signMessage({
          message: statementEncryptionKey(
            ethers.utils.keccak256(ethers.utils.solidityPack(
              ['bytes32', 'address'],
              [
                ethers.utils.keccak256(ethers.utils.solidityPack(['string'], [saltModalState.modalData])),
                _Wallet_
              ]
            ))
          )
        })
        setKeygen(true)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saltModalState, isPayment, hashType])

  // Triggers Decryption Keygen
  React.useEffect(() => {
    if (isPayment && keygen) {
      if (sigRSA && saltModalState.trigger) {
        setMessage(['Generating Encryption Key', '+'])
        const origin = hashType !== 'recordhash' ? `eth:${_Wallet_ || constants.zeroAddress}` : ENS
        const worker = new Worker(new URL('../src/worker/worker', import.meta.url))
        worker.onmessage = (event) => {
          const _deserialisedRSAKey = constants.deserialiseRSAKey(event.data[0])
          const _rehydratedKey = Object.assign(Object.create(constants.prototypeRSAKey), _deserialisedRSAKey)
          setKeypairRSA([_rehydratedKey, event.data[1]])
          setMessage(['Encryption Keypair Generated', ''])
          return
        }
        worker.onerror = (event) => {
          if (event instanceof Event) {
            console.error('❌ ERROR:', event)
            setKeypairRSA(undefined)
            setLoading(false)
            setMessage(['Failed To Generate RSA Key', ''])
            doCrash()
            setColor('orangered')
            setSigCount(0)
            setProcessCount(0)
            return
          }
          console.error('❌ UNKNOWN ERROR:', event)
          setKeypairRSA(undefined)
          setLoading(false)
          setMessage(['Unknown Error While Generating RSA Key', ''])
          doCrash()
          setColor('orangered')
          setSigCount(0)
          setProcessCount(0)
          return
        }
        worker.postMessage({
          "_origin": origin,
          "_caip10": caip10,
          "_sigRSA": sigRSA,
          "_salt": saltModalState.modalData
        })
        return () => {
          worker.terminate()
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sigRSA, isPayment, keygen, saltModalState])

  // Decrypts & Parses payment
  React.useEffect(() => {
    if (isPayment && keypairRSA !== undefined && payment) {
      setMessage(['Decrypting Invoice', ''])
      try {
        const _Payload = cryptico.decrypt(payment, keypairRSA[0])
        let _Payee = JSON.parse(_Payload.plaintext).payee
        let _Amount = JSON.parse(_Payload.plaintext).amount
        const resolve = async () => {
          if (_Payee.endsWith('.eth')) {
            await provider.resolveName(_Payee)
              .then(response => {
                if (!response) {
                } else {
                  setPayeeAddr(response)
                }
              })
              .catch(() => {
                setLoading(false)
                setMessage(['Bad Payee', ''])
                doCrash()
                setColor('orangered')
                setSigCount(0)
                setProcessCount(0)
              })
          } else {
            setPayeeAddr(_Payee)
          }
          setPayeeAmount(_Amount)
          setLoading(false)
        }
        resolve()
      } catch (error) {
        console.error('ERROR:', error)
        setLoading(false)
        setMessage(['Bad Invoice', ''])
        doCrash()
        setColor('orangered')
        setSigCount(0)
        setProcessCount(0)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keypairRSA, isPayment, payment])

  // Triggers S_IPNS(K_WALLET) after password is set
  React.useEffect(() => {
    if (sigIPNS && !keypairIPNS && !isSigner && !isPayment) {
      if (sigIPNS !== '0') {
        setLoading(true)
        setMessage(['Generating IPNS Key', ''])
        const keygen = async () => {
          const _origin = hashType === 'ownerhash' ? `eth:${_Wallet_ || constants.zeroAddress}` : ENS
          const __keypair = await KEYGEN(_origin, caip10, sigIPNS, saltModalState.modalData)
          setKeypairIPNS(__keypair[0])
          setMessage(['IPNS Keypair Generated', ''])
        }
        keygen()
      } else {
        setKeypairIPNS(['0x', '0x'])
        setGoodSalt(true)
      }
    } else if (sigRSA && !keypairRSA && isSigner) {
      setMessage(['Generating Encryption Key', '+'])
      const origin = hashType !== 'recordhash' ? `eth:${_Wallet_ || constants.zeroAddress}` : ENS
      const worker = new Worker(new URL('../src/worker/worker', import.meta.url))
      worker.onmessage = (event) => {
        const _deserialisedRSAKey = constants.deserialiseRSAKey(event.data[0])
        const _rehydratedKey = Object.assign(Object.create(constants.prototypeRSAKey), _deserialisedRSAKey)
        setKeypairRSA([_rehydratedKey, event.data[1]])
        setMessage(['Encryption Keypair Generated', ''])
        return
      }
      worker.onerror = (event) => {
        if (event instanceof Event) {
          console.error('❌ ERROR:', event)
          setKeypairRSA(undefined)
          setLoading(false)
          setMessage(['Failed To Generate RSA Key', ''])
          doCrash()
          setColor('orangered')
          setSigCount(0)
          setProcessCount(0)
          return
        }
        console.error('❌ UNKNOWN ERROR:', event)
        setKeypairRSA(undefined)
        setLoading(false)
        setMessage(['Unknown Error While Generating RSA Key', ''])
        doCrash()
        setColor('orangered')
        setSigCount(0)
        setProcessCount(0)
        return
      }
      worker.postMessage({
        "_origin": origin,
        "_caip10": caip10,
        "_sigRSA": sigRSA,
        "_salt": saltModalState.modalData
      })
      return () => {
        worker.terminate()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keygen, keypairIPNS, goodSalt, write, sigIPNS, isSigner, sigRSA, keypairRSA, isPayment])

  // Triggers S_SIGNER(K_WALLET) after password is set
  React.useEffect(() => {
    if (write && saltModalState.trigger && goodSalt && (processed || trigger === 'rsa')) {
      setMessage(['Waiting For Signature', '2'])
      const _sigSigner = async () => {
        if (saltModalState.modalData !== undefined) {
          setSigCount(2) // Trigger S_SIGNER(K_WALLET)
          setProcessCount(trigger === 'rsa' ? 4 : 3)
          signSigner(saltModalState.modalData)
        }
      }
      _sigSigner()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saltModalState, goodSalt, write, processed, trigger])

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

  // Triggers S_RSA(K_WALLET) after Signer is set
  React.useEffect(() => {
    let _modalData: string = ''
    if (saltModalState.trigger && saltModalState.modalData !== undefined) {
      _modalData = saltModalState.modalData
    }
    if (trigger === 'rsa' && safeTrigger && isSigner && saltModalState.trigger) {
      setSigCount(3)
      setMessage(['Waiting For Signature', '3'])
      signMessage({
        message: statementEncryptionKey(
          ethers.utils.keccak256(ethers.utils.solidityPack(
            ['bytes32', 'address'],
            [
              ethers.utils.keccak256(ethers.utils.solidityPack(['string'], [_modalData])),
              _Wallet_
            ]
          ))
        )
      })
      setKeygen(true)
    } else if (trigger === 'stealth' && safeTrigger && isSigner && saltModalState.trigger) {
      setMessage(['Waiting For Signature', '2'])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSigner, saltModalState, trigger])

  // Triggers S_SIGNER(K_WALLET) after password is set
  React.useEffect(() => {
    if (trigger === 'stealth') {
      setProcessCount(3)
    } else if (trigger === 'rsa') {
      setProcessCount(4)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger])

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
          }
        }
        CIDGen()
      }
    } else {
      if (write && hashType === 'gateway') {
        setGoodSalt(true)
        setCID('gateway')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keypairIPNS, sigIPNS, hashType, recordhash, ownerhash, write])

  // Sets signature from Wagmi signMessage() as S_IPNS(K_WALLET)
  React.useEffect(() => {
    if (signature && sigCount === 1) {
      setSigIPNS(signature)
    } else if (signature && sigCount === 4) {
      setSigApproved(signature)
    } else if (signature && sigCount === 2) {
      setSigSigner(signature)
    } else if (signature && sigCount === 3) {
      setSigRSA(signature)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature, sigCount])

  // RSA keypair is generated
  React.useEffect(() => {
    if (payToModalState.trigger && payToModalState.modalData) {
      setMessage(['Fetching Payer Encryption Key', ''])
      setLoading(true)
      let _Payer = payToModalState.modalData.split(':')[0]
      let _Payee = payToModalState.modalData.split(':')[1]
      let _Amount = payToModalState.modalData.split(':')[2]
      const lookup = async () => {
        const _resolver = await provider.getResolver(_Payer)
        if (_resolver?.address) {
          let _RSA: string = ''
          await _resolver.getText('rsa')
            .then((response) => {
              if (!response) {
                _RSA = ''
                setLoading(false)
                setMessage(['Payer Has No Encryption Record', ''])
                doCrash()
                setColor('orangered')
                setSigCount(0)
                setProcessCount(0)
              } else {
                setMessage(['Waiting For Signature', '2'])
                _RSA = response
                let _encryptionResult: any = {}
                _encryptionResult = cryptico.encrypt(`{"payer":"${_Payer}","payee":"${_Payee}","amount":"${_Amount}"}`, _RSA)
                const _THIS = newValues
                _THIS['stealth'] = _encryptionResult.cipher
                setNewValues(_THIS)
                setProcessed(true)
                const priorState = states
                if (!priorState.includes('stealth') && newValues['stealth']) {
                  setStates(prevState => [...prevState, 'stealth'])
                } else if (priorState.includes('stealth') && !newValues['stealth']) {
                  setStates(prevState => prevState.filter(item => item !== 'stealth'))
                }
              }
            })
            .catch(() => {
              _RSA = ''
              setLoading(false)
              setMessage(['Failed To Fetch Encryption Record', ''])
              doCrash()
              setColor('orangered')
              setSigCount(0)
              setProcessCount(0)
            })
        } else {
          setMessage(['Payer Has No Resolver', ''])
          setLoading(false)
          doCrash()
          setColor('orangered')
          setSigCount(0)
          setProcessCount(0)
        }
      }
      lookup()
    } else if (keypairRSA && !payToModalState.trigger) {
      const _THIS = newValues
      _THIS['rsa'] = keypairRSA[1]
      setNewValues(_THIS)
      const priorState = states
      if (!priorState.includes('rsa') && newValues['rsa']) {
        setStates(prevState => [...prevState, 'rsa'])
      } else if (priorState.includes('rsa') && !newValues['rsa']) {
        setStates(prevState => prevState.filter(item => item !== 'rsa'))
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [CID, keypairRSA, write, payToModalState])

  // Concludes fetching records
  React.useEffect(() => {
    if (sync) {
      setMetadata(stealth, RSA)
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sync, recordhash, ownerhash, resolver, hashType, stealth, RSA])

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
      } else {
        if (states.length > 0) {
          setLoading(true)
          setMessage(['Setting Records', String(states.length)])
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateRecords, keypairSigner, CID, write, hashType])

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
      let __signatures = constants.EMPTY_STRING_STEALTH()
      states.forEach(async (_recordType) => {
        let _signature: any
        if (newValues[_recordType]) {
          _signature = await signRecords({
            message: statementRecords(constants.filesStealth[constants.typesStealth.indexOf(_recordType)], genExtradata(_recordType, newValues[_recordType]), keypairSigner[0])
          }) // Sign with K_SIGNER
        }
        if (_signature) __signatures[_recordType] = _signature
      })
      setSignatures(__signatures)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [write, keypairSigner, newValues, states])

  // Triggers signing Off-Chain Signer's approval by Controller
  React.useEffect(() => {
    // Handle Signature S_APPROVE(K_WALLET)
    if (write && !onChainManager && !sigApproved && !constants.isEmpty(signatures)) {
      if (hashType !== 'gateway') {
        setProcessCount(trigger === 'rsa' ? 4 : 3)
      } else {
        setProcessCount(trigger === 'rsa' ? 4 : 3)
      }
      signManager() // Sign with K_WALLET
    } else if (write && onChainManager && !constants.isEmpty(signatures)) {
      setSigApproved('0x')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onChainManager, signatures, hashType])

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
      let _encodedValues = constants.EMPTY_STRING_STEALTH()
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
                  if (['stealth', 'rsa'].includes(item.type) && data.response.meta[item.type]) {
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
                    if (item.type === 'stealth') {
                      setStealth(data.response.stealth)
                    } else if (item.type === 'rsa') {
                      setRSA(data.response.rsa)
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
                if (hashType !== 'gateway' && keypairIPNS) {
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
                          let _revision_ = Revision.decode(new Uint8Array(Object.values(JSON.parse(JSON.stringify(history.revision)))))
                          _revision = await Name.increment(_revision_, toPublish)
                        }
                        setTimestamp(data.response.timestamp)
                        // Write revision to database
                        await writeRevision(_revision, gas, data.response.timestamp, data.response.ipfs.split('ipfs://')[1])
                        // Publish IPNS
                        await Name.publish(_revision, w3name.key)
                        // Wrap up
                        setGas(gas)
                        setStates([])
                        // Update values in the modal to new ones
                        let _updatedList = list.map((item) => {
                          if (['stealth', 'rsa'].includes(item.type)) {
                            let _queue = Math.round(Date.now() / 1000) - constants.latestTimestamp(data.response.timestamp) - constants.waitingPeriod
                            setQueue(_queue)
                            if (data.response.meta[item.type]) {
                              return {
                                ...item,
                                value: data.response[item.type],
                                state: true,
                                active: _queue > 0
                              }
                            } else {
                              return {
                                ...item,
                                active: _queue > 0
                              }
                            }
                          } else {
                            return item
                          }
                        })
                        setPreCache(_updatedList)
                        setNewValues(constants.EMPTY_STRING_STEALTH())
                        setSignatures(constants.EMPTY_STRING_STEALTH())
                        setUpdateRecords(false) // Reset
                        setSigCount(0)
                        setSaltModalState({
                          modalData: undefined,
                          trigger: false
                        })
                        setSuccess(trigger === 'stealth' ? '<span><span style="color: lightgreen">Stealth Record Set</span>! You may now <span style="color: cyan">Receive</span> Private Payments</span>' : '<span><span style="color: lightgreen">Encryption Key Set</span>! You may now <span style="color: cyan">Send</span> Private Payments</span>')
                        setSuccessModal(true)
                        setPayeeAddr('')
                        doEnjoy()
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
                      setStates([])
                      setLoading(false)
                      // Update values in the modal to new ones
                      let _updatedList = list.map((item) => {
                        if (!['resolver', 'storage'].includes(item.type)) {
                          let _queue = 1
                          setQueue(_queue)
                          if (data.response.meta[item.type]) {
                            return {
                              ...item,
                              value: data.response[item.type],
                              state: true,
                              active: _queue > 0
                            }
                          } else {
                            return {
                              ...item,
                              active: _queue > 0
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
                      setSuccess(trigger === 'stealth' ? '<span><span style="color: lightgreen">Stealth Record Set</span>! You may now <span style="color: cyan">Receive</span> Private Payments</span>' : '<span><span style="color: lightgreen">Encryption Key Set</span>! You may now <span style="color: cyan">Send</span> Private Payments</span>')
                      setSuccessModal(true)
                      setPayeeAddr('')
                      doEnjoy()
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
        setNewValues(constants.EMPTY_STRING_STEALTH())
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
              {message[1] && !['-', '+'].includes(message[1]) && (
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
                      {hashType !== 'gateway' ? processCount : (!write && isPayment ? processCount : processCount - 1)}
                    </span>
                  </span>
                </div>
              )}
              {message[1] && ['-', '+'].includes(message[1]) && (
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
                    <span>{message[1] === '-' ? 'Please Be Patient' : 'This Will Take Time. Hang on'}</span>
                  </span>
                </div>
              )}
            </div>
          </StyledModalBody>
        }
        {ENS && !loading &&
          <StyledModalTitle>
            <span
              className="material-icons miui"
              style={{
                marginTop: '-15px',
                color: RSA ? 'lightgreen' : 'orange',
                fontSize: '86px',
                marginLeft: '3%'
              }}
            >
              account_balance
            </span>
          </StyledModalTitle>
        }
        {ENS && list.length > 0 && !loading &&
          <StyledModalBody>
            <div
              className='flex-column'
            >
              <div
                style={{
                  marginTop: '-25px',
                  marginLeft: '2%'
                }}
              >
                <span
                  style={{
                    color: 'cyan',
                    fontSize: '13px',
                    fontWeight: '700'
                  }}
                >
                  {'Receive Stealth Payment To'}
                </span>
              </div>
              <div
                style={{
                  marginBottom: '15px',
                  marginTop: '5px',
                  marginLeft: '2%'
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
                  marginLeft: !isMobile ? '-5%' : '0',
                  marginTop: '20px'
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
                            { // Label+
                              ['stealth', 'rsa'].includes(item.type) && (
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
                                      item.type === 'stealth' ? 'lock' : 'vpn_key'
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
                                    {item.type}
                                  </span>
                                </span>
                              )}
                            { // Help icons
                              ['stealth', 'rsa'].includes(item.type) && (
                                <button
                                  className="button-tiny"
                                  onClick={() => {
                                    setHelpModal(true)
                                    setIcon('info')
                                    setColor(constants.blocked.includes(item.type) ? 'orange' : 'cyan')
                                    setHelp(constants.blocked.includes(item.type) ? '<span style="color: orangered">In Process of Bug Fixing</span>' : `<span>${item.help}</span>`)
                                  }}
                                  data-tooltip={constants.blocked.includes(item.type) ? 'Temporarily Unavailable' : 'Enlighten Me'}
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
                            { // Badges
                              ['stealth', 'rsa'].includes(item.type) && (
                                <button
                                  className="button-tiny"
                                  onClick={() => {
                                    setHelpModal(true)
                                    setIcon(item.type === 'stealth' ? 'gpp_good' : (RSA ? 'gpp_good' : 'gpp_bad'))
                                    setColor(item.type === 'stealth' ? 'lime' : (RSA ? 'lime' : 'orangered'))
                                    setHelp(item.type === 'stealth' ? '<span>Please set the <span style="color: cyan">Stealth Invoice</span> to <span style="color: orange">Receive</span> Private Payment<span>' : (RSA ? '<span>Encryption Key <span style="color: lime">Set</span><span>' : `<span>Please Set <span style="color: cyan">Encryption Key</span> To <span style="color: orange">Send</span> Private Payments<span>`))
                                  }}
                                  data-tooltip={item.type === 'stealth' ? 'Set Encrypted Invoice' : (RSA ? 'Encryption Key Set' : 'Encryption Key Missing')}
                                >
                                  <div
                                    className="material-icons-round smol"
                                    style={{
                                      color: item.type === 'stealth' ? 'lime' : (RSA ? 'lime' : 'orangered'),
                                      marginLeft: '-5px'
                                    }}
                                  >
                                    {item.type === 'stealth' ? 'gpp_good' : (RSA ? 'gpp_good' : 'gpp_bad')}
                                  </div>
                                </button>
                              )}
                            { // Countdown
                              ['stealth', 'rsa'].includes(item.type) && !constants.blocked.includes(item.type)
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
                              ['stealth', 'rsa'].includes(item.type) && !constants.blocked.includes(item.type)
                              && resolver === ccip2Contract && _Wallet_ &&
                              (recordhash || ownerhash) && history.ownerstamp.length > 0 && (
                                <button
                                  className={!['', '.', '0', '1'].includes(refresh) && [item.type].includes(refresh) ? "button-tiny blink" : "button-tiny"}
                                  onClick={() => {
                                    refresh !== '' ? '' : refreshRecord(['text', item.type], resolveCall, ENS, true)
                                    setRefreshedItem(item.type)
                                  }}
                                  data-tooltip={![item.type, '.', '0', '1'].includes(refresh) ? (item.value.toLowerCase() === history[item.type].toLowerCase() ? `Record in Sync with ${hashType === 'gateway' ? 'Gateway' : 'IPNS'}` : 'Record not in Sync. Click to refresh') : (!['.', '', '0', '1'].includes(refresh) ? 'Refresh in Progress' : (refresh === '1' ? 'Record Updated' : (refresh === '0' ? 'No New Update' : (refresh === '.' ? 'Please Wait to Refresh again' : (refresh === '-' ? 'No New Update' : 'Click to Refresh')))))}
                                >
                                  <div
                                    className="material-icons-round smol"
                                    style={{
                                      color: ![item.type, '.', '0', '1'].includes(refresh) ? (item.value.toLowerCase() === history[item.type].toLowerCase() ? 'lightgreen' : 'orange') : (!['.', '', '0', '1'].includes(refresh) ? 'white' : (refresh === '1' ? 'lime' : (refresh === '0' ? 'yellow' : (refresh === '.' ? 'white' : (refresh === '-' ? 'yellow' : 'cyan'))))),
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
                                  className="material-icons-round smol emphasis"
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
                            disabled={
                              constants.blocked.includes(item.type) ||
                              !list[item.key].active ||
                              item.state ||
                              !_Wallet_ ||
                              !managers.includes(String(_Wallet_))
                            }
                            style={{
                              alignSelf: 'flex-end',
                              height: '25px',
                              width: 'auto',
                              marginBottom: '6px',
                            }}
                            onClick={() => {
                              setSaltModal(true)
                              item.type === 'stealth' ? setPayToModalState({
                                modalData: undefined,
                                trigger: false
                              }) : ''
                              setTrigger(item.type)
                              setSafeTrigger('1')
                              setWrite(true)
                            }}
                            data-tooltip={item.tooltip}
                          >
                            <div
                              className="flex-sans-direction"
                              style={{
                                fontSize: '13px'
                              }}
                            >
                              {item.label}&nbsp;<span className="material-icons-round smoller">manage_history</span>
                            </div>
                          </button>
                        </div>
                        <input
                          className={'inputextra'}
                          id={item.key}
                          key={item.key}
                          placeholder={constants.blocked.includes(item.type) ? 'Temporarily Unavailable' : item.value}
                          type='text'
                          disabled={
                            !item.editable || constants.blocked.includes(item.type) || !managers.includes(String(_Wallet_))
                          }
                          style={{
                            background: !RSA || constants.blocked.includes(item.type) || !managers.includes(String(_Wallet_)) ? 'linear-gradient(90deg, rgba(100,0,0,0.5) 0%, rgba(100,25,25,0.5) 50%, rgba(100,0,0,0.5) 100%)' : 'linear-gradient(90deg, rgba(0,50,0,0.5) 0%, rgba(25,50,25,0.5) 50%, rgba(0,50,0,0.5) 100%)',
                            fontFamily: 'SF Mono',
                            fontWeight: '400',
                            fontSize: '14px',
                            width: '100%',
                            wordWrap: 'break-word',
                            textAlign: 'left',
                            marginTop: '-10px',
                            marginBottom: '-5px',
                            color: 'lightgreen',
                            cursor: 'copy'
                          }}
                        />
                      </div>
                      <hr style={{ marginTop: '5px' }}></hr>
                    </li>
                  ))}
                  <hr style={{ marginTop: '5px' }}></hr>
                  <div
                    className="flex-column"
                    style={{
                      marginBottom: '15px',
                      marginTop: '-15px'
                    }}
                  >
                    <StyledModalTitle>
                      <span
                        className="material-icons-round miui"
                        style={{
                          color: RSA ? 'lightgreen' : 'orange',
                          fontSize: '76px'
                        }}
                      >
                        security
                      </span>
                    </StyledModalTitle>
                    <span
                      style={{
                        color: 'cyan',
                        fontSize: '13px',
                        fontWeight: '700',
                        marginTop: '5px'
                      }}
                    >
                      {'Send Stealth Payment From'}
                    </span>
                    <div
                      style={{
                        marginBottom: '15px',
                        marginTop: '5px'
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
                    {!payeeAddr && (
                      <div
                        className='flex-column'
                        style={{
                          width: '100%',
                          marginLeft: '32px'
                        }}
                      >
                        <input
                          id={'decrypt'}
                          key={'decrypt'}
                          placeholder={'enter payee .eth'}
                          type='text'
                          disabled={!RSA}
                          style={{
                            background: !RSA ? 'linear-gradient(90deg, rgba(100,0,0,0.5) 0%, rgba(100,25,25,0.5) 50%, rgba(100,0,0,0.5) 100%)' : 'linear-gradient(90deg, rgba(0,50,0,0.5) 0%, rgba(25,50,25,0.5) 50%, rgba(0,50,0,0.5) 100%)',
                            outline: 'none',
                            border: 'none',
                            padding: '7px',
                            borderRadius: '3px',
                            fontFamily: 'SF Mono',
                            letterSpacing: '-0.5px',
                            fontWeight: '400',
                            fontSize: '15px',
                            width: '130%',
                            wordWrap: 'break-word',
                            textAlign: 'center',
                            color: payee ? 'lime' : 'white',
                            cursor: 'copy',
                            marginLeft: '-15%',
                            marginTop: '15px'
                          }}
                          onChange={(e) => {
                            setPayeeValue(e.target.value)
                          }}
                        />
                        <hr style={{ marginTop: '0', marginLeft: '-15%', width: '130%' }}></hr>
                      </div>
                    )}
                    {payeeAddr && (
                      <div
                        className='flex-column'
                      >
                        <div
                          className='flex-column'
                          style={{
                            width: '450px',
                            marginLeft: '3px'
                          }}
                        >
                          <input
                            id={'amount'}
                            key={'amount'}
                            type='text'
                            value={payeeAmount}
                            style={{
                              background: payeeAmount === '0.0' ? 'linear-gradient(90deg, rgba(100,0,0,0.5) 0%, rgba(100,25,25,0.5) 50%, rgba(100,0,0,0.5) 100%)' : 'linear-gradient(90deg, rgba(0,50,0,0.5) 0%, rgba(25,50,25,0.5) 50%, rgba(0,50,0,0.5) 100%)',
                              marginBottom: '10px',
                              outline: 'none',
                              padding: '7px',
                              borderRadius: '3px',
                              fontFamily: 'SF Mono',
                              letterSpacing: '-0.5px',
                              fontWeight: '400',
                              fontSize: '15px',
                              width: '90%',
                              paddingRight: '32px',
                              wordWrap: 'break-word',
                              textAlign: 'left',
                              color: payeeAmount === '0.0' ? 'grey' : 'lime',
                              cursor: 'copy'
                            }}
                          />
                          <hr style={{ marginTop: '-5px', marginLeft: '0', width: '90%' }}></hr>
                        </div>
                        <div
                          className='flex-row'
                          style={{
                            width: '200%'
                          }}
                        >
                          <div
                            className='flex-column'
                          >
                            <div
                              className='flex-row'
                              style={{
                                width: '450px',
                                marginLeft: '3px'
                              }}
                            >
                              <input
                                id={'pay'}
                                key={'pay'}
                                type='text'
                                value={payeeAddr}
                                style={{
                                  background: payeeAddr === constants.zeroAddress ? 'linear-gradient(90deg, rgba(100,0,0,0.5) 0%, rgba(100,25,25,0.5) 50%, rgba(100,0,0,0.5) 100%)' : 'linear-gradient(90deg, rgba(0,50,0,0.5) 0%, rgba(25,50,25,0.5) 50%, rgba(0,50,0,0.5) 100%)',
                                  outline: 'none',
                                  padding: '7px',
                                  borderRadius: '3px',
                                  fontFamily: 'SF Mono',
                                  letterSpacing: '-0.5px',
                                  fontWeight: '400',
                                  fontSize: '15px',
                                  width: '90%',
                                  paddingRight: '32px',
                                  wordWrap: 'break-word',
                                  textAlign: 'left',
                                  color: payeeAddr === constants.zeroAddress ? 'grey' : 'lime',
                                  cursor: 'copy'
                                }}
                              />
                              <button
                                className="button-empty"
                                onClick={() => {
                                  constants.copyToClipboard('pay')
                                }}
                                hidden={payeeAddr === constants.zeroAddress}
                                data-tooltip='Copy Address'
                                style={{
                                  marginLeft: '-25px',
                                  color: 'lime'
                                }}
                              >
                                <span
                                  className="material-icons-round"
                                  style={{
                                    fontSize: '22px',
                                    fontWeight: '700'
                                  }}
                                >
                                  content_copy
                                </span>
                              </button>
                            </div>
                            <hr style={{ marginTop: '5px', marginLeft: '0', width: '90%' }}></hr>
                          </div>
                        </div>
                      </div>
                    )}
                    <div>
                      <button
                        className="button"
                        style={{
                          height: '33px',
                          width: payeeAddr ? '80px' : '120px',
                          padding: '5px',
                          marginTop: '10px',
                          fontSize: '16px',
                          fontWeight: '700',
                          backgroundImage: payeeAddr && payeeAddr !== constants.zeroAddress ? 'linear-gradient(81deg, rgba(0,154,0,1) 0%, rgba(0,182,24,1) 52%, rgba(0,154,0,1) 100%)' : 'linear-gradient(112deg, rgba(190,95,65,1) 0%, rgba(191,41,36,1) 48%, rgba(203,111,0,1) 100%)'
                        }}
                        onClick={() => payeeAddr && payeeAddr !== constants.zeroAddress ? sendTransaction?.() : decrypt()}
                        disabled={!payee || payeeAddr === constants.zeroAddress}
                        hidden={!RSA}
                        data-tooltip={payeeAddr && payeeAddr !== constants.zeroAddress ? 'Send Transaction' : 'Fetch and Decrypt'}
                      >
                        <div
                          className="flex-row"
                          style={{
                            fontSize: '14px'
                          }}
                        >
                          {payeeAddr ? 'Pay' : 'Decrypt'}&nbsp;<span className="material-icons-round smoller">lock_open</span>
                        </div>
                      </button>
                      <button
                        className="button"
                        style={{
                          height: '33px',
                          width: '110px',
                          padding: '5px',
                          marginTop: '20px',
                          fontSize: '16px',
                          fontWeight: '700',
                          marginLeft: '20px',
                          background: 'red'
                        }}
                        onClick={() => setPayeeAddr('')}
                        disabled={!payee}
                        hidden={payeeAddr ? false : true}
                        data-tooltip='Cancel Transaction'
                      >
                        <div
                          className="flex-row"
                          style={{
                            fontSize: '14px'
                          }}
                        >
                          {'Cancel'}&nbsp;<span className="material-icons-round smoller">cancel</span>
                        </div>
                      </button>
                    </div>
                  </div>
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
                      (newValues === constants.EMPTY_STRING_STEALTH())
                    }
                    style={{
                      alignSelf: 'flex-end',
                      height: '25px',
                      width: 'auto',
                      marginTop: '-3px',
                    }}
                    onClick={() => {
                      setSaltModal(true)
                      setWrite(true)
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
          <PayTo
            handleTrigger={handlePayToTrigger}
            handleModalData={handlePayToModalData}
            onClose={() => {
              setPayToModal(false)
            }}
            show={payToModal}
          >
            {''}
          </PayTo>
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
  position: fixed;
  top: 60px; 
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
  top: -60px;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 1);
`

export default Stealth
