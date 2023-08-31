import { Alchemy, Network } from "alchemy-sdk"
import { ethers } from 'ethers'
import iEnsLegacyRegistry from '../ABI/Contract-ABI-ENSLegacyRegistry.json'
import iEnsLegacyRegistrar from '../ABI/Contract-ABI-ENSLegacyRegistrar.json'
import iEnsLegacyResolver from '../ABI/Contract-ABI-ENSLegacyResolver.json'
import iEnsUniversalResolverGoerli from '../ABI/Contract-ABI-ENSUniversalResolverGoerli.json'
import iEnsPublicResolverMainnet from '../ABI/Contract-ABI-ENSPublicResolverMainnet.json'
import iEnsUniversalResolverMainnet from '../ABI/Contract-ABI-ENSUniversalResolverMainnet.json'
import iEnsWrapperGoerli from '../ABI/Contract-ABI-ENSWrapperGoerli.json'
import iEnsWrapperMainnet from '../ABI/Contract-ABI-ENSWrapperMainnet.json'
import iCCIP2Goerli from '../ABI/Contract-ABI-CCIP2Goerli.json'
import iCCIP2Mainnet from '../ABI/Contract-ABI-CCIP2Mainnet.json'
import * as ensContent from '../utils/contenthash'

export const signedRecord = 'function signedRecord(address recordSigner, bytes memory recordSignature, bytes memory approvedSignature, bytes memory result)'
export const signedRedirect = 'function signedRedirect(address recordSigner, bytes memory recordSignature, bytes memory approvedSignature, bytes memory redirect)'
export const zeroAddress = '0x' + '0'.repeat(40)
export const zeroBytes = '0x' + '0'.repeat(64)
export const zeroKey = '0x' + '0'.repeat(64)
export const buffer = "\x19Ethereum Signed Message:\n"
export const prefix = '0xe5010172002408011220'

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
  '0x3F2521AC2D9ea1bFd6110CA563FcD067E6E47deb', // CCIP2 Resolver Goerli
  '0x839B3B540A9572448FD1B2335e0EB09Ac1A02885' // CCIP2 Resolver Mainnet
]
export const waitingPeriod = 1 * (network === 'goerli' ? 10 : 1) * 60 // 60 mins
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
  '<span style="color: #fc6603" class="material-icons miui">energy_savings_leaf</span><br></br>Gasless <span style="color: skyblue">ENS</span> Records',
  '<span style="color: #fc6603" class="material-icons miui">hub</span><br></br>Decentralised Records Storage on <span style="color: skyblue">IPFS</span>',
  '<span style="color: #fc6603" class="material-icons miui">recycling</span><br></br>Unlimited Free Updates through in-built <span style="color: skyblue">IPNS</span> Support',
  '<span style="color: #fc6603" class="material-icons miui">badge</span><br></br><span style="color: skyblue">Dynamic</span> Avatars, Contenthash and Reverse Resolution',
  '<img class="icon-ens" src="/ens-red.png"/><br></br>Enjoy ENS gasfree'
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
// Uneditable records in Preview modal
export const forbidden = [
  'resolver',
]
// Blocked records in Preview modal
export const blocked = [
  //'avatar',
  //'contenthash'
  'none'
]
// Record types in Preview modal
export const types = [
  'storage', // On-Chain Record
  'resolver', // Exception: Not a Record type
  'addr',
  'contenthash',
  'avatar',
  'zonehash',
  'revision' // Extra local history; Not a Record type
]
// Record filenames corresponding to record types
export const files = [
  '', // No associated record file; Not a Record
  '', // No associated record file; Not a Record
  'address/60',
  'contenthash',
  'text/avatar',
  'dns/zonehash',
  'revision' // No associated record file; Not a Record
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
  if (contenthash) {
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
      console.log('Log:', 'Image Loaded Successfully')
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
  const hexRegex = /^[0-9a-fA-F]+$/
  return value.startsWith('0x') && value.length === 42 && hexRegex.test(value.split('0x')[1])
}

// Check if value is a valid Avatar URL
export function isAvatar(value: string) {
  const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/
  return urlRegex.test(value) || value.startsWith('ipfs://') || value.startsWith('eip155:')
}
// Check if value is a valid Contenthash
export function isContenthash(value: string) {
  const prefix = value.substring(0, 7)
  const ipnsRegex = /^[a-z0-9]{62}$/
  const ipfsRegexCID0 = /^Qm[1-9A-HJ-NP-Za-km-z]{44}$/
  const ipfsRegexCID1 = /^bafy[a-zA-Z0-9]{56}$/
  return true
  /*
  return (
    (prefix === 'ipns://') ||
    (prefix === 'ipfs://')
  )
  return (
    (prefix === 'ipns://' && ipnsRegex.test(value)) || // Check IPNS
    (prefix === 'ipfs://' && ipfsRegexCID0.test(value)) || // Check IPFS CIDv0
    (prefix === 'ipfs://' && ipfsRegexCID1.test(value)) // Check IPFS CIDv1
  )
  */
}

// Get latest timestamp from all records
export function latestTimestamp(list: string[]) {
  var _Timestamps: number[] = []
  for (const key in list) {
    if (list.hasOwnProperty(key) && list[key] !== '' && list[key]) {
      _Timestamps.push(Number(list[key]))
    }
  }
  return Math.max(..._Timestamps)
}

/// Init 
// Types object with empty strings
export function EMPTY_STRING() {
  const EMPTY_STRING = {}
  for (const key of types) {
    if (!['resolver', 'storage'].includes(key)) {
      EMPTY_STRING[key] = ''
    }
  }
  return EMPTY_STRING
}

// Types object with empty bools
export function EMPTY_BOOL() {
  const EMPTY_BOOL = {}
  for (const key of types) {
    EMPTY_BOOL[key] = ['resolver', 'storage', 'revision'].includes(key) ? true : false
  }
  return EMPTY_BOOL
}

// History object with empty strings
export const EMPTY_HISTORY = {
  type: '',
  addr: '',
  contenthash: '',
  avatar: '',
  revision: '',
  version: '',
  timestamp: { ...EMPTY_STRING() },
  queue: 1,
  ownerstamp: []
}

/// Library
export async function getIPFSHashFromIPNS(ipnsKey: string, cacheBuster: Number) {
  try {
    const _response = await fetch(
      `https://${ipnsKey}.ipfs2.eth.limo/version.json?t=${String(cacheBuster)}`
    );
    if (!_response.ok) {
      console.error('Error:', 'Fetch Gone Wrong')
      return {
        '_sequence': ''
      }
    }
    const data = await _response.json();
    return data
  } catch (error) {
    console.error('Error:', error)
    return {
      '_sequence': ''
    }
  }
}
