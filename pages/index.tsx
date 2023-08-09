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
import MainSearchBox from '../components/MainSearchBox'
import * as constants from '../utils/constants'
import * as verifier from '../utils/verifier'

/// Homepage
const Home: NextPage = () => {
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
  const [tokenID, setTokenID] = React.useState('')
  const [manager, setManager] = React.useState('')
  const [query, setQuery] = React.useState('')
  const [savings, setSavings] = React.useState('')
  const [icon, setIcon] = React.useState('');
  const [color, setColor] = React.useState('');
  const [help, setHelp] = React.useState('');
  const [searchType, setSearchType] = React.useState('')
  const [recordhash, setRecordhash] = React.useState('')
  const [ownerhash, setOwnerhash] = React.useState('')
  const [owner, setOwner] = React.useState('')
  const [controller, setController] = React.useState('')
  const [onSearch, setOnSearch] = React.useState(false)
  const [previewModalState, setPreviewModalState] = React.useState<constants.MainBodyState>({
    modalData: '',
    trigger: false
  });

  // Handle Preview modal data return
  const handleParentModalData = (data: string) => {
    setPreviewModalState(prevState => ({ ...prevState, modalData: data }));
  };
  // Handle Preview modal trigger return
  const handleParentTrigger = (trigger: boolean) => {
    setPreviewModalState(prevState => ({ ...prevState, trigger: trigger }));
  };

  const isProduction = process.env.NEXT_PUBLIC_ENV === 'production'
  const _Chain_ = activeChain && (activeChain.name.toLowerCase() === 'mainnet' || activeChain.name.toLowerCase() === 'ethereum') ? '1' : '5'
  const ccip2Contract = constants.ccip2[_Chain_ === '1' ? 1 : 0]
  const ccip2Config = constants.ccip2Config[_Chain_ === '1' ? 1 : 0]

  // Get Owner with ethers.js
  async function getOwner(provider: any, _tokenID: string) {
    const contract = new ethers.Contract(constants.ensConfig[1].addressOrName, constants.ensConfig[1].contractInterface, provider);
    const _addr = await contract.ownerOf(_tokenID);
    if (_addr === ethers.constants.AddressZero) { return '0x' }
    return _addr
  }

  // Get Recordhash with ethers.js
  async function getRecordhash(provider: any, name: string) {
    const contract = new ethers.Contract(ccip2Config.addressOrName, ccip2Config.contractInterface, provider);
    const _recordhash = await contract.recordhash(ethers.utils.namehash(name));
    if (_recordhash === null) { return '0x' }
    return _recordhash
  }

  // Get historical gas savings
  async function getSavings() {
    const request = {
      type: 'gas'
    };
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
      );
      const data = await _RESPONSE.json();
      return data.response.gas;
    } catch (error) {
      console.error('Error:', 'Failed to get gas data from NameSys backend')
      return '';
    }
  }

  // Load historical gas savings on pageload
  React.useEffect(() => {
    constants.showOverlay(5);
    const getSaving = async () => {
      const _savings = await getSavings()
      setSavings(_savings)
    }
    getSaving()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle migration from Preview modal
  React.useEffect(() => {
    if (previewModalState.trigger) { // Trigger update when one of the names is migrated
      let _LIST = meta
      const index = _LIST.findIndex(item => `${item.name}.eth` === previewModalState.modalData?.split(':')[0])
      const _update = async () => {
        if (previewModalState.modalData) {
          const _Resolver = await constants.provider.getResolver(previewModalState.modalData.split(':')[0]) // Get updated Resolver
          const __Recordhash = await verifier.verifyRecordhash(previewModalState.modalData.split(':')[0], ccip2Config) // Get updated Recordhash
          const __Ownerhash = await verifier.verifyOwnerhash(ccip2Config, accountData?.address ? accountData?.address : constants.zeroAddress) // Get updated Ownerhash
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
    setPreviewModal(true);
    setNameToPreview(name);
  }

  /// ENS Domain Search Functionality
  // Read ENS Legacy Registry for Controller record of ENS domain
  const { data: _Controller_ } = useContractRead(
    constants.ensConfig[1],
    'getApproved',
    {
      args: [
        tokenID
      ]
    }
  )

  // Read ENS Legacy Registry for Owner record of ENS domain
  const { data: _Owner_, isLoading: ownerLoading, isError: ownerError } = useContractRead(
    constants.ensConfig[1],
    'ownerOf',
    {
      args: [
        tokenID
      ]
    }
  )

  // Read Recordhash from CCIP2 Resolver
  const { data: _Recordhash_ } = useContractRead(
    ccip2Config, // CCIP2 Resolver
    'recordhash',
    {
      args: [
        ethers.utils.namehash(query)
      ]
    }
  )

  // Read Ownerhash from CCIP2 Resolver
  const { data: _Ownerhash_ } = useContractRead(
    ccip2Config, // CCIP2 Resolver
    'ownerhash',
    {
      args: [
        ethers.utils.keccak256(ethers.utils.solidityPack(['address'], [accountData?.address ? accountData?.address : constants.zeroAddress]))
      ]
    }
  )

  // Set in-app manager for the ENS domain
  React.useEffect(() => {
    if (_Owner_ && _Controller_ && _Controller_?.toString() !== constants.zeroAddress) {
      setManager(_Controller_.toString())
      setController(_Controller_.toString())
      setOwner(_Owner_.toString())
    } else if (_Owner_ && _Controller_?.toString() === constants.zeroAddress) {
      setManager(_Owner_.toString())
      setOwner(_Owner_.toString())
    } else {
      setTimeout(() => {
        setLoading(false)
      }, 2000);
    }
  }, [tokenID, _Controller_, _Owner_])

  // Get data from Ethers.JS if wallet is not connected
  React.useEffect(() => {
    if (!accountData?.address && tokenID && tokenID !== '0x' && query && query !== '') {
      const _setOrigins = async () => {
        let _Owner = await getOwner(constants.provider, tokenID)
        let _Recordhash = await getRecordhash(constants.provider, query)
        if (_Owner && _Recordhash) {
          setOwner(_Owner)
          setRecordhash(_Recordhash)
        } else {
          setOwner('')
          setSuccess(false)
        }
      }
      _setOrigins()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, tokenID])

  // Shows search result for ENS domain search
  React.useEffect(() => {
    if (query.length > 0 && recordhash) {
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
              if (recordhash && recordhash.toString() !== '0x' && items[0].migrated === '1/2') {
                items[0].migrated = '1'
              } else if (ownerhash && ownerhash.toString() !== '0x' && items[0].migrated === '1/2') {
                items[0].migrated = '3/4'
              }
              setMeta(items)
              setSuccess(true)
            } else {
              setSuccess(false)
            }
          })
      }
      setMetadata()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, recordhash, ownerhash])

  // Captures Recordhash hook
  React.useEffect(() => {
    if (_Recordhash_) {
      setRecordhash(_Recordhash_.toString())
    }
  }, [_Recordhash_])
  // Captures Oecordhash hook
  React.useEffect(() => {
    if (_Ownerhash_) {
      setOwnerhash(_Ownerhash_.toString())
    }
  }, [_Ownerhash_])

  React.useEffect(() => {
    if (success) {
      if (!ownerLoading && !ownerError) {
        if (owner && owner !== null && owner !== constants.zeroAddress) {
          setErrorModal(false)
          setLoading(false)
          setEmpty(false)
        } else {
          setErrorMessage('Name not Registered')
          setErrorModal(true)
          setLoading(false)
          setEmpty(true)
          setQuery('')
        }
      } else if (ownerError) {
        setErrorMessage('Failed to Fetch')
        setErrorModal(true)
        setLoading(false)
        setEmpty(true)
        setQuery('')
      }
    } else {
      if (!owner || owner === null || owner === constants.zeroAddress) {
        setErrorMessage('Name not Registered')
        setErrorModal(true)
        setLoading(false)
        setEmpty(true)
        setQuery('')
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success, owner])


  // Sets tokenID for ENS domain search result
  React.useEffect(() => { 
    if (query) {
      try {
        let labelhash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(query.split('.eth')[0]))
        let token = ethers.BigNumber.from(labelhash)
        setTokenID(token.toString())
      } catch (error) {
        console.log('Warning:', 'BigNumberWarning')
      }
    }
  }, [query])

  // Triggers search of ENS domain
  const handleNameSearch = (query: string) => {
    setMeta([])
    setTokenID('')
    setManager('')
    setLoading(true)
    setSearchType('search')
    setQuery(query)
    setOnSearch(true)
    if (accountData?.address) {
      console.log('WAGMI QUERY:', query)
    } else {
      console.log('ETHERS QUERY:', query)
    }  
  }

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
                disabled={!isConnected}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
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
              flexDirection: 'row',
              marginTop: !isMobile ? '-7%': '25px',
            }}
          >
            <div
              style={{
                marginRight: !isMobile ? '15px' : '10px',
                marginTop: !isMobile ? '8px' : '10px',
                color: '#fc6603',
                fontFamily: 'SF Mono',
                fontSize: !isMobile ? '18px' : '15px',
              }}
            >
              <span
                style={{
                  fontFamily: 'Spotnik',
                  fontSize: !isMobile ? '12px' : '10px',
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
                  fontSize: !isMobile ? '15px' : '12px',
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
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
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
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
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
            <MainSearchBox
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
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  marginTop: '-10px',
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
                  search results
                </span>
                <button
                  className="button-tiny"
                  onClick={() => {
                    setModal(true),
                    setIcon('info'),
                    setColor('skyblue'),
                    setHelp('search results for your query')
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
                  label={isConnected && manager === accountData?.address ? 'edit' : 'view'}
                  items={meta}
                  onItemClick={onItemClick}
                />
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
                  setTokenID(''),
                  setQuery(''),
                  setManager('')
              }}
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
