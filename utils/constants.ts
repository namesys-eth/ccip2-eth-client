import { Alchemy, Network } from "alchemy-sdk"
import { ethers } from 'ethers'
import iEnsRegistry from '../contract-abi-ensRegistry.json'
import iEnsRegistrar from '../contract-abi-ensRegistrar.json'
import iEnsResolver from '../contract-abi-ensResolver.json'
import iCCIP2 from '../contract-abi-ccip2.json'

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
export const ccip2 = '0xBbee991706505b4c0c7A2e1A897bE7975CD285Ec' // CCIP2 Resolver
export const zeroAddress = '0x' + '0'.repeat(40)
export const ensContracts = [
  "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e", // v1 Registry
  "0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85", // v2 Registrar
  "0xd7a4F6473f32aC2Af804B3686AE8F1932bC35750" // Current Public Resolver
]
export const carousal = [
  '<span style="color: #fc6603" class="material-icons miui">energy_savings_leaf</span><br></br>Gasless <span style="color: skyblue">ENS</span> Records',
  '<span style="color: #fc6603" class="material-icons miui">hub</span><br></br>Decentralised Records Storage on <span style="color: skyblue">IPFS</span>',
  '<span style="color: #fc6603" class="material-icons miui">recycling</span><br></br>Unlimited Free Updates through in-built <span style="color: skyblue">IPNS</span> Support',
  '<span style="color: #fc6603" class="material-icons miui">badge</span><br></br><span style="color: skyblue">Dynamic</span> Avatars, Contenthash and Reverse Resolution',
  '<img class="icon-ens" src="/ens-red.png"/><br></br>Enjoy ENS gasfree'
]
export const ensInterface = [
  iEnsRegistry,
  iEnsRegistrar,
  iEnsResolver
]
export const ccip2Interface = [
  iCCIP2
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
  }
]
export const ccip2Config = [
  {
    addressOrName: ccip2,
    contractInterface: ccip2Interface[0]
  }
]


