import { Alchemy, Network } from "alchemy-sdk"
import { ethers } from 'ethers'
import iEnsLegacyRegistry from '../ABI/ENSLegacyRegistry.json'
import iEnsLegacyRegistrar from '../ABI/ENSLegacyRegistrar.json'
import iEnsLegacyResolver from '../ABI/ENSLegacyResolver.json'
import iEnsUniversalResolverGoerli from '../ABI/ENSUniversalResolverGoerli.json'
import iEnsPublicResolverMainnet from '../ABI/ENSPublicResolverMainnet.json'
import iEnsUniversalResolverMainnet from '../ABI/ENSUniversalResolverMainnet.json'
import iEnsWrapperGoerli from '../ABI/ENSWrapperGoerli.json'
import iEnsWrapperMainnet from '../ABI/ENSWrapperMainnet.json'
import iCCIP2Goerli from '../ABI/CCIP2Goerli.json'
import iCCIP2Mainnet from '../ABI/CCIP2Mainnet.json'
import * as ensContent from '../utils/contenthash'
import axios from 'axios'
import * as cryptico from 'cryptico-js/dist/cryptico.browser.js'

// Config records
export const config = [
  'resolver',
  'storage'
]
// Uneditable records in Preview modal
export const forbidden = [
  'resolver',
]
// Blocked records in Preview modal
export const blocked = [
  'pubkey',
  'ltc',
  'doge',
  'sol',
  'atom'
]
// Record types in Preview modal
export const typesRecords = [
  'storage', // On-Chain Record
  'resolver', // Exception: Not a Record type
  // General
  'addr',
  'contenthash',
  'avatar',
  'email',
  'pubkey',
  // Socials
  'github',
  'url',
  'twitter',
  'discord',
  'farcaster',
  'nostr',
  // Multi-addr
  'btc',
  'ltc',
  'doge',
  'sol',
  'atom',
  // DNS
  //'zonehash',
  // Extradata
  'revision' // Extra local history; Not a Record type
]
// Record types in Stealth modal
export const typesStealth = [
  // Stealth
  'rsa',
  'stealth',
  'revision' // Extra local history; Not a Record type
]
// Record filenames corresponding to record types
export const filesRecords = [
  '', // No associated record file; Not a Record
  '', // No associated record file; Not a Record
  // General
  'address/60',
  'contenthash',
  'text/avatar',
  'text/email',
  'pubkey',
  // Socials
  'text/github',
  'text/url',
  'text/twitter',
  'text/discord',
  'text/farcaster',
  'text/nostr',
  // Multi-addr
  'address/0',
  'address/2',
  'address/3',
  'address/501',
  'address/118',
  // DNS
  //'dns/zonehash',
  // Extradata
  'revision' // No associated record file; Not a Record
]
// Record filenames corresponding to record types
export const filesStealth = [
  // Stealth
  'text/rsa',
  'text/stealth',
  'revision' // No associated record file; Not a Record
]

export const signedRecord = 'function signedRecord(address recordSigner, bytes memory recordSignature, bytes memory approvedSignature, bytes memory result)'
export const signedRedirect = 'function signedRedirect(address recordSigner, bytes memory recordSignature, bytes memory approvedSignature, bytes memory redirect)'
export const zeroAddress = '0x' + '0'.repeat(40)
export const zeroBytes = '0x' + '0'.repeat(64)
export const zeroKey = '0x' + '0'.repeat(64)
export const buffer = "\x19Ethereum Signed Message:\n"
export const ipnsPrefix = '0xe5010172002408011220'
export const httpPrefix = '0x6874'
const ipnsRegex = /^[a-z0-9]{62}$/
const ipfsRegexCID0 = /^Qm[1-9A-HJ-NP-Za-km-z]{44}$/
const ipfsRegexCID1 = /^bafy[a-zA-Z0-9]{55}$/
const onionRegex = /^[a-z2-7]{16,56}$/
const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/
const hexRegex = /^[0-9a-fA-F]+$/
const githubRegex = /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/
const twitterRegex = /^[A-Za-z][A-Za-z0-9_]{0,14}$/
const zonehashRegex = /^0x[a-fA-F0-9]+$/
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const discordRegex = /^.{3,32}#[0-9]{4}$/
const farcasterRegex = /^[a-z0-9][a-z0-9-]{0,15}$/
const btcRegex = /^(1[a-km-zA-HJ-NP-Z1-9]{25,34})|(3[a-km-zA-HJ-NP-Z1-9]{25,34})|(bc1[a-zA-HJ-NP-Z0-9]{6,87})$/
const ltcRegex = /^[LM3][a-km-zA-HJ-NP-Z1-9]{26,33}$/
const dogeRegex = /^D[5-9A-HJ-NP-U][1-9A-HJ-NP-Za-km-z]{24,33}$/
const solRegex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/
const atomRegex = /^cosmos1[a-zA-Z0-9]{38}$/

export interface MainBodyState {
  modalData: string | undefined
  trigger: boolean
}
export interface CustomBodyState {
  modalData: string
  trigger: boolean
}
let network = process.env.NEXT_PUBLIC_NETWORK
export const alchemyConfig = {
  apiKey: network === 'goerli' ? process.env.NEXT_PUBLIC_ALCHEMY_ID_GOERLI : process.env.NEXT_PUBLIC_ALCHEMY_ID_MAINNET,
  network: network === 'goerli' ? Network.ETH_GOERLI : Network.ETH_MAINNET,
  chainId: network === 'goerli' ? '5' : '1',
}
export const alchemy = new Alchemy(alchemyConfig)
export const provider = new ethers.providers.AlchemyProvider(network, alchemyConfig.apiKey)
export const ccip2 = [
  '0x19F83D2042962b163ED910eFCA5EDfed765A7e89', // CCIP2 Resolver Goerli
  '0x839B3B540A9572448FD1B2335e0EB09Ac1A02885' // CCIP2 Resolver Mainnet
]
export const defaultGateway = network === 'goerli' ? 'https://ccip.namesys.xyz/5' : 'https://ccip.namesys.xyz'
export const waitingPeriod = 1 * (network === 'goerli' ? 1 : 60) * 60 // 60 mins
export const ensContracts = [
  "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e", // Legacy Registry (Goerli & Mainnet)
  "0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85", // Legacy Registrar (Goerli & Mainnet)
  "0x231b0Ee14048e9dCcD1d247744d114a4EB5E8E63", // Public Legacy Resolver 1 (Mainnet)
  "0x114D4603199df73e7D157787f8778E21fCd13066", // Name Wrapper (Goerli)
  "0xd7a4F6473f32aC2Af804B3686AE8F1932bC35750", // Universal Resolver (Goerli)
  "0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41", // Public Legacy Resolver 2 (Mainnet)
  "0x231b0Ee14048e9dCcD1d247744d114a4EB5E8E63", // Universal Resolver (Mainnet)
  "0xD4416b13d2b3a9aBae7AcD5D6C2BbDBE25686401" // Name Wrapper (Mainnet)
]
export const ensInterface = [
  iEnsLegacyRegistry, // Legacy Registry (Goerli & Mainnet)
  iEnsLegacyRegistrar, // Legacy Registrar (Goerli & Mainnet)
  iEnsLegacyResolver, // Public Legacy Resolver 1 (Mainnet)
  iEnsWrapperGoerli, // Name Wrapper (Goerli)
  iEnsUniversalResolverGoerli, // Universal Resolver (Goerli)
  iEnsPublicResolverMainnet, // Public Legacy Resolver 2 (Mainnet)
  iEnsUniversalResolverMainnet, // Universal Resolver (Mainnet)
  iEnsWrapperMainnet // Name Wrapper (Mainnet)
]
export const carousal = [
  '<span style="color: #fc6603" class="material-icons miui">energy_savings_leaf</span><br></br><span style="color: skyblue">Gasless</span> <span style="color: skyblue">ENS</span> Records',
  '<span style="color: #fc6603" class="material-icons miui">hub</span><br></br><span style="color: skyblue">Decentralised</span> Records Storage on <span style="color: skyblue">IPFS</span>',
  '<span style="color: #fc6603" class="material-icons miui">recycling</span><br></br><span style="color: skyblue">Unlimited</span> Record Updates With <span style="color: skyblue">IPNS</span>',
  '<span style="color: #fc6603" class="material-icons miui">badge</span><br></br><span style="color: skyblue">Dynamic</span> Records and More',
  '<img class="icon-ens" src="/ens-red.png"/><br></br><span style="color: skyblue">Enjoy ENS</span> Hassle Free'
]

export const ccip2Interface = [
  iCCIP2Goerli,
  iCCIP2Mainnet,
]
export const ensConfig = [
  {
    addressOrName: ensContracts[0],
    contractInterface: ensInterface[0]
  },
  {
    addressOrName: ensContracts[1],
    contractInterface: ensInterface[1]
  },
  {
    addressOrName: ensContracts[2],
    contractInterface: ensInterface[2]
  },
  {
    addressOrName: ensContracts[3],
    contractInterface: ensInterface[3]
  },
  {
    addressOrName: ensContracts[4],
    contractInterface: ensInterface[4]
  },
  {
    addressOrName: ensContracts[5],
    contractInterface: ensInterface[5]
  },
  {
    addressOrName: ensContracts[6],
    contractInterface: ensInterface[6]
  },
  {
    addressOrName: ensContracts[7],
    contractInterface: ensInterface[7]
  }
]
export const ccip2Config = [
  { // CCIP2 Resolver Goerli
    addressOrName: ccip2[0],
    contractInterface: ccip2Interface[0]
  },
  { // CCIP2 Resolver Mainnet
    addressOrName: ccip2[1],
    contractInterface: ccip2Interface[1]
  }

]

// Overlay 
export function showOverlay(durationInSeconds: number) {
  const overlay = document.getElementById('overlay')
  if (overlay) {
    overlay.style.display = 'block'
    setTimeout(() => {
      hideOverlay()
    }, durationInSeconds * 1000)
  }
}
export function hideOverlay() {
  const overlay = document.getElementById('overlay')
  if (overlay) {
    overlay.style.display = 'none'
  }
}

// Returns formatted ed25519/IPNS keypair
export function formatkey(keypair: [string, string]) {
  return '08011240' + keypair[0] + keypair[1] // ed25519 keypair = keypairIPNS
}

// Encode ENS contenthash
export function encodeContenthash(contenthash: string) {
  if (contenthash && !contenthash.startsWith('https://')) {
    const ensContentHash = ensContent.encodeContenthash(`ipns://${contenthash}`)
    return ensContentHash.encoded
  }
  return ''
}

// Copy text
export function copyToClipboard(element: string) {
  const copyText = document.getElementById(element) as HTMLInputElement
  copyText.select()
  copyText.setSelectionRange(0, 99999)

  navigator.clipboard.writeText(copyText.value).then(() => {
  }).catch((error) => {
    console.error('ERROR:', error)
  })
}

// Check if image URL resolves
export function checkImageURL(url: string) {
  return new Promise(function (resolve, reject) {
    var img = new Image()
    img.onload = function () {
      resolve(true)
    }
    img.onerror = function () {
      console.error('Image Failed to Load')
      reject(false)
    }
    img.src = url
  })
}

// Check for empty object
export function isEmpty(object: any) {
  for (const key in object) {
    if (object.hasOwnProperty(key)) {
      if (object[key] !== '') {
        return false
      }
    }
  }
  return true
}

// Check if value is a valid Name
export function isName(value: string) {
  return value.endsWith('.eth') && value.length <= 32 + 4
}
// Check if value is a valid Addr
export function isAddr(value: string) {
  return value.startsWith('0x') && value.length === 42 && hexRegex.test(value.split('0x')[1])
}
// Check if value is a valid Avatar URL
export function isAvatar(value: string) {
  return urlRegex.test(value) || value.startsWith('ipfs://') || value.startsWith('eip155:')
}
// Check if value is a valid Pubkey
export function isPubkey(value: string) {
  return value.length > 0
}
// Check if value is a valid URL
export function isEmail(value: string) {
  return emailRegex.test(value)
}
// Check if value is a valid Github username
export function isGithub(value: string) {
  return githubRegex.test(value)
}
// Check if value is a valid URL
export function isUrl(value: string) {
  return urlRegex.test(value)
}
// Check if value is a valid Twitter username
export function isTwitter(value: string) {
  return twitterRegex.test(value)
}
// Check if value is a valid Discord username
export function isDiscord(value: string) {
  return discordRegex.test(value)
}
// Check if value is a valid Farcaster username
export function isFarcaster(value: string) {
  return farcasterRegex.test(value)
}
// Check if value is a valid Nostr username
export function isNostr(value: string) {
  return btcRegex.test(value) || emailRegex.test(value)
}
// Check if value is a valid BTC address
export function isBTC(value: string) {
  return btcRegex.test(value)
}
// Check if value is a valid LTC address
export function isLTC(value: string) {
  return ltcRegex.test(value)
}
// Check if value is a valid DOGE address
export function isDOGE(value: string) {
  return dogeRegex.test(value)
}
// Check if value is a valid SOL address
export function isSOL(value: string) {
  return solRegex.test(value)
}
// Check if value is a valid ATOM address
export function isATOM(value: string) {
  return atomRegex.test(value)
}
// Check if value is a valid Zonehash
export function isZonehash(value: string) {
  return zonehashRegex.test(value)
}
// Check if value is a valid Contenthash
export function isContenthash(value: string) {
  const prefixIPFS = value.substring(0, 7)
  const prefixOnion = value.substring(0, 8)
  return (
    (prefixIPFS === 'ipns://' && ipnsRegex.test(value.substring(7,))) || // Check IPNS
    (prefixIPFS === 'ipfs://' && ipfsRegexCID0.test(value.substring(7,))) || // Check IPFS CIDv0
    (prefixIPFS === 'ipfs://' && ipfsRegexCID1.test(value.substring(7,))) || // Check IPFS CIDv1
    (prefixOnion === 'onion://' && onionRegex.test(value.substring(8,))) // Check Onion v2 & v3
  )
}

// Get latest timestamp from all records
export function latestTimestamp(list: string[]) {
  var _Timestamps: number[] = []
  for (const key in list) {
    if (list.hasOwnProperty(key) && !['revision', 'version'].includes(key) && list[key]) {
      _Timestamps.push(Number(list[key]))
    }
  }
  return Math.max(..._Timestamps)
}

// Records Types object with empty strings
export function EMPTY_STRING_RECORDS() {
  const EMPTY_STRING = {}
  for (const key of typesRecords) {
    if (!config.includes(key)) {
      EMPTY_STRING[key] = ''
    }
  }
  return EMPTY_STRING
}

// Stealth Types object with empty strings
export function EMPTY_STRING_STEALTH() {
  const EMPTY_STRING = {}
  for (const key of typesStealth) {
    EMPTY_STRING[key] = ''
  }
  return EMPTY_STRING
}

// Records Types object with empty bools
export function EMPTY_BOOL_RECORDS() {
  const EMPTY_BOOL = {}
  for (const key of typesRecords) {
    EMPTY_BOOL[key] = [...config, 'revision'].includes(key) ? true : false
  }
  return EMPTY_BOOL
}

// Stealth Types object with empty bools
export function EMPTY_BOOL_STEALTH() {
  const EMPTY_BOOL = {}
  for (const key of typesStealth) {
    EMPTY_BOOL[key] = false
  }
  return EMPTY_BOOL
}

// Records History object with empty strings
export const EMPTY_HISTORY_RECORDS = {
  type: '',
  addr: '',
  contenthash: '',
  avatar: '',
  revision: '',
  version: '',
  timestamp: { ...EMPTY_STRING_RECORDS() },
  queue: 1,
  ownerstamp: []
}

// Stealth History object with empty strings
export const EMPTY_HISTORY_STEALTH = {
  type: '',
  stealth: '',
  rsa: '',
  revision: '',
  version: '',
  timestamp: { ...EMPTY_STRING_STEALTH() },
  queue: 1,
  ownerstamp: []
}

// Get IPFS hash from <IPNS>.IPFS2.eth.limo
export async function getIPFSHashFromIPNS(ipnsKey: string, cacheBuster: Number) {
  try {
    const _response = await fetch(
      `https://${ipnsKey}.ipfs2.eth.limo/revision.json?t=${String(cacheBuster)}`
    )
    if (!_response.ok) {
      console.error('Error:', 'Fetch Gone Wrong')
      return {
        '_value': '//',
        '_sequence': ''
      }
    }
    const _data = await _response.json()
    return {
      '_value': _data.ipfs ? `/ipfs/${_data.ipfs}` : '//',
      '_sequence': _data.sequence || ''
    }
  } catch (error) {
    console.error('Error:', error)
    return {
      '_value': '//',
      '_sequence': ''
    }
  }
}

// Check record existence on server
export async function getServerMeta(_ENS: string) {
  let _PATH = _ENS
  try {
    const _response = await fetch(
      `https://${defaultGateway}/.well-known/eth/${_PATH}/revision.json`
    )
    if (!_response.ok) {
      console.error('Error:', 'Fetch Gone Wrong')
      return {
        '_value': '//',
        '_sequence': ''
      }
    }
    const _data = await _response.json()
    return {
      '_value': _data.ipfs ? `/ipfs/${_data.ipfs}` : '//',
      '_sequence': _data.sequence || ''
    }
  } catch (error) {
    console.error('Error:', error)
    return {
      '_value': '//',
      '_sequence': ''
    }
  }
}

// Random string generator
export function randomString(length: number) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

// Get ABI
export async function getABI(contractAddress: string): Promise<any | null> {
  try {
    const url = `https://api${network === 'goerli' ? '-goerli' : ''}.etherscan.io/api?module=contract&action=getabi&address=${contractAddress}&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN_KEY}`
    const response = await axios.get(url)
    const data = response.data

    if (data.status === '1' && data.result) {
      return JSON.parse(data.result)
    } else {
      console.error('Failed to get ABI:', data.message)
      return null;
    }
  } catch (error) {
    console.error('Error fetching ABI:', error)
    return null;
  }
}

/// Stealth 
const keyClass = cryptico.generateRSAKey('0', '64')
export const prototypeRSAKey = Object.getPrototypeOf(keyClass)
const BigInteger = Object.getPrototypeOf(keyClass.n).constructor

/// RSA Key de-serialisation
export function deserialiseRSAKey(serialised: any): any {
  return {
    ...serialised,
    coeff: deserialiseBigInteger(serialised.coeff),
    d: deserialiseBigInteger(serialised.d),
    dmp1: deserialiseBigInteger(serialised.dmp1),
    dmq1: deserialiseBigInteger(serialised.dmq1),
    n: deserialiseBigInteger(serialised.n),
    p: deserialiseBigInteger(serialised.p),
    q: deserialiseBigInteger(serialised.q),
  }
}

/// BigInteger de-serialisation
export function deserialiseBigInteger(serialised: any): any {
  let bigInt = Object.assign(Object.create(BigInteger.prototype), serialised)
  return bigInt
}