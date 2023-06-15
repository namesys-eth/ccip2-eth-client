/// Homepage
import React from 'react'
import Head from 'next/head'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import type { NextPage } from 'next'
import {
  useConnect,
  useAccount,
  useContractRead
} from 'wagmi'
import { ethers } from 'ethers'
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

/// Homepage
const Home: NextPage = () => {
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
  const [cache, setCache] = React.useState<any[]>([])
  const [response, setResponse] = React.useState(false)
  const [onSearch, setOnSearch] = React.useState(false)
  const [modalState, setModalState] = React.useState<constants.MainBodyState>({
    modalData: false,
    trigger: false
  });

  // Handle Preview modal data return
  const handleParentModalData = (data: boolean) => {
    setModalState(prevState => ({ ...prevState, modalData: data }));
  };
  // Handle Preview modal trigger return
  const handleParentTrigger = (trigger: boolean) => {
    setModalState(prevState => ({ ...prevState, trigger: trigger }));
  };

  /* GraphQL instance; need subgraph for this
  const logNames = useCallback(async () => {
    let EnsQuery = await fetch(EnsGraphApi, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        query: `
        query {
          {
            account(id: "${accountData?.address?.toLowerCase()}") {
              domains(first: 1000) {
                id
                name
              }
              registrations(first: 1000) {
                id
                labelName
              }
            }
          }
        }`,
      })
    })
    const { data } = await EnsQuery.json()
    setMeta(data)
  }, [accountData])
  */

  // Get historical gas savings
  async function getSavings() {
    const request = {
      type: 'gas'
    };
    try {
      const response = await fetch(
        "https://sshmatrix.club:3003/gas",
        {
          method: "post",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(request)
        }
      );
      const data = await response.json();
      return data.response.gas;
    } catch (error) {
      console.log('Failed to get gas data from NameSys backend')
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
  const { data: _Owner_ } = useContractRead(
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
    constants.ccip2Config[0], // CCIP2 Resolver
    'recordhash',
    {
      args: [
        ethers.utils.namehash(query)
      ]
    }
  )

  // Set in-app manager for the ENS domain
  React.useEffect(() => {
    if (_Controller_ && _Controller_?.toString() !== '0x' + '0'.repeat(40)) {
      setManager(_Controller_.toString())
    } else if (_Controller_?.toString() === '0x' + '0'.repeat(40) && _Owner_) {
      setManager(_Owner_.toString())
    } else {
      setTimeout(() => {
        setLoading(false)
        setResponse(false)
      }, 2000);
    }
  }, [tokenID, _Controller_, _Owner_])

  // Shows search result for ENS domain search
  React.useEffect(() => {
    if (query.length > 0) {
      setResponse(true)
      var allEns: string[] = []
      var items: any[] = []
      allEns.push(query.split('.eth')[0])
      const setMetadata = async () => {
        constants.provider.getResolver(query)
          .then((response) => {
            items.push({
              'key': 1, // Redundant [?]
              'name': query.split('.eth')[0],
              'migrated': response?.address === constants.ccip2[0] ? '1/2' : '0'
            })
            if (items.length > 0 && response?.address) {
              if (_Recordhash_?.toString() !== '0x' && items[0].migrated === '1/2') {
                items[0].migrated = '1'
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
  }, [query])

  React.useEffect(() => {
    if (success && _Owner_ && _Owner_.toString() !== constants.zeroAddress) {
      console.log('Name is Registered')
      setErrorModal(false)
      setLoading(false)
      setEmpty(false)
    } else {
      console.log('Name not Registered')
      setErrorMessage('Name not Registered')
      setErrorModal(true)
      setLoading(false)
      setEmpty(true)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success])


  // Sets tokenID for ENS domain search result
  React.useEffect(() => { 
    if (query) {
      try {
        let labelhash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(query.split('.eth')[0]))
        let token = ethers.BigNumber.from(labelhash)
        setTokenID(token.toString())
      } catch (error) {
        console.log('BigNumberWarning')
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
    console.log(`Searching for ${query}`)
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
                onClick={() => { window.location.href = '/account' }}
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
            <button
              className='button clear'
              onClick={() => { window.scrollTo(0, 0); setFaqModal(true) }}
              style={{ marginRight: 10 }}
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
              style={{ marginRight: 10 }}
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
