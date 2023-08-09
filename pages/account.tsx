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
import * as constants from '../utils/constants'
import * as verifier from '../utils/verifier'
import { _KEYGEN } from '../utils/keygen'
import * as Name from 'w3name'
import * as ed25519_2 from 'ed25519-2.0.0' // @noble/ed25519 v2.0.0

const Account: NextPage = () => {
  const { activeChain, } = useNetwork()
  const { data: accountData } = useAccount()
  const { isConnected } = useConnect()
  const [meta, setMeta] = React.useState<any[]>([])
  const [faqModal, setFaqModal] = React.useState(false)
  const [modal, setModal] = React.useState(false)
  const [termsModal, setTermsModal] = React.useState(false)
  const [errorModal, setErrorModal] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState('')
  const [previewModal, setPreviewModal] = React.useState(false)
  const [nameToPreviewModal, setNameToPreview] = React.useState('')
  const [loading, setLoading] = React.useState(true)
  const [empty, setEmpty] = React.useState(false)
  const [success, setSuccess] = React.useState(false)
  const [tab, setTab] = React.useState('OWNER')
  const [tokenID, setTokenID] = React.useState('')
  const [manager, setManager] = React.useState('')
  const [query, setQuery] = React.useState('')
  const [savings, setSavings] = React.useState('')
  const [icon, setIcon] = React.useState('')
  const [color, setColor] = React.useState('skyblue')
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
  const [wallet, setWallet] = React.useState('') // Tracks wallet changes
  const [recordhash, setRecordhash] = React.useState('') // Recordhash
  const [ownerhash, setOwnerhash] = React.useState('') // Ownerhash
  const [keypair, setKeypair] = React.useState<string[]>(['', '', '']) // Exported keypairs [ed25519-priv, secp256k1, ed25519-pub]
  const [salt, setSalt] = React.useState(false) // Trigger signature for key export
  const [CID, setCID] = React.useState(''); // IPNS pubkey/CID value
  const [previewModalState, setPreviewModalState] = React.useState<constants.MainBodyState>({
    modalData: '',
    trigger: false
  }) // Preview modal state
  const [saltModalState, setSaltModalState] = React.useState<constants.MainBodyState>({
    modalData: undefined,
    trigger: false
  }) // Salt modal state
  const recoveredAddress = React.useRef<string>()


  // Copy text
  function copyToClipboard(element: string) {
    const copyText = document.getElementById(element) as HTMLInputElement
    copyText.select()
    copyText.setSelectionRange(0, 99999)
    
    navigator.clipboard.writeText(copyText.value).then(() => {
        console.log('LOG:', 'Copied!')
    }).catch((error) => {
        console.error('ERROR:', error)
    })
  }

  // Handle Salt modal data return
  const handleSaltModalData = (data: string | undefined) => {
    setSaltModalState(prevState => ({ ...prevState, modalData: data }));
  };
  // Handle Salt modal trigger
  const handleSaltTrigger = (trigger: boolean) => {
    setSaltModalState(prevState => ({ ...prevState, trigger: trigger }));
  };

  // Handle Preview modal data return
  const handlePreviewModalData = (data: string) => {
    setPreviewModalState(prevState => ({ ...prevState, modalData: data }))
  }
  // Handle Preview modal trigger return
  const handlePreviewTrigger = (trigger: boolean) => {
    setPreviewModalState(prevState => ({ ...prevState, trigger: trigger }))
  }

  const _Chain_ = activeChain && (activeChain.name.toLowerCase() === 'mainnet' || activeChain.name.toLowerCase() === 'ethereum') ? '1' : '5'
  const ccip2Contract = constants.ccip2[_Chain_ === '1' ? 1 : 0]
  const ccip2Config = constants.ccip2Config[_Chain_ === '1' ? 1 : 0]

  // Signature S1 statement; S1(K1) [IPNS Keygen]
  // S1 is not recovered on-chain; no need for buffer prepend and hashing of message required to sign
  function statementIPNSKey(source: string, caip10: string, extradata: string) {
    let _toSign = `Requesting Signature For IPNS Key Generation\n\nOrigin: ${source}\nKey Type: ed25519\nExtradata: ${extradata}\nSigned By: ${caip10}`
    let _digest = _toSign
    //console.log('S1 Message/Digest:', _digest)
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
  // Read ENS Legacy Registry for Owner record of ENS domain
  const { data: _Owner_ } = useContractRead(
    constants.ensConfig[1],
    'ownerOf',
    {
      args: [
        tokenID
      ]
    }
  )

  // Read Ownerhash from CCIP2 Resolver
  const { data: _Ownerhash_ } = useContractRead(
    ccip2Config, // CCIP2 Resolver
    'ownerhash',
    {
      args: [
        accountData?.address
      ]
    }
  )

  // Read Recordhash from CCIP2 Resolver
  const { data: _Recordhash_ } = useContractRead(
    ccip2Config, // CCIP2 Resolver
    'recordhash',
    {
      args: [
        ethers.utils.namehash(process)
      ]
    }
  )

  // Sets Ownerhash in CCIP2 Resolver
  const {
    data: response2of2,
    write: initOwnerhash,
    isLoading: isSetOwnerhashLoading,
    isSuccess: isSetOwnerhashSuccess,
    isError: isSetOwnerhashError
  } = useContractWrite(
    ccip2Config,
    'setOwnerhash',
    {
      args: [ 
        constants.encodeContenthash(CID)
      ]
    }
  );

  // Get historical gas savings
  async function getSavings() {
    const request = {
      type: 'gas'
    }
    try {
      const _RESPONSE = await fetch(
        "https://sshmatrix.club:3003/gas",
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
      const index = _LIST.findIndex(item => `${item.name}.eth` === previewModalState.modalData)
      const _update = async () => {
        if (previewModalState.modalData) {
          const _Resolver = await constants.provider.getResolver(previewModalState.modalData) // Get updated Resolver
          const flag = await verifier.verifyRecordhash(previewModalState.modalData, ccip2Config) // Get updated Recordhash
          _LIST[index].migrated = _Resolver?.address === ccip2Contract && flag ? '1' : (
            _Resolver?.address === ccip2Contract && !flag ? '1/2' : '0' // Set new flag
          )
        }
      }
      _update()
      setMeta(_LIST)
      setFlash(_LIST)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previewModalState])

  // Triggers S1(K1) after password is set
  React.useEffect(() => {
    if (saltModalState.trigger && !keypair[0] && !keypair[1]) {
      let _origin = 'eth:' + accountData?.address
      let _caip10 = `eip155:${_Chain_}:${accountData?.address}`  // CAIP-10
      signMessage({ 
        message: statementIPNSKey(
          _origin,
          _caip10,
          ethers.utils.keccak256(ethers.utils.solidityPack(
            ['bytes32', 'address'], 
            [
              ethers.utils.keccak256(ethers.utils.solidityPack(['string'], [saltModalState.modalData])), 
              accountData?.address
            ]
          ))
        ) 
      })
      setKeygen(true)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saltModalState]);

  // Triggers S1(K1) after password is set
  React.useEffect(() => {
    if (!keypair[0] && !keypair[1] && signature) {
      //setLoading(true)
      //setMessage('Generating IPNS Key')
      const keygen = async () => {
        let _origin = 'eth:' + accountData?.address
        let _caip10 = `eip155:${_Chain_}`  // CAIP-10
        const __keypair = await _KEYGEN(_origin, _caip10, signature, saltModalState.modalData)
        setKeypair([__keypair[0][0], __keypair[1][0], __keypair[0][1]])
        //setMessage('IPNS Key Generated')
        //setLoading(false)
      };
      keygen()
    } else {
      //setMessage('IPNS Key/CID Exists')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keygen, signature]);

  // Triggers IPNS CID derivation with new S1(K1)
  React.useEffect(() => {
    if (keypair[0] && keypair[2]) {
      const CIDGen = async () => {
        let key = constants.formatkey([[keypair[0], keypair[2]], ['', '']])
        const w3name = await Name.from(ed25519_2.etc.hexToBytes(key))
        const CID_IPNS = w3name.toString()
        setCID(CID_IPNS)
        //setMessage('IPNS CID Generated')
      }
      CIDGen()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keypair]);

  // Triggers setting Ownerhash
  React.useEffect(() => {
    if (CID.startsWith('k5')) {
      initOwnerhash();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [CID]);

  // Handle wallet change by the user
  React.useEffect(() => {
    let _wallet = accountData?.address ? accountData?.address : constants.zeroAddress
    if (!loading) setLoading(true)
    if (!finish && process && _wallet === wallet) { // Prohibit wallet change when names are loading
      setMessage('Loading Names')
    } else {
      setMessage('Please be Patient') // Print message on bad wallet change
      setWallet(constants.zeroAddress)
    }
    if (!finish && !process) { // Print message on load
      setWallet(constants.zeroAddress)
      setMessage('Loading Names')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountData, finish])

  // Get all tokens for connected wallet
  React.useEffect(() => {
    const _wallet = accountData?.address ? accountData?.address : constants.zeroAddress
    if (!finish && length === 0 && _wallet !== wallet) {
      setLoading(true); // Show loading state when calling logTokens
      setWallet(_wallet)
      // Call logTokens directly here
      const loadTokens = async () => {
        const nfts = await constants.alchemy.nft.getNftsForOwner(_wallet)
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
          for (var i = 0; i < allTokens.length; i++) {
            // ISSUE: ENS Metadata service is broken and not showing all the names
            if (constants.ensContracts.includes(allTokens[i].contract.address) && allTokens[i].title) {
              count = count + 1
              //console.log('Count:', count)
              setGetting(count)
              allEns.push(allTokens[i].title.split('.eth')[0])
              const _Resolver = await constants.provider.getResolver(allTokens[i].title)
              items.push({
                'key': count,
                'name': allTokens[i].title.split('.eth')[0],
                'migrated': _Resolver?.address === ccip2Contract ? '1/2' : '0'
              })
              setProcess(allTokens[i].title)
              const flag = await verifier.verifyRecordhash(allTokens[i].title, ccip2Config)
              items[count - 1].migrated = flag && items[count - 1].migrated === '1/2' ? '1' : items[count - 1].migrated
            }
            if (i === allTokens.length - 1) {
              setFinish(true) // Flag finish of process
              setLength(0)
              setProgress(0)
              setMessage('Showing Names')
              setMeta(items)
              setFlash(items)
              setLoading(false)
            }
          }
        } 
      }
      loadTokens()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountData])

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
    if (_Owner_ && _Owner_?.toString() !== constants.zeroAddress) {
      setManager(_Owner_.toString())
    } else if (tab !== 'OWNER') {
      setTimeout(() => {
        setLoading(false)
        setResponse(false)
      }, 2000)
    }
  }, [tokenID, _Owner_, tab])

  // Handle search for a name
  React.useEffect(() => {
    if (manager && manager === accountData?.address && query.length > 0) {
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
              if (recordhash && recordhash !== '0x' && items[0].migrated === '1/2') {
                items[0].migrated = '1'
              } else if (ownerhash && ownerhash !== '0x' && items[0].migrated === '1/2') {
                items[0].migrated = '3/4'
              }
              setFlash(meta)
              setMeta(items)
              setSuccess(true)
            } else {
              setSuccess(false)
              setErrorMessage('Name not Registered')
              setErrorModal(true)
            }
          })
      }
      setMetadata()
    } else if (manager && manager !== accountData?.address)  {
      setLoading(false)
      setSuccess(false)
      setErrorMessage('You are not Owner or Manager')
      setErrorModal(true)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manager, accountData?.address, query, recordhash, ownerhash])

  React.useEffect(() => {
    if (success && _Owner_ && _Owner_.toString() !== constants.zeroAddress) {
      setErrorModal(false)
      setLoading(false)
    } else {
      setLoading(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success])

  // Capture Recordhash hook
  React.useEffect(() => {
    if (_Recordhash_) {
      setRecordhash(_Recordhash_.toString())
    }
  }, [_Recordhash_])

  // Capture Ownerhash hook
  React.useEffect(() => {
    if (_Ownerhash_) {
      setOwnerhash(_Ownerhash_.toString())
    }
  }, [_Ownerhash_])

  // Format query to ENS name and get tokenID
  React.useEffect(() => {
    if (query) {
      try {
        let labelhash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(query.split('.eth')[0]))
        let token = ethers.BigNumber.from(labelhash)
        setTokenID(token.toString())
      } catch (error) {
        //console.log('BigNumberWarning')
      }
    }
  }, [query])

  const handleNameSearch = (query: string) => {
    setLoading(true)
    setIsSearch(true)
    setProcess(query)
    setQuery(query)
    console.log('Query:', `Searching for ${query}`)
  }

  const { isSuccess: txSuccess2of2, isError: txError2of2, isLoading: txLoading2of2 } = useWaitForTransaction({
    hash: response2of2?.hash,
  });

  // Handles setting Recordhash after transaction 2 
  React.useEffect(() => {
    if (isSetOwnerhashSuccess && txSuccess2of2) {
      setOwnerhash(`ipns://${CID}`)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSetOwnerhashSuccess, txSuccess2of2]);

  // Handles Ownerhash transaction loading and error
  React.useEffect(() => {
    if (txLoading2of2 && !txError2of2) {
      setLoading(true)
      setMessage('Waiting for Transaction')
    }
    if (!txLoading2of2 && txError2of2) {
      setMessage('Transaction Failed')
      setCrash(true)
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [txLoading2of2, txError2of2]);

  return (
    <div
      className="page"
      style={{
        maxWidth: '100%',
        justifyContent: 'center',
        display: 'flex',
        flexDirection: 'column',
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
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
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
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
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
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
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
              style={{
                display: 'flex',
                justifyContent: 'center',
                textAlign: 'center',
                paddingTop: '100px'
              }}>
              {!isMobile && !isConnected && (
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
              {!isMobile && isConnected && (
                <div 
                  style={{ 
                    marginTop: '0px',
                    marginBottom: '20px' 
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
                      marginBottom: '20px' 
                    }}
                  >
                    NameSys
                  </h4>
                  <h4
                    style={{
                      fontSize: 22,
                      color: '#eb8634'
                    }}>
                    Your Names
                  </h4>
                </div>
              )}
              {isMobile && !isConnected && (
                <div>
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
              {isMobile && isConnected && (
                <div 
                  style={{ 
                    marginTop: '-15px',
                    marginBottom: '20px' 
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
                      marginBottom: '20px' 
                    }}
                  >
                    NameSys
                  </h4>
                  <h4
                    style={{
                      fontSize: 18,
                      color: '#eb8634'
                    }}>
                    Your Names
                  </h4>
                </div>
              )}
            </div>
          </div>
          <br></br><br></br>
          {!isConnected && (
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
          {isConnected && (
            <div
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                display: 'flex',
                flexDirection: 'row',
                marginBottom: '50px',
                marginTop: '-30px',
              }}>
              <button
                onClick={() => {
                  setTab('OWNER'),
                  setMeta(cache),
                  setTokenID(''),
                  setQuery(''),
                  setSuccess(false),
                  setManager(''),
                  setLoading(true),
                  setErrorModal(false),
                  setTimeout(() => {
                    setLoading(false)
                  }, 2000),
                  setKeypair(['', '', ''])
                }}
                className='button-header'
                disabled={tab === 'OWNER'}
                data-tooltip='Show names you own'
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  {'OWNED'}
                  <span className="material-icons" style={{ marginLeft: '3px' }}>manage_accounts</span>
                </div>
              </button>
              <button
                onClick={() => {
                  tab === 'SEARCH' ? '' : setCache(flash),
                  setMeta([]),
                  setTab('UTILS'),
                  setSuccess(false),
                  setManager(''),
                  setLoading(true),
                  setQuery(''),
                  setErrorModal(false),
                  setTimeout(() => {
                    setLoading(false)
                  }, 2000),
                  setKeypair(['', '', ''])
                }}
                className='button-header'
                disabled={tab === 'UTILS' || loading}
                data-tooltip='Search for a name that you manage'
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  {'UTILS'}
                  <span className="material-icons" style={{ marginLeft: '3px' }}>supervised_user_circle</span>
                </div>
              </button>
              <button
                onClick={() => {
                  tab === 'UTILS' ? '' : setCache(flash),
                  setMeta([]),
                  setTab('SEARCH'),
                  setSuccess(false),
                  setManager(''),
                  setLoading(true),
                  setQuery(''),
                  setErrorModal(false),
                  setTimeout(() => {
                    setLoading(false)
                  }, 2000)
                }}
                className='button-header'
                disabled={tab === 'SEARCH' || loading}
                data-tooltip='Search for an ENS name'
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  {'SEARCH'}
                  <span className="material-icons" style={{ marginLeft: '3px' }}>search</span>
                </div>
              </button>
            </div>
          )}
          {loading && isConnected && (
            <div>
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
                <div
                  style={{
                    paddingBottom: '10px',
                    alignItems: 'center',
                    justifyContent: 'center',
                    display: 'flex'
                  }}
                >
                  <Loading 
                    height={60}
                    width={60}
                  />
                </div>
                <div
                  style={{
                    marginTop: '40px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <div
                    style={{
                      color: '#fc6603',
                      fontWeight: '700'
                    }}
                  >
                    { tab !== 'OWNER' ? 'Please Wait' :
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
                    { tab !== 'OWNER' || length < 3 ? '' :
                      (previewModalState.modalData ? '' : `${progress}/${length}`)
                    }
                  </div>
                </div>
              </div>
              <h1>please wait</h1>
            </div>
          )}
          {!loading && tab === 'OWNER' && meta.length > 0 && isConnected && 
           !empty && wallet === accountData?.address && !finish && (
            <div>
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
                <div
                  style={{
                    paddingBottom: '10px',
                    alignItems: 'center',
                    justifyContent: 'center',
                    display: 'flex'
                  }}
                >
                  <Loading 
                    height={60}
                    width={60}
                  />
                </div>
                <div
                  style={{
                    marginTop: '40px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
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
              <h1>please wait</h1>
            </div>
          )}
          {!loading && tab === 'OWNER' && meta.length > 0 && isConnected &&
           !empty && wallet !== accountData?.address && (
            <div>
              <div
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  display: 'flex',
                  fontSize: '18px',
                  color: 'skyblue',
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
                    setModal(true),
                    setIcon('info'),
                    setColor('skyblue'),
                    setHelp('use search tab for missing names')
                  }}
                >
                  <div
                    className="material-icons smol"
                    style={{
                      color: 'skyblue'
                    }}
                  >
                    info_outline
                  </div>
                </button>
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
          {!loading && tab === 'SEARCH' && meta.length > 0 && isConnected && !empty && (
            <div>
              <div
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  display: 'flex',
                  fontSize: '18px',
                  color: 'skyblue',
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
          {!loading && tab === 'UTILS' && !success && meta && isConnected && (
            <div>
              <div
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  display: 'flex',
                  fontSize: '18px',
                  color: 'skyblue',
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
                    setModal(true),
                    setIcon('info'),
                    setColor('skyblue'),
                    setHelp('Global Settings and Exports')
                  }}
                >
                  <div
                    className="material-icons smol"
                    style={{
                      color: 'skyblue'
                    }}
                  >
                    info_outline
                  </div>
                </button>
              </div>
              <div
                className='export-container'
                style={{
                  maxHeight: '520px',
                  overflowY: 'auto',
                  marginBottom: '30px',
                  alignItems: 'center',
                  justifyContent: 'center',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    display: 'flex',
                    fontSize: '18px',
                    color: 'skyblue',
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
                      setModal(true),
                      setIcon('info'),
                      setColor('skyblue'),
                      setHelp('Sets Ownerhash For Wallet')
                    }}
                  >
                    <div
                      className="material-icons smol"
                      style={{
                        color: 'skyblue'
                      }}
                    >
                      info_outline
                    </div>
                  </button>
                </div>
                <input
                  style={{
                    width: '90%'
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
                    marginLeft: '15px',
                    color: 'rgb(255, 255, 255, 0.75)'
                  }}
                  type="submit"
                  data-tooltip='Set New Ownerhash'
                  onClick={() => { 
                    setSalt(true)
                  }}
                >
                  <div
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      display: 'flex',
                      flexDirection: 'row'
                    }}
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
                className='hash-container'
                style={{
                  maxHeight: '520px',
                  overflowY: 'auto',
                  marginBottom: '70px',
                  alignItems: 'center',
                  justifyContent: 'center',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    display: 'flex',
                    fontSize: '18px',
                    color: 'skyblue',
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
                      setModal(true),
                      setIcon('info'),
                      setColor('skyblue'),
                      setHelp('Exports IPNS and Manager Keys')
                    }}
                  >
                    <div
                      className="material-icons smol"
                      style={{
                        color: 'skyblue'
                      }}
                    >
                      info_outline
                    </div>
                  </button>
                </div>
                <div
                  style={{
                    width: '90%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    display: 'flex',
                    flexDirection: 'row'
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
                    value={keypair[0]}
                    id="export-ipns"
                    disabled
                  />
                  <button 
                    className="button-empty"
                    onClick={() => {
                      copyToClipboard('export-ipns'),
                      setColor('lightgreen'),
                      setKeypair(['', keypair[1], keypair[2]])
                    }} 
                    data-tooltip='Copy IPNS Key'
                    style={{
                      marginLeft: '-25px',
                      color: color && !keypair[0] ? color : 'skyblue'   
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
                  style={{
                    marginTop: '10px',
                    width: '90%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    display: 'flex',
                    flexDirection: 'row'
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
                    value={keypair[1]}
                    id="export-ccip"
                    disabled
                  />
                  <button 
                    className="button-empty"
                    onClick={() => {
                      copyToClipboard('export-ccip'),
                      setColor('lightgreen'),
                      setKeypair([keypair[0], '', keypair[2]])
                    }} 
                    data-tooltip='Copy Manager Key'
                    style={{
                      marginLeft: '-25px',
                      color: color && !keypair[1] ? color : 'skyblue'   
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
                    setSalt(true)
                  }}
                >
                  <div
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      display: 'flex',
                      flexDirection: 'row'
                    }}
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
          {!loading && tab === 'SEARCH' && !success && meta && isConnected && (
            <div>
              <div
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  display: 'flex',
                  fontSize: '18px',
                  color: 'skyblue',
                  marginBottom: '25px'
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
                    setModal(true),
                    setIcon('info'),
                    setColor('skyblue'),
                    setHelp('search for a name')
                  }}
                >
                  <div
                    className="material-icons smol"
                    style={{
                      color: 'skyblue'
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
          {!loading && empty && tab === 'OWNER' && (
            <div>
              <div
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  display: 'flex',
                  flexDirection: 'column',
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
          {!response && !manager && query && tab !== 'OWNER' && !loading && (
            <div>
              <div
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  display: 'flex',
                  flexDirection: 'column',
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
            style={{
              color: '#fc6603',
              top: 'auto',
              left: '50%',
              transform: 'translateX(-50%)',
              bottom: 10,
              alignItems: 'center',
              justifyContent: 'center',
              display: 'flex',
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
                show={crash && !loading}
                title={'cancel'}
              >
                { message[0] }
            </Error>
            <Error
              onClose={() => {
                setErrorModal(false),
                setTokenID(''),
                setQuery(''),
                setManager('')
              }}
              show={errorModal && !isSearch && manager && !loading}
              title={'block'}
            >
              { errorMessage }
            </Error>
            <Error
              onClose={() => {
                setErrorModal(false),
                setTokenID(''),
                setQuery(''),
                setManager('')
              }}
              show={errorModal && isSearch && manager && !loading}
              title={'block'}
            >
              {'Not Owned By You'}
            </Error>
            <Salt
                handleTrigger={handleSaltTrigger}
                handleModalData={handleSaltModalData}
                onClose={() => setSalt(false)}
                show={salt}
              >
            </Salt>
            <Help
                color={ color }
                _ENS_={ icon }
                onClose={() => setModal(false)}
                show={modal}
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
