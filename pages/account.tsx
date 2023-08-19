/// My Names page (Accountpage)
import React from 'react'
import { useCallback } from 'react'
import Head from 'next/head'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import type { NextPage } from 'next'
import {
  useConnect,
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
import Faq from '../components/FAQ'
import Salt from '../components/Salt'
import Error from '../components/Error'
import List from '../components/List'
import Ticker from '../components/Ticker'
import Loading from '../components/LoadingColors'
import SearchBox from '../components/SearchBox'
import Confirm from '../components/Confirm'
import * as constants from '../utils/constants'
import * as verifier from '../utils/verifier'
import { _KEYGEN } from '../utils/keygen'
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
  const [nameToPreviewModal, setNameToPreview] = React.useState('') // Sets name to expand in preview
  const [loading, setLoading] = React.useState(true) // Tracks if a process is occuring
  const [empty, setEmpty] = React.useState(false) // Tracks if wallet has no NFTs
  const [success, setSuccess] = React.useState(false) // Tracks success of process(es)
  const [activeTab, setActiveTab] = React.useState('OWNER')
  const [tokenIDLegacy, setTokenIDLegacy] = React.useState('')
  const [tokenIDWrapper, setTokenIDWrapper] = React.useState('')
  const [manager, setManager] = React.useState('')
  const [query, setQuery] = React.useState('')
  const [savings, setSavings] = React.useState('')
  const [icon, setIcon] = React.useState('')
  const [color, setColor] = React.useState('cyan')
  const [getting, setGetting] = React.useState(0)
  const [length, setLength] = React.useState(0) // Stores number of ENS names for an address
  const [help, setHelp] = React.useState('')
  const [isSearch, setIsSearch] = React.useState(false)
  const [keygen, setKeygen] = React.useState(false); // IPNS keygen trigger following signature
  const [process, setProcess] = React.useState(ethers.utils.namehash('0.eth')) // Stores name under process
  const [progress, setProgress] = React.useState(0) // Stores progress
  const [cache, setCache] = React.useState<any[]>([]) // Preserves cache of metadata across tabs
  const [flash, setFlash] = React.useState<any[]>([]) // Saves metadata in temporary flash memory
  const [response, setResponse] = React.useState(false) // Tracks response of search query
  const [finish, setFinish] = React.useState(false) // Tracks NFT query processing
  const [crash, setCrash] = React.useState(false) // Tracks transactions failures
  const [message, setMessage] = React.useState('Loading Names') // Sets message while processing
  const [recordhash, setRecordhash] = React.useState('') // Recordhash
  const [ownerhash, setOwnerhash] = React.useState('') // Ownerhash
  const [keypair, setKeypair] = React.useState<string[]>(['', '', '']) // Exported keypairs [ed25519-priv, secp256k1, ed25519-pub]
  const [salt, setSalt] = React.useState(false) // Trigger signature for key export
  const [CID, setCID] = React.useState(''); // IPNS pubkey/CID value
  const [choice, setChoice] = React.useState(''); // Records active process
  const [confirm, setConfirm] = React.useState(false); // Confirmation modal
  const [gateway, setGateway] = React.useState(false); // Gateway URL for storage
  const [previewModalState, setPreviewModalState] = React.useState<constants.MainBodyState>({
    modalData: '',
    trigger: false
  }) // Preview modal state
  const [saltModalState, setSaltModalState] = React.useState<constants.MainBodyState>({
    modalData: undefined,
    trigger: false
  }) // Salt modal state
  const [confirmModalState, setConfirmModalState] = React.useState<constants.MainBodyState>({
    modalData: undefined,
    trigger: false
  }); // Confirm modal state
  const recoveredAddress = React.useRef<string>()
  


  // Copy text
  function copyToClipboard(element: string) {
    const copyText = document.getElementById(element) as HTMLInputElement
    copyText.select()
    copyText.setSelectionRange(0, 99999)
    
    navigator.clipboard.writeText(copyText.value).then(() => {
    }).catch((error) => {
        console.error('ERROR:', error)
    })
  }

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

    // Handle Confirm modal data return
    const handleConfirmModalData = (data: string | undefined) => {
      setConfirmModalState(prevState => ({ ...prevState, modalData: data }))
    }
    // Handle Confirm modal trigger
    const handleConfirmTrigger = (trigger: boolean) => {
      setConfirmModalState(prevState => ({ ...prevState, trigger: trigger }))
    }

  const _Chain_ = activeChain && (activeChain.name.toLowerCase() === 'mainnet' || activeChain.name.toLowerCase() === 'ethereum') ? '1' : '5'
  const ccip2Contract = constants.ccip2[_Chain_ === '1' ? 1 : 0]
  const ccip2Config = constants.ccip2Config[_Chain_ === '1' ? 1 : 0]

  // Signature S1 statement; S1(K1) [IPNS Keygen]
  // S1 is not recovered on-chain; no need for buffer prepend and hashing of message required to sign
  function statementIPNSKey(source: string, caip10: string, extradata: string) {
    let _toSign = `Requesting Signature For IPNS Key Generation\n\nOrigin: ${source}\nKey Type: ed25519\nExtradata: ${extradata}\nSigned By: ${caip10}`
    let _digest = _toSign
    return _digest
  }

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

  /// ENS Domain Config
    // Read ENS Legacy Registrar for Owner record of ENS domain via TokenID
    const { data: _OwnerLegacy_, isLoading: legacyLoading, isError: legacyError } = useContractRead({
      address: `0x${constants.ensConfig[1].addressOrName.slice(2)}`,
      abi: constants.ensConfig[1].contractInterface,
      functionName: 'ownerOf',
      args: [tokenIDLegacy]
    })
  
    // Read ENS Legacy Registry for Owner record of ENS domain via namehash
    const { data: _OwnerDomain_, isLoading: domainLoading, isError: domainError } = useContractRead({
      address: `0x${constants.ensConfig[0].addressOrName.slice(2)}`,
      abi: constants.ensConfig[0].contractInterface,
      functionName: 'owner',
      args: [tokenIDLegacy]
    })
  
    // Read ENS Wrapper for Owner record of ENS domain
    const { data: _OwnerWrapped_, isLoading: wrapperLoading, isError: wrapperError } = useContractRead({
      address: `0x${constants.ensConfig[_Chain_ === '1' ? 7 : 3].addressOrName.slice(2)}`,
      abi: constants.ensConfig[_Chain_ === '1' ? 7 : 3].contractInterface,
      functionName: 'ownerOf',
      args: [tokenIDWrapper]
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
      args: [ethers.utils.hexZeroPad(_Wallet_ ? _Wallet_ : constants.zeroAddress, 32).toLowerCase()]
    })

  // Sets Ownerhash in CCIP2 Resolver
  const {
    data: response1of1,
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
        [CID ? `0x${constants.encodeContenthash(CID).split(constants.prefix)[1]}` : constants.zeroBytes]
      )
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
    if (previewModalState.trigger) { // Trigger update when one of the names is migrated
      let _LIST = meta
      const index = _LIST.findIndex(item => `${item.name}.eth` === previewModalState.modalData)
      const _update = async () => {
        if (previewModalState.modalData) {
          const _Resolver = await constants.provider.getResolver(previewModalState.modalData) // Get updated Resolver
          const __Recordhash = await verifier.verifyRecordhash(previewModalState.modalData, ccip2Config, _Wallet_ ? _Wallet_ : constants.zeroAddress) // Get updated Recordhash
          const __Ownerhash = await verifier.verifyOwnerhash(ccip2Config, _Wallet_ ? _Wallet_ : constants.zeroAddress) // Get updated Ownerhash
          _LIST[index].migrated = _Resolver?.address === ccip2Contract && __Recordhash ? '1' : (
            _Resolver?.address === ccip2Contract && __Ownerhash ? '3/4' : (
            _Resolver?.address === ccip2Contract ? '1/2' : '0') // Set new flag
          )
        }
      }
      _update()
      setMeta(_LIST)
      setFlash(_LIST)
      setCache(_LIST)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previewModalState])

  // Triggers S1(K1) after password is set
  React.useEffect(() => {
    if (saltModalState.trigger && !keypair[0] && !keypair[1]) {
      let _origin = 'eth:' + _Wallet_
      let _caip10 = `eip155:${_Chain_}:${_Wallet_}`  // CAIP-10
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
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saltModalState])

  // Triggers S1(K1) after password is set
  React.useEffect(() => {
    if (!keypair[0] && !keypair[1] && signature) {
      const keygen = async () => {
        let _origin = 'eth:' + _Wallet_
        let _caip10 = `eip155:${_Chain_}:${_Wallet_}`  // CAIP-10
        const __keypair = await _KEYGEN(_origin, _caip10, signature, saltModalState.modalData)
        setKeypair([__keypair[0][0], __keypair[1][0], __keypair[0][1]])
      }
      keygen()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keygen, signature])

  // Triggers IPNS CID derivation with new S1(K1)
  React.useEffect(() => {
    if (keypair[0] && keypair[2] && choice === 'ownerhash') {
      const CIDGen = async () => {
        let key = constants.formatkey([[keypair[0], keypair[2]], ['', '']])
        const w3name = await Name.from(ed25519_2.etc.hexToBytes(key))
        const CID_IPNS = w3name.toString()
        setCID(CID_IPNS)
      }
      CIDGen()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keypair])

  // Triggers setting Ownerhash
  React.useEffect(() => {
    if (CID.startsWith('k5')) {
      initOwnerhash()
      setMessage('Waiting For Transaction')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [CID])

  // Handle wallet change by the user
  React.useEffect(() => {
    if (!finish && !success && process && activeTab === 'OWNER') { // Prohibit wallet change when names are loading
      setMessage('Loading Names')
    } else if (!finish && !success && !process) { // Print message on load
      setMessage('Failed to Fetch')
    } 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_Wallet_, finish, success, activeTab])

  // Get all tokens for connected wallet
  React.useEffect(() => {
    if (!finish && !success && length === 0 && _Wallet_) {
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
        } else {
          const contract = new ethers.Contract(ccip2Config.addressOrName, ccip2Config.contractInterface, constants.provider)
          const _Ownerhash_ = await contract.getRecordhash(ethers.utils.hexZeroPad(_Wallet_ ? _Wallet_ : constants.zeroAddress, 32).toLowerCase())
          let _Recordhash_: any
          let __Recordhash: boolean = false
          let __Ownerhash: boolean = false
          for (var i = 0; i < allTokens.length; i++) {
            // ISSUE: ENS Metadata service is broken and not showing all the names
            if (constants.ensContracts.includes(allTokens[i].contract.address) && allTokens[i].title) {
              count = count + 1
              setGetting(count)
              allEns.push(allTokens[i].title.split('.eth')[0])
              const _Resolver = await constants.provider.getResolver(allTokens[i].title)
              items.push({
                'key': count,
                'name': allTokens[i].title.split('.eth')[0],
                'migrated': _Resolver?.address === ccip2Contract ? '1/2' : '0'
              })
              setProcess(allTokens[i].title)
              _Recordhash_ = await contract.getRecordhash(ethers.utils.namehash(allTokens[i].title))
              if (_Recordhash_ && _Recordhash_ !== '0x' && (_Recordhash_ === _Ownerhash_)) {
                __Recordhash = false
                if (_Ownerhash_ && _Ownerhash_ !== '0x') {
                  __Ownerhash = true
                }
              } else if (_Recordhash_ && _Recordhash_ !== '0x' && (_Recordhash_ !== _Ownerhash_)) {
                __Recordhash = true
              }
              items[count - 1].migrated = __Recordhash && items[count - 1].migrated === '1/2' ? '1' : (
                __Ownerhash && items[count - 1].migrated === '1/2' ? '3/4' : (
                items[count - 1].migrated === '1/2' ? items[count - 1].migrated : '0'
                )
              )
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
  }, [_Wallet_, finish, length])

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
  const onItemClick = (name: string) => {
    setPreviewModal(true)
    setNameToPreview(name)
  }

  React.useEffect(() => {
    if (getting > progress && getting > 0) {
      setProgress(getting)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getting])

  React.useEffect(() => {
    if (_OwnerLegacy_ && _OwnerLegacy_?.toString() !== constants.zeroAddress) {
      if (_OwnerLegacy_.toString() === constants.ensContracts[_Chain_ === '1' ? 7 : 3]) {
        if (_OwnerWrapped_ && _OwnerWrapped_?.toString() !== constants.zeroAddress) { 
          setManager(_OwnerWrapped_.toString())
        }
      } else {
        setManager(_OwnerLegacy_.toString())
      }
    } else {
      if (_OwnerDomain_ && _OwnerDomain_?.toString() !== constants.zeroAddress) {
        if (_OwnerDomain_.toString() === constants.ensContracts[_Chain_ === '1' ? 7 : 3]) {
          if (_OwnerWrapped_ && _OwnerWrapped_?.toString() !== constants.zeroAddress) { 
            setManager(_OwnerWrapped_.toString())
          } else if (wrapperError) {
            setManager('')
          }
        } else {
          setManager(_OwnerDomain_.toString())
        }
      }
    } 
    if (activeTab !== 'OWNER') {
      setTimeout(() => {
        setLoading(false)
        setResponse(false)
      }, 2000)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenIDLegacy, tokenIDWrapper, _OwnerLegacy_, activeTab, _OwnerWrapped_, _OwnerDomain_, wrapperError])

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
            if (items.length > 0 && _RESPONSE?.address) {
              if (recordhash && recordhash.toString() !== '0x' && (recordhash.toString() !== ownerhash.toString()) && items[0].migrated === '1/2') {
                items[0].migrated = '1'
              } else if (ownerhash && ownerhash.toString() !== '0x' && items[0].migrated === '1/2') {
                items[0].migrated = '3/4'
              }
              setCache(flash)
              setMeta(items)
              setSuccess(true)
              setTimeout(() => {
                setLoading(false)
              }, 1000)
            } else {
              setSuccess(false)
              setErrorMessage('Name not Registered')
              setErrorModal(true)
              setLoading(false)
            }
          })
      }
      setMetadata()
    } else if (manager && manager !== _Wallet_ && query.length > 0) {
      setLoading(false)
      setSuccess(false)
      setErrorMessage('You are not Owner')
      setErrorModal(true)
    } 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manager, _Wallet_, query, recordhash, ownerhash, flash])

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

  // Capture Recordhash hook
  React.useEffect(() => {
    if (_Recordhash_) {
      setRecordhash(`ipns://${ensContent.decodeContenthash(_Recordhash_.toString()).decoded}`)
    }
  }, [_Recordhash_, _Ownerhash_])

  // Capture Ownerhash hook
  React.useEffect(() => {
    if (_Ownerhash_) {
      setOwnerhash(`ipns://${ensContent.decodeContenthash(_Ownerhash_.toString()).decoded}`)
    }
  }, [_Ownerhash_])

  // Format query to ENS name and get tokenID
  React.useEffect(() => {
    if (query) {
      try {
        let _namehash = ethers.utils.namehash(query)
        let _token = ethers.BigNumber.from(_namehash)
        setTokenIDWrapper(_token.toString())
      } catch (error) {
      }
      try {
        let _labelhash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(query.split('.eth')[0]))
        let _token = ethers.BigNumber.from(_labelhash)
        if (query.split('.').length == 2) {
          setTokenIDLegacy(_token.toString())
        } else {
          setTokenIDLegacy(ethers.utils.namehash(query)) // Exception
        }
      } catch (error) {
      }
    }
  }, [query])

  const handleNameSearch = (query: string) => {
    setMeta([])
    setLoading(true)
    setIsSearch(true)
    setProcess(query)
    setQuery(query)
  }

  const { isSuccess: txSuccess1of1, isError: txError1of1, isLoading: txLoading1of1 } = useWaitForTransaction({
    hash: response1of1?.hash,
  })

  // Handles setting Ownerhash after transaction 2 
  React.useEffect(() => {
    if (txSuccess1of1 && isSetOwnerhashSuccess) {
      let _LIST = flash
      for (var i = 0; i < flash.length; i++) {
        if (flash[i].migrated === '1/2') {
          _LIST[i].migrated = '3/4'
        }
      }
      setMeta(_LIST)
      setFlash(_LIST)
      setCache(_LIST)
      setOwnerhash(`ipns://${CID}`)
      setMessage('Transaction Confirmed')
      setTimeout(() => {
        setLoading(false)
      }, 2000)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [txSuccess1of1, isSetOwnerhashSuccess, flash])

  // Handles Ownerhash transaction loading and error
  React.useEffect(() => {
    if (txLoading1of1 && !txError1of1) {
      setLoading(true)
      setMessage('Waiting for Confirmation')
    }
    if (!txLoading1of1 && txError1of1) {
      setMessage('Transaction Failed')
      setCrash(true)
      setLoading(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [txLoading1of1, txError1of1])

  // Handles transaction wait
  React.useEffect(() => {
    if (isSetOwnerhashLoading && !isSetOwnerhashError) {
      setLoading(true)
      setFinish(false)
      setMessage('Waiting for Transaction')
    } else if (!isSetOwnerhashLoading && isSetOwnerhashError) {
      setCrash(true)
      setLoading(false)
      setMessage('Transaction Declined By User')
    }
  }, [isSetOwnerhashLoading, isSetOwnerhashError])

  // Handles signature loading and error
  React.useEffect(() => {
    if (activeTab === 'UTILS') {
      if (signLoading && !signError) {
        setLoading(true)
        setMessage('Waiting for Signature')
      } else if (signError && !signLoading) {
        setMessage('Signature Failed')
        setCrash(true)
        setLoading(false)
      } else if (!signError && !signLoading && salt) {
        setMessage('Signature Successful')
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signLoading, signError, activeTab, salt])

  return (
    <div
      className="page flex-column-sans-align"
      style={{
        maxWidth: '100%',
        top: '20px'
      }}>
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
      <div style={{ fontFamily:  'SF Mono' }}></div> 
      <div style={{ fontFamily:  'Spotnik' }}></div> 
      {/* Overlay */}
      <div id="overlay" className="overlay">
        <div className="overlay-content overlay-content-alt">
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
                marginRight: !isMobile ? '40px': '20px',
              }}
            >
              <button
                className='button'
                onClick={() => { window.location.href = '/', setKeypair(['', '', '']) }}
                data-tooltip='Homepage'
              >
                <div
                  className="flex-sans-direction"
                >
                  {!isMobile ? 'Home' : 'Home'}
                  <span className="material-icons" style={{ marginLeft: '3px' }}>home</span>
                </div>
              </button>
            </div>
            <div
              style={{
                marginLeft: !isMobile ? '-30px' : '-9px'
              }}
            >
              <Ticker variable={ savings }/>
            </div>
          </div>
          <div
            className='connect-button'
            style={{
              marginLeft: 'auto',
              display: 'flex',
              flexDirection: 'row',
              marginTop: !isMobile ? '-7%': '25px',
            }}
          >
            <button
              className='button clear'
              onClick={() => { window.scrollTo(0, 0); setFaqModal(true), setKeypair(['', '', '']) }}
              style={{ marginRight: 10, display: 'none' }}
              data-tooltip='Learn more'
            >
              <div
                className="flex-row"
              >
                {'about'}
                <span className="material-icons" style={{ marginLeft: '3px' }}>info</span>
              </div>
            </button>
            <button
              className='button clear'
              onClick={() => { window.scrollTo(0, 0); setTermsModal(true), setKeypair(['', '', '']) }}
              style={{ marginRight: 10, display: 'none' }}
              data-tooltip='Terms of Use'
            >
              <div
                className="flex-row"
              >
                {'terms'}<span>&nbsp;</span><span className="material-icons">gavel</span>
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
        }}>
        {/* Content */}
        <div className={ !isMobile && !isSearch ? 'heading-alt' : 'none' } style={{ flex: '1 1 auto' }}>
          <div style={{ marginTop: '-120px' }}>
            <div
              className="flex-column"
              style={{
                paddingTop: '100px'
              }}>
              {!isMobile && isDisconnected && (
                <div>
                  <img
                    className="icon-ccip2"
                    alt="sample-icon"
                    src="logo.png"
                    hidden
                  />
                  <h4
                    style={{
                      fontSize: '70px',
                      color: '#fc6603',
                      marginBottom: '20px'
                    }}
                  >
                    NameSys
                  </h4>
                  <h4
                    style={{
                      fontSize: 26,
                      color: '#eb8634'
                    }}>
                    Off-chain Records Manager
                  </h4>
                </div>
              )}
              {!isMobile && (isConnected || !isDisconnected) && (
                <div 
                  style={{ 
                    marginTop: '-35px',
                    marginBottom: '10px' 
                  }}
                >
                  <img
                    className="icon-ccip2"
                    alt="sample-icon"
                    src="logo.png"
                    hidden
                  />
                  <h4
                    style={{
                      fontSize: '52px',
                      color: '#fc6603',
                      marginBottom: '20px',
                      marginTop: '30px'
                    }}
                  >
                    NameSys
                  </h4>
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
                  <h4
                    style={{
                      fontSize: '52px',
                      color: '#fc6603',
                      marginBottom: '20px'
                    }}
                  >
                    NameSys
                  </h4>
                  <h4
                    style={{
                      fontSize: 26,
                      color: '#eb8634'
                    }}>
                    Off-chain Records Manager
                  </h4>
                </div>
              )}
              {isMobile && (isConnected || !isDisconnected) && (
                <div 
                  className="flex-column"
                  style={{ 
                    marginTop: '-30px',
                    marginBottom: isMobile ? '10px' : '2px'
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
                  <h4
                    style={{
                      fontSize: '40px',
                      color: '#fc6603',
                      marginTop: '10px' 
                    }}
                  >
                    NameSys
                  </h4>
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
                  setActiveTab('OWNER'),
                  cache.length > 0 ? setMeta(cache) : console.error('BUG'),
                  setTokenIDLegacy(''),
                  setTokenIDWrapper(''),
                  setQuery(''),
                  setSuccess(false),
                  setManager(''),
                  cache.length > 0 ? setLoading(false) : (empty ? setLoading(false) : setLoading(true)),
                  setErrorModal(false),
                  setKeypair(['', '', '']),
                  !cache ? '' : setSuccess(true)
                }}
                className='button-header'
                disabled={activeTab === 'OWNER' || loading}
                data-tooltip='Show names you own'
              >
                <div
                  className="flex-sans-direction"
                >
                  {'NAMES'}
                  <span className="material-icons" style={{ marginLeft: '3px' }}>manage_accounts</span>
                </div>
              </button>
              <button
                onClick={() => {
                  activeTab === 'SEARCH' ? '' : setCache(flash),
                  setMeta([]),
                  setActiveTab('UTILS'),
                  setSuccess(false),
                  setManager(''),
                  setLoading(true),
                  setQuery(''),
                  setErrorModal(false),
                  setKeypair(['', '', '']),
                  setMessage('Please Wait')
                }}
                className='button-header'
                disabled={activeTab === 'UTILS' || loading}
                data-tooltip='NameSys Utility Functions'
              >
                <div
                  className="flex-sans-direction"
                >
                  {'UTILS'}
                  <span className="material-icons" style={{ marginLeft: '3px' }}>supervised_user_circle</span>
                </div>
              </button>
              <button
                onClick={() => {
                  activeTab === 'UTILS' ? '' : setCache(flash),
                  setMeta([]),
                  setActiveTab('SEARCH'),
                  setSuccess(false),
                  setManager(''),
                  setLoading(true),
                  setQuery(''),
                  setErrorModal(false),
                  setMessage('Please Wait')
                }}
                className='button-header'
                disabled={activeTab === 'SEARCH' || loading}
                data-tooltip='Search for an ENS name'
              >
                <div
                  className="flex-sans-direction"
                >
                  {'SEARCH'}
                  <span className="material-icons" style={{ marginLeft: '3px' }}>search</span>
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
                    marginTop: '40px'
                  }}
                >
                  <div
                    style={{
                      color: '#fc6603',
                      fontWeight: '700'
                    }}
                  >
                    { activeTab !== 'OWNER' ? `${message}` :
                      (previewModalState.modalData ? 'Please wait' : `${message}`)
                    }
                  </div>
                  <div
                    style={{
                      color: '#fc6603',
                      fontWeight: '700',
                      fontFamily: 'SF Mono'
                    }}
                  >
                    { activeTab !== 'OWNER' || length < 3 ? '' :
                      (previewModalState.modalData ? '' : `${progress}/${length}`)
                    }
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
                    marginTop: '40px'
                  }}
                >
                  <div
                    style={{
                      color: '#fc6603',
                      fontWeight: '700'
                    }}
                  >
                    { 'Please Wait' }
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
                  fontWeight: '700'
                }}
              >
                <span
                  style={{
                    marginRight: '5px'
                  }}
                >
                  names you own
                </span>
                <button
                  className="button-tiny"
                  onClick={() => {
                    setHelpModal(true),
                    setIcon('info'),
                    setColor('cyan'),
                    setHelp('<span>This list <span style="color: orangered">does not</span> contain <span style="color: orange">Wrapped Names</span> or <span style="color: orange">Subdomains</span>. Please use the <span style="color: cyan">search</span> tab for missing names</span>')
                  }}
                  data-tooltip='Enlighten me'
                >
                  <div
                    className="material-icons smol"
                    style={{
                      color: 'cyan'
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
                    onItemClick={onItemClick}
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
                  onItemClick={onItemClick}
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
                    setHelpModal(true),
                    setIcon('info'),
                    setColor('cyan'),
                    setHelp('<span>NameSys Utility Functions to set <span style="color: cyan">Ownerhash</span> and <span style="color: cyan">Export Keys</span></span>')
                  }}
                  data-tooltip='Enlighten me'
                >
                  <div
                    className="material-icons smol"
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
                      setHelpModal(true),
                      setIcon('info'),
                      setColor('cyan'),
                      setHelp('<span>Sets <span style="color: cyan">Ownerhash</span> For All Names in a Wallet</span>')
                    }}
                    data-tooltip='Set New Ownerhash'
                  >
                    <div
                      className="material-icons smol"
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
                    color: 'rgb(255, 255, 255, 0.75)'
                  }}
                  type="text"
                  placeholder={"ipns://"}
                  disabled
                  value={ownerhash}
                  id="owner-hash"
                />
                <button 
                  className="button"
                  style={{
                    height: '38px',
                    width: '80px',
                    marginTop: '15px',
                    marginLeft: '15px'
                  }}
                  type="submit"
                  data-tooltip='Set New Ownerhash'
                  onClick={() => { 
                    setConfirm(true),
                    setChoice('ownerhash')
                  }}
                >
                  <div
                    className="flex-sans-direction"
                  >
                    <span>{'SET'}</span>
                    <span 
                      className="material-icons"
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
                      setHelpModal(true),
                      setIcon('info'),
                      setColor('cyan'),
                      setHelp('<span>Export your <span style="color: cyan">IPNS</span> and/or Records <span style="color: cyan">Signer</span> Keys</span>')
                    }}
                    data-tooltip='Export Keys'
                  >
                    <div
                      className="material-icons smol"
                      style={{
                        color: 'cyan'
                      }}
                    >
                      info_outline
                    </div>
                  </button>
                </div>
                <div
                  className="flex-sans-direction"
                  style={{
                    width: '90%'
                  }}
                >
                  <input
                    style={{
                      width: '100%',
                      paddingRight: '32px',
                      fontWeight: '400',
                      textAlign: 'left',
                      color: 'rgb(255, 255, 255, 0.75)'
                    }}
                    type="text"
                    placeholder={"IPNS Private Key"}
                    value={choice !== 'export' ? '' : keypair[0]}
                    id="export-ipns"
                    disabled
                  />
                  <button 
                    className="button-empty"
                    onClick={() => {
                      copyToClipboard('export-ipns'),
                      setColor('lime'),
                      setKeypair(['', keypair[1], keypair[2]])
                    }} 
                    data-tooltip='Copy IPNS Key'
                    style={{
                      marginLeft: '-25px',
                      color: color && !keypair[0] ? color : 'cyan'   
                    }}
                  >
                    <span 
                      className="material-icons"
                      style={{
                        fontSize: '22px',
                        fontWeight: '700'
                      }}
                    >
                      content_copy
                    </span>
                  </button>
                </div>
                <div
                  className="flex-sans-direction"
                  style={{
                    marginTop: '10px',
                    width: '90%'
                  }}
                >
                  <input
                    style={{
                      width: '100%',
                      paddingRight: '32px',
                      fontWeight: '400',
                      textAlign: 'left',
                      color: 'rgb(255, 255, 255, 0.75)'
                    }}
                    type="text"
                    placeholder={"CCIP Manager Key"}
                    value={choice !== 'export' ? '' : keypair[1]}
                    id="export-ccip"
                    disabled
                  />
                  <button 
                    className="button-empty"
                    onClick={() => {
                      copyToClipboard('export-ccip'),
                      setColor('lime'),
                      setKeypair([keypair[0], '', keypair[2]])
                    }} 
                    data-tooltip='Copy Manager Key'
                    style={{
                      marginLeft: '-25px',
                      color: color && !keypair[1] ? color : 'cyan'   
                    }}
                  >
                    <span 
                      className="material-icons"
                      style={{
                        fontSize: '22px',
                        fontWeight: '700'
                      }}
                    >
                      content_copy
                    </span>
                  </button>
                </div>
                <button 
                  className="button"
                  style={{
                    height: '38px',
                    width: '115px',
                    marginLeft: '15px',
                    marginTop: '15px'
                  }}
                  type="submit"
                  data-tooltip='Export Keys'
                  onClick={() => { 
                    setSalt(true),
                    setChoice('export')
                  }}
                >
                  <div
                    className="flex-sans-direction"
                  >
                    <span>{'EXPORT'}</span>
                    <span 
                      className="material-icons"
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
                    setHelpModal(true),
                    setIcon('info'),
                    setColor('cyan'),
                    setHelp('<span>Search for a name that you <span style="color: cyan">own</span></span>')
                  }}
                  data-tooltip='Enlighten me'
                >
                  <div
                    className="material-icons smol"
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
                  className="material-icons miui-smaller"
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
                  className="material-icons miui-smaller"
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
              left: '50%',
              transform: 'translateX(-50%)',
              bottom: 10,
              position: 'fixed'
            }}>
            <span
              className="material-icons">folder_open
            </span>
            &nbsp;
            <a
              href="https://github.com/namesys-eth/ccip2-eth-client"
              className="footer-text"
              target='_blank'
              rel="noreferrer"
            >
              GitHub
            </a>
          </div>
          {/* Modals */}
          <div id="modal">
            {previewModal && (
              <Preview
                onClose={() => setPreviewModal(false)}
                show={previewModal}
                _ENS_={nameToPreviewModal}
                chain={_Chain_}
                handleParentTrigger={handlePreviewTrigger}
                handleParentModalData={handlePreviewModalData}
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
                }}
                color={'red'}
                show={crash && !loading}
                title={'cancel'}
              >
                { message }
            </Error>
            <Error
              onClose={() => {
                setErrorModal(false),
                setTokenIDLegacy(''),
                setTokenIDWrapper(''),
                setQuery(''),
                setManager('')
              }}
              color={'red'}
              show={errorModal && !isSearch && !loading}
              title={'block'}
            >
              { errorMessage }
            </Error>
            <Error
              onClose={() => {
                setErrorModal(false),
                setTokenIDLegacy(''),
                setTokenIDWrapper(''),
                setQuery(''),
                setManager('')
              }}
              color={'red'}
              show={errorModal && isSearch && !loading}
              title={'block'}
            >
              { errorMessage }
            </Error>
            <Salt
                handleTrigger={handleSaltTrigger}
                handleModalData={handleSaltModalData}
                onClose={() => setSalt(false)}
                show={salt}
              >
            </Salt>
            <Confirm
              handleTrigger={handleConfirmTrigger}
              handleModalData={handleConfirmModalData}
              onClose={() => {
                setConfirm(false)
                }}
              show={confirm && !salt}
            >
              {'0'}
            </Confirm>
            <Help
                color={ color }
                _ENS_={ icon }
                onClose={() => setHelpModal(false)}
                show={helpModal}
              >
                { help }
            </Help>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Account
