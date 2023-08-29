import * as constants from '../utils/constants'
import { ethers } from 'ethers'

export async function verifyRecordhash(input: string, ccip2Config: any, address: string): Promise<boolean> {
  // Read Recordhash from CCIP2 Resolver
  const contract = new ethers.Contract(ccip2Config.addressOrName, ccip2Config.contractInterface, constants.provider)
  const _Recordhash_ = await contract.getRecordhash(ethers.utils.namehash(input))
  const _Ownerhash_ = await contract.getRecordhash(ethers.utils.hexZeroPad(address, 32).toLowerCase())
  return new Promise<boolean>((resolve, reject) => {
    if (_Recordhash_) {
      resolve(_Recordhash_.toString() === '0x' ? false : (
        _Recordhash_.toString() === _Ownerhash_.toString() ? false : true
      ))
    } else {
      reject(new Error('Failed to fetch Recordhash'))
    }
  })
}

export async function quickRecordhash(input: string, ccip2Config: any, address: string): Promise<string> {
  // Read Recordhash from CCIP2 Resolver
  const contract = new ethers.Contract(ccip2Config.addressOrName, ccip2Config.contractInterface, constants.provider)
  const _Recordhash_ = await contract.getRecordhash(ethers.utils.namehash(input))
  const _Ownerhash_ = await contract.getRecordhash(ethers.utils.hexZeroPad(address, 32).toLowerCase())
  return new Promise<string>((resolve, reject) => {
    if (_Recordhash_) {
      resolve(_Recordhash_.toString() === '0x' ? '0x' : (
        String(_Recordhash_) === String(_Ownerhash_) ? _Ownerhash_.toString() : _Recordhash_.toString()
      ))
    } else {
      reject(new Error('Failed to fetch Recordhash'))
    }
  })
}

export async function verifyOwnerhash(ccip2Config: any, address: string): Promise<boolean> {
  // Read Ownerhash from CCIP2 Resolver
  const contract = new ethers.Contract(ccip2Config.addressOrName, ccip2Config.contractInterface, constants.provider)
  const _Ownerhash_ = await contract.getRecordhash(ethers.utils.hexZeroPad(address, 32).toLowerCase())
  return new Promise<boolean>((resolve, reject) => {
    if (_Ownerhash_) {
      resolve(_Ownerhash_.toString() !== '0x' ? true : false)
    } else {
      reject(new Error('Failed to fetch Ownerhash'))
    }
  })
}
