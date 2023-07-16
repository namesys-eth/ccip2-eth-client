import { Alchemy, Network } from "alchemy-sdk"
import { ethers } from 'ethers'
import iEnsLegacyRegistry from '../abi/contract-abi-ensLegacyRegistry.json'
import iEnsLegacyRegistrar from '../abi/contract-abi-ensLegacyRegistrar.json'
import iEnsLegacyResolver from '../abi/contract-abi-ensLegacyResolver.json'
import iEnsUniversalResolver from '../abi/contract-abi-ensUniversalResolver.json'
import iEnsWrapper from '../abi/contract-abi-ensWrapper.json'
import iCCIP2 from '../abi/contract-abi-ccip2.json'

export const signedRecord = 'function signedRecord(address recordSigner,bytes memory recordSignature, bytes memory approvedSignature, bytes memory result)'
export const signedRedirect = 'function signedRedirect(address recordSigner,bytes memory recordSignature, bytes memory approvedSignature, bytes memory redirect)'
export const zeroAddress = '0x' + '0'.repeat(40)
export const zeroKey = '0x' + '0'.repeat(64)
export const buffer = "\x19Ethereum Signed Message:\n"

export interface MainBodyState {
  modalData: boolean;
  trigger: boolean;
}
export const network = process.env.NEXT_PUBLIC_NETWORK
export const alchemyConfig = {
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID,
  network: network === 'goerli' ? Network.ETH_GOERLI : Network.ETH_MAINNET,
  chainId: network === 'goerli' ? '5': '1',
}
export const alchemy = new Alchemy(alchemyConfig)
export const provider = new ethers.providers.AlchemyProvider(network, alchemyConfig.apiKey);
export const ccip2 = [
  '0x326fD6b070FE062CCeA590314c6Fe249FFd91385' // CCIP2 Resolver
 ]
export const ensContracts = [
  "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e", // Legacy Registry
  "0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85", // Legacy Registrar 
  "0x4B1488B7a6B320d2D721406204aBc3eeAa9AD329", // Legacy Resolver
  "0x114D4603199df73e7D157787f8778E21fCd13066", // Name Wrapper
  "0xd7a4F6473f32aC2Af804B3686AE8F1932bC35750" // Universal Resolver
]
export const carousal = [
  '<span style="color: #fc6603" class="material-icons miui">energy_savings_leaf</span><br></br>Gasless <span style="color: skyblue">ENS</span> Records',
  '<span style="color: #fc6603" class="material-icons miui">hub</span><br></br>Decentralised Records Storage on <span style="color: skyblue">IPFS</span>',
  '<span style="color: #fc6603" class="material-icons miui">recycling</span><br></br>Unlimited Free Updates through in-built <span style="color: skyblue">IPNS</span> Support',
  '<span style="color: #fc6603" class="material-icons miui">badge</span><br></br><span style="color: skyblue">Dynamic</span> Avatars, Contenthash and Reverse Resolution',
  '<img class="icon-ens" src="/ens-red.png"/><br></br>Enjoy ENS gasfree'
]
export const ensInterface = [
  iEnsLegacyRegistry,
  iEnsLegacyRegistrar,
  iEnsLegacyResolver,
  iEnsWrapper,
  iEnsUniversalResolver
]
export const ccip2Interface = [
  iCCIP2
]
export const ensConfig = [
  { // Legacy Registry
    addressOrName: ensContracts[0],
    contractInterface: ensInterface[0]
  },
  { // Legacy Registrar (never used)
    addressOrName: ensContracts[1],
    contractInterface: ensInterface[1]
  },
  { // Legacy Resolver (never used)
    addressOrName: ensContracts[2],
    contractInterface: ensInterface[2]
  },
  { // Name Wrapper
    addressOrName: ensContracts[3],
    contractInterface: ensInterface[3]
  },
  { // Universal Resolver (used for gas simulations)
    addressOrName: ensContracts[4],
    contractInterface: ensInterface[4]
  }
]
export const ccip2Config = [
  { // CCIP2 Resolver
    addressOrName: ccip2[0],
    contractInterface: ccip2Interface[0]
  }
]

// Uneditable records in Preview modal
export const forbidden = [
  'resolver'
]
// Record types in Preview modal
export const types = [
  'recordhash', // On-Chain Record
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
	'dnsrecord/zonehash',
	'revision' // No associated record file; Not a Record
] 

// Overlay 
export function showOverlay(durationInSeconds: number) {
  const overlay = document.getElementById('overlay');
  if (overlay) {
    overlay.style.display = 'block';
    setTimeout(() => {
      hideOverlay();
    }, durationInSeconds * 1000);
  }
}

export function hideOverlay() {
  const overlay = document.getElementById('overlay');
  if (overlay) {
    overlay.style.display = 'none';
  }
}