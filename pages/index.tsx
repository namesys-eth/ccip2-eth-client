import React from 'react'
import { useCallback } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import type { NextPage } from 'next'
import { Alchemy, Network } from "alchemy-sdk"
import {
  useQuery,
  useConnect,
  useAccount,
  useFeeData,
  useNetwork
} from 'wagmi'
import contractInterface from '../contract-abi.json'
import { ethers } from 'ethers'
import { isMobile } from 'react-device-detect'
import Modal from '../components/Modal'
import Terms from '../components/Terms'
import Preview from '../components/Preview'
import Faq from '../components/FAQ'
import List from '../components/List'
import SearchBox from '../components/Search'
import { Statistic } from 'antd'
import LoadingIcons from 'react-loading-icons'

const alchemyConfig = {
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID,
  network: Network.ETH_GOERLI
}
const alchemy = new Alchemy(alchemyConfig)
const { Countdown } = Statistic
const EnsGraphApi = 'https://api.thegraph.com/subgraphs/name/ensdomains/ens/graphql'
const ensRegistrars = [
  "0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85", // Old Registrar
  "0x114d4603199df73e7d157787f8778e21fcd13066"  // Name Wrapper
]
let metadata
const carousal = [
  '<span class="material-icons miui">energy_savings_leaf</span><br></br>Gasless <span style="color: skyblue">ENS</span> Records',
  '<span class="material-icons miui">hub</span><br></br>Decentralised Records Storage on <span style="color: skyblue">IPFS</span>',
  '<span class="material-icons miui">recycling</span><br></br>Unlimited Free Updates through in-built <span style="color: skyblue">IPNS</span> Support',
  '<span class="material-icons miui">badge</span><br></br><span style="color: skyblue">Dynamic</span> Avatars, Contenthash and Reverse Resolution',
  '<span class="material-icons miui">currency_bitcoin</span><br></br><span style="color: skyblue">Enjoy ENS gasfree</span>'
]

const Home: NextPage = () => {
  const { data: accountData } = useAccount()
  const { connectors, isConnected } = useConnect()
  const { data: gasData, isError } = useFeeData()
  const [meta, setMeta] = React.useState<any[]>([])
  const [faqModal, setFaqModal] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [option, setOption] = React.useState('owner')
  const { chains } = useNetwork()

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
    for (var i = 0; i < allTokens.length; i++) {
      // @TODO : ENS Metadata service is broken and not showing all the names
      if (ensRegistrars.includes(allTokens[i].contract.address) && allTokens[i].title) {
        allEns.push(allTokens[i].title.split('.eth')[0])
        items.push({
          'key': i + 1,
          'name': allTokens[i].title.split('.eth')[0]
        })
      }
    }
    setMeta(items)
    setLoading(false)
    //console.log(allTokens)
  }, [accountData])

  const getTokens = useCallback(async () => {
    if (accountData) {
      await logTokens()
    }
  }, [accountData])

  React.useEffect(() => {
    setLoading(true)
    getTokens()
    if (metadata) {
      setLoading(false)
      setMeta(metadata)
    }
  }, [accountData, isConnected])

  React.useEffect(() => {
    const handleBeforeUnload = () => {
      metadata = meta
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [])

  const onItemClick = (key: number) => {
    console.log(`Item ${key} clicked`)
  }

  const handleManagerSearch = (query: string) => {
    console.log(`Searching Manager for ${query}`)
  }

  const handleNameSearch = (query: string) => {
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
          src="logo-dark-alpha.png"
        />
      </div>
      <Head>
        <title>CCIP2 - Off-chain Records Manager</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width, user-scalable=no" />
        <link rel="shortcut icon" href="logo-dark.png" />
      </Head>
      {/* Detect Device */}
      <div
        className='connect-button'
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
        <button
          className='button clear'
          onClick={() => { window.scrollTo(0, 0); setFaqModal(true) }}
          style={{ marginRight: 10 }}
          data-tooltip='Learn more'
        >
          <div 
            className="smol"
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
              {'about'}&nbsp;<span className="material-icons">info</span>
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
                onClick={() => { setOption('owner') }}
                className='button-header'
                disabled={ option === 'owner'}
                data-tooltip='Show names you own'
              >
                <div 
                  className="smol"
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                    {'owned'}&nbsp;<span className="material-icons">manage_accounts</span>
                </div>
              </button>
              <button
                onClick={() => { setOption('manager') }}
                className='button-header'
                disabled={ option === 'manager'}
                data-tooltip='Search for a name that you manage'
              >
                <div 
                  className="smol"
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                    {'managed'}&nbsp;<span className="material-icons">supervised_user_circle</span>
                </div>
              </button>
              <button
                onClick={() => { setOption('search') }}
                className='button-header'
                disabled={ option === 'search'}
                data-tooltip='Search for an ENS name'
              >
                <div 
                  className="smol"
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                    {'search'}&nbsp;<span className="material-icons">search</span>
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
          {!loading && option === 'owner' && meta && isConnected && (
            <div>
              <div
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  display: 'flex',
                  fontSize: '18px',
                  color: 'white',
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
          {!loading && option === 'manager' && meta && isConnected && (
            <div>
              <div
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  display: 'flex',
                  fontSize: '18px',
                  color: 'white',
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
          {!loading && option === 'search' && meta && isConnected && (
            <div>
              <div
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  display: 'flex',
                  fontSize: '18px',
                  color: 'white',
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
            <span className="material-icons">folder_open</span>&nbsp;<a className="footer-text">GitHub</a>
          </div>
          {/* Modals */}
          <Faq
            onClose={() => setFaqModal(false)}
            show={faqModal}
          />
          <div id="modal"></div>
        </div>
      </div>
    </div>
  )
}

export default Home
