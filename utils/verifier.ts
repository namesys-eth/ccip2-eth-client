import * as constants from '../utils/constants'
import { ethers } from 'ethers'

export async function verifyRecordhash(input: string, ccip2Config: any): Promise<boolean> {
  // Read Recordhash from CCIP2 Resolver
  const contract = new ethers.Contract(ccip2Config.addressOrName, ccip2Config.contractInterface, constants.provider)
  const _Recordhash_ = await contract.recordhash(ethers.utils.namehash(input))
  return new Promise<boolean>((resolve, reject) => {
    if (_Recordhash_) {
      resolve(_Recordhash_.toString() !== '0x' ? true : false)
    } else {
      reject(new Error('Failed to fetch Recordhash'))
    }
  })
}

export async function verifyOwnerhash(ccip2Config: any, address: string): Promise<boolean> {
  // Read Recordhash from CCIP2 Resolver
  const contract = new ethers.Contract(ccip2Config.addressOrName, ccip2Config.contractInterface, constants.provider)
  const _Ownerhash_ = await contract.ownerhash(ethers.utils.keccak256(ethers.utils.solidityPack(['address'], [address])))
  return new Promise<boolean>((resolve, reject) => {
    if (_Ownerhash_) {
      resolve(_Ownerhash_.toString() !== '0x' ? true : false)
    } else {
      reject(new Error('Failed to fetch Ownerhash'))
    }
  })
}
