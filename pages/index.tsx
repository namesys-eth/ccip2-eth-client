/// Homepage
import React from 'react'
import Head from 'next/head'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import type { NextPage } from 'next'
import {
  useConnect,
  useAccount,
  useContractRead,
  useNetwork
} from 'wagmi'
import { ethers, providers } from 'ethers'
import { isMobile } from 'react-device-detect'
import Help from '../components/Help'
import Terms from '../components/Terms'
import Preview from '../components/Preview'
import Faq from '../components/FAQ'
import Error from '../components/Error'
import List from '../components/List'
import Ticker from '../components/Ticker'
import Loading from '../components/LoadingColors'
import BigSearch from '../components/BigSearch'
import * as constants from '../utils/constants'
import * as verifier from '../utils/verifier'
import * as ensContent from '../utils/contenthash'
import { isMainThread } from 'worker_threads'

/// Homepage
const Home: NextPage = () => {
  const { chain: activeChain } = useNetwork()
  const { address: _Wallet_, isConnected: isConnected, isDisconnected: isDisconnected } = useAccount()
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
  const [finish, setFinish] = React.useState(false)
  const [tokenIDLegacy, setTokenIDLegacy] = React.useState('')
  const [tokenIDWrapper, setTokenIDWrapper] = React.useState('')
  const [manager, setManager] = React.useState('')
  const [query, setQuery] = React.useState('')
  const [savings, setSavings] = React.useState('')
  const [icon, setIcon] = React.useState('')
  const [color, setColor] = React.useState('')
  const [help, setHelp] = React.useState('')
  const [searchType, setSearchType] = React.useState('')
  const [recordhash, setRecordhash] = React.useState('')
  const [ownerhash, setOwnerhash] = React.useState('')
  const [owner, setOwner] = React.useState('')
  const [onSearch, setOnSearch] = React.useState(false)
  const [previewModalState, setPreviewModalState] = React.useState<constants.MainBodyState>({
    modalData: '',
    trigger: false
  })

  // Handle Preview modal data return
  const handleParentModalData = (data: string) => {
    setPreviewModalState(prevState => ({ ...prevState, modalData: data }))
  }
  // Handle Preview modal trigger return
  const handleParentTrigger = (trigger: boolean) => {
    setPreviewModalState(prevState => ({ ...prevState, trigger: trigger }))
  }

  const isProduction = process.env.NEXT_PUBLIC_ENV === 'production'
  const _Chain_ = activeChain && (activeChain.name.toLowerCase() === 'mainnet' || activeChain.name.toLowerCase() === 'ethereum') ? '1' : '5'
  const ccip2Contract = constants.ccip2[_Chain_ === '1' ? 1 : 0]
  const ccip2Config = constants.ccip2Config[_Chain_ === '1' ? 1 : 0]

  // Get Owner with ethers.js
  async function getOwner(provider: any) {
    let _OwnerLegacy: string = ''
    if (query.split('.').length == 2) {
      const contractLegacy = new ethers.Contract(constants.ensConfig[1].addressOrName, constants.ensConfig[1].contractInterface, provider)
      try {
        _OwnerLegacy = await contractLegacy.ownerOf(tokenIDLegacy)
      } catch (error) {
      }  
    } else {
      const contractLegacy = new ethers.Contract(constants.ensConfig[0].addressOrName, constants.ensConfig[0].contractInterface, provider)
      try {
        _OwnerLegacy = await contractLegacy.owner(tokenIDLegacy)
      } catch (error) {
      } 
    }   
    const contractWrapper = new ethers.Contract(constants.ensConfig[_Chain_ === '1' ? 7 : 3].addressOrName, constants.ensConfig[_Chain_ === '1' ? 7 : 3].contractInterface, provider)
    let _OwnerWrapped: string = ''
    try {
      _OwnerWrapped = await contractWrapper.ownerOf(tokenIDWrapper)
    } catch (error) {
    }
    if (_OwnerLegacy === ethers.constants.AddressZero) { return '0x' }
    if (_OwnerLegacy === constants.ensContracts[_Chain_ === '1' ? 7 : 3]) {
      if (_OwnerWrapped !== ethers.constants.AddressZero) {
        return _OwnerWrapped
      } else {
        return '0x'
      }
    }
    return _OwnerLegacy
  }

  // Get Recordhash with ethers.js
  async function getRecordhash(provider: any, name: string) {
    const contract = new ethers.Contract(ccip2Config.addressOrName, ccip2Config.contractInterface, provider)
    let _recordhash: string = ''
    try {
      _recordhash = await contract.getRecordhash(ethers.utils.namehash(name))
    } catch (error) {
    }
    if (_recordhash === null) { return '' }
    return `ipns://${ensContent.decodeContenthash(_recordhash.toString()).decoded}`
  }

  // Get Ownerhash with ethers.js
  async function getOwnerhash(provider: any, address: string) {
    const contract = new ethers.Contract(ccip2Config.addressOrName, ccip2Config.contractInterface, provider)
    let _ownerhash: string = ''
    try {
      _ownerhash = await contract.getRecordhash(ethers.utils.hexZeroPad(address, 32).toLowerCase())
    } catch (error) {
    }
    if (_ownerhash === null) { return '' }
    return `ipns://${ensContent.decodeContenthash(_ownerhash.toString()).decoded}`
  }

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
      console.error('Error:', 'Failed to get gas data from NameSys backend')
      return ''
    }
  }

  // Load historical gas savings on pageload
  React.useEffect(() => {
    setOwner('')
    setOwnerhash('')
    setRecordhash('')
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
      const index = _LIST.findIndex(item => `${item.name}.eth` === previewModalState.modalData?.split(':')[0])
      const _update = async () => {
        if (previewModalState.modalData) {
          const _Resolver = await constants.provider.getResolver(previewModalState.modalData.split(':')[0]) // Get updated Resolver
          const __Recordhash = await verifier.verifyRecordhash(previewModalState.modalData.split(':')[0], ccip2Config, _Wallet_ ? _Wallet_ : constants.zeroAddress) // Get updated Recordhash
          const __Ownerhash = await verifier.verifyOwnerhash(ccip2Config, _Wallet_ ? _Wallet_ : constants.zeroAddress) // Get updated Ownerhash
          _LIST[index].migrated = _Resolver?.address === ccip2Contract && __Recordhash ? '1' : (
            _Resolver?.address === ccip2Contract && __Ownerhash ? '3/4' : (
            _Resolver?.address === ccip2Contract ? '1/2' : '0') // Set new flag
          )
        }
      }
      _update()
      setMeta(_LIST)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previewModalState])

  // Preserve metadata across pageloads
  React.useEffect(() => {
    const handleBeforeUnload = () => {
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [meta])

  // Open Preview modal for chosen ENS domain
  const onItemClick = (name: string) => {
    setPreviewModal(true)
    setNameToPreview(name)
  }

  /// ENS Domain Search Functionality
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
  const { data: _Recordhash_, isLoading: recordhashLoading, isError: recordhashError } = useContractRead({
    address: `0x${ccip2Config.addressOrName.slice(2)}`,
    abi: ccip2Config.contractInterface,
    functionName: 'getRecordhash',
    args: [ethers.utils.namehash(query)]
  })

  // Read Ownerhash from CCIP2 Resolver
  const { data: _Ownerhash_, isLoading: ownerhashLoading, isError: ownerhashError } = useContractRead({
    address: `0x${ccip2Config.addressOrName.slice(2)}`,
    abi: ccip2Config.contractInterface,
    functionName: 'getRecordhash',
    args: [ethers.utils.hexZeroPad(_Wallet_ ? _Wallet_ : constants.zeroAddress, 32).toLowerCase()]
  })

  // Set in-app manager for the ENS domain
  React.useEffect(() => {
    if (_OwnerLegacy_ && _OwnerLegacy_?.toString() !== constants.zeroAddress) {
      if (_OwnerLegacy_.toString() === constants.ensContracts[_Chain_ === '1' ? 7 : 3]) {
        if (_OwnerWrapped_ && _OwnerWrapped_?.toString() !== constants.zeroAddress) { 
          setManager(_OwnerWrapped_.toString())
          setOwner(_OwnerWrapped_.toString())
        }
      } else {
        setManager(_OwnerLegacy_.toString())
        setOwner(_OwnerLegacy_.toString())
      }
    } else {
      if (_OwnerDomain_ && _OwnerDomain_?.toString() !== constants.zeroAddress) {
        if (_OwnerDomain_.toString() === constants.ensContracts[_Chain_ === '1' ? 7 : 3]) {
          if (_OwnerWrapped_ && _OwnerWrapped_?.toString() !== constants.zeroAddress) { 
            setManager(_OwnerWrapped_.toString())
            setOwner(_OwnerWrapped_.toString())
          } else if (wrapperError) {
            setOwner('0x')
          }
        } else {
          setOwner(_OwnerDomain_.toString())
          setManager(_OwnerDomain_.toString())
        }
      } else {
        setOwner('0x')
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenIDLegacy, _OwnerLegacy_, tokenIDWrapper, _OwnerWrapped_, _OwnerDomain_])

  // Get data from Ethers.JS if wallet is not connected
  React.useEffect(() => {
    if (!_Wallet_ && tokenIDLegacy && tokenIDWrapper && query && query !== ''
      ) {
      const _setOrigins = async () => {
        let _Owner = await getOwner(constants.provider)
        let _Recordhash = await getRecordhash(constants.provider, query)
        let _Ownerhash = await getOwnerhash(constants.provider, _Owner)
        if (_Owner) {
          setOwner(_Owner)
          if (_Recordhash && _Ownerhash && (_Recordhash !== _Ownerhash)) {
            setRecordhash(_Recordhash)
            setOwnerhash(_Ownerhash)
          } else if (_Recordhash && _Ownerhash && (_Recordhash === _Ownerhash)) {
            setRecordhash('')
            setOwnerhash(_Ownerhash)
          } else if (_Recordhash && !_Ownerhash) {
            setRecordhash(_Recordhash)
            setOwnerhash('')
          } else {
            setRecordhash('')
            setOwnerhash('')
          }
        } else {
          setOwner('0x')
          setSuccess(false)
        }
      }
      _setOrigins()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, tokenIDLegacy, tokenIDWrapper])

  // Shows search result for ENS domain search
  React.useEffect(() => {
    if (query.length > 0) {
      var allEns: string[] = []
      var items: any[] = []
      allEns.push(query.split('.eth')[0])
      const setMetadata = async () => {
        constants.provider.getResolver(query)
          .then((_RESPONSE) => {
            items.push({
              'key': 1, // Redundant [?]
              'name': query.split('.eth')[0],
              'migrated': _RESPONSE?.address === ccip2Contract ? '1/2' : '0'
            })
            if (items.length > 0 && _RESPONSE?.address) {
              if (recordhash && recordhash.toString() !== 'ipns://' && items[0].migrated === '1/2') {
                items[0].migrated = '1'
              } else if (ownerhash && ownerhash.toString() !== 'ipns://' && items[0].migrated === '1/2') {
                items[0].migrated = '3/4'
              }
              setMeta(items)
              setSuccess(true)
              setFinish(true)
            } else {
              setSuccess(false)
              setFinish(true)
            }
          })
      }
      setMetadata()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, recordhash, ownerhash])

  // Captures Recordhash hook
  React.useEffect(() => {
    if (_Recordhash_ && (_Recordhash_ !== _Ownerhash_) && _Wallet_) {
      setRecordhash(`ipns://${ensContent.decodeContenthash(_Recordhash_.toString()).decoded}`)
    } else {
      setRecordhash('')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_Recordhash_, _Ownerhash_])
  // Captures Ownerhash hook
  React.useEffect(() => {
    if (_Ownerhash_ && _Wallet_) {
      setOwnerhash(`ipns://${ensContent.decodeContenthash(_Ownerhash_.toString()).decoded}`)
    } else {
      setOwnerhash('')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_Ownerhash_])

  // End name query
  React.useEffect(() => {
    if (success && finish) {
      if (owner !== '0x' && owner !== constants.zeroAddress) {
        setErrorModal(false)
        setLoading(true)
        setTimeout(() => {
          setLoading(false)
        }, 5000)
        setEmpty(false)
      } else {
        if (!wrapperLoading && !legacyLoading && !domainLoading) {
          setTimeout(() => {
            setLoading(false)
          }, 2000)
          setErrorMessage('Name not Registered')
          setErrorModal(true)
          setEmpty(true)
          setQuery('')
        }
      }      
    } else {
      if (finish) {
        setTimeout(() => {
          setLoading(false)
        }, 2000)
        setErrorMessage('Name not Registered')
        setErrorModal(true)
        setEmpty(true)
      } else {
        setLoading(true)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success, owner, finish])

  // Sets tokenID for ENS domain search result
  React.useEffect(() => { 
    if (query) {
      try {
        let _labelhash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(query.split('.eth')[0]))
        let _token = ethers.BigNumber.from(_labelhash)
        if (query.split('.').length == 2) {
          setTokenIDLegacy(_token.toString())
        } else {
          console.log(ethers.utils.namehash(query))
          setTokenIDLegacy(ethers.utils.namehash(query)) // Exception
        }
        let __labelhash = ethers.utils.namehash(query)
        let __token = ethers.BigNumber.from(__labelhash)
        setTokenIDWrapper(__token.toString())
      } catch (error) {
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, owner, manager])

  // Triggers search of ENS domain
  const handleNameSearch = (query: string) => {
    setLoading(true)
    setQuery(query)
    setMeta([])
    setTokenIDLegacy('')
    setTokenIDWrapper('')
    setManager('')
    setSearchType('search')
    setRecordhash('')
    setOwner('')
    setOnSearch(true)
    if (_Wallet_) {
    } else {
      setOwnerhash('')
    }  
  }

  return (
    <div
      className="page flex-column-sans-align"
      style={{
        maxWidth: '100vw',
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
            alt="corner-index"
            src="logo.png"
          />
        </div>
      )}
      <Head>
        <title>NameSys - Off-Chain Records Manager</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="shortcut icon" href="logo.png" />
        <link rel="preload" href="https://fonts.googleapis.com/icon?family=Material+Icons" as="style" />
        <link rel="preload" href="SF-Mono.woff2"  as="font" type="font/woff2" crossOrigin="anonymous"  />
        <link rel="preload" href="Spotnik.woff2"  as="font" type="font/woff2" crossOrigin="anonymous"  />
        <link rel="preload" href="Rajdhani.woff2" as="font" type="font/woff2" crossOrigin="anonymous"  />
      </Head>
      {/* Preload */}
      <div style={{ fontFamily: 'Rajdhani' }}></div> 
      <div style={{ fontFamily:  'SF Mono' }}></div> 
      <div style={{ fontFamily:  'Spotnik' }}></div> 
      {/* Overlay */}
      <div id="overlay" className="overlay">
        <div className="overlay-content">
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
      {/* Buttons */}
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
                onClick={() => { window.location.href = isProduction ? '/account.html' : '/account' }}
                data-tooltip='My Names'
                disabled={isDisconnected}
              >
                <div
                  className="flex-sans-direction"
                >
                  {!isMobile ? 'My Names' : 'Names'}&nbsp;<span className="material-icons">admin_panel_settings</span>
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
              flexDirection: isMobile ? 'column' : 'row',
              marginTop: !isMobile ? '-7%': '-5px',
            }}
          >
            <div
              style={{
                marginRight: !isMobile ? '15px' : '10px',
                marginTop: !isMobile ? '6px' : '10px',
                color: '#fc6603',
                fontFamily: 'SF Mono',
                fontSize: !isMobile ? '18px' : '13px',
              }}
            >
              <span
                style={{
                  fontFamily: 'Spotnik',
                  fontSize: !isMobile ? '12px' : '7.5px',
                  fontWeight: '700',
                  marginRight: '2px'
                }}
              >
                { 'v' } 
              </span>
                { '1.0.0' } 
              <span
                style={{
                  fontFamily: 'Spotnik',
                  fontSize: !isMobile ? '15px' : '10px',
                  fontWeight: '700',
                  marginLeft: '2px'
                }}
              >
                { '-beta' } 
              </span>
            </div>
            <button
              className='button clear'
              onClick={() => { window.scrollTo(0, 0); setFaqModal(true) }}
              style={{ marginRight: 10, display: 'none' }}
              data-tooltip='Learn more'
            >
              <div
                className="flex-row"
              >
                {'about'}<span style={{ fontFamily: 'SF Mono' }}>&nbsp;</span><span className="material-icons">info</span>
              </div>
            </button>
            <button
              className='button clear'
              onClick={() => { window.scrollTo(0, 0); setTermsModal(true) }}
              style={{ marginRight: 10, display: 'none' }}
              data-tooltip='Terms of Use'
            >
              <div
                className="flex-row"
              >
                {'terms'}&nbsp;<span className="material-icons">gavel</span>
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
          marginTop: onSearch ? '0px' : '40px'
        }}>
        {/* Content */}
        <div className={ !isMobile && !onSearch ? 'heading' : 'none' } style={{ flex: '1 1 auto' }}>
          <div style={{ marginTop: '-120px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                textAlign: 'center',
                paddingTop: '100px'
              }}
            >
              {!isMobile && (
                <div>
                  <img
                    className="icon-ccip2"
                    alt="sample-icon"
                    src="logo.png"
                    hidden
                  />
                  <h4
                    style={{
                      fontSize: onSearch ? '46px' : '50px',
                      marginTop: onSearch ? '20px' : '25px',
                      color: '#fc6603',
                      marginBottom: '10px'
                    }}
                  >
                    NameSys
                  </h4>
                  <h4
                    style={{
                      fontSize: onSearch ? '24px' : '28px',
                      color: '#eb8634'
                    }}
                  >
                    Off-chain Records Manager
                  </h4>
                </div>
              )}
              {isMobile && (
                <div>
                  <img
                    className="icon-ccip2"
                    alt="sample-icon"
                    src="logo.png"
                  />
                  <h4
                    style={{
                      fontSize: onSearch ? '36px' : '44px',
                      marginTop: onSearch ? '12px' : '10px',
                      color: '#fc6603'
                    }}
                  >
                    NameSys
                  </h4> 
                  <div
                    style={{
                      fontSize: onSearch ? '20px' : '24px',
                      fontWeight: 700,
                      color: '#eb8634'
                    }}
                  >
                    Off-chain Records Manager
                  </div>
                </div>
              )}
            </div>
          </div>
          <br></br><br></br>
          <div
            className='main-search-container'
            style={{
              maxHeight: '520px',
              overflowY: 'auto',
              marginBottom: '50px',
            }}
          >
            <BigSearch
              onSearch={handleNameSearch}
            />
          </div>
          {!onSearch && (
            <div>
              <div className="content-slider">
                <div className="slider">
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
                </div>
              </div>
            </div>
          )}
          {loading && onSearch && (
            <div>
              <div
                className="flex-column"
                style={{
                  marginTop: '-10px',
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
                    height={50}
                    width={50}
                  />
                </div>
                <div
                  style={{
                    marginTop: '40px'
                  }}
                >
                  <span
                    style={{
                      color: '#fc6603',
                      fontWeight: '700'
                    }}
                  >
                    { 'Please Wait' }
                  </span>
                </div>
              </div>
            </div>
          )}
          {!loading && meta.length > 0 && !empty && onSearch && (
            <div>
              <div
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  display: 'flex',
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
                  search results
                </span>
                <button
                  className="button-tiny"
                  onClick={() => {
                    setModal(true),
                    setIcon('info'),
                    setColor('cyan'),
                    setHelp('search results for your query')
                  }}
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
                className='list-container'
                style={{
                  maxHeight: '520px',
                  overflowY: 'auto',
                  marginBottom: '50px'
                }}
              >
                <List
                  label={(!isDisconnected || isConnected) && manager === _Wallet_ ? 'edit' : 'view'}
                  items={meta}
                  onItemClick={onItemClick}
                />
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
            </span>&nbsp;
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
                chain={constants.alchemyConfig.chainId}
                handleParentTrigger={handleParentTrigger}
                handleParentModalData={handleParentModalData}
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
                setErrorModal(false),
                  setTokenIDLegacy(''),
                  setTokenIDWrapper(''),
                  setQuery(''),
                  setManager('')
              }}
              color={'red'}
              show={errorModal && searchType === 'search' && !loading}
              title={'block'}
            >
              { errorMessage }
            </Error>
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

export default Home
