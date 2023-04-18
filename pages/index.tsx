import React from 'react'
import { useCallback } from 'react'
import Head from 'next/head'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import type { NextPage } from 'next'
import { Alchemy, Network } from "alchemy-sdk"
import {
  useConnect,
  useAccount,
  useFeeData,
  useContractRead
} from 'wagmi'
import iEnsRegistrar from '../contract-abi-ensRegistrar.json'
import iEnsWrapper from '../contract-abi-ensWrapper.json'
import { ethers } from 'ethers'
import { isMobile } from 'react-device-detect'
import Modal from '../components/Modal'
import Terms from '../components/Terms'
import Preview from '../components/Preview'
import Faq from '../components/FAQ'
import Error from '../components/Error'
import List from '../components/List'
import SearchBox from '../components/Search'
import LoadingIcons from 'react-loading-icons'
import * as Name from 'w3name'
import { ed25519Keygen } from '../utils/keygen'

const network = process.env.NEXT_PUBLIC_NETWORK
const alchemyConfig = {
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID,
  network: network === 'goerli' ? Network.ETH_GOERLI : Network.ETH_MAINNET
}
const alchemy = new Alchemy(alchemyConfig)
const ensRegistrars = [
  "0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85", // v1 Registrar
  "0x114d4603199df73e7d157787f8778e21fcd13066"  // v2 Name Wrapper
]
const ensInterface = [
  iEnsRegistrar,
  iEnsWrapper
]
const ensConfig = [{
  addressOrName: ensRegistrars[0],
  contractInterface: ensInterface[0]
},
{
  addressOrName: ensRegistrars[1],
  contractInterface: ensInterface[1]
}]
let metadata: React.SetStateAction<any[]>
const carousal = [
  '<span class="material-icons miui">energy_savings_leaf</span><br></br>Gasless <span style="color: skyblue">ENS</span> Records',
  '<span class="material-icons miui">hub</span><br></br>Decentralised Records Storage on <span style="color: skyblue">IPFS</span>',
  '<span class="material-icons miui">recycling</span><br></br>Unlimited Free Updates through in-built <span style="color: skyblue">IPNS</span> Support',
  '<span class="material-icons miui">badge</span><br></br><span style="color: skyblue">Dynamic</span> Avatars, Contenthash and Reverse Resolution',
  '<span class="material-icons miui">currency_bitcoin</span><br></br><span style="color: skyblue">Enjoy ENS gasfree</span>'
]

const Home: NextPage = () => {
  const { data: accountData } = useAccount()
  const { isConnected } = useConnect()
  const { data: gasData, isError } = useFeeData()
  const [meta, setMeta] = React.useState<any[]>([])
  const [faqModal, setFaqModal] = React.useState(false)
  const [modal, setModal] = React.useState(false)
  const [termsModal, setTermsModal] = React.useState(false)
  const [errorModal, setErrorModal] = React.useState(false)
  const [previewModal, setPreviewModal] = React.useState(false)
  const [nameToPreviewModal, setNameToPreview] = React.useState('')
  const [loading, setLoading] = React.useState(true)
  const [empty, setEmpty] = React.useState(false)
  const [success, setSuccess] = React.useState(false)
  const [option, setOption] = React.useState('owner')
  const [tokenID, setTokenID] = React.useState('')
  const [manager, setManager] = React.useState('')
  const [query, setQuery] = React.useState('')
  const [searchType, setSearchType] = React.useState('')
  const [cache, setCache] = React.useState<any[]>([])
  const [response, setResponse] = React.useState(false)

  /* @dev : GraphQL Instance
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

  const logTokens = useCallback(async () => {
    const nfts = await alchemy.nft.getNftsForOwner(accountData?.address ? accountData.address : '')
    const allTokens = nfts.ownedNfts
    var allEns: string[] = []
    var items: any[] = []
    var count = 0
    for (var i = 0; i < allTokens.length; i++) {
      // @TODO : ENS Metadata service is broken and not showing all the names
      if (ensRegistrars.includes(allTokens[i].contract.address) && allTokens[i].title) {
        count = count + 1
        allEns.push(allTokens[i].title.split('.eth')[0])
        items.push({
          'key': count,
          'name': allTokens[i].title.split('.eth')[0]
        })
      }
    }
    setMeta(items)
    if (count === 0) {
      setEmpty(true)
    } else {
      setEmpty(false)
    }
    setTimeout(() => {
      setLoading(false)
    }, 2000);
  }, [accountData])

  const getTokens = useCallback(async () => {
    if (accountData) {
      await logTokens()
    }
  }, [accountData, logTokens])

  React.useEffect(() => {
    setLoading(true)
    getTokens()
    if (metadata) {
      setMeta(metadata)
      setLoading(false)
    }
  }, [accountData, isConnected, getTokens])

  React.useEffect(() => {
    const handleBeforeUnload = () => {
      metadata = meta
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [meta])

  const onItemClick = (name: string) => {
    setPreviewModal(true);
    setNameToPreview(name);
  }

  const { data: controller } = useContractRead(
    ensConfig[0],
    'getApproved',
    {
      args: [
        tokenID
      ]
    }
  )

  const { data: owner } = useContractRead(
    ensConfig[0],
    'ownerOf',
    {
      args: [
        tokenID
      ]
    }
  )

  React.useEffect(() => {
    if (controller && controller?.toString() !== '0x' + '0'.repeat(40)) {
      setManager(controller.toString())
    } else if (controller?.toString() === '0x' + '0'.repeat(40) && owner) {
      setManager(owner.toString())
    } else {
      setTimeout(() => {
        setLoading(false)
        setResponse(false)
      }, 2000);
    }
  }, [tokenID, controller, owner])

  React.useEffect(() => {
    if (manager === accountData?.address) {
      setResponse(true)
      var allEns: string[] = []
      var items: any[] = []
      allEns.push(query.split('.eth')[0])
      items.push({
        'key': 1,
        'name': query.split('.eth')[0]
      })
      if (items) {
        setMeta(items)
        setSuccess(true)
        console.log('You are owner/manager')
        setErrorModal(false)
        setLoading(false)
      } else {
        setSuccess(false)
        setEmpty(true)
      }
    } else {
      setErrorModal(true)
      setSuccess(false)
    }
  }, [manager, accountData?.address, query])

  React.useEffect(() => {
    if (query) {
      try {
        let token = ethers.BigNumber.from(ethers.utils.keccak256(ethers.utils.toUtf8Bytes(query.split('.eth')[0])))
        setTokenID(token.toString())
      } catch (error) {
        console.log('BigNumberWarning')
      }
    }
  }, [query])

  React.useEffect(() => {
    const genRandomKey = async () => {
      const name = await Name.create()
      //console.log(name.key.bytes)
    };
    genRandomKey()
  }, [])

  const handleManagerSearch = (query: string) => {
    setLoading(true)
    setSearchType('manager')
    setQuery(query)
    console.log(`Searching Manager for ${query}`)
  }

  const handleNameSearch = (query: string) => {
    setLoading(true)
    setSearchType('search')
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
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'flex-start'
        }}>
        <img
          className="avatar"
          alt="sample"
          src="logo.png"
        />
      </div>
      <Head>
        <title>CCIP2 - Off-chain Records Manager</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width, user-scalable=no" />
        <link rel="shortcut icon" href="logo.png" />
      </Head>
      {/* Detect Device */}
      <div
        className='connect-button'
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'flex-end',
        }}>
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
      {/* Container */}
      <div
        className="container"
        style={{
          maxWidth: `inherit`,
          margin: '50px 0 0 0'
        }}>
        {/* Content */}
        <div style={{ flex: '1 1 auto' }}>
          <div style={{ marginTop: '0px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                textAlign: 'center'
              }}>
              {!isMobile && !isConnected && (
                <div>
                  <img
                    className="icon-ens"
                    alt="sample-icon"
                    src="ens.png"
                  />
                  <h4
                    style={{
                      fontSize: 36,
                      color: 'white'
                    }}>
                    Off-chain Records Manager
                  </h4>
                </div>
              )}
              {!isMobile && isConnected && (
                <div style={{ marginTop: '-50px' }}>
                  <img
                    className="icon-ens"
                    alt="sample-icon"
                    src="ens.png"
                  />
                  <h4
                    style={{
                      fontSize: 22,
                      color: 'white'
                    }}>
                    Off-chain Records Manager
                  </h4>
                </div>
              )}
              {isMobile && !isConnected && (
                <div>
                  <img
                    className="icon-ens"
                    alt="sample-icon"
                    src="ens.png"
                  />
                  <h4
                    style={{
                      fontSize: 26,
                      color: 'white'
                    }}>
                    Off-chain Records Manager
                  </h4>
                </div>
              )}
              {isMobile && isConnected && (
                <div>
                  <img
                    className="icon-ens"
                    alt="sample-icon"
                    src="ens.png"
                  />
                  <h4
                    style={{
                      fontSize: 18,
                      color: 'white'
                    }}>
                    Off-chain Records Manager
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
                    {carousal.map((item, index) => (
                      <li className={`anim${index + 1}`} key={index}>
                        <div className="home-modal-item">
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
                marginBottom: '50px'
              }}>
              <button
                onClick={() => {
                  setOption('owner'),
                    setMeta(cache),
                    setTokenID(''),
                    setQuery(''),
                    setSuccess(false),
                    setManager(''),
                    setLoading(true),
                    setTimeout(() => {
                      setLoading(false)
                    }, 2000)
                }}
                className='button-header'
                disabled={option === 'owner'}
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
                  {'owned'}&nbsp;
                  <span className="material-icons">manage_accounts</span>
                </div>
              </button>
              <button
                onClick={() => {
                  option === 'search' ? console.log(cache) : setCache(meta),
                    setMeta([]),
                    setOption('manager'),
                    setSuccess(false),
                    setManager(''),
                    setLoading(true),
                    setTimeout(() => {
                      setLoading(false)
                    }, 2000)
                }}
                className='button-header'
                disabled={option === 'manager'}
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
                  {'managed'}&nbsp;
                  <span className="material-icons">supervised_user_circle</span>
                </div>
              </button>
              <button
                onClick={() => {
                  option === 'manager' ? console.log(cache) : setCache(meta),
                    setMeta([]),
                    setOption('search'),
                    setSuccess(false),
                    setManager(''),
                    setLoading(true),
                    setTimeout(() => {
                      setLoading(false)
                    }, 2000)
                }}
                className='button-header'
                disabled={option === 'search'}
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
                  {'search'}&nbsp;
                  <span className="material-icons">search</span>
                </div>
              </button>
            </div>
          )}
          {loading && isConnected && (
            <div
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                display: 'flex',
                marginTop: '50px',
                marginBottom: '200px'
              }}
            >
              <LoadingIcons.Bars />
            </div>
          )}
          {!loading && option === 'owner' && meta.length > 0 && isConnected && !empty && (
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
                names you own
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
                  items={meta}
                  onItemClick={onItemClick}
                />
              </div>
            </div>
          )}
          {!loading && (option === 'manager' || option === 'search') && meta.length > 0 && isConnected && !empty && (
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
                  items={meta}
                  onItemClick={onItemClick}
                />
              </div>
            </div>
          )}
          {!loading && option === 'manager' && !success && meta && isConnected && (
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
                names you manage
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
          {!loading && option === 'search' && !success && meta && isConnected && (
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
                search names
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
          {empty && option === 'owner' && (
            <div>
              <div
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  fontSize: '22px',
                  color: 'white',
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
          {!response && !manager && query && option !== 'owner' && !loading && (
            <div>
              <div
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  fontSize: '22px',
                  color: 'white',
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
              color: 'white',
              marginTop: '20%',
              marginBottom: 20,
              alignItems: 'center',
              justifyContent: 'center',
              display: 'flex'
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
            show={errorModal && searchType === 'manager' && manager}
            title={'block'}
          >
            {'you are not manager'}
          </Error>
          <Error
            onClose={() => {
              setErrorModal(false),
                setTokenID(''),
                setQuery(''),
                setManager('')
            }}
            show={errorModal && searchType === 'search' && manager}
            title={'block'}
          >
            {'not owner or manager'}
          </Error>
          <div id="modal">
            <Modal
              onClose={() => setModal(false)}
              show={modal}
            >
              {'not owner or manager'}
            </Modal>
          </div>
          {previewModal && (
            <div id="modal">
              <Preview
                onClose={() => setPreviewModal(false)}
                show={previewModal}
                title={nameToPreviewModal}
              >
                {true}
              </Preview>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Home
