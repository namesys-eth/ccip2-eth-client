/// My Names page 
import React from 'react'
import Head from 'next/head'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import type { NextPage } from 'next'
import {
  useAccount,
  useContractRead,
  useNetwork,
  useSignMessage,
  useContractWrite,
  useWaitForTransaction
} from 'wagmi'
import { ethers } from 'ethers'
import { isMobile } from 'react-device-detect'
import { verifyMessage } from 'ethers/lib/utils'
import Help from '../components/Help'
import Terms from '../components/Terms'
import Preview from '../components/Preview'
import Stealth from '../components/Stealth'
import Faq from '../components/FAQ'
import Salt from '../components/Salt'
import Error from '../components/Error'
import Gateway from '../components/Gateway'
import List from '../components/List'
import Ticker from '../components/Ticker'
import Loading from '../components/LoadingColors'
import SearchBox from '../components/SearchBox'
import Confirm from '../components/Confirm'
import Export from '../components/Export'
import * as constants from '../utils/constants'
import * as verifier from '../utils/verifier'
import { KEYGEN } from '../utils/keygen'
import * as Name from 'w3name'
import * as ed25519_2 from 'ed25519-2.0.0' // @noble/ed25519 v2.0.0
import * as ensContent from '../utils/contenthash'

const Account: NextPage = () => {
  const { chain: activeChain } = useNetwork() // Wagmi useNetwork()
  const { address: _Wallet_, isConnected: isConnected, isDisconnected: isDisconnected } = useAccount() // Wagmi connector hook
  const [meta, setMeta] = React.useState<any[]>([])  // Stores all names and their states
  const [faqModal, setFaqModal] = React.useState(false) // Controls FAQ modal
  const [helpModal, setHelpModal] = React.useState(false) // Controls Help modal 
  const [termsModal, setTermsModal] = React.useState(false) // Controls Terms modal
  const [errorModal, setErrorModal] = React.useState(false) // Controls Error modal
  const [errorMessage, setErrorMessage] = React.useState('') // Sets Error message
  const [previewModal, setPreviewModal] = React.useState(false) // Controls Preview modal
  const [stealthModal, setStealthModal] = React.useState(false) // Controls Stealth modal
  const [nameToPreview, setNameToPreview] = React.useState('') // Sets name to expand in preview
  const [nameToStealth, setNameToStealth] = React.useState('') // Sets name to expand in stealth
  const [loading, setLoading] = React.useState(true) // Tracks if a process is occuring
  const [empty, setEmpty] = React.useState(false) // Tracks if wallet has no NFTs
  const [success, setSuccess] = React.useState(false) // Tracks success of process(es)
  const [activeTab, setActiveTab] = React.useState('OWNER') // Set active tab
  const [tokenIDLegacy, setTokenIDLegacy] = React.useState('') // Set Token ID of unwrapped/legacy name
  const [namehashLegacy, setNamehashLegacy] = React.useState(''); // Legacy Namehash of ENS Domain
  const [tokenIDWrapper, setTokenIDWrapper] = React.useState('') // Set Token ID of wrapped name
  const [manager, setManager] = React.useState('') // Set manager of name
  const [query, setQuery] = React.useState('') // Store name in query
  const [savings, setSavings] = React.useState('') // Save gas savings
  const [icon, setIcon] = React.useState('') // Set Icon inside help modal
  const [color, setColor] = React.useState('cyan') // Set Color of help modal
  const [getting, setGetting] = React.useState(0) // Count in process
  const [sigCount, setSigCount] = React.useState(-1) // Signature count
  const [length, setLength] = React.useState(0) // Stores number of ENS names for an address
  const [help, setHelp] = React.useState('') // Set Help modal
  const [sigIPNS, setSigIPNS] = React.useState('') // IPNS Signature for local storage
  const [sigSigner, setSigSigner] = React.useState('') // Signer Signature for local storage
  const [recentCrash, setRecentCrash] = React.useState(false) // Crash state
  const [isSearch, setIsSearch] = React.useState(false) // Store if search is in progress
  const [keygen, setKeygen] = React.useState(false); // IPNS keygen trigger following signature
  const [inProcess, setInProcess] = React.useState(ethers.utils.namehash('0.eth')) // Stores name under process
  const [progress, setProgress] = React.useState(0) // Stores progress
  const [cache, setCache] = React.useState<any[]>([]) // Preserves cache of metadata across tabs
  const [flash, setFlash] = React.useState<any[]>([]) // Saves metadata in temporary flash memory
  const [response, setResponse] = React.useState(false) // Tracks response of search query
  const [finish, setFinish] = React.useState(false) // Tracks NFT query processing
  const [crash, setCrash] = React.useState(false) // Tracks transactions failures
  const [message, setMessage] = React.useState('Loading Names') // Sets message while processing
  const [recordhash, setRecordhash] = React.useState('') // Recordhash
  const [ownerhash, setOwnerhash] = React.useState('') // Ownerhash
  const [keypairIPNS, setKeypairIPNS] = React.useState<string[]>(['', '']) // Exported IPNS keypairs [ed25519-priv,ed25519-pub]
  const [keypairSigner, setKeypairSigner] = React.useState<string[]>(['', '']) // Exported Signer keypairs [secp256k1-priv, secp256k1-pub]
  const [keyIPNS, setKeyIPNS] = React.useState('') // IPNS Encoded Key: '08011240' + privKey + pubKey
  const [saltModal, setSaltModal] = React.useState(false) // Trigger signature for key export
  const [exportKey, setExportKey] = React.useState(false) // Trigger export procedure
  const [username, setUsername] = React.useState('') // Username for salt modal
  const [CID, setCID] = React.useState(''); // IPNS pubkey/CID value
  const [choice, setChoice] = React.useState(''); // Records active process
  const [confirm, setConfirm] = React.useState(false); // Confirmation modal
  const [gateway, setGateway] = React.useState(false); // Gateway URL for storage
  const [previewModalState, setPreviewModalState] = React.useState<constants.CustomBodyState>({
    modalData: '',
    trigger: false
  }) // Preview modal state
  const [stealthModalState, setStealthModalState] = React.useState<constants.CustomBodyState>({
    modalData: '',
    trigger: false
  }) // Stealth modal state
  const [saltModalState, setSaltModalState] = React.useState<constants.MainBodyState>({
    modalData: undefined,
    trigger: false
  }) // Salt modal state
  const [confirmModalState, setConfirmModalState] = React.useState<constants.MainBodyState>({
    modalData: undefined,
    trigger: false
  }) // Confirm modal state
  const [exportModalState, setExportModalState] = React.useState<constants.MainBodyState>({
    modalData: undefined,
    trigger: false
  }) // Export modal state
  const [gatewayModalState, setGatewayModalState] = React.useState<constants.MainBodyState>({
    modalData: undefined,
    trigger: false
  }) // Gateway modal state
  const recoveredAddress = React.useRef<string>()
  const _Chain_ = activeChain && (activeChain.name.toLowerCase() === 'mainnet' || activeChain.name.toLowerCase() === 'ethereum') ? '1' : '5'
  const ccip2Contract = constants.ccip2[_Chain_ === '1' ? 1 : 0]
  const ccip2Config = constants.ccip2Config[_Chain_ === '1' ? 1 : 0]
  const PORT = process.env.NEXT_PUBLIC_PORT
  const SERVER = process.env.NEXT_PUBLIC_SERVER

  // Handle Salt modal data return
  const handleSaltModalData = (data: string | undefined) => {
    setSaltModalState(prevState => ({ ...prevState, modalData: data }))
  }
  // Handle Salt modal trigger
  const handleSaltTrigger = (trigger: boolean) => {
    setSaltModalState(prevState => ({ ...prevState, trigger: trigger }))
  }

  // Handle Preview modal data return
  const handlePreviewModalData = (data: string) => {
    setPreviewModalState(prevState => ({ ...prevState, modalData: data }))
  }
  // Handle Preview modal trigger return
  const handlePreviewTrigger = (trigger: boolean) => {
    setPreviewModalState(prevState => ({ ...prevState, trigger: trigger }))
  }

  // Handle Stealth modal data return
  const handleStealthModalData = (data: string) => {
    setStealthModalState(prevState => ({ ...prevState, modalData: data }))
  }
  // Handle Stealth modal trigger return
  const handleStealthTrigger = (trigger: boolean) => {
    setStealthModalState(prevState => ({ ...prevState, trigger: trigger }))
  }

  // Handle Confirm modal data return
  const handleConfirmModalData = (data: string | undefined) => {
    setConfirmModalState(prevState => ({ ...prevState, modalData: data }))
  }
  // Handle Confirm modal trigger
  const handleConfirmTrigger = (trigger: boolean) => {
    setConfirmModalState(prevState => ({ ...prevState, trigger: trigger }))
  }

  // Handle Confirm modal data return
  const handleExportModalData = (data: string | undefined) => {
    setExportModalState(prevState => ({ ...prevState, modalData: data }))
  }
  // Handle Confirm modal trigger
  const handleExportTrigger = (trigger: boolean) => {
    setExportModalState(prevState => ({ ...prevState, trigger: trigger }))
  }

  // Handle Gateway modal data return
  const handleGatewayModalData = (data: string | undefined) => {
    setGatewayModalState(prevState => ({ ...prevState, modalData: data }))
  }
  // Handle Gateway modal trigger
  const handleGatewayTrigger = (trigger: boolean) => {
    setGatewayModalState(prevState => ({ ...prevState, trigger: trigger }))
  }

  // Signature S_IPNS statement; S_IPNS(K_WALLET) [IPNS Keygen]
  // S_IPNS is not recovered on-chain; no need for buffer prepend and hashing of message required to sign
  function statementIPNSKey(source: string, caip10: string, extradata: string) {
    let _toSign = `Requesting Signature To Generate IPNS Key\n\nOrigin: ${source}\nKey Type: ed25519\nExtradata: ${extradata}\nSigned By: ${caip10}`
    let _digest = _toSign
    return _digest
  }
  // Signature S_SIGNER statement; S_SIGNER(K_WALLET) [Signer Keygen]
  // S_SIGNER is not recovered on-chain; no need for buffer prepend and hashing of message required to sign
  function statementSignerKey(source: string, caip10: string, extradata: string) {
    let _toSign = `Requesting Signature To Generate ENS Records Signer\n\nOrigin: ${source}\nKey Type: secp256k1\nExtradata: ${extradata}\nSigned By: ${caip10}`
    let _digest = _toSign
    return _digest
  }

  // Function for writing IPNS Revision metadata to NameSys backend; needed for updates
  async function writeRevision(revision: Name.Revision | undefined, gas: {}, timestamp: string, _ipfs: string) {
    const request = {
      ens: '',
      controller: _Wallet_,
      manager: '',
      managerSignature: '',
      revision: JSON.stringify({}),
      chain: _Chain_,
      ipns: CID,
      ipfs: _ipfs,
      gas: JSON.stringify(gas),
      version: JSON.stringify({}),
      timestamp: timestamp,
      hashType: 'ownerhash'
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
      setMessage('Storage Purge Failed')
      setCrash(true)
      setLoading(false)
      setColor('orangered')
    }
  }

  // Crash Handler
  function doCrash() {
    setCrash(true)
    setSigCount(0)
    setSigIPNS('')
    setSigSigner('')
    setKeypairIPNS([])
    setKeypairSigner([])
    setKeyIPNS('')
    setSaltModal(false)
    setCID('')
    setLoading(false)
  }

  function handleMeta(_success: boolean, _set: boolean, _flash: typeof meta, _CID: string) {
    if (_success && _set) {
      let _LIST = _flash
      for (var i = 0; i < _flash.length; i++) {
        if (_flash[i].migrated === '1/2') {
          _LIST[i].migrated = _CID.startsWith('https://') ? '4/5' : '3/4'
        }
      }
      setMeta(_LIST)
      setFlash(_LIST)
      setCache(_LIST)
      setOwnerhash(_CID.startsWith('k') ? `ipns://${_CID}` : _CID)
      setMessage('Transaction Confirmed')
      setTimeout(() => {
        setLoading(false)
      }, 2000)
    }
    setSaltModalState({
      modalData: undefined,
      trigger: false
    })
    setExportModalState({
      modalData: undefined,
      trigger: false
    })
    setKeypairIPNS([])
    setKeypairSigner([])
    setKeyIPNS('')
  }

  const {
    data: _Signature_,
    error: signError,
    isLoading: signLoading,
    signMessage
  } = useSignMessage({
    onSuccess(data, variables) {
      const address = verifyMessage(variables.message, data)
      recoveredAddress.current = address
    },
  })  // Wagmi Signature hook

  /// ENS Domain Config
  // Read ENS Legacy Registrar for Owner record of ENS domain via namehash
  const { data: _OwnerLegacy_, isLoading: legacyOwnerLoading, isError: legacyOwnerError } = useContractRead({
    address: `0x${constants.ensConfig[1].addressOrName.slice(2)}`,
    abi: constants.ensConfig[1].contractInterface,
    functionName: 'ownerOf',
    args: [tokenIDLegacy]
  })

  // Read ENS Wrapper for Owner record of ENS domain
  const { data: _OwnerWrapped_, isLoading: wrapperOwnerLoading, isError: wrapperOwnerError } = useContractRead({
    address: `0x${constants.ensConfig[_Chain_ === '1' ? 7 : 3].addressOrName.slice(2)}`,
    abi: constants.ensConfig[_Chain_ === '1' ? 7 : 3].contractInterface,
    functionName: 'ownerOf',
    args: [tokenIDWrapper]
  })

  // Read Legacy ENS Registry for ENS domain Manager
  const { data: _ManagerLegacy_, isLoading: legacyManagerLoading, isError: legacyManagerError } = useContractRead({
    address: `0x${constants.ensConfig[0].addressOrName.slice(2)}`,
    abi: constants.ensConfig[0].contractInterface,
    functionName: 'owner',
    args: [namehashLegacy]
  })

  // Read Recordhash from CCIP2 Resolver
  const { data: _Recordhash_ } = useContractRead({
    address: `0x${ccip2Config.addressOrName.slice(2)}`,
    abi: ccip2Config.contractInterface,
    functionName: 'getRecordhash',
    args: [ethers.utils.namehash(query)]
  })

  // Read Ownerhash from CCIP2 Resolver
  const { data: _Ownerhash_ } = useContractRead({
    address: `0x${ccip2Config.addressOrName.slice(2)}`,
    abi: ccip2Config.contractInterface,
    functionName: 'getRecordhash',
    args: [ethers.utils.hexZeroPad(_Wallet_ || constants.zeroAddress, 32).toLowerCase()]
  })

  // Sets Ownerhash in CCIP2 Resolver
  const {
    data: response1of2,
    write: initOwnerhash,
    isLoading: isSetOwnerhashLoading,
    isSuccess: isSetOwnerhashSuccess,
    isError: isSetOwnerhashError
  } = useContractWrite({
    address: `0x${ccip2Config.addressOrName.slice(2)}`,
    abi: ccip2Config.contractInterface,
    functionName: 'setShortOwnerhash',
    args: [
      ethers.utils.defaultAbiCoder.encode(
        ['bytes32'],
        [CID.startsWith('k') ? `0x${constants.encodeContenthash(CID).split(constants.prefix)[1]}` : constants.zeroBytes]
      )
    ]
  })

  // Sets Gateway as Ownerhash in CCIP2 Resolver
  const {
    data: response2of2,
    write: initGateway,
    isLoading: isSetGatewayLoading,
    isSuccess: isSetGatewaySuccess,
    isError: isSetGatewayError
  } = useContractWrite({
    address: `0x${ccip2Config.addressOrName.slice(2)}`,
    abi: ccip2Config.contractInterface,
    functionName: 'setOwnerhash',
    args: [
      CID ? ethers.utils.hexlify(ethers.utils.toUtf8Bytes(CID)) : constants.zeroBytes
    ]
  })

  // Get historical gas savings
  async function getSavings() {
    const request = {
      type: 'gas'
    }
    try {
      const _RESPONSE = await fetch(
        "https://ipfs.namesys.xyz:3003/gas",
        {
          method: "post",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(request)
        }
      )
      const data = await _RESPONSE.json()
      return data.response.gas
    } catch (error) {
      console.error('Error:', 'Failed to get gas data from CCIP2 backend')
      return ''
    }
  }

  // Load historical gas savings on pageload
  React.useEffect(() => {
    constants.showOverlay(5)
    const getSaving = async () => {
      const _savings = await getSavings()
      setSavings(_savings)
    }
    getSaving()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Handle migration from Preview modal
  React.useEffect(() => {
    if (previewModalState.trigger && previewModalState.modalData) { // Trigger update when one of the names is migrated
      let _LIST = meta
      const index = _LIST.findIndex(item => `${item.name}.eth` === previewModalState.modalData.slice(0, -1))
      const _update = async () => {
        if (previewModalState.modalData) {
          const _Resolver = await constants.provider.getResolver(previewModalState.modalData.slice(0, -1)) // Get updated Resolver
          const __Recordhash = await verifier.verifyRecordhash(previewModalState.modalData.slice(0, -1), ccip2Config, _Wallet_ || constants.zeroAddress) // Get updated Recordhash
          const __Ownerhash = await verifier.verifyOwnerhash(ccip2Config, _Wallet_ || constants.zeroAddress) // Get updated Ownerhash
          _LIST[index].migrated = _Resolver?.address === ccip2Contract && __Recordhash !== '0' ? (__Recordhash === '1' ? '1' : '4/5') : (
            _Resolver?.address === ccip2Contract && __Ownerhash !== '0' ? (__Ownerhash === '1' ? '3/4' : '4/5') : (
              _Resolver?.address === ccip2Contract ? '1/2' : '0') // Set new flag
          )
        }
      }
      _update()
      setMeta(_LIST)
      setFlash(_LIST)
      setCache(_LIST)
      setPreviewModal(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previewModalState])

  // Preview modal state
  React.useEffect(() => {
    if (previewModalState.trigger && previewModalState.modalData && !previewModal) {
      if (previewModalState.modalData.charAt(previewModalState.modalData.length - 1) === '#') {
        setNameToPreview(`${previewModalState.modalData.slice(0, -1)}#`)
      } else if (previewModalState.modalData.charAt(previewModalState.modalData.length - 1) === '-') {
        setNameToPreview(`${previewModalState.modalData.slice(0, -1)}-`)
      } else if (previewModalState.modalData.charAt(previewModalState.modalData.length - 1) === '&') {
        setNameToPreview(`${previewModalState.modalData.slice(0, -1)}&`)
      } else if (previewModalState.modalData.charAt(previewModalState.modalData.length - 1) === '+') {
        setNameToPreview(`${previewModalState.modalData.slice(0, -1)}+`)
      }
      setPreviewModalState({
        modalData: '',
        trigger: false
      })
    }
  }, [previewModal, previewModalState])

  // Stealth modal state
  React.useEffect(() => {
    if (stealthModalState.trigger && stealthModalState.modalData && !stealthModal) {
      setNameToStealth('')
      setStealthModalState({
        modalData: '',
        trigger: false
      })
    }
  }, [stealthModal, stealthModalState])

  // Trigger Preview modal
  React.useEffect(() => {
    if (nameToPreview.endsWith(':') || nameToPreview.endsWith('#') || nameToPreview.endsWith('-') || nameToPreview.endsWith('&')) {
      setPreviewModal(true)
    } else {
      setPreviewModal(false)
    }
  }, [nameToPreview])

  // Trigger Stealth modal
  React.useEffect(() => {
    if (nameToStealth.endsWith('.eth')) {
      setStealthModal(true)
    } else {
      setStealthModal(false)
    }
  }, [nameToStealth])

  // Triggers S_IPNS(K_WALLET) after password is set
  React.useEffect(() => {
    if (saltModalState.trigger && !keypairIPNS[0] && !keypairIPNS[1] && !choice.endsWith('_IPNS') && exportModalState.modalData !== '2') {
      if (choice === 'export') {
        setChoice('export_IPNS')
      } else if (choice === 'ownerhash') {
        setChoice('ownerhash_IPNS')
      }
      let _origin = 'eth:' + _Wallet_
      let _caip10 = `eip155:${_Chain_}:${_Wallet_}`  // CAIP-10
      setSigCount(1)
      signMessage({
        message: statementIPNSKey(
          _origin,
          _caip10,
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
    } else if (exportModalState.modalData === '2' && saltModalState.trigger && !keypairIPNS[0] && !keypairIPNS[1] && !choice.endsWith('_IPNS')) {
      setKeypairIPNS(['0x', '0x'])
      setChoice('export_HTTP')
      setKeygen(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saltModalState, keypairIPNS, choice, exportModalState])
  React.useEffect(() => {
    if (saltModalState.trigger && !keypairIPNS[0] && !keypairIPNS[1] && sigIPNS && keygen) {
      const keygen = async () => {
        let _origin = 'eth:' + _Wallet_
        let _caip10 = `eip155:${_Chain_}:${_Wallet_}`  // CAIP-10
        const __keypair = await KEYGEN(_origin, _caip10, sigIPNS, saltModalState.modalData)
        setKeypairIPNS(__keypair[0])
        setKeyIPNS(`08011240${__keypair[1]}${__keypair[0]}`)
      }
      keygen()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keygen, sigIPNS, keypairIPNS, saltModalState])

  // Triggers S_SIGNER(K_WALLET) after password is set
  React.useEffect(() => {
    if (saltModalState.trigger && saltModalState.modalData !== undefined && !keypairSigner[0] && !keypairSigner[1] && keypairIPNS[0] && keypairIPNS[1] && !choice.endsWith('_Signer')) {
      if (['export_IPNS', 'export_HTTP'].includes(choice) && exportModalState.modalData) {
        setChoice('export_Signer')
        let _origin = 'eth:' + _Wallet_
        let _caip10 = `eip155:${_Chain_}:${_Wallet_}`  // CAIP-10
        if (choice === 'export_HTTP') {
          setSigCount(1)
        } else {
          setSigCount(2)
        }
        signMessage({
          message: statementSignerKey(
            ['1', '2'].includes(exportModalState.modalData) ? saltModalState.modalData.split(':')[0] : _origin,
            _caip10,
            ethers.utils.keccak256(ethers.utils.solidityPack(
              ['bytes32', 'address'],
              [
                ethers.utils.keccak256(ethers.utils.solidityPack(['string'], [saltModalState.modalData])),
                _Wallet_
              ]
            ))
          )
        })
      } else if (!keypairSigner[0] && !keypairSigner[1] && choice === 'ownerhash_IPNS') {
        setChoice('ownerhash_Signer')
        setKeypairSigner(['0x', '0x'])
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saltModalState, keypairSigner, keypairIPNS, choice, exportModalState])
  React.useEffect(() => {
    if (saltModalState.trigger && !keypairSigner[0] && !keypairSigner[1] && sigSigner && keypairIPNS[0] && keypairIPNS[1]) {
      const keygen = async () => {
        let _origin = 'eth:' + _Wallet_
        let _caip10 = `eip155:${_Chain_}:${_Wallet_}`  // CAIP-10

        if (choice === 'export_Signer') {
          // Sign S2 if export is requested
          const __keypair = await KEYGEN(_origin, _caip10, sigSigner, saltModalState.modalData)
          setKeypairSigner(__keypair[1])
        } else if (choice.startsWith('ownerhash')) {
          // Don't sign S2
          setKeypairSigner(['0x', '0x'])
        }
      }
      keygen()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keypairIPNS, sigSigner, keypairSigner, choice, saltModalState])

  // Trigger end of export
  React.useEffect(() => {
    if (keypairSigner[0] && keypairSigner[1] && keypairIPNS[0] && keypairIPNS[1]) {
      if (choice.startsWith('export')) {
        setLoading(false)
        setSaltModalState({
          modalData: undefined,
          trigger: false
        })
        setExportModalState({
          modalData: undefined,
          trigger: false
        })
        setSigCount(0)
        setSigIPNS('')
        setSigSigner('')
        setSaltModal(false)
      } else if (choice.startsWith('ownerhash')) {
        // Triggers setting Ownerhash
        setSigCount(0)
        if (CID.startsWith('k5')) {
          initOwnerhash()
        } else if (CID.startsWith('https://')) {
          initGateway()
        }
        setMessage('Waiting For Transaction')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keypairSigner, keypairIPNS, CID, choice])

  // Triggers IPNS CID derivation with new S_IPNS(K_WALLET)
  React.useEffect(() => {
    if (keypairIPNS[0] && keypairIPNS[1] && choice.startsWith('ownerhash') && !choice.endsWith('HTTP')) {
      const CIDGen = async () => {
        let key = constants.formatkey([keypairIPNS[0], keypairIPNS[1]])
        const w3name = await Name.from(ed25519_2.etc.hexToBytes(key))
        const CID_IPNS = String(w3name)
        setCID(CID_IPNS)
      }
      CIDGen()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keypairIPNS])

  // Handle wallet change by the user
  React.useEffect(() => {
    if (!finish && !success && inProcess && activeTab === 'OWNER') { // Prohibit wallet change when names are loading
      setMessage('Loading Names')
    } else if (!finish && !success && !inProcess) { // Print message on load
      setMessage('Failed to Fetch')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_Wallet_, finish, success, activeTab])

  // Get all tokens for connected wallet
  React.useEffect(() => {
    if (!finish && !success && length === 0 && _Wallet_ && activeTab === 'OWNER') {
      setLoading(true); // Show loading state when calling logTokens
      // Call logTokens directly here
      const loadTokens = async () => {
        const nfts = await constants.alchemy.nft.getNftsForOwner(_Wallet_)
        const allTokens = nfts.ownedNfts
        var allEns: string[] = []
        var items: any[] = []
        var count = 0
        var _Cache: string[] = []
        for (var i = 0; i < allTokens.length; i++) {
          if (constants.ensContracts.includes(allTokens[i].contract.address) && allTokens[i].title) {
            _Cache.push(allTokens[i].title)
          }
        }
        setLength(_Cache.length)
        if (_Cache.length === 0) {
          setEmpty(true)
          setLoading(false)
        } else {
          const contract = new ethers.Contract(ccip2Config.addressOrName, ccip2Config.contractInterface, constants.provider)
          const contractLegacy = new ethers.Contract(constants.ensConfig[0].addressOrName, constants.ensConfig[0].contractInterface, constants.provider)
          const _Ownerhash_ = await contract.getRecordhash(ethers.utils.hexZeroPad(_Wallet_ || constants.zeroAddress, 32).toLowerCase())
          let _Recordhash_: any
          let __Recordhash: boolean = false
          let __Ownerhash: boolean = false
          for (var i = 0; i < allTokens.length; i++) {
            if (constants.ensContracts.includes(allTokens[i].contract.address) && allTokens[i].title) {
              const _ManagerLegacy = await contractLegacy.owner(ethers.utils.namehash(allTokens[i].title))
              if (_ManagerLegacy === _Wallet_) {
                count = count + 1
                setGetting(count)
                allEns.push(allTokens[i].title.split('.eth')[0])
                const _Resolver = await constants.provider.getResolver(allTokens[i].title)
                items.push({
                  'key': count,
                  'name': allTokens[i].title.split('.eth')[0],
                  'migrated': _Resolver?.address === ccip2Contract ? '1/2' : '0'
                })
                setInProcess(allTokens[i].title)
                _Recordhash_ = await contract.getRecordhash(ethers.utils.namehash(allTokens[i].title))
                if (_Recordhash_ && _Recordhash_ !== '0x' && (_Recordhash_ === _Ownerhash_)) {
                  __Recordhash = false
                  if (_Ownerhash_ && _Ownerhash_ !== '0x') {
                    __Ownerhash = true
                  }
                } else if (_Recordhash_ && _Recordhash_ !== '0x' && (_Recordhash_ !== _Ownerhash_)) {
                  __Recordhash = true
                }
                items[count - 1].migrated = __Recordhash && items[count - 1].migrated === '1/2' ? (_Recordhash_.startsWith('0x6874') ? '4/5' : '1') : (
                  __Ownerhash && items[count - 1].migrated === '1/2' ? (_Ownerhash_.startsWith('0x6874') ? '4/5' : '3/4') : (
                    items[count - 1].migrated === '1/2' ? items[count - 1].migrated : '0'
                  )
                )
              }
            }
            if (i === allTokens.length - 1) {
              setFinish(true) // Flag finish of process
              setLength(0)
              setProgress(0)
              setMessage('Showing Names')
              setMeta(items)
              setFlash(items)
              setLoading(false)
              setSuccess(true)
            }
            __Recordhash = false
            __Ownerhash = false
            _Recordhash_ = undefined
          }
        }
      }
      loadTokens()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_Wallet_, finish, length, activeTab])

  // Preserve metadata across tabs
  React.useEffect(() => {
    const handleBeforeUnload = () => {
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meta])

  // Open Preview modal for chosen ENS domain
  const onItemClickPreview = (name: string) => {
    setNameToPreview(`${name}:`)
  }

  // Open Stealth modal for chosen ENS domain
  const onItemClickStealth = (name: string) => {
    setNameToStealth(`${name}`)
  }

  React.useEffect(() => {
    if (getting > progress && getting > 0) {
      setProgress(getting)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getting])

  React.useEffect(() => {
    if ((_OwnerWrapped_ && _ManagerLegacy_)
      && String(_ManagerLegacy_) !== constants.zeroAddress) {
      if (String(_ManagerLegacy_) === constants.ensContracts[_Chain_ === '1' ? 7 : 3]) {
        if (_OwnerWrapped_ && String(_OwnerWrapped_) !== constants.zeroAddress) {
          setManager(String(_OwnerWrapped_))
        }
      } else {
        setManager(String(_ManagerLegacy_))
      }
    }
    if (activeTab !== 'OWNER') {
      setTimeout(() => {
        setLoading(false)
        setResponse(false)
      }, 2000)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenIDLegacy, tokenIDWrapper, _OwnerLegacy_, activeTab, _OwnerWrapped_, wrapperOwnerError, _ManagerLegacy_])

  // Set signature
  React.useEffect(() => {
    if (_Signature_ && choice === 'ownerhash_IPNS') {
      setSigIPNS(_Signature_)
    } else if (_Signature_ && choice === 'ownerhash_Signer') {
      setSigSigner(_Signature_)
    } else if (_Signature_ && choice === 'export_IPNS') {
      setSigIPNS(_Signature_)
    } else if (_Signature_ && choice === 'export_Signer') {
      setSigSigner(_Signature_)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_Signature_, choice])

  // Handle search for a name
  React.useEffect(() => {
    if (manager && manager === _Wallet_ && query.length > 0) {
      setResponse(true)
      var allEns: string[] = []
      var items: any[] = []
      allEns.push(query.split('.eth')[0])
      const setMetadata = async () => {
        constants.provider.getResolver(query)
          .then((_RESPONSE) => {
            items.push({
              'key': 1,
              'name': query.split('.eth')[0],
              'migrated': _RESPONSE?.address === ccip2Contract ? '1/2' : '0'
            })
            if (items.length > 0) {
              if (recordhash && String(recordhash) !== '0x' && (String(recordhash) !== String(ownerhash)) && items[0].migrated === '1/2') {
                items[0].migrated = '1'
              } else if (ownerhash && String(ownerhash) !== '0x' && items[0].migrated === '1/2') {
                items[0].migrated = '3/4'
              }
              setCache(flash)
              setMeta(items)
              setSuccess(true)
              setTimeout(() => {
                setLoading(false)
              }, 1000)
            }
          })
      }
      setMetadata()
    } else if (manager && manager !== _Wallet_ && query.length > 0) {
      setLoading(false)
      setSuccess(false)
      setEmpty(true)
      setErrorMessage('You do not have Manager permission')
      setErrorModal(true)
    } else if (manager && manager === constants.zeroAddress && query.length > 0 && !legacyManagerLoading) {
      setLoading(false)
      setSuccess(false)
      setEmpty(true)
      setErrorMessage('Name not Registered or Expired')
      setErrorModal(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manager, _Wallet_, query, recordhash, ownerhash, flash, legacyManagerLoading, legacyManagerError])

  // Sets Option between IPNS Ownerhash and HTTP Gateway
  React.useEffect(() => {
    if (confirmModalState.trigger && confirmModalState.modalData) {
      setConfirm(false)
      if (confirmModalState.modalData === '0') {
        setUsername(`eth:${_Wallet_}`)
        setSaltModal(true)
      } else if (confirmModalState.modalData === '1') {
        setGateway(true)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [confirmModalState])

  // Triggers Gateway routine
  React.useEffect(() => {
    if (gatewayModalState.trigger && gatewayModalState.modalData !== undefined) {
      setCID(gatewayModalState.modalData)
      setChoice('ownerhash_HTTP')
      setKeypairIPNS(['0x', '0x'])
      setKeypairSigner(['0x', '0x'])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gatewayModalState])

  // Sets option between Ownerhash and Recordhash
  React.useEffect(() => {
    if (exportModalState.trigger && exportModalState.modalData) {
      setExportKey(false)
      if (exportModalState.modalData === '0') {
        setUsername(`eth:${_Wallet_}`)
        setSaltModal(true)
      } else if (['1', '2'].includes(exportModalState.modalData)) {
        setUsername('')
        setSaltModal(true)
      } else {
        setUsername('0')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exportModalState])

  // Capture Recordhash hook
  React.useEffect(() => {
    if (_Recordhash_ && String(_Recordhash_) !== '0x') {
      let _String: string = ''
      if (String(_Recordhash_).startsWith(constants.prefix)) {
        _String = `ipns://${ensContent.decodeContenthash(String(_Recordhash_)).decoded}`
      } else {
        _String = ethers.utils.toUtf8String(String(_Recordhash_))
      }
      if (_String.startsWith('https://')) {
        setRecordhash(`${_String}`)
      } else {
        setRecordhash(`${_String}`)
      }
    }
  }, [_Recordhash_])

  // Capture Ownerhash hook
  React.useEffect(() => {
    if (_Ownerhash_ && String(_Ownerhash_) !== '0x') {
      let _String: string = ''
      if (String(_Ownerhash_).startsWith(constants.prefix)) {
        _String = `ipns://${ensContent.decodeContenthash(String(_Ownerhash_)).decoded}`
      } else {
        _String = ethers.utils.toUtf8String(String(_Ownerhash_))
      }
      if (_String.startsWith('https://')) {
        setOwnerhash(`${_String}`)
      } else {
        setOwnerhash(`${_String}`)
      }
    }
  }, [_Ownerhash_])

  // Format query to ENS name and get tokenID
  React.useEffect(() => {
    if (query) {
      let _namehash = ethers.utils.namehash(query)
      let _token = ethers.BigNumber.from(_namehash)
      let _labelhash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(query.split('.eth')[0]))
      setNamehashLegacy(_namehash)
      setTokenIDWrapper(String(_token))
      setTokenIDLegacy(String(ethers.BigNumber.from(_labelhash)))
    }
  }, [query])

  // Handle Query
  const handleNameSearch = (query: string) => {
    setMeta([])
    setLoading(true)
    setIsSearch(true)
    setInProcess(query)
    setQuery(query)
    setEmpty(false)
  }

  // Wagmi hooks for transaction status
  const { isSuccess: txSuccess1of2, isError: txError1of2, isLoading: txLoading1of2 } = useWaitForTransaction({
    hash: response1of2?.hash,
  })
  const { isSuccess: txSuccess2of2, isError: txError2of2, isLoading: txLoading2of2 } = useWaitForTransaction({
    hash: response2of2?.hash,
  })

  // Handles setting Ownerhash after Transaction
  React.useEffect(() => {
    if (txSuccess1of2 && isSetOwnerhashSuccess) {
      const purge = async () => {
        await writeRevision(undefined, {}, '', '')
      }
      purge()
    }
    handleMeta(txSuccess1of2, isSetOwnerhashSuccess, flash, CID)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [txSuccess1of2, isSetOwnerhashSuccess, flash, CID])

  // Handles setting Gateway as Ownerhash after Transaction
  React.useEffect(() => {
    handleMeta(txSuccess2of2, isSetGatewaySuccess, flash, CID)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [txSuccess2of2, isSetGatewaySuccess, flash, CID])

  // Handles Ownerhash transaction loading and error
  React.useEffect(() => {
    if (txLoading1of2 && !txError1of2) {
      setLoading(true)
      setMessage('Waiting for Confirmation')
    }
    if (!txLoading1of2 && txError1of2) {
      if (!recentCrash) {
        setMessage('Transaction Failed')
        setCrash(true)
        setSigCount(0)
      } else {
        if (recentCrash) setRecentCrash(false)
      }
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [txLoading1of2, txError1of2])

  // Handles Gateway as Ownerhash transaction loading and error
  React.useEffect(() => {
    if (txLoading2of2 && !txError2of2) {
      setLoading(true)
      setMessage('Waiting for Confirmation')
    }
    if (!txLoading2of2 && txError2of2) {
      if (!recentCrash) {
        setMessage('Transaction Failed')
        setCrash(true)
        setSigCount(0)
      } else {
        if (recentCrash) setRecentCrash(false)
      }
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [txLoading2of2, txError2of2])

  // Handles Ownerhash transaction wait
  React.useEffect(() => {
    if (isSetOwnerhashLoading && !isSetOwnerhashError) {
      setLoading(true)
      setFinish(false)
      setMessage('Waiting for Transaction')
      if (recentCrash) setRecentCrash(false)
    } else if (!isSetOwnerhashLoading && isSetOwnerhashError) {
      if (!recentCrash) {
        doCrash()
        setMessage('Transaction Declined By User')
        setSuccess(false)
      } else {
        if (recentCrash) setRecentCrash(false)
      }
      setSaltModalState({
        modalData: undefined,
        trigger: false
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSetOwnerhashLoading, isSetOwnerhashError])

  // Handles Gateway as Ownerhash transaction wait
  React.useEffect(() => {
    if (isSetGatewayLoading && !isSetGatewayError) {
      setLoading(true)
      setFinish(false)
      setMessage('Waiting for Transaction')
      if (recentCrash) setRecentCrash(false)
    } else if (!isSetGatewayLoading && isSetGatewayError) {
      if (!recentCrash) {
        doCrash()
        setMessage('Transaction Declined By User')
        setSuccess(false)
      } else {
        if (recentCrash) setRecentCrash(false)
      }
      setSaltModalState({
        modalData: undefined,
        trigger: false
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSetGatewayLoading, isSetGatewayError])

  // Handles signature loading and error
  React.useEffect(() => {
    if (activeTab === 'UTILS') {
      if (signLoading && !signError) {
        setLoading(true)
        setMessage('Waiting for Signature')
        if (recentCrash) setRecentCrash(false)
      } else if (signError && !signLoading) {
        if (!recentCrash) {
          setMessage('Signature Failed')
          doCrash()
        } else {
          if (recentCrash) setRecentCrash(false)
        }
        setSaltModalState({
          modalData: undefined,
          trigger: false
        })
        setExportModalState({
          modalData: undefined,
          trigger: false
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signLoading, signError, activeTab])

  return (
    <div
      className="page flex-column-sans-align"
      style={{
        maxWidth: '100%'
      }}
    >
      {/* Avatar */}
      {!isMobile && (
        <div
          style={{
            margin: '20px',
            width: '40%',
            display: 'flex',
            justifyContent: 'flex-start'
          }}>
          <img
            className="avatar"
            alt="corner-account"
            src="logo.png"
          />
        </div>
      )}
      <Head>
        <title>NameSys - Off-chain Records Manager</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width, user-scalable=no" />
        <link rel="shortcut icon" href="logo.png" />
        <link rel="preload" as="style" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
        <link rel="preload" href="SF-Mono.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="Spotnik.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </Head>
      {/* Preload */}
      <div style={{ fontFamily: 'Rajdhani' }}></div>
      <div style={{ fontFamily: 'SF Mono' }}></div>
      <div style={{ fontFamily: 'Spotnik' }}></div>
      {/* Overlay */}
      <div id="overlay" className="overlay">
        <div 
          className="overlay-content overlay-content-alt"
        >
          <Loading
            height={75}
            width={75}
          />
          <div
            style={{
              marginTop: '20px'
            }}
          >
            <span>
              PLEASE WAIT
            </span>
          </div>
        </div>
      </div>
      {/* buttons */}
      <div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'space-between',
            width: '100%'
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: !isMobile ? 'row' : 'column',
              marginLeft: !isMobile ? '9%' : '25px',
              marginRight: 'auto',
              marginTop: !isMobile ? '-7%' : '25px'
            }}
          >
            <div
              style={{
                marginRight: !isMobile ? '40px' : '20px',
              }}
            >
              <button
                className='button'
                onClick={() => { window.location.href = '/', setKeypairSigner([]), setKeypairIPNS([]), setKeyIPNS('') }}
                data-tooltip='Homepage'
              >
                <div
                  className="flex-sans-direction"
                >
                  {!isMobile ? 'Home' : 'Home'}
                  <span className="material-icons-round" style={{ marginLeft: '3px' }}>home</span>
                </div>
              </button>
            </div>
            <div
              style={{
                marginLeft: !isMobile ? '-30px' : '-9px'
              }}
            >
              <Ticker variable={savings} />
            </div>
          </div>
          <div
            className='connect-button'
            style={{
              marginLeft: 'auto',
              display: 'flex',
              flexDirection: 'row',
              marginTop: !isMobile ? '-7%' : '25px',
            }}
          >
            <button
              className='button clear'
              onClick={() => { window.scrollTo(0, 0); setFaqModal(true), setKeypairSigner([]), setKeypairIPNS([]), setKeyIPNS('') }}
              style={{ marginRight: 10, display: 'none' }}
              data-tooltip='Learn more'
            >
              <div
                className="flex-row"
              >
                {'about'}
                <span className="material-icons-round" style={{ marginLeft: '3px' }}>info</span>
              </div>
            </button>
            <button
              className='button clear'
              onClick={() => { window.scrollTo(0, 0); setTermsModal(true), setKeypairSigner([]), setKeypairIPNS([]), setKeyIPNS('') }}
              style={{ marginRight: 10, display: 'none' }}
              data-tooltip='Terms of Use'
            >
              <div
                className="flex-row"
              >
                {'terms'}<span>&nbsp;</span><span className="material-icons-round">gavel</span>
              </div>
            </button>
            {!isMobile && (
              <div>
                <ConnectButton
                  label='connect'
                />
              </div>
            )}
            {isMobile && (
              <div>
                <ConnectButton
                  label="connect"
                />
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Container */}
      <div
        className="container"
        style={{
          maxWidth: `inherit`,
          margin: '50px 0 0 0'
        }}
      >
        {/* Content */}
        <div className={!isMobile && !isSearch ? 'heading-alt' : 'none'}
          style={{
            flex: '1 1 auto',
            marginTop: isDisconnected ? '30px' : '0'
          }}
        >
          <div style={{ marginTop: '-120px' }}>
            <div
              className="flex-column"
              style={{
                paddingTop: '100px'
              }}>
              {!isMobile && isDisconnected && (
                <div
                >
                  <img
                    className="icon-ccip2"
                    alt="sample-icon"
                    src="logo.png"
                    hidden
                  />
                  <div
                    className="flex-column"
                    style={{
                      fontSize: '70px',
                      color: '#fc6603',
                      marginBottom: '20px',
                      fontWeight: '700'
                    }}
                  >
                    NameSys
                  </div>
                  <div
                    className="flex-column"
                    style={{
                      fontSize: 26,
                      color: '#eb8634',
                      marginTop: isMobile ? '-30px' : '10px',
                      fontWeight: '700'
                    }}
                  >
                    Off-chain Records Manager
                  </div>
                </div>
              )}
              {!isMobile && (isConnected || !isDisconnected) && (
                <div
                  style={{
                    marginTop: '-30px',
                    marginBottom: '10px'
                  }}
                >
                  <img
                    className="icon-ccip2"
                    alt="sample-icon"
                    src="logo.png"
                    hidden
                  />
                  <div
                    className="flex-column"
                    style={{
                      fontSize: '52px',
                      color: '#fc6603',
                      marginBottom: '20px',
                      marginTop: '30px',
                      fontWeight: '700'
                    }}
                  >
                    NameSys
                  </div>
                </div>
              )}
              {isMobile && isDisconnected && (
                <div
                  className="flex-column"
                >
                  <img
                    className="icon-ccip2"
                    alt="sample-icon"
                    src="logo.png"
                    style={{
                      marginBottom: '7px'
                    }}
                  />
                  <div
                    className="flex-column"
                    style={{
                      fontSize: '52px',
                      color: '#fc6603',
                      marginBottom: '20px',
                      fontWeight: '700'
                    }}
                  >
                    NameSys
                  </div>
                  <div
                    className="flex-column"
                    style={{
                      fontSize: 26,
                      color: '#eb8634',
                      marginTop: '-10px',
                      fontWeight: '700'
                    }}
                  >
                    Off-chain Records
                  </div>
                  <div
                    className="flex-column"
                    style={{
                      fontSize: 26,
                      color: '#eb8634',
                      marginTop: '0px',
                      fontWeight: '700'
                    }}
                  >
                    Manager
                  </div>
                </div>
              )}
              {isMobile && (isConnected || !isDisconnected) && (
                <div
                  className="flex-column"
                  style={{
                    marginTop: '-30px',
                    marginBottom: '50px'
                  }}
                >
                  <img
                    className="icon-ccip2"
                    alt="sample-icon"
                    src="logo.png"
                    style={{
                      marginBottom: '7px'
                    }}
                  />
                  <div
                    className="flex-column"
                    style={{
                      fontSize: '40px',
                      color: '#fc6603',
                      marginTop: '10px',
                      fontWeight: '700'
                    }}
                  >
                    NameSys
                  </div>
                </div>
              )}
            </div>
          </div>
          {isDisconnected && (
            <div
              style={{
                marginBottom: '0px'
              }}>
              <div className="content-slider"><div className="slider">
                <div className="mask">
                  <ul>
                    {constants.carousal.map((item, index) => (
                      <li className={`anim${index + 1}`} key={index}>
                        <div className="carousal-item">
                          <div dangerouslySetInnerHTML={{ __html: item }}></div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div></div>
            </div>
          )}
          {(isConnected || !isDisconnected) && (
            <div
              className="flex-sans-direction"
              style={{
                marginBottom: '50px',
                marginTop: isMobile ? '-35px' : '2px'
              }}
            >
              <button
                onClick={() => {
                  setActiveTab('OWNER')
                  cache.length > 0 ? setMeta(cache) : console.error('BUG')
                  setTokenIDLegacy('')
                  setTokenIDWrapper('')
                  setQuery('')
                  setSuccess(false)
                  setManager('')
                  cache.length > 0 ? setLoading(false) : (empty ? setLoading(false) : setLoading(true))
                  setErrorModal(false)
                  setKeypairSigner([])
                  setKeypairIPNS([])
                  setKeyIPNS('')
                  setSigCount(0)
                  !cache ? '' : setSuccess(true)
                }}
                className='button-header'
                disabled={activeTab === 'OWNER' || loading}
                data-tooltip='Show names that you can manage'
              >
                <div
                  className="flex-sans-direction"
                >
                  {'NAMES'}
                  <span className="material-icons-round" style={{ marginLeft: '3px' }}>manage_accounts</span>
                </div>
              </button>
              <button
                onClick={() => {
                  activeTab === 'SEARCH' ? '' : setCache(flash)
                  setMeta([])
                  setActiveTab('UTILS')
                  setSuccess(false)
                  setManager('')
                  setLoading(true)
                  setQuery('')
                  setErrorModal(false)
                  setKeypairSigner([])
                  setKeypairIPNS([])
                  setKeyIPNS('')
                  setMessage('Please Wait')
                  setSigCount(0)
                }}
                className='button-header'
                disabled={activeTab === 'UTILS' || loading}
                data-tooltip='NameSys Utility Functions'
              >
                <div
                  className="flex-sans-direction"
                >
                  {'UTILS'}
                  <span className="material-icons-round" style={{ marginLeft: '3px' }}>supervised_user_circle</span>
                </div>
              </button>
              <button
                onClick={() => {
                  activeTab === 'UTILS' ? '' : setCache(flash)
                  setMeta([])
                  setActiveTab('SEARCH')
                  setSuccess(false)
                  setManager('')
                  setLoading(true)
                  setQuery('')
                  setKeypairIPNS([])
                  setKeypairSigner([])
                  setKeyIPNS('')
                  setErrorModal(false)
                  setMessage('Please Wait')
                  setSigCount(0)
                }}
                className='button-header'
                disabled={activeTab === 'SEARCH' || loading}
                data-tooltip='Search for an ENS name'
              >
                <div
                  className="flex-sans-direction"
                >
                  {'SEARCH'}
                  <span className="material-icons-round" style={{ marginLeft: '3px' }}>search</span>
                </div>
              </button>
            </div>
          )}
          {loading && (isConnected || !isDisconnected) && (
            <div>
              <div
                className="flex-column"
                style={{
                  marginTop: '50px',
                  marginBottom: '200px'
                }}
              >
                <div
                  className="flex-column"
                  style={{
                    paddingBottom: '10px'
                  }}
                >
                  <Loading
                    height={60}
                    width={60}
                  />
                </div>
                <div
                  className="flex-column"
                  style={{
                    marginTop: '10px'
                  }}
                >
                  <div
                    style={{
                      color: '#fc6603',
                      fontWeight: '700'
                    }}
                  >
                    {activeTab !== 'OWNER' ? `${message}` :
                      (previewModalState.modalData ? 'Please wait' : `${message}`)
                    }
                  </div>
                  <div
                    style={{
                      color: 'white',
                      fontWeight: '700',
                      marginTop: '10px'
                    }}
                  >
                    <span style={{ fontFamily: 'SF Mono', fontSize: '22px' }}>
                      {
                        activeTab === 'UTILS' ? (sigCount > 0 ? `${sigCount}` : '') :
                          (activeTab === 'OWNER' ? (previewModalState.modalData ? '' : `${progress}`) : '')
                      }
                    </span>
                    <span style={{ fontSize: '19px' }}>
                      {
                        activeTab === 'UTILS' ? (sigCount > 0 ? ` Of ` : '') :
                          (activeTab === 'OWNER' ? (previewModalState.modalData ? '' : ` Of `) : '')
                      }
                    </span>
                    <span style={{ fontFamily: 'SF Mono', fontSize: '22px' }}>
                      {
                        activeTab === 'UTILS' ? (sigCount > 0 ? `${choice.startsWith('export') ? (exportModalState.modalData === '2' ? '1' : '2') : '1'}` : '') :
                          (activeTab === 'OWNER' ? (previewModalState.modalData ? '' : `${length}`) : '')
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
          {loading && activeTab === 'OWNER' && meta.length > 0 && (isConnected || !isDisconnected) &&
            !empty && !finish && (
              <div>
                <div
                  className="flex-column"
                  style={{
                    marginTop: '50px',
                    marginBottom: '200px'
                  }}
                >
                  <div
                    className="flex-column"
                    style={{
                      paddingBottom: '10px'
                    }}
                  >
                    <Loading
                      height={60}
                      width={60}
                    />
                  </div>
                  <div
                    className="flex-column"
                    style={{
                      marginTop: '10px'
                    }}
                  >
                    <div
                      style={{
                        color: '#fc6603',
                        fontWeight: '700'
                      }}
                    >
                      {'Please Wait'}
                    </div>
                  </div>
                </div>
              </div>
            )}
          {!loading && activeTab === 'OWNER' && meta.length > 0 && (isConnected || !isDisconnected) &&
            !empty && (
              <div>
                <div
                  className="flex-sans-direction"
                  style={{
                    fontSize: '18px',
                    color: 'cyan',
                    marginBottom: '25px',
                    fontWeight: '700',
                    marginTop: isMobile ? '-10px' : '0'
                  }}
                >
                  <span
                    style={{
                      marginRight: '5px'
                    }}
                  >
                    Names You Manage
                  </span>
                  <button
                    className="button-tiny emphasis-smol"
                    onClick={() => {
                      setHelpModal(true)
                      setIcon('info')
                      setColor('cyan')
                      setHelp('<span>This list <span style="color: orangered">does not</span> contain <span style="color: orange">Wrapped Names</span> or <span style="color: orange">Subdomains</span> or <span style="color: orange">Legacy Names that you Manage but do not Own</span>. Please use the <span style="color: cyan">Search</span> tab to find names in these categories</span>')
                    }}
                    data-tooltip='Enlighten me'
                  >
                    <div
                      className="material-icons-round smol"
                      style={{
                        color: 'orange'
                      }}
                    >
                      info_outline
                    </div>
                  </button>
                </div>
                {activeTab === 'OWNER' && !loading && success && (
                  <div
                    className='list-container'
                    style={{
                      maxHeight: '520px',
                      overflowY: 'auto',
                      marginBottom: '50px',
                    }}
                  >
                    <List
                      label='edit'
                      items={meta}
                      onItemClickStealth={onItemClickStealth}
                      onItemClickPreview={onItemClickPreview}
                    />
                  </div>
                )}
              </div>
            )}
          {!loading && activeTab === 'SEARCH' && meta.length > 0 && (isConnected || !isDisconnected) && !empty && (
            <div>
              <div
                className="flex-sans-direction"
                style={{
                  fontSize: '18px',
                  color: 'cyan',
                  marginBottom: '25px',
                  fontWeight: '700'
                }}
              >
                search result
              </div>
              <div
                className='list-container'
                style={{
                  maxHeight: '520px',
                  overflowY: 'auto',
                  marginBottom: '50px',
                }}
              >
                <List
                  label='edit'
                  items={meta}
                  onItemClickStealth={onItemClickStealth}
                  onItemClickPreview={onItemClickPreview}
                />
              </div>
            </div>
          )}
          {!loading && activeTab === 'UTILS' && !success && meta && (isConnected || !isDisconnected) && (
            <div>
              <div
                className="flex-sans-direction"
                style={{
                  fontSize: '18px',
                  color: 'cyan',
                  marginBottom: '25px',
                  fontWeight: '700'
                }}
              >
                <span
                  style={{
                    marginRight: '5px'
                  }}
                >
                  NameSys Utilities
                </span>
                <button
                  className="button-tiny"
                  onClick={() => {
                    setHelpModal(true)
                    setIcon('info')
                    setColor('cyan')
                    setHelp('<span>NameSys Utility Functions to set <span style="color: cyan">Ownerhash</span> and <span style="color: cyan">Export Keys</span></span>')
                  }}
                  data-tooltip='Enlighten me'
                >
                  <div
                    className="material-icons-round smol"
                    style={{
                      color: 'cyan'
                    }}
                  >
                    info_outline
                  </div>
                </button>
              </div>
              <div
                className='export-container flex-column'
                style={{
                  maxHeight: '520px',
                  overflowY: 'auto',
                  marginBottom: '30px'
                }}
              >
                <div
                  className="flex-sans-direction"
                  style={{
                    fontSize: '18px',
                    color: 'cyan',
                    marginBottom: '25px',
                    fontWeight: '700'
                  }}
                >
                  <span
                    style={{
                      marginRight: '5px'
                    }}
                  >
                    Ownerhash Setter
                  </span>
                  <button
                    className="button-tiny"
                    onClick={() => {
                      setHelpModal(true)
                      setIcon('info')
                      setColor('cyan')
                      setHelp('<span>Sets <span style="color: cyan">Ownerhash</span> For All Names in a Wallet</span>')
                    }}
                    data-tooltip='Set New Ownerhash'
                  >
                    <div
                      className="material-icons-round smol"
                      style={{
                        color: 'cyan'
                      }}
                    >
                      info_outline
                    </div>
                  </button>
                </div>
                <input
                  style={{
                    width: '90%',
                    color: 'rgb(50, 205, 50, 0.75)'
                  }}
                  type="text"
                  placeholder={'Click on \'SET\''}
                  disabled
                  value={ownerhash === 'ipns://' ? '' : ownerhash}
                  id="owner-hash"
                />
                <div
                  className='flex-row'
                >
                  <button
                    className="button"
                    style={{
                      height: '38px',
                      width: '80px',
                      marginTop: '18px',
                      marginLeft: '15px'
                    }}
                    type="submit"
                    data-tooltip='Set New Ownerhash'
                    onClick={() => {
                      setConfirm(true)
                      setChoice('ownerhash')
                      setKeypairIPNS([])
                      setKeypairSigner([])
                      setKeyIPNS('')
                      setSigIPNS('')
                      setSigSigner('')
                      setSuccess(false)
                      setMessage('')
                    }}
                  >
                    <div
                      className="flex-sans-direction"
                    >
                      <span>{'SET'}</span>
                      <span
                        className="material-icons-round"
                        style={{
                          fontSize: '22px',
                          fontWeight: '700',
                          marginLeft: '3px'
                        }}
                      >
                        settings
                      </span>
                    </div>
                  </button>
                  {(txSuccess1of2 || txError1of2) && !txLoading1of2 && (
                    <div
                      className="material-icons-round smol"
                      style={{
                        color: txSuccess1of2 ? 'lime' : 'orangered',
                        marginLeft: '10px',
                        marginTop: '18px',
                        fontSize: '20px'
                      }}
                    >
                      {txSuccess1of2 ? 'task_alt' : 'cancel'}
                    </div>
                  )}
                  {(txSuccess2of2 || txError2of2) && !txLoading2of2 && (
                    <div
                      className="material-icons-round smol"
                      style={{
                        color: txSuccess2of2 ? 'lime' : 'orangered',
                        marginLeft: '10px',
                        marginTop: '18px',
                        fontSize: '20px'
                      }}
                    >
                      {txSuccess2of2 ? 'task_alt' : 'cancel'}
                    </div>
                  )}
                </div>
              </div>
              <div
                className='hash-container flex-column'
                style={{
                  maxHeight: '520px',
                  overflowY: 'auto',
                  marginBottom: '70px'
                }}
              >
                <div
                  className="flex-sans-direction"
                  style={{
                    fontSize: '18px',
                    color: 'cyan',
                    marginBottom: '25px',
                    fontWeight: '700'
                  }}
                >
                  <span
                    style={{
                      marginRight: '5px'
                    }}
                  >
                    Private Key Exporter
                  </span>
                  <button
                    className="button-tiny"
                    onClick={() => {
                      setHelpModal(true)
                      setIcon('info')
                      setColor('cyan')
                      setHelp('<span>Export your <span style="color: cyan">IPNS</span> and/or Records <span style="color: cyan">Signer</span> Keys</span>')
                    }}
                    data-tooltip='Export Keys'
                  >
                    <div
                      className="material-icons-round smol"
                      style={{
                        color: 'cyan'
                      }}
                    >
                      info_outline
                    </div>
                  </button>
                </div>
                <div
                  style={{
                    width: '90%',
                    alignItems: 'flex-start'
                  }}
                >
                  <span
                    style={{
                      color: 'skyblue',
                      fontSize: '12px',
                      fontWeight: '700'
                    }}
                  >
                    IPNS PRIVATE KEY
                  </span>
                  <div
                    className="flex-sans-direction"
                    style={{
                      marginTop: '2px',
                      width: '100%'
                    }}
                  >
                    <input
                      style={{
                        width: '100%',
                        paddingRight: '32px',
                        fontWeight: '400',
                        textAlign: 'left',
                        color: keypairIPNS[0] === 'IPNS PRIVATE KEY COPIED!' ? 'lime' : 'rgb(255, 255, 150, 0.75)'
                      }}
                      type="text"
                      placeholder={"IPNS Private Key"}
                      value={!choice.startsWith('export') ? '' : (!choice.endsWith('HTTP') ? (keypairIPNS[0] !== '0x' ? keypairIPNS[0] : '') : '')}
                      id="export-ipns"
                      disabled
                    />
                    <button
                      className="button-empty"
                      onClick={() => {
                        constants.copyToClipboard('export-ipns')
                        setColor('lime')
                        setKeypairIPNS(['IPNS PRIVATE KEY COPIED!', 'COPIED!'])
                      }}
                      data-tooltip='Copy IPNS Key'
                      style={{
                        marginLeft: '-25px',
                        color: color && !keypairIPNS[0] && !keypairIPNS[1] ? color : 'cyan'
                      }}
                      hidden={!keypairIPNS[0] || keypairIPNS[0] === '0x'}
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
                </div>
                <div
                  style={{
                    width: '90%',
                    alignItems: 'flex-start',
                    marginTop: '10px'
                  }}
                >
                  <span
                    style={{
                      color: 'skyblue',
                      fontSize: '12px',
                      fontWeight: '700'
                    }}
                  >
                    CCIP MANAGER KEY
                  </span>
                  <div
                    className="flex-sans-direction"
                    style={{
                      marginTop: '2px',
                      width: '100%'
                    }}
                  >
                    <input
                      style={{
                        width: '100%',
                        paddingRight: '32px',
                        fontWeight: '400',
                        textAlign: 'left',
                        color: keypairSigner[0] === 'RECORDS SIGNER KEY COPIED!' ? 'lime' : 'rgb(255, 255, 150, 0.75)'
                      }}
                      type="text"
                      placeholder={"CCIP Manager Key"}
                      value={!choice.startsWith('export') ? '' : keypairSigner[0]}
                      id="export-ccip"
                      disabled
                    />
                    <button
                      className="button-empty"
                      onClick={() => {
                        constants.copyToClipboard('export-ccip')
                        setColor('lime')
                        setKeypairSigner(['RECORDS SIGNER KEY COPIED!', 'COPIED!'])
                      }}
                      data-tooltip='Copy Manager Key'
                      style={{
                        marginLeft: '-25px',
                        color: color && !keypairSigner[0] && !keypairSigner[1] ? color : 'cyan'
                      }}
                      hidden={!keypairSigner[0]}
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
                </div>
                <div
                  style={{
                    width: '90%',
                    alignItems: 'flex-start',
                    marginTop: '10px'
                  }}
                >
                  <span
                    style={{
                      color: 'skyblue',
                      fontSize: '12px',
                      fontWeight: '700'
                    }}
                  >
                    IPNS ENCODED KEY
                  </span>
                  <div
                    className="flex-sans-direction"
                    style={{
                      marginTop: '2px',
                      width: '100%'
                    }}
                  >
                    <input
                      style={{
                        width: '100%',
                        paddingRight: '32px',
                        fontWeight: '400',
                        textAlign: 'left',
                        color: keyIPNS === 'IPNS ENCODED KEY COPIED!' ? 'lime' : 'rgb(255, 255, 150, 0.75)'
                      }}
                      type="text"
                      placeholder={"IPNS Encoded Key"}
                      value={!choice.startsWith('export') ? '' : keyIPNS}
                      id="export-encoded"
                      disabled
                    />
                    <button
                      className="button-empty"
                      onClick={() => {
                        constants.copyToClipboard('export-encoded')
                        setColor('lime')
                        setKeyIPNS('IPNS ENCODED KEY COPIED!')
                      }}
                      data-tooltip='Copy Manager Key'
                      style={{
                        marginLeft: '-25px',
                        color: color && !keyIPNS ? color : 'cyan'
                      }}
                      hidden={!keyIPNS}
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
                </div>
                <div
                  className='flex-row'
                >
                  <button
                    className="button"
                    style={{
                      height: '38px',
                      width: '115px',
                      marginLeft: '15px',
                      marginTop: '20px'
                    }}
                    type="submit"
                    data-tooltip='Export Keys'
                    onClick={() => {
                      setExportKey(true)
                      setChoice('export')
                      setKeypairIPNS([])
                      setKeypairSigner([])
                      setKeyIPNS('')
                      setSigIPNS('')
                      setSigSigner('')
                      setMessage('')
                    }}
                  >
                    <div
                      className="flex-sans-direction"
                    >
                      <span>{'EXPORT'}</span>
                      <span
                        className="material-icons-round"
                        style={{
                          fontSize: '22px',
                          fontWeight: '700',
                          marginLeft: '5px'
                        }}
                      >
                        file_download
                      </span>
                    </div>
                  </button>
                  <div
                    className="material-icons-round smol"
                    style={{
                      color: keyIPNS || keypairIPNS[0] || keypairSigner[0] ? 'lime' : (signError ? 'orangered' : ''),
                      marginLeft: '10px',
                      marginTop: '18px',
                      fontSize: '20px'
                    }}
                  >
                    {keyIPNS || keypairIPNS[0] || keypairSigner[0] ? 'task_alt' : (signError ? 'cancel' : '')}
                  </div>
                </div>
              </div>
            </div>
          )}
          {!loading && activeTab === 'SEARCH' && meta && (isConnected || !isDisconnected) && (
            <div>
              <div
                className="flex-sans-direction"
                style={{
                  fontSize: '18px',
                  color: 'cyan',
                  marginBottom: '25px',
                  marginTop: meta ? '-15px' : '0px'
                }}
              >
                <span
                  style={{
                    marginRight: '5px'
                  }}
                >
                  search names
                </span>
                <button
                  className="button-tiny"
                  onClick={() => {
                    setHelpModal(true)
                    setIcon('info')
                    setColor('cyan')
                    setHelp('<span>Search for a <span style="color: cyan">Subdomain</span> or a <span style="color: cyan">Wrapped Domain</span> or a <span style="color: cyan">Legacy name that you Manage but do not Own</span></span>')
                  }}
                  data-tooltip='Enlighten me'
                >
                  <div
                    className="material-icons-round smol"
                    style={{
                      color: 'cyan'
                    }}
                  >
                    info_outline
                  </div>
                </button>
              </div>
              <div
                className='search-container'
                style={{
                  maxHeight: '520px',
                  overflowY: 'auto',
                  marginBottom: '50px',
                }}
              >
                <SearchBox
                  onSearch={handleNameSearch}
                />
              </div>
            </div>
          )}
          {!loading && empty && activeTab === 'OWNER' && !errorModal && (
            <div>
              <div
                className="flex-column"
                style={{
                  fontSize: '22px',
                  color: '#fc6603',
                  marginBottom: '25px',
                  fontWeight: '700'
                }}
              >
                <span
                  className="material-icons-round miui-smaller"
                >
                  warning
                </span>
                <br></br>
                No Names Found
              </div>
            </div>
          )}
          {!response && !manager && query && activeTab !== 'OWNER' && !loading && !errorModal && (
            <div>
              <div
                className="flex-column"
                style={{
                  fontSize: '22px',
                  color: '#fc6603',
                  marginBottom: '25px',
                  fontWeight: '700'
                }}
              >
                <span
                  className="material-icons-round miui-smaller"
                >
                  warning
                </span>
                <br></br>
                No Names Found
              </div>
            </div>
          )}
          {/* Footer */}
          <div
            className="flex-sans-direction"
            style={{
              color: '#fc6603',
              top: 'auto',
              left: !isMobile ? '14%' : '32%',
              transform: !isMobile ? 'translateX(-92%)' : 'translateX(-72%)',
              bottom: 10
            }}
          >
            <div
              className='flex-row'
              style={{
                marginRight: '15px'
              }}
            >
              <span
                className="material-icons-round"
                style={{
                  marginRight: '3px'
                }}
              >
                source
              </span>
              <a
                href="https://github.com/namesys-eth/ccip2-eth-client"
                className="footer-text"
                target='_blank'
                rel="noreferrer"
              >
                GitHub
              </a>
            </div>
            <div
              className='flex-row'
            >
              <span
                className="material-icons-round"
                style={{
                  marginRight: '3px'
                }}
              >
                info_outline
              </span>
              <a
                href="https://github.com/namesys-eth/ccip2-eth-resources/blob/main/docs/GUIDE.md"
                className="footer-text"
                target='_blank'
                rel="noreferrer"
              >
                Help
              </a>
            </div>
          </div>
          {/* Modals */}
          <div 
            id="modal"
          >
            {previewModal && (
              <Preview
              onClose={() => setPreviewModal(false)}
              show={previewModal}
              _ENS_={nameToPreview}
              chain={_Chain_}
              handleParentTrigger={handlePreviewTrigger}
              handleParentModalData={handlePreviewModalData}
            />
            )}
            {stealthModal && (
              <Stealth
              onClose={() => setStealthModal(false)}
              show={stealthModal}
              _ENS_={nameToStealth}
              chain={_Chain_}
              handleParentTrigger={handleStealthTrigger}
              handleParentModalData={handleStealthModalData}
            />
            )}
            <Faq
              onClose={() => setFaqModal(false)}
              show={faqModal}
            />
            <Terms
              onClose={() => setTermsModal(false)}
              show={termsModal}
            />
            <Error
              onClose={() => {
                setCrash(false)
                setRecentCrash(true)
              }}
              color={'red'}
              show={crash && !loading}
              title={'cancel'}
            >
              {message}
            </Error>
            <Error
              onClose={() => {
                setErrorModal(false)
                setTokenIDLegacy('')
                setTokenIDWrapper('')
                setQuery('')
                setManager('')
              }}
              color={'red'}
              show={errorModal && !isSearch && !loading}
              title={'block'}
            >
              {errorMessage}
            </Error>
            <Error
              onClose={() => {
                setErrorModal(false)
                setTokenIDLegacy('')
                setTokenIDWrapper('')
                setQuery('')
                setManager('')
              }}
              color={'red'}
              show={errorModal && isSearch && !loading}
              title={'block'}
            >
              {errorMessage}
            </Error>
            <Gateway
              handleTrigger={handleGatewayTrigger}
              handleModalData={handleGatewayModalData}
              onClose={() => {
                setGateway(false)
              }}
              show={gateway}
            >
            </Gateway>
            <Salt
              handleTrigger={handleSaltTrigger}
              handleModalData={handleSaltModalData}
              onClose={() => {
                setSaltModal(false)
              }}
              show={saltModal}
            >
              {[username, 'ownerhash']}
            </Salt>
            <Confirm
              handleTrigger={handleConfirmTrigger}
              handleModalData={handleConfirmModalData}
              onClose={() => {
                setConfirm(false)
              }}
              show={confirm && !saltModal}
            >
              {'0'}
            </Confirm>
            <Export
              handleTrigger={handleExportTrigger}
              handleModalData={handleExportModalData}
              onClose={() => {
                setExportKey(false)
              }}
              show={exportKey}
            >
              {''}
            </Export>
            <Help
              color={color}
              icon={icon}
              onClose={() => setHelpModal(false)}
              show={helpModal}
            >
              {help}
            </Help>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Account
