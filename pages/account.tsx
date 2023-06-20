/// My Names page (Accountpage)
import React from 'react'
import { useCallback } from 'react'
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
import SearchBox from '../components/SearchBox'
import * as constants from '../utils/constants'
import * as recordhash from '../utils/recordhash'

const Account: NextPage = () => {
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
  const [color, setColor] = React.useState('')
  const [help, setHelp] = React.useState('')
  const [searchType, setSearchType] = React.useState('')
  const [process, setProcess] = React.useState('') // Stores name under process
  const [progress, setProgress] = React.useState(0) // Stores progress
  const [cache, setCache] = React.useState<any[]>([]) // Preserves cache of metadata across tabs
  const [flash, setFlash] = React.useState<any[]>([]) // Saves metadata in temporary flash memory
  const [response, setResponse] = React.useState(false) // Tracks response of search query
  const [modalState, setModalState] = React.useState<constants.MainBodyState>({
    modalData: false,
    trigger: false
  }) // Child modal state

  // Handle Preview modal data return
  const handleParentModalData = (data: boolean) => {
    setModalState(prevState => ({ ...prevState, modalData: data }));
  }
  // Handle Preview modal trigger return
  const handleParentTrigger = (trigger: boolean) => {
    setModalState(prevState => ({ ...prevState, trigger: trigger }));
  }

  /* @dev : GraphQL Instance
  /// we need our own subgraph for this
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

  /// ENS Domain Config
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
        ethers.utils.namehash(process)
      ]
    }
  )

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
      console.log('Failed to get gas data from CCIP2 backend')
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

  // Get all tokens for an address
  const logTokens = useCallback(async () => {
    const nfts = await constants.alchemy.nft.getNftsForOwner(accountData?.address ? accountData.address : '')
    const allTokens = nfts.ownedNfts
    var allEns: string[] = []
    var items: any[] = []
    var count = 0
    for (var i = 0; i < allTokens.length; i++) {
      // ISSUE: ENS Metadata service is broken and not showing all the names
      if (constants.ensContracts.includes(allTokens[i].contract.address) && allTokens[i].title) {
        count = count + 1
        allEns.push(allTokens[i].title.split('.eth')[0])
        const _Resolver = await constants.provider.getResolver(allTokens[i].title)
        items.push({
          'key': count,
          'name': allTokens[i].title.split('.eth')[0],
          'migrated': _Resolver?.address === constants.ccip2[0] ? '1/2' : '0'
        })
        setProcess(allTokens[i].title)
        const flag = await recordhash.verifyRecordhash(allTokens[i].title)
        items[count - 1].migrated = flag && items[count - 1].migrated === '1/2' ? '1' : items[count - 1].migrated
      }
    }
    setMeta(items)
    setFlash(items)
    if (count === 0) {
      setEmpty(true)
    }
    setTimeout(() => {
      setLoading(false)
    }, 2000);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const getTokens = useCallback(async () => {
    if (accountData) {
      await logTokens()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  React.useEffect(() => {
    setLoading(true)
    const setMetadata = async () => {
      await getTokens()
        .then(() => {
          setTimeout(() => {
            setLoading(false)
          }, 2000);
        })
    }
    setMetadata()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountData, modalState])

  // Preserve metadata across tabs
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

  React.useEffect(() => {
    if (_Controller_ && _Controller_?.toString() !== constants.zeroAddress) {
      setManager(_Controller_.toString())
    } else if (_Owner_ && _Controller_?.toString() === constants.zeroAddress) {
      setManager(_Owner_.toString())
    } else if (tab !== 'OWNER') {
      setTimeout(() => {
        setLoading(false)
        setResponse(false)
      }, 2000);
    }
  }, [tokenID, _Controller_, _Owner_, tab])

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
              'migrated': _RESPONSE?.address === constants.ccip2[0] ? '1/2' : '0'
            })
            if (items.length > 0 && _RESPONSE?.address) {
              if (_Recordhash_ && _Recordhash_.toString() !== '0x' && items[0].migrated === '1/2') {
                items[0].migrated = '1'
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
      setSuccess(false)
      setErrorMessage('You are not Owner or Manager')
      setErrorModal(true)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manager, accountData?.address, query])

  React.useEffect(() => {
    if (success && _Owner_ && _Owner_.toString() !== constants.zeroAddress) {
      setErrorModal(false)
      setLoading(false)
    } else {
      setLoading(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success])

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

  const handleManagerSearch = (query: string) => {
    setLoading(true)
    setSearchType('MANAGER')
    setProcess(query)
    setQuery(query)
    console.log(`Searching Manager for ${query}`)
  }

  const handleNameSearch = (query: string) => {
    setLoading(true)
    setSearchType('SEARCH')
    setProcess(query)
    setQuery(query)
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
                onClick={() => { window.location.href = '/' }}
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
                  {!isMobile ? 'Home' : 'Home'}&nbsp;<span className="material-icons">home</span>
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
          margin: '50px 0 0 0'
        }}>
        {/* Content */}
        <div className={ !isMobile && !searchType ? 'heading-alt' : 'none' } style={{ flex: '1 1 auto' }}>
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
                  }, 2000)
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
                  {'OWNED'}&nbsp;
                  <span className="material-icons">manage_accounts</span>
                </div>
              </button>
              <button
                onClick={() => {
                  tab === 'SEARCH' ? '' : setCache(flash),
                  setMeta([]),
                  setTab('MANAGER'),
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
                disabled={tab === 'MANAGER' || loading}
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
                  {'MANAGED'}&nbsp;
                  <span className="material-icons">supervised_user_circle</span>
                </div>
              </button>
              <button
                onClick={() => {
                  tab === 'MANAGER' ? '' : setCache(flash),
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
                  {'SEARCH'}&nbsp;
                  <span className="material-icons">search</span>
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
                  marginTop: '40px'
                }}
              >
                <span
                  style={{
                    color: '#fc6603',
                    fontWeight: '700'
                  }}
                >
                  { tab !== 'OWNER' ? 'Please Wait' :
                    (modalState.modalData ? 'Please wait' : `Loading Names`)
                  }
                </span>
              </div>
              </div>
              <h1>please wait</h1>
            </div>
          )}
          {!loading && tab === 'OWNER' && meta.length > 0 && isConnected && !empty && (
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
                    setHelp('if a name that you own is not listed, please use the search 🔎 tab')
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
          {!loading && (tab === 'MANAGER' || tab === 'SEARCH') && meta.length > 0 && isConnected && !empty && (
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
          {!loading && tab === 'MANAGER' && !success && meta && isConnected && (
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
                  names you manage
                </span>
                <button
                  className="button-tiny"
                  onClick={() => {
                    setModal(true),
                    setIcon('info'),
                    setColor('skyblue'),
                    setHelp('search for an ENS name that you manage (or own)')
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
                  onSearch={handleManagerSearch}
                />
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
              show={errorModal && searchType === 'MANAGER' && manager && !loading}
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
              show={errorModal && searchType === 'SEARCH' && manager && !loading}
              title={'block'}
            >
              {'Not Owner or Manager'}
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

export default Account
