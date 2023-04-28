import iEnsRegistry from '../contract-abi-ensRegistry.json'
import iEnsRegistrar from '../contract-abi-ensRegistrar.json'
import iEnsResolver from '../contract-abi-ensResolver.json'

export const ccip2 = '0x0Db7E56BFE3cbCD7B952F750c303CbF809585C6b'

export const ensContracts = [
  "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e", // v1 Registry
  "0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85", // v2 Registrar
  "0xd7a4F6473f32aC2Af804B3686AE8F1932bC35750" // Current Public Resolver
]

export const ensInterface = [
  iEnsRegistry,
  iEnsRegistrar,
  iEnsResolver
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
